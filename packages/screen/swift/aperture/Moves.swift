typealias MoveDict = Dictionary<Int, [[Int]]>

class Moves {
  public var clockwise: Dictionary<Int, MoveDict>
  public var px = 1

  init() {
    // corners and sides
    let down = [0, px]
    let downright = [px, px]
    let left = [-px, 0]
    let upleft = [-px, -px]
    let up = [0, -px]
    let upright = [px, -px]
    let right = [px, 0]
    let downleft = [-px, px]
    // steep diagonals
    let diag_downdownright = [px, 2 * px, -1]
    let diag_downdownleft = [-px, 2 * px, -1]
    let diag_downrightright = [2 * px, px, 1]
    let diag_downleftleft = [2 * -px, px, 1]
    let diag_upupleft = [-px, 2 * -px, -1]
    let diag_upupright = [px, 2 * -px, -1]
    let diag_upleftleft = [2 * -px, -px, 1]
    let diag_uprightright = [2 * px, -px, 1]
    // clockwise sequences
    let fromupleft = [
//      down,
//      diag_downdownleft,
      downleft,
      left,
      diag_upleftleft,
      upleft,
      diag_upupleft,
      up,
      diag_upupright,
      upright,
      diag_uprightright,
      right,
      diag_downrightright,
      downright,
    ]
    let fromleft = [
//      downright,
//      diag_downdownright,
      down,
      diag_downdownleft,
      downleft,
      diag_downleftleft,
      left,
      diag_upleftleft,
      upleft,
      diag_upupleft,
      up,
      diag_upupright,
      upright,
      diag_uprightright,
      right,
    ]
    let fromdownleft = [
//      right,
//      diag_downrightright,
      downright,
      diag_downdownright,
      down,
      diag_downdownleft,
      downleft,
      diag_downleftleft,
      left,
      diag_upleftleft,
      upleft,
      diag_upupleft,
      up,
      diag_upupright,
      upright,
    ]
    let fromup = [
//      downleft,
//      diag_downleftleft,
      left,
      diag_upleftleft,
      upleft,
      diag_upupleft,
      up,
      diag_upupright,
      upright,
      diag_uprightright,
      right,
      diag_downrightright,
      downright,
      diag_downdownright,
      down,
    ]
    let fromdown = [
//      upright,
//      diag_uprightright,
      right,
      diag_downrightright,
      downright,
      diag_downdownright,
      down,
      diag_downdownleft,
      downleft,
      diag_downleftleft,
      left,
      diag_upleftleft,
      upleft,
      diag_upupleft,
      up,
    ]
    let fromupright = [
//      left,
//      diag_upleftleft,
      upleft,
      diag_upupleft,
      up,
      diag_upupright,
      upright,
      diag_uprightright,
      right,
      diag_downrightright,
      downright,
      diag_downdownright,
      down,
      diag_downdownleft,
      downleft,
    ]
    let fromright = [
//      upleft,
//      diag_upupleft,
      up,
      diag_upupright,
      upright,
      diag_uprightright,
      right,
      diag_downrightright,
      downright,
      diag_downdownright,
      down,
      diag_downdownleft,
      downleft,
      diag_downleftleft,
      left,
    ]
    let fromdownright = [
//      up,
//      diag_upupright,
      upright,
      diag_uprightright,
      right,
      diag_downrightright,
      downright,
      diag_downdownright,
      down,
      diag_downdownleft,
      downleft,
      diag_downleftleft,
      left,
      diag_upleftleft,
      upleft,
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
