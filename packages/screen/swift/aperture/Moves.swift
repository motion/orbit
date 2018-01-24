typealias MoveDict = Dictionary<Int, [[Int]]>

class Moves {
  public var clockwise: Dictionary<Int, MoveDict>

  init() {
    clockwise = [
      -1: [
        // leftup
        -1: [
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
        ],
        // left
        0: [
          [1, 1],   // rightdown
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
        ],
        // leftdown
        1: [
          [1, 0],   // right
          [1, 1],   // rightdown
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
        ]
      ],
      0: [
        // up
        -1: [
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
        ],
        // down
        1: [
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
          [-1, 1],  // upleft
        ],
      ],
      1: [
        // rightup
        -1: [
          [-1, 0],  // left
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [0, 1],   // down
        ],
        // right
        0: [
          [-1, 1],  // upleft
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [0, 1],   // down
          [-1, 1],  // downleft
        ],
        // rightdown
        1: [
          [0, -1],  // up
          [1, -1],  // upright
          [1, 0],   // right
          [1, 1],   // rightdown
          [0, 1],   // down
          [-1, 1],  // downleft
          [-1, 0],  // left
        ]
      ]
    ]
  }
}
