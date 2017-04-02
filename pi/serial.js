'use strict'
let https = require('https')
let SerialPort = require('serialport')

var serialPort = new SerialPort("/dev/ttyS0", {
    baudrate: 9600
});

serialPort.on("open", function () {
    console.log('open');
    while(true) {
        https.get("https://hacks.maxton.xyz:3443/api/v1/controller", (res) => {
	    console.log("sending");
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    console.log("got data");
                    let parsedData = JSON.parse(rawData);
                    var b = new Buffer(4);
                    b.writeInt8(parsedData.left[0] * 127 + 127, 0);
                    b.writeInt8(parsedData.left[1] * 127 + 127, 1);
                    b.writeInt8(parsedData.right[0] * 127 + 127, 2);
                    b.writeInt8(parsedData.right[1] * 127 + 127, 3);
                    serialPort.write(b);
                } catch (e) {
                    console.log(e.message);
                }
            });
        });
    }
});
