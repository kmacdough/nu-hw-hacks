'use strict'

let express = require('express');

let router = express.Router();

router.get('/move/:dir/:meters', (req, res) => {
  let dir = req.params.dir
  let meters = req.params.meters
  res.send('You moved ' + meters + ' meters ' + dir);
});

module.exports = router
