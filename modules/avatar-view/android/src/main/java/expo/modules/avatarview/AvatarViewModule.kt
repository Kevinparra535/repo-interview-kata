package expo.modules.avatarview

import android.content.Context
import android.widget.FrameLayout
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.views.ExpoView

// Fabric-compatible wrapper for New Architecture.
// Embeds AvatarView (plain android.view.View) inside an ExpoView so it integrates
// with the Fabric renderer. The actual drawing logic lives in AvatarView,
// which is also exposed via the legacy SimpleViewManager path (AvatarViewManager.kt).
class AvatarExpoView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val nativeView = AvatarView(context).also { view ->
    addView(view, FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.MATCH_PARENT,
      FrameLayout.LayoutParams.MATCH_PARENT,
    ))
  }

  fun setName(name: String) { nativeView.setName(name) }
  fun setSize(size: Int) { nativeView.setSize(size) }
}

class AvatarViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AvatarView")

    View(AvatarExpoView::class) {
      Prop("name") { view: AvatarExpoView, name: String ->
        view.setName(name)
      }
      Prop("size") { view: AvatarExpoView, size: Int ->
        view.setSize(size)
      }
    }
  }
}
