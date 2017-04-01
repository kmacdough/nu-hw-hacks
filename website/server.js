'use strict';

let express = require('express')
let app = express()

app.use('/api/v1', require('./api'))
// app.use('/', requireg('./webapp'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})
