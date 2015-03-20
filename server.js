var express = require('express'), server = express();
server.use(express.static(__dirname));
console.log('Listening on 127.0.0.1:3000');
server.listen(3000);