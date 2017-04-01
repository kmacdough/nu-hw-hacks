'use strict'

let express = require('express');

let router = express.Router();

var lastMove = {
  dir: "stop",
  speed: 0
}

var resetAt = Date()
let resetAfterSec = 5;

router.get('/move', (req, res) => {
  let dir = req.query.dir
  let speed = req.query.speed
  res.send('You moved ' + speed + ' meters ' + dir);
  lastMove = {
    dir: dir,
    speed: speed
  }
  reset = Date(Date.getTime() + resetAfterSec * 1000);

  // Autoreset
  SetTimeout(() => {
    if (Date() > resetAt) {
      lastMove = {
        dir: "stop",
        speed: 0
      }
    }
  }, resetAfterSec * 1000)
});

router.get('/getmove', (req, res) => {
  res.json(lastMove);
})



module.exports = router
