package expo.modules.avatarview

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class AvatarView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {

  private var name: String = ""
  private var sizeDp: Int = 40

  private val backgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG)
  private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
    color = Color.WHITE
    typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
    textAlign = Paint.Align.CENTER
  }

  /** Deterministic color palette — mirrors the JS Avatar component */
  private val avatarColors = intArrayOf(
    Color.parseColor("#0D9488"), // teal (accent)
    Color.parseColor("#7C3AED"), // purple
    Color.parseColor("#2563EB"), // blue
    Color.parseColor("#EF4444"), // red
    Color.parseColor("#F59E0B"), // amber
    Color.parseColor("#10B981"), // green
  )

  fun setName(newName: String) {
    name = newName
    backgroundPaint.color = colorFromName(newName)
    invalidate()
  }

  fun setSize(newSize: Int) {
    sizeDp = newSize
    invalidate()
  }

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    val w = width.toFloat()
    val h = height.toFloat()
    val radius = minOf(w, h) / 2f

    // Draw circle background
    canvas.drawCircle(w / 2f, h / 2f, radius, backgroundPaint)

    // Draw initials
    val initials = getInitials(name)
    textPaint.textSize = radius * 0.7f
    val textY = h / 2f - (textPaint.descent() + textPaint.ascent()) / 2f
    canvas.drawText(initials, w / 2f, textY, textPaint)
  }

  private fun getInitials(fullName: String): String {
    val parts = fullName.trim().split("\\s+".toRegex())
    return if (parts.size == 1) {
      parts[0].take(2).uppercase()
    } else {
      "${parts.first()[0]}${parts.last()[0]}".uppercase()
    }
  }

  private fun colorFromName(seed: String): Int {
    val hash = seed.fold(0) { acc, ch -> acc + ch.code }
    return avatarColors[hash % avatarColors.size]
  }
}
