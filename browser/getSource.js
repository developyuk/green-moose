"use strict";


var port, server, service,
    system = require('system');

if (system.args.length !== 2) {
    console.log('Usage: serverkeepalive.js <portnumber>');
    phantom.exit(1);
} else {
    port = system.args[1];
    server = require('webserver').create();

    service = server.listen(port, {
        keepAlive: true
    }, function(request, response) {
        var page = require('webpage').create();
        var url = request.url.slice(1);

        var resourceWait = 300,
            maxRenderWait = 10000;

        var count = 0,
            forcedRenderTimeout,
            renderTimeout;

        function doRender() {
            // page.render('twitter.png');
            // phantom.exit();

            var body = page.content;
            response.statusCode = 200;
            response.headers = {
                'Cache': 'no-cache',
                'Content-Type': 'text/plain',
                'Connection': 'Keep-Alive',
                'Keep-Alive': 'timeout=5, max=100',
                'Content-Length': body.length
            };
            response.write(body);
            response.close();
        }

        page.onResourceRequested = function(req) {
            count += 1;
            // console.log('> ' + req.id + ' - ' + req.url);
            clearTimeout(renderTimeout);
        };

        page.onResourceReceived = function(res) {
            if (!res.stage || res.stage === 'end') {
                count -= 1;
                // console.log(res.id + ' ' + res.status + ' - ' + res.url);
                if (count === 0) {
                    renderTimeout = setTimeout(doRender, resourceWait);
                }
            }
        };
        page.open(url, function(status) {
            // console.log(status, url);

            if (status !== "success") {
                console.log('Unable to load url');
                // phantom.exit();
            } else {
                forcedRenderTimeout = setTimeout(function() {
                    // console.log(count);
                    doRender();
                }, maxRenderWait);
            }
        });
    });

    if (service) {
        console.log('Web server running on port ' + port);
    } else {
        console.log('Error: Could not create web server listening on port ' + port);
        phantom.exit();
    }
}
