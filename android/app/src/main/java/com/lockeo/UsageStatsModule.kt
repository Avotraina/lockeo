package com.lockeo

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.content.Intent


class UsageStatsModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "UsageStatsModule"

  // Check if the user has granted usage access permission
  @ReactMethod
  fun hasUsageAccessPermission(promise: Promise) {
    try {
      val usm = reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val now = System.currentTimeMillis()
      val stats = usm.queryEvents(now - 1000 * 60, now)
      promise.resolve(stats != null)
    } catch (e: Exception) {
      promise.reject("ERR_PERMISSION_CHECK", e)
    }
  }

  // Open the Usage Access settings screen
  @ReactMethod
  fun openUsageAccessSettings() {
    val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    reactContext.startActivity(intent)
  }

  // Return the current foreground app package name
  @ReactMethod
  fun getForegroundApp(promise: Promise) {
    try {
      val usm = reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val endTime = System.currentTimeMillis()
      val beginTime = endTime - 2000
      val events = usm.queryEvents(beginTime, endTime)
      val event = UsageEvents.Event()
      var lastApp: String? = null

      while (events.hasNextEvent()) {
        events.getNextEvent(event)
        if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
          lastApp = event.packageName
        }
      }

      promise.resolve(lastApp)
    } catch (e: Exception) {
      promise.reject("ERR_USAGE_STATS", e)
    }
  }
}
