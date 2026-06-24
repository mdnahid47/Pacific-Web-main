# android/app/proguard-rules.pro
# Flutter
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-keep class com.google.firebase.** { *; }

# Provider
-keep class * extends androidx.lifecycle.ViewModel
-keep class * extends android.app.Application

# Keep - Applications. Keep all application classes, as they are accessed via reflection by the platform.
-keep public class * extends android.app.Application

# Keep - ViewModels
-keepclassmembers class * extends androidx.lifecycle.ViewModel {
    <init>(...);
}

# Keep - Parcelables
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}