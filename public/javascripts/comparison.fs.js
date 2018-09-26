var socket = io('https://' + location.host);

var Pi = {};

socket.on('connect', function () {
    d1 = 0
    d2 = 0
    if(count < 256) d2 = count
    else {
      d1 = count - 255
      de = 255
    }
    data = new Uint8Array([d1,d2,0,0,0,6,1,3,0,0,0,27])
    console.log('request no - ' + count)
    client.write(Buffer.from(data.buffer))
    count++
});

socket.on('data', function (data) {
    var ras = msg.devras;
    var datr3 = msg.datr3;

    if (!Pi[ras] || !isPlay) return;


    no = buffer.from([data[0],data[1]])
    dcv = Buffer.from([data[11],data[12]])
    dca = Buffer.from([data[13],data[14]])
    env = Buffer.from([data[51],data[52]])
    envh = Buffer.from([data[53],data[54]])
    console.log('요청번호: ' + no.readUInt16BE(0))
	console.log('dc전압: ' + dcv.readUInt16BE(0))
    console.log('dc전류: ' + dca.readUInt16BE(0))
    console.log('경사일사량:' + env.readUInt16BE(0))
    console.log('수평일사량:' + envh.readUInt16BE(0))

    var dcv = Number(msg.dcv);
    var dca = Number(msg.dca);
    var env = Number(msg.env);
    var envh = Number(msg.envh);

    Pi[ras].dcv = values.dcv;
    Pi[ras].dca = values.dca;
    Pi[ras].env = values.env;
    Pi[ras].envh = values.envh;

    updateTable3(ras);
});
