package com.lockeo

import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper

class ForegroundWatcherService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private val interval = 1000L

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        handler.post(checkRunnable)
        return START_STICKY
    }

    private val checkRunnable = object : Runnable {
        override fun run() {
            val foregroundApp = getForegroundApp()
            if (foregroundApp != null) {
                val lockIntent = Intent(this@ForegroundWatcherService, LockActivity::class.java)
                lockIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                lockIntent.putExtra("packageName", foregroundApp)
                startActivity(lockIntent)
            }
            handler.postDelayed(this, interval)
        }
    }

    private fun getForegroundApp(): String? {
        val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val now = System.currentTimeMillis()
        val events = usm.queryEvents(now - 2000, now)
        val ev = UsageEvents.Event()
        var lastApp: String? = null
        while (events.hasNextEvent()) {
            events.getNextEvent(ev)
            if (ev.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) lastApp = ev.packageName
        }
        return lastApp
    }

    override fun onDestroy() {
        handler.removeCallbacks(checkRunnable)
        super.onDestroy()
    }
}




// package com.lockeo

// import android.app.Notification
// import android.app.NotificationChannel
// import android.app.NotificationManager
// import android.app.Service
// import android.content.Intent
// import android.os.Build
// import android.os.IBinder
// import androidx.core.app.NotificationCompat

// class ForegroundWatcherService : Service() {

//     private val CHANNEL_ID = "app_locker_foreground_channel"

//     override fun onCreate() {
//         super.onCreate()
//         createNotificationChannel()
//         val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
//             .setContentTitle("AppLocker is running")
//             .setContentText("Monitoring foreground apps")
//             .setSmallIcon(android.R.drawable.ic_lock_lock)
//             .build()

//         startForeground(1, notification)
//     }

//     override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
//         // Here you could start periodic checks or bind to usage stats
//         return START_STICKY
//     }

//     override fun onBind(intent: Intent?): IBinder? {
//         return null
//     }

//     private fun createNotificationChannel() {
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             val channel = NotificationChannel(
//                 CHANNEL_ID,
//                 "AppLocker Service",
//                 NotificationManager.IMPORTANCE_LOW
//             )
//             val manager = getSystemService(NotificationManager::class.java)
//             manager.createNotificationChannel(channel)
//         }
//     }
// }
