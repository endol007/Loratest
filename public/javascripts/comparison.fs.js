var socket = io('https://' + location.host);

var nodes = {};

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

socket.on('data', function (msg) {
    var eui = msg.deveui;
    var datr = msg.datr;

    if (!nodes[eui] || !isPlay) return;
    
    if(nodes[eui].currentDatr != datr) {
        nodes[eui].currentDatr = datr;
        nodes[eui].data[datr] = [];
        nodes[eui].dcv = 0;
        nodes[eui].dca = 0;
        nodes[eui].env = 0;
        nodes[eui].envh = 0;
        clearCharts(eui);
    }

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
    nodes[eui].data[datr].push({ dcv: dcv, dca: dca, env: env, envh: envh});
    var values = get(nodes[eui],data[datr]);
    nodes[eui].dcv = values.dcv;
    nodes[eui].dca = values.dca;
    nodes[eui].env = values.env;
    nodes[eui].envh = values.envh;

    updateTable3(eui);
});
