import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static IO.Socket? _socket;
  static Function(Map<String, dynamic>)? onNewOrder;
  static Function(Map<String, dynamic>)? onStatusUpdate;

  static void connect({required String vendorId, required String token}) {
    if (_socket != null && _socket!.connected) return;

    _socket = IO.io(
      'http://192.168.0.16:5001',
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      debugPrint('✅ Socket connected');
      _socket!.emit('join_vendor', vendorId);
    });

    _socket!.on('new_order_assignment', (data) {
      debugPrint('🔔 New order: $data');
      final mapData = Map<String, dynamic>.from(data);
      onNewOrder?.call(mapData);
    });

    _socket!.on('order_status_updated', (data) {
      debugPrint('📋 Status update: $data');
      onStatusUpdate?.call(Map<String, dynamic>.from(data));
    });

    _socket!.onDisconnect((_) => debugPrint('❌ Socket disconnected'));
    _socket!.onError((error) => debugPrint('⚠️ Socket error: $error'));
  }

  static void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}