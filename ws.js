const ws = require('ws')

const WebSocketServer = ws.Server
const wss = new WebSocketServer({
  port: process.env.PORT || 8000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
})

wss.on('connection', function connection(ws) {
  console.log('connect')
  ws.send('connected')
  ws.on('message', function message(data) {
    const isJsonString = data[0] === '{' || data[0] === '['
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(isJsonString ? data.toString() : data.toString())
      }
    })
  })
  // ws.on('SUBSCRIBE', function subscribe(info) {
  //   ws.join(info.roomId)
  //   roomId = info.roomId
  // })
  // ws.on('INFO', function info(info) {
  //   console.log('roomID', roomId)
  //   ws.send(info)
  // })
  // ws.on('TWO_PLAYER_CONNECTED', function twoPlayerConnected(info) {
  //   console.log('roomID1', roomId)
  //   ws.send(info)
  // })
  // ws.on('TWO_PLAYER_READY', function twoPlayerReady(info) {
  //   console.log('roomID2', roomId)

  //   ws.send(info)
  // })
  // ws.on('TWO_PLAYER_START', function twoPlayerStart() {
  //   ws.send({key: 'TWO_PLAYER_START'})
  // })
})
