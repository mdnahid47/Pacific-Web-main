import 'package:flutter/material.dart';
import '../providers/auth_provider.dart';
import 'package:provider/provider.dart';

extension AuthExtension on BuildContext {
  AuthProvider get auth => Provider.of<AuthProvider>(this, listen: false);
}

extension AuthExtensionListen on BuildContext {
  AuthProvider get authListen => Provider.of<AuthProvider>(this, listen: true);
}
