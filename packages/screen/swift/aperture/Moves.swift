typealias MoveDict = Dictionary<Int, [[Int]]>

class Moves {
  public var clockwise: Dictionary<Int, MoveDict>
  public var px = 1

  init() {
    // corners and sides
    let down = [0, px]
    let downright = [px, px]
    let left = [-px, 0]
    let upleft = [-px, px]
    let up = [0, -px]
    let upright = [px, -px]
    let right = [px, 0]
    let downleft = [-px, px]
    // steep diagonals
    let downdownright = [px, 2 * px, -1]
    let downdownleft = [-px, 2 * px, -1]
    let downrightright = [2 * px, px, 1]
    let downleftleft = [2 * -px, px, 1]
    let upupleft = [-px, 2 * -px, -1]
    let upupright = [px, 2 * -px, -1]
    let upleftleft = [2 * -px, -px, 1]
    let uprightright = [2 * px, -px, 1]
    // clockwise sequences
    let fromupleft = [
      down,
      downdownleft,
      downleft,
      left,
      upleftleft,
      upleft,
      upupleft,
      up,
      upupright,
      upright,
      uprightright,
      right,
    ]
    let fromleft = [
      downright,
      downdownright,
      down,
      downdownleft,
      downleft,
      downleftleft,
      left,
      upleftleft,
      upleft,
      upupleft,
      up,
      upupright,
      upright,
    ]
    let fromdownleft = [
      right,
      downrightright,
      downright,
      downdownright,
      down,
      downdownleft,
      downleft,
      downleftleft,
      left,
      upleftleft,
      upleft,
      upupleft,
      up,
    ]
    let fromup = [
      downleft,
      downleftleft,
      left,
      upleftleft,
      upleft,
      upupleft,
      up,
      upupright,
      upright,
      uprightright,
      right,
      downrightright,
      downright,
    ]
    let fromdown = [
      upright,
      uprightright,
      right,
      downrightright,
      downright,
      downdownright,
      down,
      downdownleft,
      downleft,
      downleftleft,
      left,
      upleftleft,
      upleft,
    ]
    let fromupright = [
      left,
      upleftleft,
      upleft,
      upupleft,
      up,
      upupright,
      upright,
      uprightright,
      right,
      downrightright,
      downright,
      downdownright,
      down,
    ]
    let fromright = [
      upleft,
      upupleft,
      up,
      upupright,
      upright,
      uprightright,
      right,
      downrightright,
      downright,
      downdownright,
      down,
      downdownleft,
      downleft,
    ]
    let fromdownright = [
      up,
      upupright,
      upright,
      uprightright,
      right,
      downrightright,
      downright,
      downdownright,
      down,
      downdownleft,
      downleft,
      downleftleft,
      left,
    ]
    clockwise = [
      -px: [
        -px: fromupleft,
        0: fromleft,
        px: fromdownleft
      ],
      0: [
        -px: fromup,
        px: fromdown,
      ],
      px: [
        -px: fromupright,
        0: fromright,
        px: fromdownright
      ]
    ]
  }
}
