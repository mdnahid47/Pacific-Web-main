import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

class NotificationService {
  static final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  static Future<void> initialize() async {
    // ✅ Android notification channel
    const androidChannel = AndroidNotificationChannel(
      'order_channel',
      'New Orders',
      description: 'Notifications for new orders',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
      showBadge: true,
    );

    await _notifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(androidChannel);

    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    // ✅ v22 API: settings, onDidReceiveNotificationResponse (Named Parameters)
    await _notifications.initialize(
      settings: initSettings,
      onDidReceiveNotificationResponse: (response) {
        debugPrint('🔔 Notification tapped: ${response.payload}');
      },
    );

    await _notifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.requestNotificationsPermission();
  }

  static Future<void> showIncomingOrder({
    required String orderId,
    required int secondsLeft,
  }) async {
    await WakelockPlus.enable();
    FlutterRingtonePlayer().playRingtone(looping: true, volume: 1.0);

    final payload = json.encode({
      'orderId': orderId,
      'action': 'receive',
      'secondsLeft': secondsLeft,
    });

    final androidDetails = AndroidNotificationDetails(
      'order_channel',
      'New Orders',
      channelDescription: 'Notifications for new orders',
      importance: Importance.max,
      priority: Priority.max,
      fullScreenIntent: true,
      category: AndroidNotificationCategory.call,
      ongoing: true,
      autoCancel: false,
      playSound: true,
      enableVibration: true,
      visibility: NotificationVisibility.public,
      actions: <AndroidNotificationAction>[
        const AndroidNotificationAction('receive', 'Receive',
            showsUserInterface: true, cancelNotification: true),
        const AndroidNotificationAction('reject', 'Reject',
            showsUserInterface: true, cancelNotification: true),
      ],
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
      interruptionLevel: InterruptionLevel.critical,
    );

    final notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    // ✅ v22 API: সব Named Parameters
    await _notifications.show(
      id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title: '🔔 New Order Received',
      body: 'Order #${orderId.replaceAll('#', '')} - Tap to respond within 60s',
      notificationDetails: notificationDetails,
      payload: payload,
    );
  }

  static Future<void> stopRing() async {
    FlutterRingtonePlayer().stop();
    await WakelockPlus.disable();
  }

  static Future<void> clearAll() async {
    await _notifications.cancelAll();
  }
}