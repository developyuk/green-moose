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

const {getAll: rootGetAll, post: rootPost, get: rootGet} = require('./routes-root.js');
server.route({method: 'GET', path: '/', handler: rootGetAll});
server.route({method: 'GET', path: '/{contentId}', handler: rootGet});
server.route({method: 'POST', path: '/', handler: rootPost});

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
