import React

@objc(AvatarViewManager)
class AvatarViewManager: RCTViewManager {

  @objc override static func requiresMainQueueSetup() -> Bool { return true }

  override func view() -> UIView! {
    return AvatarSwiftView()
  }
}
