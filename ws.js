function handler(req, res) {}

const EVENT_TYPE = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'joinRoom',
  SEND_PRIVATE_MESSAGE: 'sendPrivateMessage',
  SEND_ROOM_MESSAGE: 'sendRoomMessage',
}

const app = require('http').createServer(handler)
const io = require('socket.io')(app, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on(EVENT_TYPE.CONNECTION, (socket) => {
  console.log(`User ${socket.userId} join ${socket.userId} room.`)
  socket.join(socket.userId)

  if (socket.roomId && socket.roomId !== socket.userId) {
    console.log(`User ${socket.userId} join ${socket.roomId} room.`)
    socket.join(socket.roomId)
  }

  socket.on(EVENT_TYPE.JOIN_ROOM, (roomId) => {
    socket.join(roomId)
  })

  socket.on(EVENT_TYPE.SEND_PRIVATE_MESSAGE, ({ content, to }) => {
    const message = {
      content,
      from: socket.userId,
      to,
    }
    socket.to(to).emit(EVENT_TYPE.SEND_PRIVATE_MESSAGE, message)
  })

  socket.on(EVENT_TYPE.SEND_ROOM_MESSAGE, ({ content, to }) => {
    if (!to) {
      to = socket.roomId
    }

    const message = {
      content,
      from: socket.userId,
      to,
    }
    socket.to(to).emit(EVENT_TYPE.SEND_ROOM_MESSAGE, message)
  })

  socket.on(EVENT_TYPE.DISCONNECT, () => {
    console.log(`User ${socket.userId} disconnected.`)
  })
})
const port = process.env.PORT || 8000
app.listen(port, function run () {
  console.log(`listen on *:${port}`)
})



// const ws = require('ws')

// const WebSocketServer = ws.Server
// const wss = new WebSocketServer({
//   port: 8000,
//   perMessageDeflate: {
//     zlibDeflateOptions: {
//       // See zlib defaults.
//       chunkSize: 1024,
//       memLevel: 7,
//       level: 3,
//     },
//     zlibInflateOptions: {
//       chunkSize: 10 * 1024,
//     },
//     // Other options settable:
//     clientNoContextTakeover: true, // Defaults to negotiated value.
//     serverNoContextTakeover: true, // Defaults to negotiated value.
//     serverMaxWindowBits: 10, // Defaults to negotiated value.
//     // Below options specified as default values.
//     concurrencyLimit: 10, // Limits zlib concurrency for perf.
//     threshold: 1024, // Size (in bytes) below which messages
//     // should not be compressed if context takeover is disabled.
//   },
// })

// wss.on('connection', function connection(ws) {
//   console.log('connect')
//   ws.send('connected')
//   ws.on('message', function message(data) {
//     const isJsonString = data[0] === '{' || data[0] === '['
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === ws.OPEN) {
//         setTimeout(() => {
//           client.send(isJsonString ? data.toString() : data.toString())
//         }, 300)
//       }
//     })
//   })
//   // ws.on('SUBSCRIBE', function subscribe(info) {
//   //   ws.join(info.roomId)
//   //   roomId = info.roomId
//   // })
//   // ws.on('INFO', function info(info) {
//   //   console.log('roomID', roomId)
//   //   ws.send(info)
//   // })
//   // ws.on('TWO_PLAYER_CONNECTED', function twoPlayerConnected(info) {
//   //   console.log('roomID1', roomId)
//   //   ws.send(info)
//   // })
//   // ws.on('TWO_PLAYER_READY', function twoPlayerReady(info) {
//   //   console.log('roomID2', roomId)

//   //   ws.send(info)
//   // })
//   // ws.on('TWO_PLAYER_START', function twoPlayerStart() {
//   //   ws.send({key: 'TWO_PLAYER_START'})
//   // })
// })
