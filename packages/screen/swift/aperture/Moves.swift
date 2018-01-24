typealias MoveDict = Dictionary<Int, [[Int]]>

class Moves {
  public var clockwise: Dictionary<Int, MoveDict>

  init() {
    clockwise = [
      -1: [
        // leftup
        -1: [
          [0, 1],   // down
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [-1, 1],  // downleft
          [1, 1],   // rightdown
        ],
        // left
        0: [
          [1, 1],   // rightdown
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [0, 1],   // down
          [1, 0],   // right
        ],
        // leftdown
        1: [
          [1, 0],   // right
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, 1],   // rightdown
          [1, -1],  // upright
        ]
      ],
      0: [
        // up
        -1: [
          [-1, 1],  // downleft
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [-1, 0],  // left
          [0, 1],   // down
        ],
        // down
        1: [
          [1, -1],  // upright
          [1, 1],   // rightdown
          [1, 2],   // rightdowndown
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
          [1, 0],   // right
          [0, -1],  // up
        ],
      ],
      1: [
        // rightup
        -1: [
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [0, 1],   // down
          [-1, 0],  // left
          [-1, 1],  // downleft
        ],
        // right
        0: [
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [1, 2],   // rightdowndown
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 1],  // upleft
          [-1, 0],  // left
        ],
        // rightdown
        1: [
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [1, 2],   // rightdowndown
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
          [0, -1],  // up
          [-1, 1],  // upleft
        ]
      ]
    ]
  }
}
