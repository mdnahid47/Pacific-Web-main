import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  // ✅ Base URL - /api সহ (double /api এড়াতে)
  String get baseUrl {
    final url = dotenv.env['API_BASE_URL'] ?? 'http://localhost:5001/api';
    // নিশ্চিত করুন শেষে /api আছে, ডাবল /api এড়ান
    if (url.endsWith('/api')) return url;
    if (url.endsWith('/api/')) return url.substring(0, url.length - 1);
    return '$url/api';
  }

  // Headers
  Map<String, String> getHeaders({String? token}) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Helper method to handle API responses
  dynamic _handleResponse(http.Response response) {
    dynamic responseData;
    try {
      responseData = json.decode(response.body);
    } catch (e) {
      throw Exception('Invalid response format: ${response.body}');
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return responseData;
    } else {
      throw Exception(
        responseData['message'] ??
            'Request failed with status: ${response.statusCode}',
      );
    }
  }

  // Clean order ID - remove # prefix
  String _cleanOrderId(String orderId) {
    return orderId.replaceFirst('#', '');
  }

  // ================ AUTH ENDPOINTS ================

  // Universal Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: getHeaders(),
        body: json.encode({'email': email, 'password': password}),
      );

      print('🔐 Login Response status: ${response.statusCode}');
      print('🔐 Login Response body: ${response.body}');

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        return responseData;
      } else if (response.statusCode == 401) {
        throw Exception(
          'Invalid credentials. Please check your email and password.',
        );
      } else {
        throw Exception(
          responseData['message'] ??
              responseData['error'] ??
              'Login failed with status: ${response.statusCode}',
        );
      }
    } catch (error) {
      print('❌ Login API error: $error');
      rethrow;
    }
  }

  // Vendor Login
  Future<Map<String, dynamic>> vendorLogin(
    String email,
    String password,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/vendor/login'),
      headers: getHeaders(),
      body: json.encode({'email': email, 'password': password}),
    );

    return _handleResponse(response);
  }

  // Super Admin Login
  Future<Map<String, dynamic>> superAdminLogin(
    String email,
    String password,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/superadmin/login'),
      headers: getHeaders(),
      body: json.encode({'email': email, 'password': password}),
    );

    return _handleResponse(response);
  }

  // User Registration
  Future<Map<String, dynamic>> registerUser({
    required String firstName,
    required String email,
    required String phoneNumber,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: getHeaders(),
      body: json.encode({
        'firstName': firstName,
        'email': email,
        'phoneNumber': phoneNumber,
        'password': password,
      }),
    );

    return _handleResponse(response);
  }

  // Vendor Registration
  Future<Map<String, dynamic>> registerVendor({
    required Map<String, dynamic> formData,
    required List<http.MultipartFile> files,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/vendor/register'),
      );

      formData.forEach((key, value) {
        if (value != null) {
          request.fields[key] = value.toString();
        }
      });

      for (var file in files) {
        request.files.add(file);
      }

      request.headers.addAll({'Accept': 'application/json'});

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (error) {
      throw Exception('Registration failed: $error');
    }
  }

  // Verify Token
  Future<Map<String, dynamic>> verifyToken(String token) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ PROFILE ENDPOINTS ================

  // Get User Profile
  Future<Map<String, dynamic>> getUserProfile(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/user-profile'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Update User Profile
  Future<Map<String, dynamic>> updateUserProfile({
    required String token,
    required Map<String, dynamic> data,
    String? photoPath,
  }) async {
    var request = http.MultipartRequest(
      'PUT',
      Uri.parse('$baseUrl/user-profile'),
    );

    request.headers.addAll(getHeaders(token: token));

    data.forEach((key, value) {
      if (value != null) {
        request.fields[key] = value.toString();
      }
    });

    if (photoPath != null && photoPath.isNotEmpty) {
      var file = await http.MultipartFile.fromPath('photo', photoPath);
      request.files.add(file);
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    return _handleResponse(response);
  }

  // ================ VENDOR PROFILE ENDPOINTS ================

  // Get Vendor Profile
  Future<Map<String, dynamic>> getVendorProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/vendor/profile'),
        headers: getHeaders(token: token),
      );

      print('📱 Vendor Profile status: ${response.statusCode}');
      return _handleResponse(response);
    } catch (error) {
      print('❌ Get Vendor Profile error: $error');
      rethrow;
    }
  }

  // Update Vendor Profile
  Future<Map<String, dynamic>> updateVendorProfile({
    required String token,
    required Map<String, dynamic> data,
    String? profileImagePath,
    Uint8List? profileImageBytes,
    String? profileImageName,
  }) async {
    try {
      if (kIsWeb) {
        return await _updateVendorProfileWeb(
          token: token,
          data: data,
          imageBytes: profileImageBytes,
          imageName: profileImageName,
        );
      } else {
        return await _updateVendorProfileMobile(
          token: token,
          data: data,
          imagePath: profileImagePath,
        );
      }
    } catch (error) {
      print('❌ Update Vendor Profile error: $error');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> _updateVendorProfileMobile({
    required String token,
    required Map<String, dynamic> data,
    String? imagePath,
  }) async {
    var request = http.MultipartRequest(
      'PUT',
      Uri.parse('$baseUrl/vendor/profile'),
    );

    request.headers.addAll(getHeaders(token: token));

    data.forEach((key, value) {
      if (value != null) {
        request.fields[key] = value.toString();
      }
    });

    if (imagePath != null && imagePath.isNotEmpty) {
      var file = await http.MultipartFile.fromPath('profile_image', imagePath);
      request.files.add(file);
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> _updateVendorProfileWeb({
    required String token,
    required Map<String, dynamic> data,
    Uint8List? imageBytes,
    String? imageName,
  }) async {
    try {
      if (imageBytes != null && imageName != null) {
        final base64Image = base64Encode(imageBytes);
        data['profile_image_base64'] = base64Image;
        data['profile_image_name'] = imageName;
      }

      final response = await http.put(
        Uri.parse('$baseUrl/vendor/profile'),
        headers: getHeaders(token: token),
        body: json.encode(data),
      );

      return _handleResponse(response);
    } catch (error) {
      throw Exception('Web profile update failed: $error');
    }
  }

  // ================ VENDOR DOCUMENT ENDPOINTS ================

  Future<Map<String, dynamic>> uploadVendorDocument({
    required String token,
    required String documentType,
    required String filePath,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/vendor/documents'),
      );

      request.headers.addAll(getHeaders(token: token));
      request.fields['document_type'] = documentType;

      var file = await http.MultipartFile.fromPath('document', filePath);
      request.files.add(file);

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (error) {
      throw Exception('Document upload failed: $error');
    }
  }

  Future<Map<String, dynamic>> getVendorDocuments(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/vendor/documents'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ DASHBOARD ENDPOINTS ================

  // ✅ Admin Dashboard - Complete data
  Future<Map<String, dynamic>> getAdminDashboard(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/admin/dashboard'),
        headers: getHeaders(token: token),
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'stats': responseData['stats'] ?? {},
          'recentActivity': responseData['recentActivity'] ?? [],
        };
      } else {
        throw Exception(
          responseData['message'] ?? 'Failed to load admin dashboard',
        );
      }
    } catch (error) {
      print('❌ Get Admin Dashboard error: $error');
      rethrow;
    }
  }

  // ✅ Vendor Dashboard - Complete data
  Future<Map<String, dynamic>> getVendorDashboard(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/vendor/dashboard'),
        headers: getHeaders(token: token),
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        final dashboard = responseData['dashboard'] ?? {};
        return {
          'stats': dashboard['stats'] ?? {},
          'recentOrders': dashboard['recent_orders'] ?? <dynamic>[],
          'monthlyStats': dashboard['monthly_stats'] ?? <dynamic>[],
          'success': true,
        };
      } else {
        throw Exception(
          responseData['message'] ?? 'Failed to load vendor dashboard',
        );
      }
    } catch (error) {
      print('❌ Get Vendor Dashboard error: $error');
      rethrow;
    }
  }

  // ✅ User Dashboard - Calculate from orders
  Future<Map<String, dynamic>> getUserDashboard(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/orders'),
        headers: getHeaders(token: token),
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        final orders = responseData['orders'] as List? ?? [];

        final stats = {
          'totalOrders': orders.length,
          'pendingOrders':
              orders.where((o) => o['status'] == 'Pending').length,
          'activeOrders':
              orders.where((o) => o['status'] == 'Active').length,
          'completedOrders':
              orders.where((o) => o['status'] == 'Completed').length,
          'cancelledOrders':
              orders.where((o) => o['status'] == 'Cancelled').length,
        };

        final recentActivity = orders.take(5).map((o) {
          return {
            'orderId': o['order_id'],
            'status': o['status'],
          };
        }).toList();

        return {
          'stats': stats,
          'recentActivity': recentActivity,
        };
      } else {
        throw Exception(
          responseData['message'] ?? 'Failed to load user dashboard',
        );
      }
    } catch (error) {
      print('❌ Get User Dashboard error: $error');
      rethrow;
    }
  }

  // Get Vendor Dashboard Stats (legacy)
  Future<Map<String, dynamic>> getVendorDashboardStats(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/vendor/dashboard'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ ORDER ENDPOINTS ================

  // Place Order
  Future<Map<String, dynamic>> placeOrder({
    required String token,
    required Map<String, dynamic> orderData,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/place-order'),
      headers: getHeaders(token: token),
      body: json.encode(orderData),
    );

    return _handleResponse(response);
  }

  // Get User Orders
  Future<Map<String, dynamic>> getUserOrders(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/orders'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Cancel Order
  Future<Map<String, dynamic>> cancelOrder({
    required String token,
    required String orderId,
    required String reason,
  }) async {
    final cleanId = _cleanOrderId(orderId);
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$cleanId/cancel'),
      headers: getHeaders(token: token),
      body: json.encode({'reason': reason}),
    );

    return _handleResponse(response);
  }

  // Get Order Tracking
  Future<Map<String, dynamic>> getOrderTracking({
    required String token,
    required String orderId,
  }) async {
    final cleanId = _cleanOrderId(orderId);
    final response = await http.get(
      Uri.parse('$baseUrl/orders/$cleanId/tracking'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ VENDOR ORDERS ================

  Future<Map<String, dynamic>> getVendorOrders(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/vendor/orders'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> updateOrderStatus({
    required String token,
    required String orderId,
    required String status,
    String? notes,
  }) async {
    final cleanId = _cleanOrderId(orderId);
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$cleanId/status'),
      headers: getHeaders(token: token),
      body: json.encode({
        'status': status,
        if (notes != null) 'notes': notes,
      }),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> getVendorOrderDetails({
    required String token,
    required String orderId,
  }) async {
    final cleanId = _cleanOrderId(orderId);
    final response = await http.get(
      Uri.parse('$baseUrl/vendor/orders/$cleanId'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ SERVICE ENDPOINTS ================

  Future<List<dynamic>> getAllServices() async {
    final response = await http.get(
      Uri.parse('$baseUrl/services'),
      headers: getHeaders(),
    );

    final result = json.decode(response.body);
    if (response.statusCode == 200) {
      return List<dynamic>.from(result);
    } else {
      throw Exception('Failed to load services');
    }
  }

  Future<List<dynamic>> getServicesByCategory(String category) async {
    final response = await http.get(
      Uri.parse('$baseUrl/services/$category'),
      headers: getHeaders(),
    );

    final result = json.decode(response.body);
    if (response.statusCode == 200) {
      return List<dynamic>.from(result);
    } else {
      throw Exception('Failed to load services');
    }
  }

  // ================ FORGOT PASSWORD ================

  Future<Map<String, dynamic>> forgotPassword(String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/forgot-password'),
      headers: getHeaders(),
      body: json.encode({'email': email}),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> verifyResetToken({
    required String token,
    required String email,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/verify-reset-token'),
      headers: getHeaders(),
      body: json.encode({'token': token, 'email': email}),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> resetPassword({
    required String token,
    required String email,
    required String newPassword,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/reset-password'),
      headers: getHeaders(),
      body: json.encode({
        'token': token,
        'email': email,
        'newPassword': newPassword,
      }),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> changePassword({
    required String token,
    required String currentPassword,
    required String newPassword,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/change-password'),
      headers: getHeaders(token: token),
      body: json.encode({
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      }),
    );

    return _handleResponse(response);
  }

  // ================ ADMIN ENDPOINTS ================

  Future<Map<String, dynamic>> getDashboardStats(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/admin/dashboard'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> getAllOrders(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/admin/all-orders'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> getAllUsers(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/admin/all-users'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> getAllVendors(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/admin/vendors'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> updateVendorStatus({
    required String token,
    required String vendorId,
    required String status,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/admin/vendors/$vendorId/status'),
      headers: getHeaders(token: token),
      body: json.encode({'status': status}),
    );

    return _handleResponse(response);
  }

  // ✅ Assign Vendor to Order (Admin)
  Future<Map<String, dynamic>> assignVendorToOrder({
    required String token,
    required String orderId,
    required int vendorId,
  }) async {
    final cleanId = _cleanOrderId(orderId);
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$cleanId/assign'),
      headers: getHeaders(token: token),
      body: json.encode({
        'vendor_id': vendorId,
        'status': 'Active',
      }),
    );

    return _handleResponse(response);
  }

  // ✅ Update Order Status (Admin)
  Future<Map<String, dynamic>> updateOrderStatusByAdmin({
    required String token,
    required String orderId,
    required String status,
    bool serviceStarted = false,
  }) async {
    final cleanId = _cleanOrderId(orderId);
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$cleanId/status'),
      headers: getHeaders(token: token),
      body: json.encode({
        'status': status,
        'service_started': serviceStarted,
      }),
    );

    return _handleResponse(response);
  }

  // ✅ Cancel Order (Admin)
  Future<Map<String, dynamic>> cancelOrderByAdmin({
    required String token,
    required String orderId,
    required String reason,
    double penaltyFee = 0,
  }) async {
    final cleanId = _cleanOrderId(orderId);
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$cleanId/cancel'),
      headers: getHeaders(token: token),
      body: json.encode({
        'reason': reason,
        'penaltyFee': penaltyFee,
      }),
    );

    return _handleResponse(response);
  }

  // ================ TECHNICIAN MANAGEMENT ================

  Future<Map<String, dynamic>> getVendorTechnicians(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/vendor/technicians'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> addTechnician({
    required String token,
    required Map<String, dynamic> technicianData,
    String? photoPath,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/vendor/technicians'),
      );

      request.headers.addAll(getHeaders(token: token));

      technicianData.forEach((key, value) {
        if (value != null) {
          request.fields[key] = value.toString();
        }
      });

      if (photoPath != null && photoPath.isNotEmpty) {
        var file = await http.MultipartFile.fromPath('photo', photoPath);
        request.files.add(file);
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (error) {
      throw Exception('Failed to add technician: $error');
    }
  }

  Future<Map<String, dynamic>> updateTechnicianStatus({
    required String token,
    required String technicianId,
    required String status,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/vendor/technicians/$technicianId/status'),
      headers: getHeaders(token: token),
      body: json.encode({'status': status}),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> deleteTechnician({
    required String token,
    required String technicianId,
  }) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/vendor/technicians/$technicianId'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ NOTIFICATIONS ================

  Future<Map<String, dynamic>> getNotifications(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<int> getUnreadCount(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/notifications/unread-count'),
        headers: getHeaders(token: token),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['count'] ?? 0;
      }
      return 0;
    } catch (e) {
      print('❌ Get unread count error: $e');
      return 0;
    }
  }

  Future<Map<String, dynamic>> markNotificationAsRead({
    required String token,
    required String notificationId,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/notifications/$notificationId/read'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> markAllNotificationsAsRead(String token) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/notifications/mark-all-read'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> deleteNotification({
    required String token,
    required String notificationId,
  }) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/notifications/$notificationId'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ REVIEWS & RATINGS ================

  Future<Map<String, dynamic>> getVendorReviews(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/vendor/reviews'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> replyToReview({
    required String token,
    required String reviewId,
    required String reply,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/vendor/reviews/$reviewId/reply'),
      headers: getHeaders(token: token),
      body: json.encode({'reply': reply}),
    );

    return _handleResponse(response);
  }

  // ================ UTILITY METHODS ================

  // Test API Connection
  Future<Map<String, dynamic>> testConnection() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'API is reachable'};
      } else {
        return {
          'success': false,
          'message': 'API returned ${response.statusCode}',
        };
      }
    } catch (error) {
      return {'success': false, 'message': 'API connection failed: $error'};
    }
  }

  // Clear Cache
  Future<void> clearCache() async {
    // Implement cache clearing logic if needed
  }
}