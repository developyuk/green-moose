const mercury = require('mercury-parser')('API_KEY');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./src/content.db');

exports.getAll = (req, rep) => {
  const page = req.query.page
    ? encodeURIComponent(req.query.page)
    : false
  let data = {};

  db.all(`SELECT id,title,author,leadImage,excerpt FROM content`, (err, rows) => {
    if (err) {
      throw err;
    }

    data = {
      status: !err,
      data: rows
    }
    return rep(data)
  })
}

exports.get = (req, rep) => {
  const contentId = req.params.contentId
    ? encodeURIComponent(req.params.contentId)
    : false;
  let data = {}

  db.get(`SELECT c.id,c.title,c.author,c.leadImage,c.content,c.excerpt,
      s.url,s.dateFetched
    FROM content c JOIN source s ON s.id = c.sourceId
    WHERE c.id=?`, contentId, (err, row) => {

    if (err) {
      throw err;
    }

    data = {
      status: !err,
      data: !!row
        ? row
        : {}
    }
    return rep(data)
  });
}

exports.post = (req, rep) => {
  const url = !!req.payload['url']
    ? req.payload.url.trim()
    : false

  let data = {
    status: false,
    message: '',
    data: {}
  };
  if (!url) {
    data.message = 'please define url'
    return rep(data)
  };

  const selectRowId = (params) => {
    const {urlId} = params;
    db.get(`SELECT id FROM content WHERE sourceId=?`, urlId, (err, row) => {

      if (!!row) {
        data = {
          status: !!row,
          data: {
            id: row['id']
          }
        }
        return rep(data);
      } else {
        parseAndInsert({url, urlId});
      }

    })
  }
  const parseAndInsert = (params) => {
    const {url, urlId} = params;

    mercury.parse(url).then(response => {
      const dataDb = [
        response.title,
        response.author,
        response.lead_image_url,
        response.content,
        response.excerpt,
        urlId
      ];

      if (!!response.domain) {
        db.run('UPDATE source SET domain=? WHERE id=?', [
          response.domain, urlId
        ], err => {
          if (err) {
            throw err;
          }
        })

        db.run(`INSERT INTO
          content (title,author,leadImage,content,excerpt,sourceId)
          VALUES  (    ?,     ?,        ?,      ?,      ?,       ?)`, dataDb, function(err) {

          if (!err) {

            data = {
              status: true,
              data: {
                id: this.lastID
              }
            }
            return rep(data);
          } else {
            selectRowId({urlId});
          }

        });
      } else {
        data.message = 'Unauthorized access or internet is down';
        return rep(data);
      }
    }).catch(err => {
      data.message = err;
      return rep(data);
    })
  }

  db.run("INSERT INTO source (url) VALUES (?)", url, function(err) {
    // fetch from db with last insert id

    if (!err) {
      const urlId = this.lastID;
      parseAndInsert({url, urlId})
    } else {
      if (err.code == 'SQLITE_CONSTRAINT') {
        db.get('SELECT id FROM source WHERE url=?', url, (err, row) => {
          const urlId = row.id;
          selectRowId({urlId});
        })

      } else {
        throw err;
      }
    }
  })

}
