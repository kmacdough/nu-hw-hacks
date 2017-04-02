'use strict'

let express = require('express');
let multer  = require('multer');

let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let router = express.Router();
let upload = multer();

var lastMove = {
  left: [0,0],
  right: [0,0]
}

var resetAt = Date()
let resetAfterSec = 1;

router.post('/controller', jsonParser, (req, res) => {
  lastMove = req.body
  resetAt = new Date((new Date()).getTime() + resetAfterSec * 1000);

  res.send('')
  // Autoreset
  setTimeout(() => {
    if ((new Date()).getTime() > resetAt.getTime()) {
      lastMove = {
        left: [0,0],
        right: [0,0]
      }
    }
  }, resetAfterSec * 1000 + 200);
});

router.get('/controller', (req, res) => {
  res.json(lastMove);
})

var gps = {
  "lat": 0,
  "lng": 0,
  "alt": 0
}
router.post('/gps', jsonParser, (req, res) => {
  gps = req.body
  res.send('')
})

router.get('/gps', (req, res) => {
  res.json(gps)
})

var heading = {
  "heading": 0
}
router.post('/heading', jsonParser, (req, res) => {
  heading = req.body
  res.send('')
})

router.get('/heading', (req, res) => {
  res.json(heading)
})

var imgbuffer = new Buffer([]);

router.post('/img', upload.single('file'), (req,res) => {
  imgbuffer = req.file.buffer;
  res.send('');
})

router.get('/img', (req, res) => {
  res.type('jpeg');
  res.set('Cache-Control', 'no-store');
  res.send(imgbuffer);
})

module.exports = router
