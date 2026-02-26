#import <React/RCTViewManager.h>

// Registers AvatarViewManager in the legacy (Paper) bridge module registry.
// Property passing to the view is handled via the @objc-annotated setters on
// AvatarSwiftView, which the bridge discovers through the Objective-C runtime.
// When New Architecture is active, the Fabric path goes through AvatarViewModule.
@interface RCT_EXTERN_MODULE(RCTAvatarViewManager, RCTViewManager)
@end
