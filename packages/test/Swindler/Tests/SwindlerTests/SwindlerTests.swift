import XCTest
@testable import Swindler

class SwindlerTests: XCTestCase {
    func testExample() {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct
        // results.
        XCTAssertEqual(Swindler().text, "Hello, World!")
    }


    static var allTests = [
        ("testExample", testExample),
    ]
}
