package expo.modules.avatarview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AvatarViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AvatarView")

    View(AvatarView::class) {
      Prop("name") { view: AvatarView, name: String ->
        view.setName(name)
      }

      Prop("size") { view: AvatarView, size: Int ->
        view.setSize(size)
      }
    }
  }
}
