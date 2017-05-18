const mercury = require('mercury-parser')('API_KEY');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/content.db');

const exec = require('child_process').exec;


exports.getAll = (req, rep) => {
  const page = req.query.page ? encodeURIComponent(req.query.page) : false;

  db.all(`SELECT id,title,author,leadImage,excerpt
    FROM content`, (err, rows) => {
    if (err) { throw err; }

    return rep({ status: !err, data: rows });
  })
}

exports.get = (req, rep) => {
  const contentId = req.params.contentId ? encodeURIComponent(req.params.contentId) : false;

  db.get(`SELECT c.id,c.title,c.author,c.leadImage,c.content,c.excerpt,s.url
    FROM content c
    JOIN source s ON s.id = c.sourceId
    WHERE c.id=?`, contentId, (err, row) => {

      if (err) { throw err; }

      return rep({ status: !err, data: !!row ? row : {} });
    }
  );
}

(function(){

  let dataReply = { status: false, message: '', data: {} };

  const selectRowId = (params) => {
    const {urlId,url,rep} = params;
    db.get(`SELECT id FROM content WHERE sourceId=?`, urlId, (err, row) => {

      if (!!row) {
        console.log('aios',2);
        dataReply.status = !!row
        dataReply.data= { id: row['id'] };

        return rep(dataReply);
      } else {

        console.log('aios',3,urlId);
        parseAndInsert(params);
      }

    })
  }

  const parseAndInsert = (params) => {
    const {url, urlId, rep} = params;

    mercury.parse(url).then(response => {
      const dataDb = [
        response.title,
        response.author,
        response.lead_image_url,
        response.content,
        response.excerpt,
        urlId
      ];
      // console.log('content text length',response.content.replace(/(<([^>]+)>)/ig,"").trim().length);

      if (!!response.domain) {

        console.log('aios',4);
        db.run('UPDATE source SET domain=? WHERE id=?', [ response.domain, urlId ], err => {
          if (err) { throw err; }
        })

        if (response.content.replace(/(<([^>]+)>)/ig,"").trim().length > 50) {
          console.log('aios',6);
          db.run(`INSERT INTO
            content (title,author,leadImage,content,excerpt,sourceId)
            VALUES  (    ?,     ?,        ?,      ?,      ?,       ?)`, dataDb, function(err) {

              if (!err) {
                console.log('aios',8);
                dataReply.status= true
                dataReply.data= { id: this.lastID };
                return rep(dataReply);
              } else {
                console.log('aios',9);
                selectRowId(params);
              }
            }
          );
        }else{
          console.log('aios',7);
          exec(`php src/getMicrodata.php ${url}`, function callback(err, out, stderr){
            const microdata = JSON.parse(out)

            const urlAmp=microdata['rels']['amphtml'][0];
            console.log('aios',13);

            db.run("INSERT INTO source (url) VALUES (?)", urlAmp, function(err) {
              if (!err) {
                const urlAmpId = this.lastID;

                // parseAndInsert({url, urlId})
                db.run('UPDATE source SET parentId=? WHERE id=?', [ urlAmpId, urlId ], err => {
                  // if (!err) { throw err; }
                  console.log('aios',14);
                  selectRowId({urlId:urlAmpId,url:urlAmp,rep})
                })
              } else { throw err; }
            })
          });

        }
      } else {
        console.log('aios',5,err);
        dataReply.message = 'Unauthorized access or internet is down';
        return rep(dataReply);
      }
    }).catch(err => {
      dataReply.message = err;
      return rep(dataReply);
    })
  }

  exports.post = (req, rep) => {
    const url = !!req.payload['url'] ? req.payload.url.trim() : false;
    if (!url) {
      dataReply.message = 'Please define URL';
      return rep(dataReply);
    };

    db.run("INSERT INTO source (url) VALUES (?)", url, function(err) {
      // fetch from db with last insert id

      if (!err) {
        const urlId = this.lastID;
        parseAndInsert({url, urlId, rep})
      } else {
        if (err.code == 'SQLITE_CONSTRAINT') {
          db.get(`SELECT id,parentId
            FROM source
            WHERE url=?`, url, (err, row) => {

            if(!!row && !!row.parentId){

              db.get(`SELECT p.id
                FROM source s
                LEFT JOIN source p ON p.id = s.parentId
                WHERE s.url=?`, url, (err, row) => {
                  const urlId = row.id;
                  selectRowId({urlId,url,rep});
              })
            }else{
                const urlId = row.id;
                selectRowId({urlId,url,rep});
            }
          })
        } else { throw err; }
      }
    })

  }
})()
