import UIKit
import ExpoModulesCore

public class AvatarSwiftView: ExpoView {

  private var name: String = ""
  private var sizePt: Int = 40

  /// Deterministic color palette — mirrors the JS Avatar component
  private let avatarColors: [UIColor] = [
    UIColor(red: 0.051, green: 0.580, blue: 0.533, alpha: 1), // #0D9488 teal
    UIColor(red: 0.486, green: 0.227, blue: 0.929, alpha: 1), // #7C3AED purple
    UIColor(red: 0.145, green: 0.388, blue: 0.922, alpha: 1), // #2563EB blue
    UIColor(red: 0.937, green: 0.267, blue: 0.267, alpha: 1), // #EF4444 red
    UIColor(red: 0.961, green: 0.620, blue: 0.043, alpha: 1), // #F59E0B amber
    UIColor(red: 0.063, green: 0.725, blue: 0.506, alpha: 1), // #10B981 green
  ]

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    backgroundColor = .clear
  }

  func setName(_ newName: String) {
    name = newName
    setNeedsDisplay()
  }

  func setSize(_ newSize: Int) {
    sizePt = newSize
    setNeedsDisplay()
  }

  public override func draw(_ rect: CGRect) {
    guard let ctx = UIGraphicsGetCurrentContext() else { return }

    let side = min(rect.width, rect.height)
    let origin = CGPoint(
      x: (rect.width - side) / 2,
      y: (rect.height - side) / 2
    )
    let circleRect = CGRect(origin: origin, size: CGSize(width: side, height: side))

    // Background circle
    ctx.setFillColor(colorFromName(name).cgColor)
    ctx.fillEllipse(in: circleRect)

    // Initials
    let initials = getInitials(name)
    let fontSize = side * 0.35
    let attrs: [NSAttributedString.Key: Any] = [
      .font: UIFont.boldSystemFont(ofSize: fontSize),
      .foregroundColor: UIColor.white,
    ]
    let textSize = (initials as NSString).size(withAttributes: attrs)
    let textRect = CGRect(
      x: circleRect.midX - textSize.width / 2,
      y: circleRect.midY - textSize.height / 2,
      width: textSize.width,
      height: textSize.height
    )
    (initials as NSString).draw(in: textRect, withAttributes: attrs)
  }

  private func getInitials(_ fullName: String) -> String {
    let parts = fullName.trimmingCharacters(in: .whitespaces)
      .components(separatedBy: .whitespaces)
      .filter { !$0.isEmpty }

    if parts.count == 1 {
      return String(parts[0].prefix(2)).uppercased()
    }
    let first = parts.first!.first!
    let last = parts.last!.first!
    return "\(first)\(last)".uppercased()
  }

  private func colorFromName(_ seed: String) -> UIColor {
    let hash = seed.unicodeScalars.reduce(0) { $0 + Int($1.value) }
    return avatarColors[hash % avatarColors.count]
  }
}
