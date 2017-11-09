export default function watchify(rootNode) {
  let start = null
  let startState = null
  let dragFlag = false
  let animationTime = 0
  let currentAnimationModule = null
  let display = null

  function sumCoord(coord1, coord2) {
    if (coord2 == undefined) {
      debugger
    }
    if (coord1.length != coord2.length) return

    var coord = []
    for (var i = 0; i < coord1.length; i++) {
      coord.push(coord1[i] + coord2[i])
    }
    return coord
  }

  function subCoord(coord1, coord2) {
    if (coord1 == undefined || coord2 == undefined) debugger
    if (coord1.length != coord2.length) return

    var coord = []
    for (var i = 0; i < coord1.length; i++) {
      coord.push(coord1[i] - coord2[i])
    }
    return coord
  }

  function getDist(coord1, coord2) {
    var sub = subCoord(coord1, coord2)
    return Math.sqrt(sub[0] * sub[0] + sub[1] * sub[1])
  }

  // http://stackoverflow.com/a/2234986
  function isDescendant(parent, child) {
    if (parent == child) return true
    var node = child.parentNode
    while (node != null) {
      if (node == parent) {
        return true
      }
      node = node.parentNode
    }
    return false
  }

  function interpolation(p, w1, w2, v1, v2) {
    if (p >= w1) {
      return v1
    } else if (p <= w2) {
      return v2
    }

    var result = []
    if (typeof v1 == 'number') {
      v1 = [v1]
      v2 = [v2]
    }
    for (var i = 0; i < v1.length; i++) {
      var ratio = Math.abs(w1 - p) / Math.abs(w1 - w2)
      result.push(v2[i] * ratio + v1[i] * (1 - ratio))
    }

    if (v1.length == 1) return result[0]
    return result
  }

  function AppCircle(_name, _parentMap) {
    this.parentMap = _parentMap
    this.element = undefined
    this.appName = _name
    this.radius = 0.33
    this.coord = []
    this.color = this.getRandomColor()
  }

  AppCircle.prototype = {
    constructor: AppCircle,
    nearCoords: [[2, 0], [1, 1], [-1, 1], [-2, 0], [-1, -1], [1, -1]],
    getNearApps: function() {
      var nearAppList = []
      for (var i = 0; i < 6; i++) {
        var nearCoord = sumCoord(this.coord, this.nearCoords[i])
        var nearApp = this.parentMap.getApp(nearCoord)

        nearAppList.push(nearApp)
      }
      return nearAppList
    },
    getNearAppsWithDir: function(dir) {
      var nearAppsWithDir = []
      var first = dir - 1 < 0 ? 5 : dir - 1
      var last = dir + 1 >= 6 ? 0 : dir + 1

      var nearApps = this.getNearApps()

      nearAppsWithDir.push(nearApps[first])
      nearAppsWithDir.push(nearApps[dir])
      nearAppsWithDir.push(nearApps[last])

      return nearAppsWithDir
    },
    getPosition: function() {
      var x = this.coord[0] / 2
      var y = this.coord[1] * Math.sqrt(3) / 2
      return [x, y]
    },
    getTunedPosition: function() {
      var x = this.element.getAttribute('cx')
      var y = this.element.getAttribute('cy')
      return [x, y]
    },
    tunePosition: function(tuneValue) {
      var pos = this.getPosition()
      var x = pos[0] + tuneValue[0]
      var y = pos[1] + tuneValue[1]
      this.element.setAttribute('cx', x)
      this.element.setAttribute('cy', y)
    },
    getDistanceFrom: function(anotherCircle) {
      var sub = subCoord(this.coord, anotherCircle.coord)
      if (Math.abs(sub[0]) > Math.abs(sub[1])) {
        return (Math.abs(sub[0]) + Math.abs(sub[1])) / 2
      } else return Math.abs(sub[1])
    },
    setRadius: function(newRad) {
      // if (this.radius - newRad > 0.1) debugger;
      this.radius = newRad
      this.element.setAttribute('r', newRad)
    },
    // http://stackoverflow.com/a/1484514
    getRandomColor: function() {
      var letters = '0123456789ABCDEF'.split('')
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      // avoid too-dark color
      var count = 0
      for (var i = 1; i <= 3; i++) {
        if (color[i] < '4') count++
      }
      if (count == 3) return this.getRandomColor()
      return color
    },
    isSentinel: function() {
      if (this.appName == 'sentinel') return true
      else return false
    },
  }
  function Sentinel(_parentMap, _coord) {
    AppCircle.call(this, 'sentinel', _parentMap)
    this.coord = _coord
    this.color = 'black'
  }

  Sentinel.prototype = new AppCircle()
  Sentinel.prototype.constructor = Sentinel
  Sentinel.prototype.isSentinel = function() {
    return true
  }

  function Hexagon(_origin) {
    this.origin = _origin
    this.origin.parentMap = this
    this.origin.coord = [0, 0]
    this.apps = {
      '0,0': this.origin,
      '2,0': new Sentinel(this, [2, 0]),
      '1,1': new Sentinel(this, [1, 1]),
      '1,-1': new Sentinel(this, [1, -1]),
      '-1,1': new Sentinel(this, [-1, 1]),
      '-1,-1': new Sentinel(this, [-1, -1]),
      '-2,0': new Sentinel(this, [-2, 0]),
    }
  }

  Hexagon.prototype = {
    constructor: Hexagon,
    getApp: function(coord) {
      var result = this.apps[coord.toString()]
      return result
    },
    addApp: function(appName) {
      // debugger;
      var newApp = new AppCircle(appName, this)

      var parent = this.origin
      var dir = Math.floor(Math.random() * 6)
      var nearApps = parent.getNearAppsWithDir(dir)

      // 인접 앱이 풀방일 경우 재귀적으로 선택

      while (!this.listContainsSentinel(nearApps)) {
        var ridx = Math.floor(Math.random() * 3)
        var selected = nearApps[ridx]

        parent = selected

        dir = dir + (ridx - 1)
        dir = (dir + 6) % 6
        nearApps = parent.getNearAppsWithDir(dir)
      }

      // 풀방이지 않은 앱을 찾은 경우
      // newApp에 대한 정보 설정
      newApp.coord = function() {
        var allNearApps = parent.getNearAppsWithDir(dir)
        var idx = dir + this.indexOfSentinel(allNearApps) - 1
        idx = (idx + 6) % 6
        var diff = newApp.nearCoords[idx]
        return sumCoord(parent.coord, diff)
      }.bind(this)()

      // 주변 Sentinel 설정
      nearApps = newApp.getNearApps()
      for (var i = 0; i < nearApps.length; i++) {
        var nearApp = nearApps[i]
        if (nearApp == undefined) {
          var nearCoord = sumCoord(newApp.coord, newApp.nearCoords[i])
          var sentinel = new Sentinel(this, nearCoord)
          this.apps[nearCoord.toString()] = sentinel
        }
      }

      // Map에 앱 위치 등록
      this.apps[newApp.coord.toString()] = newApp
    },

    listContainsSentinel: function(list) {
      for (var i = 0; i < list.length; i++) {
        var app = list[i]
        if (app.isSentinel()) return true
      }
      return false
    },
    indexOfSentinel: function(list) {
      for (var i = 0; i < list.length; i++) {
        var app = list[i]
        if (app.isSentinel()) return i
      }
      return -1
    },
  }

  function Display(_element, _map) {
    this.width = 375
    this.height = 470
    this.element = _element
    this.map = _map
    if (_map) {
      this.currentCenter = _map.origin
      this.currentCenterCandidates = [this.currentCenter, this.currentCenter]
    }

    this.interactionEnabled = true
    this.dragEnabled = true
    this.zoomEnabled = true
    this.clickEnabled = true

    this.runningApp = null

    // scale : 좌표상의 1을 몇 픽셀로 그릴 것인가
    this.scale = 100
    this.maxScale = 100
    this.minScale = 60
    this.defaultRadius = 0.125
  }

  Display.prototype = {
    constructor: Display,

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Draw Functions
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    draw: function() {
      for (let app in this.map.apps) {
        var circle = this.map.apps[app]
        var element = this._drawCircle(circle)
        circle.element = element
      }
      this.setDisplayCenter(this.currentCenter.getPosition())
      this.refresh()
    },
    _drawCircle: function(circle) {
      var eCircle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      )
      var circlePos = circle.getPosition()
      eCircle.setAttribute('key', circle.appName)
      eCircle.setAttribute('cx', circlePos[0])
      eCircle.setAttribute('cy', circlePos[1])
      eCircle.setAttribute('r', circle.radius)
      eCircle.setAttribute('fill', circle.color)

      const eIcon = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'image'
      )
      eIcon.setAttribute('xlink:href', '/logos/hubspot.svg')
      eIcon.setAttribute('width', '40px')
      eIcon.setAttribute('height', '40px')
      eIcon.setAttribute('x', '0')
      eIcon.setAttribute('y', '0')

      eCircle.appendChild(eIcon)

      // eCircle.addEventListener("click", this.clickCircle.bind(this, circle));

      this.element.appendChild(eCircle)

      // var eText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      // eText.textContent = circle.coord.toString();
      // eText.setAttribute("x", circlePos[0]-0.3);
      // eText.setAttribute("y", circlePos[1]);
      // eText.setAttribute("font-size", 0.2);
      // eText.setAttribute("fill", "red");
      // this.element.appendChild(eText);
      return eCircle
    },

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Functions For DragModule
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    canMoveViewBoxTo: function(dx, dy) {
      if (this.interactionEnabled == false || this.dragEnabled == false)
        return false

      var nearApps = this.currentCenter.getNearApps()

      var idx = this.moveToCoordIdx(dx, dy)
      if (nearApps[idx] == undefined) return false
      if (nearApps[idx].isSentinel()) return false
      return true
    },

    moveToCoordIdx: function(dx, dy) {
      var overSqrt3 = 1 / Math.sqrt(3)
      var gradient = dy / dx
      if (dx == 0) {
        if (dy > 0) return 1
        else return 4
      }
      var idx = 0
      if (gradient <= -overSqrt3) idx = 5
      else if (gradient > overSqrt3) idx = 1
      else idx = 0

      if (dx < 0) idx = (idx + 3) % 6
      return idx
    },

    moveViewBox: function(dx, dy) {
      var viewBox = this._getViewBox()
      var newViewBox = [
        viewBox[0] + dx / this.scale,
        viewBox[1] + dy / this.scale,
        viewBox[2],
        viewBox[3],
      ]
      this._setViewBox(newViewBox)
    },

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Functions For ZoomModule
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    getScale: function() {
      return this.scale
    },
    setScale: function(newScale) {
      if (this.interactionEnabled == false || this.zoomEnabled == false) return
      this.scale = newScale
      var centerPos = this.getDisplayCenter()
      var newViewBox = [
        centerPos[0] - this.width / this.scale / 2,
        centerPos[1] - this.height / this.scale / 2,
        this.width / this.scale,
        this.height / this.scale,
      ]
      this._setViewBox(newViewBox)
      this.refresh()
    },

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Functions For ClickModule
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    clicked: function(pos) {
      if (this.interactionEnabled == false || this.clickEnabled == false) return
      if (this.runningApp != null) {
        this.closeApp()
        return
      }
      var viewBox = this._getViewBox()
      var clickedPos = [
        viewBox[0] + pos[0] / this.scale,
        viewBox[1] + pos[1] / this.scale,
      ]
      var clickedCoord = this.getCoordFromPos(clickedPos)
      var clickedCircle = this.getCircleAtCoord(clickedCoord)

      if (clickedCircle == this.currentCenter) {
        if (this.runningApp == null) this.openApp(clickedCircle)
        return
      }
      if (clickedCircle.isSentinel() || clickedCircle == undefined) {
        var nearCircle = this.getNearCircle(clickedPos)
        if (nearCircle == this.currentCenter) {
          currentAnimationModule.reset()
          currentAnimationModule = null
          return
        }
        clickedCircle = nearCircle
      }

      this.snapCenterTo(clickedCircle)
    },

    getNearCircle: function(pos) {
      var centerPos = this.currentCenter.getPosition()
      var diff = subCoord(centerPos, pos)

      for (var r = 0; r < 1; r += 0.05) {
        var guessPos = sumCoord(pos, [diff[0] * r, diff[1] * r])
        var guessCoord = this.getCoordFromPos(guessPos)
        var guessCircle = this.getCircleAtCoord(guessCoord)
        if (guessCircle.isSentinel() || guessCircle == undefined) continue
        else return guessCircle
      }
      return this.currentCenter
    },

    snapCenter: function() {
      this.snapCenterTo(this.currentCenter)
    },

    snapCenterTo: function(circle) {
      if (circle.isSentinel()) return
      this.interactionEnabled = false
      window.requestAnimationFrame(this.snapAnimation.bind(this, circle))
    },

    snapAnimation: function(circle, timestamp) {
      let progress
      // Start State
      if (startState === null) startState = this._getViewBox()
      // Goals
      var circlePos = circle.getPosition()
      var x = circlePos[0] - this.width / this.scale / 2
      var y = circlePos[1] - this.height / this.scale / 2

      if (start === null) start = timestamp
      if (animationTime == 0) {
        var centerPos = this.currentCenter.getPosition()
        animationTime = getDist(centerPos, circlePos) * 400
        if (animationTime == 0) animationTime = 400
      }
      progress = (timestamp - start) / animationTime

      // 변화될 상태 계산
      var newx = startState[0] + (x - startState[0]) * progress
      var newy = startState[1] + (y - startState[1]) * progress

      this._setViewBox([newx, newy, startState[2], startState[3]])
      this.refresh()

      if (progress < 1) {
        window.requestAnimationFrame(this.snapAnimation.bind(this, circle))
      } else {
        start = null
        startState = null
        this.interactionEnabled = true
        animationTime = 0
        // 클릭 이벤트리스너 복구
        if (currentAnimationModule != null) currentAnimationModule.reset()
        // circle.element.addEventListener("click", this.clickCircle.bind(this, circle));
      }
    },

    openApp: function(circle) {
      this.interactionEnabled = false

      var eRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      var circleCenter = circle.getTunedPosition()
      var width = 0.6 * 2 * circle.radius
      var height = 0.75 * 2 * circle.radius

      eRect.setAttribute('x', circleCenter[0] - width / 2)
      eRect.setAttribute('y', circleCenter[1] - height / 2)
      eRect.setAttribute('width', width)
      eRect.setAttribute('height', height)
      eRect.setAttribute('fill', circle.getRandomColor())
      eRect.setAttribute('opacity', 0)

      this.element.appendChild(eRect)

      window.requestAnimationFrame(this.openAppAnimation.bind(this, eRect))
    },

    openAppAnimation: function(appRect, timestamp) {
      var progress
      if (start === null) start = timestamp
      progress = (timestamp - start) / 2000

      // Start State
      if (startState === null) startState = this._getViewBox()
      // Goals
      var x = appRect.getAttribute('x')
      var y = appRect.getAttribute('y')
      var w = appRect.getAttribute('width')
      var h = appRect.getAttribute('height')

      // 변화될 상태 계산
      var newx = startState[0] + (x - startState[0]) * progress
      var newy = startState[1] + (y - startState[1]) * progress
      var neww = startState[2] + (w - startState[2]) * progress
      var newh = startState[3] + (h - startState[3]) * progress

      this._setViewBox([newx, newy, neww, newh])
      appRect.setAttribute('opacity', progress)

      if (progress < 1) {
        window.requestAnimationFrame(this.openAppAnimation.bind(this, appRect))
      } else {
        start = null
        startState = null
        this.interactionEnabled = true
        this.dragEnabled = false
        this.zoomEnabled = false
        if (currentAnimationModule != null) currentAnimationModule.reset()
        this.runningApp = appRect
      }
    },

    closeApp: function() {
      this.interactionEnabled = false
      this.refresh()
      window.requestAnimationFrame(
        this.closeAppAnimation.bind(this, this.runningApp)
      )
      this.setCandidatesForCenter(this.getCandidatesForCenter())
    },

    closeAppAnimation: function(appRect, timestamp) {
      var progress
      if (start === null) start = timestamp
      progress = (timestamp - start) / 2000

      // Start State
      if (startState === null) startState = this._getViewBox()
      // Goals
      var centerPos = this.currentCenter.getPosition()
      var goal = [
        centerPos[0] - this.width / this.scale / 2,
        centerPos[1] - this.height / this.scale / 2,
        this.width / this.scale,
        this.height / this.scale,
      ]

      // 변화될 상태 계산
      var newx = startState[0] + (goal[0] - startState[0]) * progress
      var newy = startState[1] + (goal[1] - startState[1]) * progress
      var neww = startState[2] + (goal[2] - startState[2]) * progress
      var newh = startState[3] + (goal[3] - startState[3]) * progress

      this._setViewBox([newx, newy, neww, newh])
      appRect.setAttribute('opacity', 1 - progress)

      if (progress < 1) {
        window.requestAnimationFrame(this.closeAppAnimation.bind(this, appRect))
      } else {
        start = null
        startState = null
        this.element.removeChild(appRect)
        this.interactionEnabled = true
        this.zoomEnabled = true
        this.dragEnabled = true
        this.runningApp = null
        if (currentAnimationModule != null) currentAnimationModule.reset()
      }
    },

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Refresh Functions
    // Refresh about ONLY circles radius / position
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    refresh: function() {
      this._refreshCenter()
      this._refreshCircles()
    },

    _refreshCenter: function() {
      var circleAtCenter = this.getCircleAtCenterOfDisplay()
      if (!circleAtCenter) debugger
      this.currentCenter = circleAtCenter
      var candidatesForCenter = this.getCandidatesForCenter()
      this.setCandidatesForCenter(candidatesForCenter)
    },

    _refreshCircles: function() {
      this._resizeAllCircles()
      this._tunePositions()
    },

    _resizeAllCircles: function() {
      for (const coord in this.map.apps) {
        var circle = this.getCircleAtCoord(coord)
        var zoomInRadius = this.triangleInterpolation(
          circle,
          this.currentCenter,
          this.currentCenterCandidates[0],
          this.currentCenterCandidates[1],
          this._getRadius.bind(this)
        )
        var zoomOutRadius = this.triangleInterpolation(
          circle,
          this.currentCenter,
          this.currentCenterCandidates[0],
          this.currentCenterCandidates[1],
          this._getZoomOutRadius.bind(this)
        )
        var newRadius = interpolation(
          this.scale,
          this.maxScale,
          this.minScale,
          zoomInRadius,
          zoomOutRadius
        )
        if (newRadius < 0) debugger
        circle.setRadius(newRadius)
      }
    },

    _getRadius: function(circle, psudoCenter) {
      var radiusData = {
        '0,0': 0.46,
        '0,2': 0.37,
        '1,1': 0.42,
        '1,3': 0.125,
        '2,0': 0.42,
        '2,2': 0.32,
        '3,1': 0.32,
        '3,3': 0.125,
        '4,0': 0.125,
        '4,2': 0.125,
        '5,1': 0.2,
      }

      var coordDiff = subCoord(psudoCenter.coord, circle.coord)
      var key = Math.abs(coordDiff[0]) + ',' + Math.abs(coordDiff[1])
      var radius = radiusData[key] || this.defaultRadius

      return radius
    },

    _getZoomOutRadius: function(circle, psudoCenter) {
      var circlePos = circle.getPosition()
      var dist = circle.getDistanceFrom(psudoCenter)

      return Math.max(0.45 - 0.07 * dist, this.defaultRadius)
    },

    _tunePositions: function() {
      for (const coord in this.map.apps) {
        var circle = this.getCircleAtCoord(coord)
        var circlePos = circle.getPosition()
        var zoomInTuneDistance = this.triangleInterpolation(
          circle,
          this.currentCenter,
          this.currentCenterCandidates[0],
          this.currentCenterCandidates[1],
          this._getTuneDistance.bind(this)
        )
        var zoomOutTuneDistance = [0, 0]
        var tuneDistance = interpolation(
          this.scale,
          this.maxScale,
          this.minScale,
          zoomInTuneDistance,
          zoomOutTuneDistance
        )
        circle.tunePosition(tuneDistance)
      }
    },

    _getTuneDistance: function(circle, psudoCenter) {
      var tuneData = {
        '6,0': [-0.3, 0],
        '6,2': [-0.4, -0.14],
        '5,1': [-0.3, 0],
        '5,3': [-0.4, -0.14],
        '4,0': [-0.3, 0],
        '4,2': [-0.4, -0.14],
        '4,4': [-0.05, -0.1],
        '3,1': [-0.14, -0.05],
        '3,3': [-0.2, -0.1],
        '2,2': [-0.05, -0.1],
        '2,4': [-0.05, -0.1],
        '1,3': [0.03, -0.4],
        '0,4': [0.03, -0.4],
      }

      var sub = subCoord(circle.coord, psudoCenter.coord)
      var key = Math.abs(sub[0]) + ',' + Math.abs(sub[1])

      var tuneValue = tuneData[key] || [0, 0]
      tuneValue = tuneValue.slice(0)
      if (sub[0] < 0) tuneValue[0] = -tuneValue[0]
      if (sub[1] < 0) tuneValue[1] = -tuneValue[1]

      return tuneValue
    },

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // ViewBox Functions
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    getDisplayCenter: function() {
      var viewBox = this._getViewBox()
      var width = viewBox[2]
      var height = viewBox[3]
      var center = [viewBox[0] + width / 2, viewBox[1] + height / 2]

      return center
    },
    setDisplayCenter: function(pos) {
      var viewBox = this._getViewBox()
      var width = viewBox[2]
      var height = viewBox[3]
      var newViewBox = [pos[0] - width / 2, pos[1] - height / 2, width, height]
      this._setViewBox(newViewBox)
    },
    _getViewBox: function() {
      var ltwh = this.element.getAttribute('viewBox').split(' ')
      return ltwh.map(function(str) {
        return parseFloat(str)
      })
    },
    _setViewBox: function(newViewBox) {
      // var curViewBox = this._getViewBox();
      // var move = [newViewBox[0] - curViewBox[0], newViewBox[1] - curViewBox[1]];
      // var idx = this.moveToCoordIdx(move[0], move[1]);
      // this.movingDir = idx;
      this.element.setAttribute('viewBox', newViewBox.join(' '))
    },

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // get Center
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    getCircleAtCenterOfDisplay: function() {
      var centerPos = this.getDisplayCenter()
      var coord = this.getCoordFromPos(centerPos)
      var centerCircle = this.getCircleAtCoord(coord)
      if (!centerCircle) debugger
      return centerCircle
    },

    getCoordFromPos: function(pos) {
      var x = Math.round(pos[0] * 2)
      var y = Math.round(pos[1] * 2 / Math.sqrt(3))

      if ((Math.abs(x) + Math.abs(y)) % 2 != 0) {
        if (Math.abs(x + 1 - pos[0]) < Math.abs(x - 1 + pos[0])) x = x + 1
        else x = x - 1
      }
      return [x, y]
    },
    getCircleAtCoord: function(coord) {
      var result = ''
      if (typeof coord == 'string') result = this.map.apps[coord]
      else result = this.map.apps[coord.toString()]

      return result
    },

    // Candidates Functions
    getCandidatesForCenter: function() {
      var centerPos = this.getDisplayCenter()
      var curCenterCirclePos = this.currentCenter.getPosition()
      var sub = subCoord(centerPos, curCenterCirclePos)
      var dir = this.moveToCoordIdx(sub[0], sub[1])
      var candidates = this.currentCenter.getNearAppsWithDir(dir)

      candidates.sort(function(c1, c2) {
        var c1Pos = c1.getPosition()
        var c2Pos = c2.getPosition()
        return getDist(centerPos, c1Pos) - getDist(centerPos, c2Pos)
      })

      return candidates.slice(0, 2)
    },
    setCandidatesForCenter: function(newCenterCandidates) {
      this.currentCenterCandidates = newCenterCandidates
    },

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // Utility Functions
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    triangleInterpolation: function(c, c1, c2, c3, func) {
      var p = this.getDisplayCenter()
      var x = c1.getPosition()
      var y = c2.getPosition()
      var z = c3.getPosition()
      var vx = func(c, c1)
      var vy = func(c, c2)
      var vz = func(c, c3)

      if (typeof vx == 'number') {
        vx = [vx]
        vy = [vy]
        vz = [vz]
      }

      var w = []
      for (var i = 0; i < vx.length; i++) {
        var det =
          x[0] * y[1] -
          y[0] * x[1] +
          y[0] * z[1] -
          z[0] * y[1] +
          z[0] * x[1] -
          x[0] * z[1]
        if (det == 0) {
          if (vx.length == 1) return vx[0]
          else return vx
        }
        var A =
          ((y[1] - z[1]) * vx[i] +
            (z[1] - x[1]) * vy[i] +
            (x[1] - y[1]) * vz[i]) /
          det
        var B =
          ((z[0] - y[0]) * vx[i] +
            (x[0] - z[0]) * vy[i] +
            (y[0] - x[0]) * vz[i]) /
          det
        var C =
          ((y[0] * z[1] - z[0] * y[1]) * vx[i] +
            (z[0] * x[1] - x[0] * z[1]) * vy[i] +
            (x[0] * y[1] - y[0] * x[1]) * vz[i]) /
          det
        w.push(A * p[0] + B * p[1] + C)
      }

      if (w.length == 1) return w[0]
      return w
    },
  }

  function ClickModule(_display) {
    this.display = _display
    this.displayElement = _display.element

    this.clickFunctionCaches = {
      click: this.click.bind(this),
    }
  }

  ClickModule.prototype = {
    constructor: ClickModule,
    setClickable: function() {
      this.displayElement.addEventListener(
        'click',
        this.clickFunctionCaches.click
      )
    },
    click: function(e) {
      if (dragFlag == true) return
      this.displayElement.removeEventListener(
        'click',
        this.clickFunctionCaches.click
      )
      if (currentAnimationModule == null) currentAnimationModule = this
      var clickedPos = [e.offsetX, e.offsetY]
      this.display.clicked(clickedPos)
    },
    reset: function() {
      this.setClickable()
      currentAnimationModule = null
    },
  }

  function DragModule(_display) {
    this.lastMousePos = []
    this.display = _display
    this.displayElement = _display.element

    this.dragFunctionCaches = {
      dragging: this.dragging.bind(this),
      noDragging: this.noDragging.bind(this),
      dragStart: this.dragStart.bind(this),
      dragEnd: this.dragEnd.bind(this),
    }
  }

  DragModule.prototype = {
    constructor: DragModule,
    getMousePos: function(e) {
      var displayRect = this.displayElement.getBoundingClientRect()
      var displayLeft = displayRect.left
      var displayTop = displayRect.top
      return [e.clientX - displayLeft, e.clientY - displayTop]
    },
    dragStart: function(e) {
      dragFlag = false
      this.displayElement.addEventListener(
        'mousemove',
        this.dragFunctionCaches.dragging
      )
      this.displayElement.addEventListener(
        'mouseout',
        this.dragFunctionCaches.noDragging
      )
      this.lastMousePos = this.getMousePos(e)
    },
    dragging: function(e) {
      var mousePos = this.getMousePos(e)
      var mouseDiff = subCoord(this.lastMousePos, mousePos)
      if (
        dragFlag == false &&
        Math.max(Math.abs(mouseDiff[0]), Math.abs(mouseDiff[1])) > 2
      )
        dragFlag = true
      this.lastMousePos = mousePos

      if (this.display.canMoveViewBoxTo(mouseDiff[0], mouseDiff[1])) {
        this.display.moveViewBox(mouseDiff[0], mouseDiff[1])
        this.display.refresh()
      }
    },
    dragEnd: function(e) {
      this.displayElement.removeEventListener(
        'mousemove',
        this.dragFunctionCaches.dragging
      )
      this.displayElement.removeEventListener(
        'mouseout',
        this.dragFunctionCaches.noDragging
      )
      if (
        this.display.interactionEnabled == true &&
        this.display.dragEnabled == true &&
        dragFlag == true
      ) {
        this.display.snapCenter()
      }
    },
    noDragging: function(e) {
      if (isDescendant(this.displayElement, e.relatedTarget)) return
      else
        this.displayElement.removeEventListener(
          'mousemove',
          this.dragFunctionCaches.dragging
        )
    },
    setDraggable: function() {
      this.displayElement.addEventListener(
        'mousedown',
        this.dragFunctionCaches.dragStart
      )
      this.displayElement.addEventListener(
        'mouseup',
        this.dragFunctionCaches.dragEnd
      )
    },
    resetDraggable: function() {
      this.displayElement.removeEventListener(
        'mousedown',
        this.dragFunctionCaches.dragStart
      )
      this.displayElement.removeEventListener(
        'mouseup',
        this.dragFunctionCaches.dragEnd
      )
    },
  }

  var ZoomModule = function(_display) {
    this.display = _display
    this.scale = 100
    this.wheelFunctionCaches = {
      zoom: this.zoom.bind(this),
    }
  }

  ZoomModule.prototype = {
    constructor: ZoomModule,
    zoom: function(e) {
      if (!this.display.zoomEnabled) return
      var delta = e.wheelDelta / 120
      if (
        (this.disableZoomOut && delta < 0) ||
        (this.disableZoomIn && delta > 0)
      )
        return
      this.scale += delta

      if (this.scale >= this.display.maxScale) {
        this.scale = this.display.maxScale
      } else if (this.scale < this.display.minScale) {
        this.scale = this.display.minScale
      }
      console.log(this.scale)
      this.display.setScale(this.scale)
    },
    setZoomable: function() {
      this.display.element.addEventListener(
        'mousewheel',
        this.wheelFunctionCaches.zoom,
        false
      )
    },
  }

  const hex = new Hexagon(new AppCircle('origin'))
  for (var i = 0; i < 80; i++) {
    hex.addApp('app' + i)
  }

  display = new Display(rootNode, hex)
  display.draw()

  const click = new ClickModule(display)
  click.setClickable()

  const drag = new DragModule(display)
  drag.setDraggable()

  // const zoom = new ZoomModule(display)
  // zoom.setZoomable()
}
