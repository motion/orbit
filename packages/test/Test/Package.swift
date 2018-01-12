// swift-tools-version:4.0

import PackageDescription

let package = Package(
    name: "Test",
    dependencies: [
        .package(url: "../AXSwift", from: "1.0.0"),
        .package(url: "https://github.com/mxcl/PromiseKit", from: "4.0.0"),
    ],
    targets: [
        .target(
            name: "Test",
            dependencies: []),
    ]
)
