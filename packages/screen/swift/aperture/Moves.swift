typealias MoveDict = Dictionary<Int, [[Int]]>

class Moves {
  public var clockwise: Dictionary<Int, MoveDict>
  public var px = 2

  init() {
    let down = [0, px]
    let rightdown = [px, px]
    let left = [-px, 0]
    let upleft = [-px, px]
    let up = [0, -px]
    let upright = [px, -px]
    let right = [px, 0]
    let downleft = [-px, px]
    // let rightdowndown = [px, 2 * px, -1]
    // let leftdowndown = [-px, 2 * px, -1]
    let fromleftup = [
      down,
      downleft,
      // leftdowndown,
      left,
      upleft,
      up,
      upright,
      right,
      // rightdown,
    ]
    let fromleft = [
      rightdown,
      downleft,
      // leftdowndown,
      left,
      upleft,
      up,
      upright,
      down,
      // right,
    ]
    let fromleftdown = [
      right,
      down,
      downleft,
      // leftdowndown,
      left,
      upleft,
      up,
      rightdown,
      // upright,
    ]
    let fromup = [
      downleft,
      // leftdowndown,
      upleft,
      up,
      upright,
      right,
      rightdown,
      left,
      // down,
    ]
    let fromdown = [
      upright,
      rightdown,
      // rightdowndown,
      down,
      downleft,
      // leftdowndown,
      left,
      upleft,
      right,
      // up,
    ]
    let fromrightup = [
      upleft,
      up,
      upright,
      right,
      rightdown,
      down,
      left,
      // downleft,
    ]
    let fromright = [
      up,
      upright,
      right,
      rightdown,
      // rightdowndown,
      down,
      downleft,
      // leftdowndown,
      upleft,
      // left,
    ]
    let fromrightdown = [
      upright,
      right,
      rightdown,
      // rightdowndown,
      down,
      downleft,
      // leftdowndown,
      left,
      up,
      // upleft,
    ]
    clockwise = [
      -px: [
        -px: fromleftup,
        0: fromleft,
        px: fromleftdown
      ],
      0: [
        -px: fromup,
        px: fromdown,
      ],
      px: [
        -px: fromrightup,
        0: fromright,
        px: fromrightdown
      ]
    ]
  }
}
