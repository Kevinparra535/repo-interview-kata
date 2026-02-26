import React

// Classic RCTViewManager — demonstrates the legacy bridge pattern.
// Exposes the view under "RCTAvatarView" to avoid a name collision with
// the Expo Modules (Fabric) registration in AvatarViewModule.swift.
// The Expo Module is what the JS layer actually consumes via requireNativeView.
@objc(RCTAvatarViewManager)
class AvatarViewManager: RCTViewManager {

  @objc override static func requiresMainQueueSetup() -> Bool { return true }

  override func view() -> UIView! {
    return AvatarSwiftView()
  }
}
