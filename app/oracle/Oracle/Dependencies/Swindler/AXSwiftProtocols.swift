// This file defines protocols that wrap classes in AXSwift, so we can inject fakes while testing.
// If a method from AXSwift is needed, it can be added to the corresponding protocol.


/// Protocol that wraps UIElement.
protocol UIElementType: Equatable {
    static var globalMessagingTimeout: Float { get }

    func pid() throws -> pid_t
    func attribute<T>(_ attribute: Attribute) throws -> T?
    func arrayAttribute<T>(_ attribute: Attribute) throws -> [T]?
    func setAttribute(_ attribute: Attribute, value: Any) throws
    func getMultipleAttributes(_ attributes: [Attribute]) throws -> [Attribute: Any]

    var inspect: String { get }
}
extension UIElement: UIElementType {}

/// Protocol that wraps Observer.
protocol ObserverType {
    associatedtype UIElement: UIElementType
    associatedtype Context

    typealias Callback = (Context, UIElement, AXNotification) -> Void

    init(processID: pid_t, callback: @escaping Callback) throws
    func addNotification(_ notification: AXNotification, forElement: UIElement) throws
    func removeNotification(_ notification: AXNotification, forElement: UIElement) throws
}
extension Observer: ObserverType {
    typealias UIElement = UIElement
    typealias Context = Observer
}

/// Protocol that wraps Application.
protocol ApplicationElementType: UIElementType {
    associatedtype UIElement: UIElementType

    init?(forProcessID processID: pid_t)

    static func all() -> [Self]

    // Until the Swift type system improves, I don't see a way around this.
    var toElement: UIElement { get }
}
extension Application: ApplicationElementType {
    typealias UIElement = UIElement
    var toElement: UIElement { return self }
}
