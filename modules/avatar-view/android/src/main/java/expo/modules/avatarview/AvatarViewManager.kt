package expo.modules.avatarview

import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AvatarViewManager(private val reactContext: ReactApplicationContext) :
    SimpleViewManager<AvatarView>() {

  companion object {
    const val REACT_CLASS = "AvatarView"
  }

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(reactContext: ThemedReactContext): AvatarView =
    AvatarView(reactContext)

  @ReactProp(name = "name")
  fun setName(view: AvatarView, name: String) {
    view.setName(name)
  }

  @ReactProp(name = "size", defaultInt = 40)
  fun setSize(view: AvatarView, size: Int) {
    view.setSize(size)
  }
}
