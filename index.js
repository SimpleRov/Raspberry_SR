var express = require('express');
var app = express();

// Настройка сервера.
var serverHttp = require('http').createServer(app);
app.use(express.static(__dirname + '/public'));
serverHttp.listen(8090);

// Сообщение об удачном запуске сервера.
console.log("HTTP server running");

// Настройка бинарного парсера.
var binaryParser= require('binary-parser').Parser;

var ps2Struct = new binaryParser()
    .string('beginPackage', {
            encoding: 'ascii',
            length: 1})
    .string('commandType', {
            encoding: 'ascii',
            length: 1})
    .uint8('commandDataSize')  
    .uint8('command')  
    .bit8('bfirst')
    .bit8('bsecond')
    .uint8('statuswork')
    .uint8('lx')
    .uint8('ly')
    .uint8('rx')
    .uint8('ry')
    .uint8('checksum')

var rovDataStruct = new binaryParser()
    .string('beginPackage', {
            encoding: 'ascii',
            length: 1})
    .string('commandType', {
            encoding: 'ascii',
            length: 1})
    .uint8('commandDataSize')  
    .uint8('command')  
    .uint8('errore') 
    .uint8('checksum')

// Настройка UART.
var serialPort = require("serialport");

// Создаем UART и подключаемся к нему.
var uart = new serialPort.SerialPort("/dev/ttyAMA0", { baudrate : 115200 },
    function(error)
    {
        if(error)
        {
            console.log("Uart init error: " + error.message + "\n");
        }
    });

// Обработчик события, открытия порта UART.
uart.open(function (err)
{
    if (err)
    {
        console.log(err);
        return;
    }
    console.log('Uart open');
});

// Обработчик события, получения данных по UART.
uart.on('data', function(message)
{    
    console.log("UART In");

    serverUdp.send(message, 0, message.length, udpPort, '192.168.1.108',
        function (err, bytes)
        {
            if (err)
            {
                console.log(err);
                return;
            }
        }
    );

    //console.log(rovDataStruct.parse(message));

    console.log("UDP Out");
});

// Настройка UDP.
var udpPort = 8888;
var udpHost = '192.168.1.102';

const dgram = require('dgram');
const serverUdp = dgram.createSocket('udp4');

// Обработчик события, ошибок UDP.
serverUdp.on('error', function(err)
{
    if (err)
    {
        console.log(err);
        return;
    }
});

// Обработчик события, генерируется всякий раз, когда сокет начинает прослушивание.
serverUdp.on('listening', function (message, remote)
{

}); 

// Обработчик события, полученния данных UDP.
serverUdp.on('message', function (message, remote)
{
    if (uart.isOpen())
    {
        console.log("UDP In");

        uart.write(message);

        console.log("UART Out");

		//console.log(ps2Struct.parse(message));
    }
});

serverUdp.bind(udpPort, udpHost);

// Сообщение об удачном запуске сервера.
console.log("UDP server running");
