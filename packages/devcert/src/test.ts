let devcert = require("./index");
let https = require("https");
let express = require('express');
let app = express();

(async function() {
  // await devcert.removeDomain('nate-is-handsome2.com');

  await devcert.certificateFor('nate-is-handsome5.com', {
    })
    .then((ssl: any) => https.createServer(ssl, app).listen(3000))
}());