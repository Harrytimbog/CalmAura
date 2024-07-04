package com.peripheralinteractivityapp

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.*

class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "UsageStats"
    }

    @ReactMethod
    fun isCameraInUse(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 60 // last minute

            val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
            var cameraInUse = false

            val event = UsageEvents.Event()
            while (usageEvents.hasNextEvent()) {
                usageEvents.getNextEvent(event)
                if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                    val packageName = event.packageName
                    if (packageName.contains("camera", true)) {
                        cameraInUse = true
                        break
                    }
                }
            }

            promise.resolve(cameraInUse)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }
}
