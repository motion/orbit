import express from 'express'
import http from 'http'
import { Server } from 'ws'
import uuid from 'node-uuid'
import debug from 'debug'
import url from 'url'
import socketio from 'socket.io'

const log = debug('server')

export default class DebugServer {
  constructor({ onTargets }) {
    var targets = {}
    var sockets = {}
    var sessions = {}

    function callOnTargets() {
      onTargets(Object.keys(targets))
    }

    var app = express()
    app.set('port', process.env.PORT || 8000)
    app.use(express.static('web'))

    app.get('/', function(req, res) {
      log('http:index')
      res.json({
        msg: 'Hello from DevToolsRemote',
      })
    })

    app.get('/sessions', function(req, res) {
      res.json(sessions)
    })

    app.get('/_stats', function(req, res) {
      log('http:stats')
      res.json({
        count: {
          targets: Object.keys(targets).length,
          sockets: Object.keys(sockets).length,
          sessions: Object.keys(sessions).length,
        },
      })
    })

    app.get('/:session/json', function(req, res) {
      var sessionId = req.params.session
      var sessionTargets = targets[sessionId]
      res.send(sessionTargets)
    })

    // server
    const server = new http.Server(app)
    server.listen(app.get('port'), function() {
      log(
        '-:listening on port %d in %s mode',
        app.get('port'),
        app.settings.env,
      )
    })

    // handle connection from browser socket
    const io = socketio(server)
    io.sockets.on('connection', function(socket) {
      const sessionId = uuid()
      log('socket:connection', sessionId)
      targets[sessionId] = []
      sockets[sessionId] = socket
      sessions[sessionId] = {
        startTime: new Date().getTime(),
      }
      socket.on('disconnect', () => {
        log('socket:disconnect')
        var session = sessions[sessionId]
        var endTime = new Date().getTime()
        var duration = endTime - session.startTime
        console.log('duration', duration)
        delete targets[sessionId]
        delete sockets[sessionId]
        delete sessions[sessionId]
        callOnTargets()
      })
      socket.on('error', function(err) {
        log('socket:error', err)
      })
      socket.on('hello', data => {
        log('socket:hello', data)
        var webSocketUrl =
          (process.env.WEBSOCKET_DOMAIN
            ? process.env.WEBSOCKET_DOMAIN
            : 'localhost:' + app.get('port')) +
          '/devtools/page/' +
          sessionId
        targets[sessionId].push({
          description: '',
          devtoolsFrontendUrl: '/devtools/devtools.html?ws=' + webSocketUrl,
          devtoolsUrl:
            'chrome-devtools://devtools/remote/serve_rev/@8925c3c45f3923bc78ffc841842183cc592a0143/inspector.html?wss=' +
            webSocketUrl +
            '&remoteFrontend=true&dockSide=unlocked&experiments=true',
          id: uuid(),
          title: data.title,
          type: 'page',
          url: data.url,
          webSocketDebuggerUrl: 'ws://' + webSocketUrl,
        })
        callOnTargets()
        socket.emit('sessionCreated', sessionId)
      })
    })

    // relay to other devtools
    const Relay = new Server({ noServer: true })
    Relay.on('error', err => console.log('Relay:err', err))
    server.on('upgrade', (request, socket, head) => {
      const { pathname } = url.parse(request.url)
      const names = pathname.split('/')
      if (names[1] !== 'devtools') {
        socket.destroy()
        return
      }
      const id = names[names.length - 1]
      Relay.handleUpgrade(request, socket, head, conn => {
        log('upgrading...', id)
        handleConnection(id, conn)
      })
    })
    function handleConnection(pageId, conn) {
      const socket = sockets[pageId]
      if (!socket) {
        console.log('closing with 1011')
        return conn.close(1011, 'Matching socket not found :/')
      }
      log('relay:connected', pageId)
      const forwardMessage = data => conn.send(JSON.stringify(data))
      socket.on('data.response', data => {
        log('relay:data:response', data.id)
        forwardMessage(data)
      })
      socket.on('data.event', data => {
        log('relay:data:event', data.method)
        forwardMessage(data)
      })
      conn.on('close', () => {
        log('relay:close')
        socket.removeAllListeners('data.response')
        socket.removeAllListeners('data.event')
      })
      conn.on('error', err => log('relay:error', err))
      conn.on('message', data => {
        log('relay:message')
        try {
          const message = JSON.parse(data)
          socket.emit('data.request', message)
        } catch (e) {
          log('relay:err:parsing', data)
        }
      })
    }
  }
}
