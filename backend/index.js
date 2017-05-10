const Hapi = require('hapi');
const server = new Hapi.Server();
const Good = require('good');

server.connection({
  host: '0.0.0.0',
  port: 9000,
  routes: {
    cors: true
  }
});

const {getAll: routeGetAll, post: routePost, get: routeGet} = require('./route-root.js');
server.route({method: 'GET', path: '/', handler: routeGetAll});
server.route({method: 'GET', path: '/{contentId}', handler: routeGet});
server.route({method: 'POST', path: '/', handler: routePost});

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
    throw err;
  }
  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
