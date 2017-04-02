'use strict'

let SerialPort = require('serialport')

var serialPort = new SerialPort("/dev/ttyACM0", {
    baudrate: 9600
});

serialPort.on("open", function () {
    console.log('open');
    while(true) {
        http.get("https://hacks.maxton.xyz:3443/api/v1/controller", (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    var b = new Buffer(4);
                    b.writeInt8(parsedData.left[0] * 127, 0);
                    b.writeInt8(parsedData.left[1] * 127, 1);
                    b.writeInt8(parsedData.right[0] * 127, 2);
                    b.writeInt8(parsedData.right[1] * 127, 3);
                    serialPort.write(b);
                } catch (e) {
                    console.log(e.message);
                }
            });
        });
    }
});