'use strict';

let express = require('express')
let app = express()

let https = require('https')
let fs = require('fs')

app.use('/api/v1', require('./api'))
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})



try {
  var sslOpts = {
    key: fs.readFileSync('/etc/letsencrypt/live/hacks.maxton.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/hacks.maxton.xyz/fullchain.pem')
  }

  https.createServer(sslOpts, app).listen(3443, function() {
    console.log("HTTPS server listening on port 3443")
  })
} catch(ex) {
  app.listen(3001, function () {
    console.log('HTTP server listening on port 3001!')
  })
}
