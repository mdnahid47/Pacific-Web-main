import 'package:flutter/material.dart';
import '../providers/auth_provider.dart';
import 'package:provider/provider.dart';

// Custom hook similar to React's useAuth
AuthProvider useAuth(BuildContext context) {
  final authProvider = Provider.of<AuthProvider>(context, listen: true);
  return authProvider;
}

// Or using extension for cleaner syntax
extension AuthContextExtension on BuildContext {
  AuthProvider get auth => Provider.of<AuthProvider>(this, listen: true);
}
