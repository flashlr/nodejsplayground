var http = require('http');
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var util = require('util');
var inspect = require('eyes').inspector({ maxLength: false });


// ======= load GPX in memory
var parser = new xml2js.Parser();
var ftag = function (name) { console.log('tagname: ' + name); };
var fattr = function (value, name) { console.log('name: ' + name + " - value:" + value); };



var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml'
};

var coordinates="";
fs.readFile(__dirname + '/marneffe.gpx', function (err, data) {

    parser.parseString(data,


        function (err, result) {
          console.log ("parse GPX")
            /*
            for (i = 0; i++; i < 10) {
                console(result.gpx.trk[0].trkseg[0].trkpt[i]["$"].lat);

            }
            */

            /// inspect(result.gpx.trk[0].trkseg[0].trkpt[0]["$"].lat);

             
             result.gpx.trk[0].trkseg[0].trkpt.forEach(x => {
                coordinates +=x["$"].lat +";"+  x["$"].lon +";" + x.time + "\n"; 
            }
            
            
            );


            console.log("extract coordinates:\n" + coordinates);
            

            //   array.forEach(result.gpx.trk.trkseq.trkseq.trkpt => { console.log(x.lat)});
            //  console.log();
            // processed data
        });
    /*
  parser.parseString(data, function (err, result) {
  });
  */
});
/*
fs.readFile(__dirname + '/marneffe.gpx', function (err, data) {
    console.log("read file :");
    parser.parseString(data, {

        attrNameProcessors: [],
        valueProcessors: [],
        attrValueProcessors: [],

        function(err, result) {
            console.dir(result);
            console.log('Done');
           // console.log(util.inspect(result, false, null));
            // console.log(result.gpx.trk.trkseq);

            // array.forEach(result.gpx.trk.trkseq.trkseq.trkpt=> { console.log(x.lat);

        }
    });
});

*/



http.createServer(function (request, response) {
    console.log('request ', request.url);
    
    var filePath = '.' + request.url;

     if (request.url == "/gpx")
    {
        response.writeHead(200, { 'Content-Type': "text/plain" });
        response.end(coordinates, 'utf-8');
    }

    else
    {
    if (filePath == './') {
        filePath = './index.html';
    }
    
   
  

        var extname = String(path.extname(filePath)).toLowerCase();
        
        var contentType = mimeTypes[extname] || 'application/octet-stream';
        
        fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./404.html', function (error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, lro, we made a mistake, no error page - check with the site admin for error: ' + error.code + ' ..\n');
                    response.end();
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    
    }  
    }).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');
