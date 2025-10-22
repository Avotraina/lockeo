package com.lockeo

import android.os.Bundle
import android.view.WindowManager
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReactApplicationContext

class LockActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val packageName = intent.getStringExtra("packageName") ?: ""

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(50, 200, 50, 50)
        }

        val editText = EditText(this).apply { hint = "Enter PIN" }
        val button = Button(this).apply { text = "Unlock" }

        button.setOnClickListener {
            val pin = editText.text.toString()
            // TODO: Connect to EncryptedStorage via React Native module
            if (pin == "1234") finish()
        }

        layout.addView(TextView(this).apply { text = "App Locked: $packageName" })
        layout.addView(editText)
        layout.addView(button)

        setContentView(layout)
        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN or
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
            WindowManager.LayoutParams.FLAG_FULLSCREEN or
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
        )
    }
}
