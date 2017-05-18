const system = require('system');
const webPage = require('webpage');

const page = webPage.create();
const url = system.args[1];

const requestsArray = [];

page.onResourceRequested = function(requestData, networkRequest) {
  if ((/.+?\.css/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/css'
      (/.+?\.(jpg|jpeg)/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'image/jpeg') {
        // console.log('The url of the request is matching. Aborting: ' + requestData['url']);
        networkRequest.abort();
  }
  // console.log(requestData.headers['Content-Type']);
  requestsArray.push(requestData.id);
};

page.onResourceReceived = function(response) {
  var index = requestsArray.indexOf(response.id);
  requestsArray.splice(index, 1);
};

page.open(url, function(status) {

  var interval = setInterval(function () {
    if (requestsArray.length === 0) {

      clearInterval(interval);
      var content = page.content;
      console.log(content);

      phantom.exit();
    }
  }, 50);
});
