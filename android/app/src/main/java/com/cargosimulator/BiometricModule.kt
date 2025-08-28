package com.cargosimulator.modules

import androidx.annotation.NonNull
import androidx.biometric.BiometricPrompt
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*

class BiometricModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BiometricModule"

    @ReactMethod
    fun authenticate(promise: Promise) {
        val currentActivity = reactApplicationContext.currentActivity as? FragmentActivity
        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null")
            return
        }

        currentActivity.runOnUiThread {
            val executor = currentActivity.mainExecutor
            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("Biometric Authentication")
                .setSubtitle("Authenticate using your biometric credential")
                .setNegativeButtonText("Cancel")
                .build()

            val biometricPrompt = BiometricPrompt(currentActivity, executor,
                object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                        promise.resolve("success")
                    }

                    override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                        promise.reject(errorCode.toString(), errString.toString())
                    }

                    override fun onAuthenticationFailed() {
                        promise.reject("FAILED", "Authentication failed")
                    }
                })

            biometricPrompt.authenticate(promptInfo)
        }
    }
}
