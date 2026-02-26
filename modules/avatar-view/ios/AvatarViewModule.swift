import ExpoModulesCore

// Fabric-compatible wrapper for New Architecture.
// Embeds AvatarSwiftView (plain UIView) inside an ExpoView so it integrates
// with the Fabric renderer. The actual drawing logic lives in AvatarSwiftView,
// which is also exposed via the legacy RCTViewManager path (AvatarViewManager.swift).
class AvatarExpoView: ExpoView {
  private let nativeView = AvatarSwiftView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    // Do NOT use Auto Layout — Fabric sets the ExpoView frame via Yoga and
    // never triggers a constraint pass on the embedded subview.
    // We sync manually in layoutSubviews instead.
    addSubview(nativeView)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    // Pin the drawing view to our Fabric-assigned bounds and force a redraw
    // now that we have the correct size.
    nativeView.frame = bounds
    nativeView.setNeedsDisplay()
  }

  func setName(_ name: String) { nativeView.setName(name) }
  func setSize(_ newSize: Int) { nativeView.setSize(NSNumber(value: newSize)) }
}

public class AvatarViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AvatarView")

    View(AvatarExpoView.self) {
      Prop("name") { (view: AvatarExpoView, name: String) in
        view.setName(name)
      }
      Prop("size") { (view: AvatarExpoView, size: Int) in
        view.setSize(size)
      }
    }
  }
}
