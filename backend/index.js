const Hapi = require('hapi');
const server = new Hapi.Server();
const mercury = require('mercury-parser')('API_KEY');

server.connection({
    host: '0.0.0.0',
    port: 9000,
    routes: {
        cors: true
    }
});

// GET / : get all url
// GET /{url} : get url
server.route({
    method:['GET'],
    path: '/',
    handler(req, rep) {
        const url = req.query.url ? encodeURIComponent(req.query.url) : False;

        // check url exist on db
        // if exist, fetch from db
        // else, fetch with parser, insert to db and put to response

        mercury.parse(url).then(response =>{
            let data = {
                status: true,
                data: response
            };

            return rep(data);
        }).catch(err => {
            console.log('Error: ', err);
        })
    }
});


server.start(function (err) {
    if (err) throw err;

    server.log('info', `Server running at: ${server.info.uri}`);
});
