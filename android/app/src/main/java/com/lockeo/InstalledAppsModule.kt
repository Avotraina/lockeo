package com.lockeo

import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream

class InstalledAppsModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "InstalledAppsModule"

  @ReactMethod
  fun getApps(promise: Promise) {
    try {
      val pm = reactContext.packageManager
      val packages = pm.getInstalledApplications(PackageManager.GET_META_DATA)
      val resultArray: WritableArray = Arguments.createArray()

      for (app in packages) {
        val appName = pm.getApplicationLabel(app).toString()
        val packageName = app.packageName
        val iconDrawable = pm.getApplicationIcon(app)

        val bitmap = drawableToBitmap(iconDrawable)
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
        val base64 = Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT)

        val map = Arguments.createMap().apply {
          putString("appName", appName)
          putString("packageName", packageName)
          putString("icon", base64)
          putBoolean("isSystemApp", (app.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM) != 0)
        }

        resultArray.pushMap(map)
      }

      promise.resolve(resultArray)
    } catch (e: Exception) {
      promise.reject("ERR_GET_APPS", e)
    }
  }

  private fun drawableToBitmap(drawable: Drawable): Bitmap {
    return if (drawable is BitmapDrawable) {
      drawable.bitmap
    } else {
      val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 1
      val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 1
      val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
      val canvas = Canvas(bitmap)
      drawable.setBounds(0, 0, canvas.width, canvas.height)
      drawable.draw(canvas)
      bitmap
    }
  }
}
