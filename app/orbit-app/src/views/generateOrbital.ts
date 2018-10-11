export function generateOrbital({ type, canvas, canvasWidth, canvasHeight, w, h, zoom }) {
  var ctx = canvas.getContext('2d')

  // -------------------------- utils -------------------------- //

  var TAU = Math.PI * 2

  function extend(a, b) {
    for (var prop in b) {
      a[prop] = b[prop]
    }
    return a
  }

  function lerp(a, b, t) {
    return (b - a) * t + a
  }

  function modulo(num, div) {
    return ((num % div) + div) % div
  }

  // -------------------------- Vector3 -------------------------- //

  function Vector3(position) {
    this.set(position)
  }

  Vector3.prototype.set = function(pos) {
    pos = Vector3.sanitize(pos)
    this.x = pos.x
    this.y = pos.y
    this.z = pos.z
    return this
  }

  Vector3.prototype.rotate = function(rotation) {
    if (!rotation) {
      return
    }
    rotation = Vector3.sanitize(rotation)
    this.rotateZ(rotation.z)
    this.rotateY(rotation.y)
    this.rotateX(rotation.x)
    return this
  }

  Vector3.prototype.rotateZ = function(angle) {
    rotateProperty(this, angle, 'x', 'y')
  }

  Vector3.prototype.rotateX = function(angle) {
    rotateProperty(this, angle, 'y', 'z')
  }

  Vector3.prototype.rotateY = function(angle) {
    rotateProperty(this, angle, 'x', 'z')
  }

  function rotateProperty(vec, angle, propA, propB) {
    if (angle % TAU === 0) {
      return
    }
    var cos = Math.cos(angle)
    var sin = Math.sin(angle)
    var a = vec[propA]
    var b = vec[propB]
    vec[propA] = a * cos - b * sin
    vec[propB] = b * cos + a * sin
  }

  Vector3.prototype.add = function(vec) {
    if (!vec) {
      return
    }
    vec = Vector3.sanitize(vec)
    this.x += vec.x
    this.y += vec.y
    this.z += vec.z
    return this
  }

  Vector3.prototype.subtract = function(vec) {
    if (!vec) {
      return
    }
    vec = Vector3.sanitize(vec)
    this.x -= vec.x
    this.y -= vec.y
    this.z -= vec.z
    return this
  }

  Vector3.prototype.multiply = function(value) {
    if (value === undefined) {
      return
    }
    // multiple all values by same number
    if (typeof value == 'number') {
      this.x *= value
      this.y *= value
      this.z *= value
      return
    }
    // multiply object
    var vec = Vector3.sanitize(value, 1)
    this.x *= vec.x
    this.y *= vec.y
    this.z *= vec.z
    return this
  }

  Vector3.prototype.transform = function(translation, rotation, scale) {
    this.multiply(scale)
    this.rotate(rotation)
    this.add(translation)
  }

  Vector3.prototype.lerp = function(vec, t) {
    vec = Vector3.sanitize(vec)
    this.x = lerp(this.x, vec.x, t)
    this.y = lerp(this.y, vec.y, t)
    this.z = lerp(this.z, vec.z, t)
    return this
  }

  Vector3.prototype.magnitude = function() {
    var sum = this.x * this.x + this.y * this.y + this.z * this.z
    // PERF: check if sum ~= 1 and skip sqrt
    if (Math.abs(sum - 1) < 0.00000001) {
      return 1
    }
    return Math.sqrt(sum)
  }

  // ----- utils ----- //

  // add missing properties
  Vector3.sanitize = function(vec, value) {
    vec = vec || {}
    value = value || 0
    vec.x = vec.x === undefined ? value : vec.x
    vec.y = vec.y === undefined ? value : vec.y
    vec.z = vec.z === undefined ? value : vec.z
    return vec
  }

  // -------------------------- Anchor -------------------------- //

  function Anchor(options) {
    this.create(options)
  }

  Anchor.prototype.create = function(options) {
    // set defaults & options
    extend(this, this.constructor.defaults)
    options = options || {}
    this.setOptions(this, options)

    // transform
    this.translate = new Vector3(options.translate)
    this.rotate = new Vector3(options.rotate)
    // scale
    if (typeof options.scale == 'number') {
      this.scale = Vector3.sanitize({}, options.scale)
    } else {
      this.scale = Vector3.sanitize(options.scale, 1)
    }

    // origin
    this.origin = new Vector3()
    this.renderOrigin = new Vector3()
    // children
    this.children = []
    if (this.addTo) {
      this.addTo.addChild(this)
    }
  }

  Anchor.defaults = {}

  Anchor.optionKeys = Object.keys(Anchor.defaults).concat(['rotate', 'translate', 'scale', 'addTo'])

  Anchor.prototype.setOptions = function(item, options) {
    var optionKeys = this.constructor.optionKeys

    for (var key in options) {
      if (optionKeys.includes(key)) {
        item[key] = options[key]
      }
    }
  }

  Anchor.prototype.addChild = function(shape) {
    this.children.push(shape)
  }

  // ----- update ----- //

  Anchor.prototype.update = function() {
    // update self
    this.reset()
    // update children
    this.children.forEach(function(child) {
      child.update()
    })
    this.transform(this.translate, this.rotate, this.scale)
  }

  Anchor.prototype.reset = function() {
    this.renderOrigin.set(this.origin)
  }

  Anchor.prototype.transform = function(translation, rotation, scale) {
    this.renderOrigin.transform(translation, rotation, scale)
    // transform children
    this.children.forEach(function(child) {
      child.transform(translation, rotation, scale)
    })
  }

  Anchor.prototype.updateGraph = function() {
    this.update()
    this.checkFlatGraph()
    this.flatGraph.forEach(function(item) {
      item.updateSortValue()
    })
    // z-sort
    this.flatGraph.sort(sortBySortValue)
  }

  function sortBySortValue(a, b) {
    return b.sortValue - a.sortValue
  }

  Anchor.prototype.checkFlatGraph = function() {
    if (!this.flatGraph) {
      this.updateFlatGraph()
    }
  }

  Anchor.prototype.updateFlatGraph = function() {
    this.flatGraph = this.getFlatGraph()
  }

  // return Array of self & all child graph items
  Anchor.prototype.getFlatGraph = function() {
    var flatGraph = [this]
    this.children.forEach(function(child) {
      var childFlatGraph = child.getFlatGraph()
      flatGraph = flatGraph.concat(childFlatGraph)
    })
    return flatGraph
  }

  Anchor.prototype.updateSortValue = function() {
    this.sortValue = this.renderOrigin.z
  }

  // ----- render ----- //

  Anchor.prototype.render = function() {}

  Anchor.prototype.renderGraph = function(ctx) {
    if (!ctx) {
      throw new Error(
        'ctx is ' + ctx + '. ' + 'Canvas context required for render. Check .renderGraph( ctx ).',
      )
    }
    this.checkFlatGraph()
    this.flatGraph.forEach(function(item) {
      item.render(ctx)
    })
  }

  // ----- misc ----- //

  Anchor.prototype.copy = function(options) {
    // copy options
    var itemOptions = {}
    var optionKeys = this.constructor.optionKeys
    optionKeys.forEach(function(key) {
      itemOptions[key] = this[key]
    }, this)
    // add set options
    this.setOptions(itemOptions, options)
    var ItemClass = this.constructor
    return new ItemClass(itemOptions)
  }

  Anchor.prototype.copyGraph = function(options) {
    var clone = this.copy(options)
    this.children.forEach(function(child) {
      child.copyGraph({
        addTo: clone,
      })
    })
    return clone
  }

  Anchor.prototype.normalizeRotate = function() {
    this.rotate.x = modulo(this.rotate.x, TAU)
    this.rotate.y = modulo(this.rotate.y, TAU)
    this.rotate.z = modulo(this.rotate.z, TAU)
  }

  // ----- subclass ----- //

  function getSubclass(Super) {
    return function(defaults) {
      // create constructor
      function Item(options) {
        this.create(options)
      }

      Item.prototype = Object.create(Super.prototype)
      Item.prototype.constructor = Item

      Item.defaults = extend({}, Super.defaults)
      extend(Item.defaults, defaults)
      // create optionKeys
      Item.optionKeys = Super.optionKeys.slice(0)
      // add defaults keys to optionKeys, dedupe
      Object.keys(Item.defaults).forEach(function(key) {
        if (!Item.optionKeys.includes(key)) {
          Item.optionKeys.push(key)
        }
      })

      Item.subclass = getSubclass(Item)

      return Item
    }
  }

  Anchor.subclass = getSubclass(Anchor)

  // -------------------------- PathAction -------------------------- //

  function PathAction(method, points, previousPoint) {
    this.method = method
    this.points = points.map(mapVectorPoint)
    this.renderPoints = points.map(mapVectorPoint)
    this.previousPoint = previousPoint
    this.endRenderPoint = this.renderPoints[this.renderPoints.length - 1]
    // arc actions come with previous point & corner point
    // but require bezier control points
    if (method == 'arc') {
      this.controlPoints = [new Vector3(), new Vector3()]
    }
  }

  function mapVectorPoint(point) {
    return new Vector3(point)
  }

  PathAction.prototype.reset = function() {
    // reset renderPoints back to orignal points position
    var points = this.points
    this.renderPoints.forEach(function(renderPoint, i) {
      var point = points[i]
      renderPoint.set(point)
    })
  }

  PathAction.prototype.transform = function(translation, rotation, scale) {
    this.renderPoints.forEach(function(renderPoint) {
      renderPoint.transform(translation, rotation, scale)
    })
  }

  PathAction.prototype.render = function(ctx) {
    this[this.method](ctx)
  }

  PathAction.prototype.move = function(ctx) {
    var point = this.renderPoints[0]
    ctx.moveTo(point.x, point.y)
  }

  PathAction.prototype.line = function(ctx) {
    var point = this.renderPoints[0]
    ctx.lineTo(point.x, point.y)
  }

  PathAction.prototype.bezier = function(ctx) {
    var cp0 = this.renderPoints[0]
    var cp1 = this.renderPoints[1]
    var end = this.renderPoints[2]
    ctx.bezierCurveTo(cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y)
  }

  PathAction.prototype.arc = function(ctx) {
    var prev = this.previousPoint
    var corner = this.renderPoints[0]
    var end = this.renderPoints[1]
    var cp0 = this.controlPoints[0]
    var cp1 = this.controlPoints[1]
    cp0.set(prev).lerp(corner, 9 / 16)
    cp1.set(end).lerp(corner, 9 / 16)
    ctx.bezierCurveTo(cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y)
  }

  /* globals Shape: true */

  // -------------------------- Shape -------------------------- //

  var Shape = Anchor.subclass({
    stroke: true,
    fill: false,
    color: '#333',
    lineWidth: 1,
    closed: true,
    rendering: true,
    path: [{}],
    front: { z: -1 },
    backfaceVisible: true,
  })

  Shape.prototype.create = function(options) {
    Anchor.prototype.create.call(this, options)
    this.updatePath() // hook for Rect, Ellipse, & other subclasses
    this.updatePathActions()

    // front
    this.front = new Vector3(options.front || this.front)
    this.renderFront = new Vector3(this.front)
    this.renderNormal = new Vector3()
  }

  var actionNames = ['move', 'line', 'bezier', 'arc']

  // place holder for Ellipse, Rect, etc.
  Shape.prototype.updatePath = function() {}

  // parse path into PathActions
  Shape.prototype.updatePathActions = function() {
    var previousPoint
    this.pathActions = this.path.map(function(pathPart, i) {
      // pathPart can be just vector coordinates -> { x, y, z }
      // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
      var keys = Object.keys(pathPart)
      var method = keys[0]
      var points = pathPart[method]
      var isInstruction = keys.length === 1 && actionNames.includes(method) && Array.isArray(points)

      if (!isInstruction) {
        method = 'line'
        points = [pathPart]
      }

      // first action is always move
      method = i === 0 ? 'move' : method
      // arcs require previous last point
      var pathAction = new PathAction(method, points, previousPoint)
      // update previousLastPoint
      previousPoint = pathAction.endRenderPoint
      return pathAction
    })
  }

  // ----- update ----- //

  Shape.prototype.reset = function() {
    this.renderOrigin.set(this.origin)
    this.renderFront.set(this.front)
    // reset pathAction render points
    this.pathActions.forEach(function(pathAction) {
      pathAction.reset()
    })
  }

  Shape.prototype.transform = function(translation, rotation, scale) {
    // calculate render points backface visibility & cone/hemisphere shapes
    this.renderOrigin.transform(translation, rotation, scale)
    this.renderFront.transform(translation, rotation, scale)
    this.renderNormal.set(this.renderOrigin).subtract(this.renderFront)
    // transform points
    this.pathActions.forEach(function(pathAction) {
      pathAction.transform(translation, rotation, scale)
    })
    // transform children
    this.children.forEach(function(child) {
      child.transform(translation, rotation, scale)
    })
  }

  Shape.prototype.updateSortValue = function() {
    var sortValueTotal = 0
    this.pathActions.forEach(function(pathAction) {
      sortValueTotal += pathAction.endRenderPoint.z
    })
    // average sort value of all points
    // def not geometrically correct, but works for me
    this.sortValue = sortValueTotal / this.pathActions.length
  }

  // ----- render ----- //

  Shape.prototype.render = function(ctx) {
    var length = this.pathActions.length
    if (!this.rendering || !length) {
      return
    }
    // do not render if hiding backface
    var isFacingBack = this.renderNormal.z < 0
    if (!this.backfaceVisible && isFacingBack) {
      return
    }
    // render dot or path
    var isDot = length == 1
    if (isDot) {
      this.renderDot(ctx)
    } else {
      this.renderPath(ctx)
    }
  }

  // Safari does not render lines with no size, have to render circle instead
  Shape.prototype.renderDot = function(ctx) {
    ctx.fillStyle = this.color
    var point = this.pathActions[0].endRenderPoint
    ctx.beginPath()
    var radius = this.lineWidth / 2
    ctx.arc(point.x, point.y, radius, 0, TAU)
    ctx.fill()
  }

  Shape.prototype.renderPath = function(ctx) {
    // set render properties
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.lineWidth

    // render points
    ctx.beginPath()
    this.pathActions.forEach(function(pathAction) {
      pathAction.render(ctx)
    })
    var isTwoPoints = this.pathActions.length == 2 && this.pathActions[1].method == 'line'
    if (!isTwoPoints && this.closed) {
      ctx.closePath()
    }
    if (this.stroke) {
      ctx.stroke()
    }
    if (this.fill) {
      ctx.fill()
    }
  }

  /* globals Ellipse: true */

  // -------------------------- Ellipse -------------------------- //

  var Ellipse = Shape.subclass({
    width: 1,
    height: 1,
    closed: false,
  })

  Ellipse.prototype.updatePath = function() {
    var x = this.width / 2
    var y = this.height / 2
    this.path = [
      { x: 0, y: -y },
      {
        arc: [
          // top right
          { x: x, y: -y },
          { x: x, y: 0 },
        ],
      },
      {
        arc: [
          // bottom right
          { x: x, y: y },
          { x: 0, y: y },
        ],
      },
      {
        arc: [
          // bottom left
          { x: -x, y: y },
          { x: -x, y: 0 },
        ],
      },
      {
        arc: [
          // bottom left
          { x: -x, y: -y },
          { x: 0, y: -y },
        ],
      },
    ]
  }

  /* globals Rect: true */

  // -------------------------- Rect -------------------------- //

  var Rect = Shape.subclass({
    width: 1,
    height: 1,
  })

  Rect.prototype.updatePath = function() {
    var x = this.width / 2
    var y = this.height / 2
    this.path = [{ x: -x, y: -y }, { x: x, y: -y }, { x: x, y: y }, { x: -x, y: y }]
  }

  /* globals Polygon: true */

  // -------------------------- Polygon -------------------------- //

  var Polygon = Shape.subclass({
    sides: 3,
    radius: 0.5,
  })

  Polygon.prototype.updatePath = function() {
    this.path = []
    for (var i = 0; i < this.sides; i++) {
      var theta = (i / this.sides) * TAU - TAU / 4
      var x = Math.cos(theta) * this.radius
      var y = Math.sin(theta) * this.radius
      this.path.push({ x: x, y: y })
    }
  }

  /* globals Group: true */

  // -------------------------- Group -------------------------- //

  var Group = Anchor.subclass({
    updateSort: false,
    rendering: true,
  })

  // ----- update ----- //

  Group.prototype.updateSortValue = function() {
    var sortValueTotal = 0
    this.checkFlatGraph()
    this.flatGraph.forEach(function(item) {
      item.updateSortValue()
      sortValueTotal += item.sortValue
    })
    // average sort value of all points
    // def not geometrically correct, but works for me
    this.sortValue = sortValueTotal / this.flatGraph.length

    if (this.updateSort) {
      this.flatGraph.sort(function(a, b) {
        return b.sortValue - a.sortValue
      })
    }
  }

  // ----- render ----- //

  Group.prototype.render = function(ctx) {
    if (!this.rendering) {
      return
    }

    this.checkFlatGraph()
    this.flatGraph.forEach(function(item) {
      item.render(ctx)
    })
  }

  // do not include children, group handles rendering & sorting internally
  Group.prototype.getFlatGraph = function() {
    return [this]
  }

  Group.prototype.checkFlatGraph = function() {
    if (!this.flatGraph) {
      this.updateFlatGraph()
    }
  }

  Group.prototype.updateFlatGraph = function() {
    this.flatGraph = this.getChildFlatGraph()
  }

  // get flat graph only used for group
  // do not include in parent flatGraphs
  Group.prototype.getChildFlatGraph = function() {
    // do not include self
    var flatGraph = []
    this.children.forEach(function(child) {
      var childFlatGraph = child.getFlatGraph()
      flatGraph = flatGraph.concat(childFlatGraph)
    })
    return flatGraph
  }

  /* globals Hemisphere: true */

  // -------------------------- Hemisphere -------------------------- //

  var Hemisphere = Group.subclass({
    radius: 0.5,
    color: '#333',
    baseColor: undefined,
    fill: true,
    stroke: true,
    lineWidth: 1,
  })

  Hemisphere.prototype.create = function(/* options */) {
    // call super
    Group.prototype.create.apply(this, arguments)
    // composite shape, create child shapes
    // outside base
    var base = new Ellipse({
      width: this.radius * 2,
      height: this.radius * 2,
      addTo: this,
      color: this.color,
      lineWidth: this.lineWidth,
      stroke: this.stroke,
      fill: this.fill,
      backfaceVisible: this.baseColor ? false : true,
    })
    // inside base
    if (this.baseColor) {
      base.copy({
        color: this.baseColor,
        rotate: { y: TAU / 2 },
      })
    }
    // used for calculating contour angle
    this.renderNormal = base.renderNormal
  }

  Hemisphere.prototype.render = function(ctx) {
    if (!this.rendering) {
      return
    }
    this.renderDome(ctx)
    Group.prototype.render.call(this, ctx)
  }

  Hemisphere.prototype.renderDome = function(ctx) {
    var contourAngle = Math.atan2(this.renderNormal.y, this.renderNormal.x)
    var startAngle = contourAngle + TAU / 4
    var endAngle = contourAngle - TAU / 4

    ctx.strokeStyle = ctx.fillStyle = this.color
    ctx.lineWidth = this.lineWidth
    ctx.beginPath()
    var x = this.renderOrigin.x
    var y = this.renderOrigin.y
    // apply scale
    var domeRadius = this.radius * this.renderNormal.magnitude()
    ctx.arc(x, y, domeRadius, startAngle, endAngle)
    ctx.closePath()
    if (this.stroke) {
      ctx.stroke()
    }
    if (this.fill) {
      ctx.fill()
    }
  }

  // -------------------------- Dragger -------------------------- //

  // quick & dirty drag event stuff
  // messes up if multiple pointers/touches

  // event support, default to mouse events
  var downEvent = 'mousedown'
  var moveEvent = 'mousemove'
  var upEvent = 'mouseup'
  if (window.PointerEvent) {
    // PointerEvent, Chrome
    downEvent = 'pointerdown'
    moveEvent = 'pointermove'
    upEvent = 'pointerup'
  } else if ('ontouchstart' in window) {
    // Touch Events, iOS Safari
    downEvent = 'touchstart'
    moveEvent = 'touchmove'
    upEvent = 'touchend'
  }

  function noop() {}

  function Dragger(options) {
    this.startElement = options.startElement
    this.onPointerDown = options.onPointerDown || noop
    this.onPointerMove = options.onPointerMove || noop
    this.onPointerUp = options.onPointerUp || noop

    this.startElement.addEventListener(downEvent, this)
  }

  Dragger.prototype.handleEvent = function(event) {
    var method = this['on' + event.type]
    if (method) {
      method.call(this, event)
    }
  }

  Dragger.prototype.onmousedown = Dragger.prototype.onpointerdown = function(event) {
    this.pointerDown(event, event)
  }

  Dragger.prototype.ontouchstart = function(event) {
    this.pointerDown(event, event.changedTouches[0])
  }

  Dragger.prototype.pointerDown = function(event, pointer) {
    event.preventDefault()
    this.dragStartX = pointer.pageX
    this.dragStartY = pointer.pageY
    window.addEventListener(moveEvent, this)
    window.addEventListener(upEvent, this)
    this.onPointerDown(pointer)
  }

  Dragger.prototype.ontouchmove = function(event) {
    // HACK, moved touch may not be first
    this.pointerMove(event, event.changedTouches[0])
  }

  Dragger.prototype.onmousemove = Dragger.prototype.onpointermove = function(event) {
    this.pointerMove(event, event)
  }

  Dragger.prototype.pointerMove = function(event, pointer) {
    event.preventDefault()
    var moveX = pointer.pageX - this.dragStartX
    var moveY = pointer.pageY - this.dragStartY
    this.onPointerMove(pointer, moveX, moveY)
  }

  Dragger.prototype.onmouseup = Dragger.prototype.onpointerup = Dragger.prototype.ontouchend = Dragger.prototype.pointerUp = function(
    event,
  ) {
    window.removeEventListener(moveEvent, this)
    window.removeEventListener(upEvent, this)
    this.onPointerUp(event)
  }

  // -------------------------- demo -------------------------- //

  var ROOT3 = Math.sqrt(3)
  var ROOT5 = Math.sqrt(5)
  var PHI = (1 + ROOT5) / 2
  var isRotating = true
  var t = 0
  var tSpeed = 1 / 180
  var viewRotation = new Vector3()

  // warm colors
  var violet = '#636'
  var magenta = '#C25'
  var orange = '#E62'
  var gold = '#EA0'
  var yellow = '#ED0'

  // cool colors
  // var violet = '#366';
  // var magenta = '#C25';
  // var orange = '#4DD';
  // var gold = '#EA0';
  // var yellow = '#8FF';

  var scene = new Anchor({
    scale: 8,
  })

  var solids = []

  const shapes = {
    sphere: () => {
      var sphere = new Anchor({
        addTo: scene,
        translate: { x: -4, y: -4 },
      })

      solids.push(sphere)

      var hemi = new Hemisphere({
        radius: 1,
        addTo: sphere,
        color: orange,
        baseColor: violet,
        stroke: false,
      })

      hemi.copy({
        rotate: { y: TAU / 2 },
        color: violet,
        baseColor: orange,
      })
    },

    isocahedron: () => {
      var isocahedron = new Anchor({
        addTo: scene,
        translate: { x: -4, y: -4 },
        scale: 1.2,
      })

      solids.push(isocahedron)

      // geometry
      // radius of triangle with side length = 1
      var faceRadius = ((ROOT3 / 2) * 2) / 3
      var faceHeight = (faceRadius * 3) / 2
      var capApothem = 0.5 / Math.tan(TAU / 10)
      var capRadius = 0.5 / Math.sin(TAU / 10)
      var capTilt = Math.asin(capApothem / faceHeight)
      var capSagitta = capRadius - capApothem
      var sideTilt = Math.asin(capSagitta / faceHeight)
      var sideHeight = Math.sqrt(faceHeight * faceHeight - capSagitta * capSagitta)

      // var colorWheel = [ violet, magenta, orange, gold, yellow ];
      ;[-1, 1].forEach(function(ySide) {
        var capColors = {
          '-1': [yellow, gold, orange, magenta, gold],
          1: [violet, magenta, orange, gold, magenta],
        }[ySide]

        var sideColors = {
          '-1': [yellow, orange, magenta, magenta, gold],
          1: [violet, orange, orange, gold, magenta],
        }[ySide]

        for (var i = 0; i < 5; i++) {
          var rotor = new Anchor({
            addTo: isocahedron,
            rotate: { y: (TAU / 5) * i },
            translate: { y: (sideHeight / 2) * ySide },
          })

          var capRotateX = -capTilt
          var isYPos = ySide > 0
          capRotateX += isYPos ? TAU / 2 : 0

          var capAnchor = new Anchor({
            addTo: rotor,
            translate: { z: capApothem * ySide },
            rotate: { x: capRotateX },
          })

          // cap face
          var face = new Polygon({
            sides: 3,
            radius: faceRadius,
            addTo: capAnchor,
            translate: { y: -faceRadius / 2 },
            stroke: false,
            fill: true,
            color: capColors[i],
            // backfaceVisible: false,
          })

          var sideRotateX = -sideTilt
          sideRotateX += isYPos ? 0 : TAU / 2
          var sideAnchor = capAnchor.copy({
            rotate: { x: sideRotateX },
          })

          face.copy({
            addTo: sideAnchor,
            translate: { y: -faceRadius / 2 },
            rotate: { y: TAU / 2 },
            color: sideColors[i],
          })
        }
      })
    },

    dodecahedron: () => {
      var dodecahedron = new Anchor({
        addTo: scene,
        translate: { x: -4, y: -4 },
        scale: 0.75,
      })

      solids.push(dodecahedron)

      // https://en.wikipedia.org/wiki/Regular_dodecahedron#Dimensions
      var midradius = (PHI * PHI) / 2

      // top & bottom faces
      var face = new Polygon({
        sides: 5,
        radius: 1,
        addTo: dodecahedron,
        translate: { y: -midradius },
        rotate: { x: -TAU / 4 },
        fill: true,
        stroke: false,
        color: yellow,
        // backfaceVisible: false,
      })

      face.copy({
        translate: { y: midradius },
        rotate: { x: TAU / 4 },
        color: violet,
      })
      ;[-1, 1].forEach(function(ySide) {
        var colorWheel = {
          '-1': [violet, magenta, gold, orange, magenta],
          1: [yellow, gold, magenta, orange, gold],
        }[ySide]

        for (var i = 0; i < 5; i++) {
          var rotor1 = new Anchor({
            addTo: dodecahedron,
            rotate: { y: (TAU / 5) * i },
          })
          var rotor2 = new Anchor({
            addTo: rotor1,
            rotate: { x: (TAU / 4) * -ySide + Math.atan(2) },
          })

          face.copy({
            addTo: rotor2,
            translate: { z: -midradius },
            rotate: { z: TAU / 2 },
            color: colorWheel[i],
          })
        }
      })
    },
  }

  // -- animate --- //

  // -- update -- //

  function easeInOut(i) {
    i = i % 1
    var isFirstHalf = i < 0.5
    var i1 = isFirstHalf ? i : 1 - i
    i1 = i1 / 0.5
    // make easing steeper with more multiples
    var i2 = i1 * i1
    i2 = i2 / 2
    return isFirstHalf ? i2 : i2 * -1 + 1
  }

  function update() {
    viewRotation.y += isRotating ? +TAU / 150 : 0

    if (isRotating) {
      t += tSpeed
      var theta = easeInOut(t) * TAU
      var everyOtherCycle = t % 2 < 1
      viewRotation.y = everyOtherCycle ? -theta : 0
      viewRotation.x = everyOtherCycle ? 0 : theta
    }

    solids.forEach(function(solid) {
      solid.rotate.set(viewRotation)
    })

    scene.updateGraph()
  }

  // -- render -- //

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.save()
    ctx.scale(zoom, zoom)
    ctx.translate(w / 2, h / 2)
    scene.renderGraph(ctx)
    ctx.restore()
  }

  // ----- inputs ----- //

  // click drag to rotate
  var dragStartAngleX, dragStartAngleY

  let playing = false

  function animate() {
    if (playing) {
      update()
      render()
      requestAnimationFrame(animate)
    }
  }

  return {
    start: () => {
      shapes[type]()
      playing = true
      animate()
    },
    pause: () => {
      playing = false
    },
    setupDrag: () => {
      return new Dragger({
        startElement: canvas,
        onPointerDown: function() {
          isRotating = false
          dragStartAngleX = viewRotation.x
          dragStartAngleY = viewRotation.y
        },
        onPointerMove: function(_pointer, moveX, moveY) {
          var angleXMove = (moveY / canvasWidth) * TAU
          var angleYMove = (moveX / canvasWidth) * TAU
          viewRotation.x = dragStartAngleX + angleXMove
          viewRotation.y = dragStartAngleY + angleYMove
        },
      })
    },
  }
}
