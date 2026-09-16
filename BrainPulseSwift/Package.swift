// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "BrainPulse",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "BrainPulse",
            targets: ["BrainPulse"]
        )
    ],
    targets: [
        .target(
            name: "BrainPulse",
            path: "Sources"
        )
    ]
)
