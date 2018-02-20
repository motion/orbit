/* global chrome io */

function getCurrentTab() {
  return new Promise(res => {
    chrome.tabs.query({ currentWindow: true, active: true }, function(
      tabArray,
    ) {
      res(tabArray[0])
    })
  })
}

var log = function(...args) {
  console.log(...args)
}

log('huuuu')

async function run() {
  const tab = await getCurrentTab()
  if (!tab) return
  console.log('got tab', tab)

  // const server = 'https://remote.devtools.rocks/'
  const server = 'http://localhost:8000/'

  var debuggee = {}
  var app = {}
  var tabRef
  var socketRef
  var connection = io(server, {
    autoConnect: false,
  })

  resetSockets(tab)

  function resetSockets(tab) {
    tabRef = tab
    debuggee.tabId = tab.id

    getDebuggerTarget().then(target => {
      if (target.attached) {
        console.warn('debuggee.already attached')
        chrome.debugger.detach(debuggee)
      }
      if (target.url.startsWith('chrome://')) {
        return log('ERR')
      }
      log('oo0')
      attachDebuggerAndSocket(debuggee, tab)
    })
  }

  function getDebuggerTarget(fn) {
    return new Promise(resolve =>
      chrome.debugger.getTargets(targetsArr => {
        var arr = targetsArr.filter(t => t.tabId === debuggee.tabId)
        resolve(arr && arr[0])
      }),
    )
  }

  function attachDebuggerAndSocket(debuggee, tab) {
    log('debugger.attach', tab)
    chrome.debugger.attach(debuggee, '1.1', function() {
      log('debugger.attached')
    })

    if (connection && connection.connected) {
      log('socket.disconnecting previous socket')
      connection.disconnect()
    }
    log('socket.connecting')
    connection.connect()
  }

  // socket-side
  app.onSocketConnect = function() {
    log('socket.connect')
    socketRef = this

    this.on('data.request', app.onSocketDataRequest)
    this.on('sessionCreated', app.onSessionCreated)

    this.emit('hello', {
      title: tabRef.title,
      url: tabRef.url,
      userAgent: navigator.userAgent,
    })
  }

  app.onSocketDisconnect = function() {
    log('socket.disconnect')

    this.off('data.request')
    this.off('sessionCreated')

    socketRef = null

    getDebuggerTarget().then(target => {
      if (target && target.attached) {
        chrome.debugger.detach(debuggee, _ => log('debugger.detached'))
      }
    })
  }

  app.onSocketDataRequest = function(data) {
    log('socket.data.request', data.id, data)

    if (data.method === 'Page.canScreencast') {
      var reply = {
        id: data.id,
        result: {
          result: true,
        },
      }

      this.emit('data.response', reply)
      return
    }

    chrome.debugger.sendCommand(
      debuggee,
      data.method,
      data.params,
      function(response) {
        log('debugger.command.sent', data.id, response)

        var reply = {
          id: data.id,
          result: response,
        }

        log('socket.data.response', reply.id, reply)
        this.emit('data.response', reply)
      }.bind(this),
    )
  }

  app.getURL = function(sessionId) {
    log('ooo')

    window
      .fetch(server + sessionId + '/json')
      .then(r => r.json())
      .then(targets => {
        log('Inspectable targets on ', server, ':')
        targets.forEach(t => {
          /* t looks like: {
          description: "",
          devtoolsFrontendUrl: "/devtools/devtools.html?ws=devtoolsremote.com/devtools/page/lQOtx1HAAC",
          devtoolsUrl: "chrome-devtools://devtools/remote/serve_rev/@06a2e…m/devtools/page/lQOtx1HAAC&remoteFrontend=true&dockSide=unlocked",
          id: "lQOtx1HuFkFfAQ3AAAAC",
          title: "chrome.debugger - Google Chrome",
          type: "page",
          url: "https://developer.chrome.com/extensions/debugger#type-TargetInfo",
          webSocketDebuggerUrl: "ws://devtoolsremote.com/devtools/page/lQOtx1HAAC"
        } */

          log('%c%s', 'font-weight: bold;', t.title)
          log('\t %c%s', 'color: gray; font-size: 90%;', t.url)
          log('\t Inspection URL: %c%s', 'color: blue;', t.devtoolsUrl)

          if (t.url === tabRef.url) {
            app.copyToClipboard(t.devtoolsUrl)
          }
        })
      })
  }

  connection.on('connect', app.onSocketConnect)
  connection.on('disconnect', app.onSocketDisconnect)

  app.copyToClipboard = function(text) {
    var input = document.createElement('input')
    document.body.appendChild(input)
    input.value = text
    input.focus()
    input.select()
    document.execCommand('copy')
    input.remove()

    log('copied')
    setTimeout(log, 600)
  }

  // chrome-side
  app.onBrowserAction = function(tab) {
    log('ooo')
    resetSockets(tab)
  }

  app.onDebuggerEvent = function(source, method, params) {
    log('debugger.event.recieved', source, method, params)
    socketRef.emit('data.event', {
      method: method,
      params: params,
    })
  }

  app.onDebuggerDetach = function(debuggee, reason) {
    log('debugger.detached', reason)
    connection.disconnect()

    log('clear')
    setTimeout(log, 500)
  }

  app.onSessionCreated = function(sessionId) {
    log('sessionId', sessionId)
    app.getURL(sessionId)
  }

  chrome.runtime.onMessage.addListener(app.onRuntimeMessage)
  chrome.debugger.onEvent.addListener(app.onDebuggerEvent)
  chrome.debugger.onDetach.addListener(app.onDebuggerDetach)
  chrome.runtime.onConnect.addListener(function(port) {
    log('whats this', port)
  })
  return true
}

let int = setInterval(async () => {
  console.log('do it yo')
  if (await run()) clearInterval(int)
}, 500)
