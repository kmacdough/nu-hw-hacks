'use strict'

let express = require('express');
let multer  = require('multer');
let router = express.Router();
let upload = multer();

var lastMove = {
  // direction vector { [0,360), [0,1] }
  dir: [0,0],
  vertical: 0
}

var resetAt = Date()
let resetAfterSec = 5;

router.get('/move', (req, res) => {
  let dir = req.query.dir
  let vertical = req.query.vertical
  res.send('You moved ' + speed + ' meters ' + dir);
  lastMove = {
    dir: dir,
    vertical: vertical
  }
  resetAt = new Date((new Date()).getTime() + resetAfterSec * 1000);

  // Autoreset
  setTimeout(() => {
    if ((new Date()).getTime() > resetAt.getTime()) {
      lastMove = {
        dir: [0,0],
        vertical: 0
      }
    }
  }, resetAfterSec * 1000 + 200);
});

router.get('/getmove', (req, res) => {
  res.json(lastMove);
})

var imgbuffer = new Buffer([]);

router.post('/img', upload.single('file'), (req,res) => {
  imgbuffer = req.file.buffer;
  res.send('1');
})

router.get('/img', (req, res) => {
  res.type('jpeg');
  res.set('Cache-Control', 'no-store');
  res.send(imgbuffer);
})

module.exports = router
