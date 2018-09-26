var db = require('./mongoose');

var gateways = db.listGateways;
var nodes = db.listNodes;

function ioEventHandler(socket) {
  socket.on('data', function(msg) {
    socket.broadcast.emit('data', msg);

    if (!nodes[msg.deveui]) return;

    try { saveData(msg) }
    catch (e) { console.log('# [Err] io.saveData\n', e); }
  });
}

function saveData(data) {
  var eui = data.deveui;
  var dbConnection = db.getConnection(nodes[eui].gateway);

  if (!dbConnection) return;

  var node = nodes[data.deveui];
  node.rssi = data.rssi;
  node.solar = data.solar;
  node.dcv = data.dcv;
  node.dca = data.dca;
  node.env = data.env;
  node.envh = data.envh;
  node.interval = (new Date(data.timestamp) - new Date(node.last_in)) / 1000;
  node.last_in = new Date(data.timestamp);

  var query = {
    time: data.time,
    lsnr: data.lsnr,
    rssi: data.rssi,
    solar: data.solar,
    dcv: data.dcv,
    dca: data.dca,
    env: data.env,
    envh: data.envh,
    seqn: data.seqn,
    sensors: data.sensors
  }
  dbConnection.model('node_' + eui, db.Schema.data)(query).save()
  .then()
  .catch(function(err) {
    console.log('[Err] io.saveData\n', err);
  });
}

module.exports = {
  ioEventHandler: ioEventHandler
};
