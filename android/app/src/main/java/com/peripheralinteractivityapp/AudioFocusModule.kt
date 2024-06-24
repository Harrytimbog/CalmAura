package com.peripheralinteractivityapp

import android.content.Context
import android.media.AudioManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback

class AudioFocusModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context = reactContext

    override fun getName(): String {
        return "AudioFocusModule"
    }

    @ReactMethod
    fun isAudioPlaying(callback: Callback) {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val isPlaying = audioManager.isMusicActive
        callback.invoke(isPlaying)
    }
}
