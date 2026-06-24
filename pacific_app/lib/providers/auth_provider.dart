import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart'; // ✅ Import যোগ করুন

class AuthProvider with ChangeNotifier {
  String? _token;
  String? _userRole;
  Map<String, dynamic>? _userData; // ✅ userData নামে property
  bool _loading = false;
  bool _initialCheckDone = false;
  String? get token => _token;
  String? get userRole => _userRole;
  Map<String, dynamic>? get userData => _userData; // ✅ getter ঠিক করুন
  bool get loading => _loading;
  bool get isAuthenticated => _token != null;

  // ✅ Helper getters for easier access
  String? get userName => _userData?['name'];
  String? get userEmail => _userData?['email'];
  String? get userPhone => _userData?['phone'];
  String? get userPhoto => _userData?['photo'];
  String? get userProfileImage => _userData?['profileImage'];

  // ✅ Vendor specific getters
  String? get vendorName => _userData?['name'];
  String? get vendorEmail => _userData?['email'];
  String? get vendorPhone => _userData?['phone'];
  String? get vendorPhoto =>
      _userData?['profileImage'] ?? _userData?['vendor_photo'];
  String? get vendorStatus => _userData?['status'];

  AuthProvider() {
    _loadStoredToken();
  }

  Future<void> _loadStoredToken() async {
    try {
      _loading = true;
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final storedToken = prefs.getString('token');
      final storedRole = prefs.getString('userRole');
      final storedUserData = prefs.getString('userData');

      await Future.delayed(const Duration(milliseconds: 500)); // Optional delay

      if (storedToken != null) {
        _token = storedToken;
        _userRole = storedRole;
        _userData = storedUserData != null
            ? Map<String, dynamic>.from(json.decode(storedUserData))
            : null;
        print('✅ Loaded stored token. Role: $_userRole');
      } else {
        print('ℹ️ No stored token found');
      }
    } catch (error) {
      print('❌ Error loading stored token: $error');
    } finally {
      _loading = false;
      _initialCheckDone = true; // ✅ Mark as done
      notifyListeners();
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      _loading = true;
      notifyListeners();

      // ✅ Universal login endpoint
      final response = await ApiService().login(email, password);

      print('Login API Response: ${response.toString()}');

      if (response['success'] == true) {
        _token = response['token'];
        _userRole = response['role'];
        _userData = response['user'];

        // Store in shared preferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', _token!);
        await prefs.setString('userRole', _userRole!);
        await prefs.setString('userData', json.encode(_userData));

        print('✅ Login successful! Role: $_userRole, User: $_userData');

        notifyListeners();
        return _userData!;
      } else {
        throw Exception(
          response['message'] ?? 'Login failed. Invalid response format.',
        );
      }
    } catch (error) {
      print('❌ AuthProvider login error: $error');
      throw error;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userRole');
    await prefs.remove('userData');

    _token = null;
    _userRole = null;
    _userData = null;
    notifyListeners();
  }

  Future<Map<String, dynamic>> verifyToken() async {
    if (_token == null) {
      throw Exception('No token found');
    }

    try {
      final response = await ApiService().verifyToken(_token!);
      return response;
    } catch (error) {
      await logout();
      throw error;
    }
  }

  Future<Map<String, dynamic>> getUserProfile() async {
    if (_token == null) {
      throw Exception('Not authenticated');
    }

    try {
      final response = await ApiService().getUserProfile(_token!);
      if (response['success'] == true) {
        _userData = response['user'];
        notifyListeners();

        // Update stored data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userData', json.encode(_userData));

        return _userData!;
      } else {
        throw Exception(response['message'] ?? 'Failed to get profile');
      }
    } catch (error) {
      throw error;
    }
  }

  Future<Map<String, dynamic>> getVendorProfile() async {
    if (_token == null) {
      throw Exception('Not authenticated');
    }

    try {
      final response = await ApiService().getVendorProfile(_token!);
      if (response['success'] == true) {
        _userData = response['vendor'];
        notifyListeners();

        // Update stored data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userData', json.encode(_userData));

        return _userData!;
      } else {
        throw Exception(response['message'] ?? 'Failed to get vendor profile');
      }
    } catch (error) {
      throw error;
    }
  }

  void updateVendorProfile(
    vendorDetail,
    vendorDetail2,
    vendorDetail3,
    vendorDetail4,
    vendorDetail5,
  ) {}
}
