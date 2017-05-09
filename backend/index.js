const Hapi = require('hapi');
const server = new Hapi.Server();
const Good = require('good');
const mercury = require('mercury-parser')('API_KEY');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./src/content.db');

server.connection({
  host: '0.0.0.0',
  port: 9000,
  routes: { cors: true }
});

// GET / : get all url
server.route({
  method: 'GET',
  path: '/',
  handler(req, rep) {
    const page = req.query.page ? encodeURIComponent(req.query.page) : false
    let data = {};

    db.all(`SELECT id,title,author,leadImage,content,excerpt FROM content`, (err, rows) => {
      if (err) { throw err; }

      data = { status: !err, data: rows }
      return rep(data)
    })
  }
});

// POST / : add url to db
server.route({
  method: 'POST',
  path: '/',
  handler(req, rep) {
    const url = !! req.payload['url'] ? req.payload.url.trim() : false

    let data = { status: false, message: '', data: { } };
    if(! url){
      data.message = 'url empty'
      return rep(data)
    };

    db.run("INSERT INTO source (url) VALUES (?)", url, function(err) {

      if (! err) {
        // fetch from db with last insert id
        const urlId = this.lastID;
        mercury.parse(url).then(response => {
          const dataDb = [ response.title, response.author, response.lead_image_url, response.content, response.excerpt, urlId ];

          if (!!response.domain){
            db.run('UPDATE source SET domain=? WHERE id=?', [ response.domain, urlId ], err => {
              if (err) { throw err; }

              db.run(`INSERT INTO
                content (title,author,leadImage,content,excerpt,sourceId)
                VALUES  (    ?,     ?,        ?,      ?,      ?,       ?)`, dataDb, function(err) {

                  if (err) { throw err; }
                  data = { status: true, data: { id: this.lastID } }

                  return rep(data);
                });

              })
          } else {
            db.run('DELETE FROM source WHERE id=?',urlId,err=>{
              data.message = 'Unauthorized access';
              return rep(data);
            })
          }
        }).catch(err => {
          data.message = err;
          return rep(data);
        })
      } else {
        if (err.code == 'SQLITE_CONSTRAINT') {

          db.get(`SELECT c.id FROM content c
            JOIN source s ON s.id = c.sourceId
            WHERE s.url=?`, url, (err, row) => {

            if(!!row){
              data = { status: !!row, data: { id: row['id'] } }
              return rep(data);
            } else{
                db.run('DELETE FROM source WHERE url=?',url,err=>{
                  data.message = 'Content not parsed yet, please refresh';
                  return rep(data);
                })
            }

          })
        } else {
          throw err;
        }
      }
    })

  }
});

// GET /{urlId} : get url
server.route({
  method: 'GET',
  path: '/{contentId}',
  handler(req, rep) {
    const contentId = req.params.contentId ? encodeURIComponent(req.params.contentId) : false;
    let data = {}

    db.get(`SELECT c.id,c.title,c.author,c.leadImage,c.content,c.excerpt,
        s.url,s.dateFetched
      FROM content c JOIN source s ON s.id = c.sourceId
      WHERE c.id=?`, contentId, (err, row) => {

      if (err) { throw err; }

      data = { status: !err, data: !!row ? row:{} }
      return rep(data)
    });
  }
});

server.register({
  register: Good,
  options: {
    reporters: {
      console: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [ { response: '*', log: '*' } ]
        }, {
          module: 'good-console'
        },
        'stdout'
      ]
    }
  }
}, (err) => {
  if (err) { throw err; }
  server.start((err) => {
    if (err) { throw err; }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
