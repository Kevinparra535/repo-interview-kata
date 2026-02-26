import ExpoModulesCore

public class AvatarViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AvatarView")

    View(AvatarSwiftView.self) {
      Prop("name") { (view: AvatarSwiftView, name: String) in
        view.setName(name)
      }

      Prop("size") { (view: AvatarSwiftView, size: Int) in
        view.setSize(size)
      }
    }
  }
}
