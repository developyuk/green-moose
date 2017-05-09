const Hapi = require('hapi');
const server = new Hapi.Server();
const Good = require('good');
const mercury = require('mercury-parser')('gzrlY9eugmiGC3L4DkcaSARyKuN0aWklMlPjvUva');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./src/content.db');

server.connection({
  host: '0.0.0.0',
  port: 9000,
  routes: {
    cors: true
  }
});

// GET / : get all url
server.route({
  method: 'GET',
  path: '/',
  handler(req, rep) {
    const page = req.query.page
      ? encodeURIComponent(req.query.page)
      : false
    let data = {};

    db.all(`SELECT id,title,author,leadImage,content,excerpt
      FROM content`, (err, rows) => {

      data = {
        status: !!rows.length,
        data: rows
      }
      return rep(data)
    })
  }
});
// POST / : add url to db
server.route({
  method: 'POST',
  path: '/',
  handler(req, rep) {
    const url = req.payload.url
      ? encodeURIComponent(req.payload.url)
      : false
    let data = {
      status: false,
      message: '',
      data: {
        id: null
      }
    };

    db.run("INSERT INTO source (url) VALUES (?)", url, function(err) {
      const urlId = this.lastID;
      if (!!urlId) {
        // fetch from db with last insert id
        mercury.parse(url).then(response => {
          const dataDb = [
            response.title,
            response.author,
            response.lead_image_url,
            response.content,
            response.excerpt,
            urlId
          ];
          // console.log(5, data);
          db.run('UPDATE source SET domain=? WHERE id=?', [
            response.domain, urlId
          ], err => {

            db.run(`INSERT INTO
              content (title,author,leadImage,content,excerpt,sourceId)
              VALUES  (    ?,     ?,        ?,      ?,      ?,       ?)`, dataDb, function(err) {
              data = {
                status: true,
                data: {
                  id: this.lastID
                }
              }

              return rep(data);
            });

          })
        }).catch(err => {
          console.log('Error: ', err);
          data.message = err;
          return rep(data);
        })
      } else {
        if (err.code == 'SQLITE_CONSTRAINT') {

          db.get(`SELECT c.id
              FROM content c
              JOIN source s ON s.id = c.sourceId
              WHERE s.url=?`, url, (err, row) => {

            data = {
              status: true,
              data: {
                id: row.id
              }
            }
            return rep(data);
          })
        } else {
          data.message = err;
          return rep(data);
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
    const contentId = req.params.contentId
      ? encodeURIComponent(req.params.contentId)
      : false;
    let data = {}

    db.get(`SELECT c.id,c.title,c.author,c.leadImage,c.content,c.excerpt,
        s.url,s.dateFetched
      FROM content c
      JOIN source s ON s.id = c.sourceId
      WHERE c.id=?`, contentId, (err, row) => {

      if (!!row) {
        data = {
          status: true,
          data: row
        }
      } else {
        data = {
          status: false,
          message: err,
          data: {}
        }
      }
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
          args: [
            {
              response: '*',
              log: '*'
            }
          ]
        }, {
          module: 'good-console'
        },
        'stdout'
      ]
    }
  }
}, (err) => {

  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start((err) => {

    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
