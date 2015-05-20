var http = require('http');
var winston = require('winston');

var __MY__VERSION = "1.0.0";

//////////////
// SETTINGS //
//////////////

// List of RECIVERS
var proxyList = [{
    hostname: '123.456.789',
    port: 3333,
    path: '/'
},{
    hostname: 'localhost',
    port: 8580,
    path: '/fcd'
}];

// The port where the server will be listen for incoming request.
var mySettings = {
    myPort: 1800
}

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
			level: 'info',
			colorize: true,
			timestamp: true,
		}),
      new (winston.transports.DailyRotateFile)({
			filename: 'proxy.log', 
			level: 'info'
	  })
    ]
});

logger.info("Starting multi-http-proxy");

var nProxy = proxyList.length;
http.createServer(function (request, response) {

    var fullBody = '';
    request.on('data', function(chunk) {
        fullBody += chunk.toString();
    });
	
	request.on('error', function(err){
		logger.error("Error", err);
	});

    request.on('end', function () {
		
        for(var i=0;i<nProxy;i++) {
            var proxy = proxyList[i];
			logger.info("send to", proxy);
        
			proxy.method = request.method;
            proxy.headers = request.headers;
            proxy.headers.host = proxy.hostname;

            if(i==0) {
                var proxied_req = http.request(proxy, function(res) {
                    res.setEncoding('utf8');

                    var bodyResponse = "";

					res.on('error', function (err) {
                        logger.error("Error sending to", err, proxy);
                    });
					
                    res.on('data', function (chunk) {
                        bodyResponse += chunk;
                    });

                    res.on('end', function(){
                        response.headers = res.headers;
                        response.write(bodyResponse);
                        response.end();
                    });
                });
            }
            else {
                var proxied_req = http.request(proxy, function(res) {});				
            }

            proxied_req.write(fullBody);
            proxied_req.end();

			proxied_req.on('error', function (err) {
				logger.error("Error sending to", err, proxy);
			});
        }
    });
}).listen(mySettings.myPort);