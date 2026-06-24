import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  // Base URL from environment
  String get baseUrl => dotenv.env['API_BASE_URL'] ?? 'http://localhost:5001';

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
    final responseData = json.decode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return responseData;
    } else {
      throw Exception(
        responseData['message'] ??
            'Request failed with status: ${response.statusCode}',
      );
    }
  }

  // ================ AUTH ENDPOINTS ================

  // Universal Login - INSTANCE METHOD
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/login'),
        headers: getHeaders(),
        body: json.encode({'email': email, 'password': password}),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

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
      print('Login API error: $error');
      rethrow;
    }
  }

  // Vendor Login - INSTANCE METHOD
  Future<Map<String, dynamic>> vendorLogin(
    String email,
    String password,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/vendor/login'),
      headers: getHeaders(),
      body: json.encode({'email': email, 'password': password}),
    );

    return _handleResponse(response);
  }

  // Super Admin Login - INSTANCE METHOD
  Future<Map<String, dynamic>> superAdminLogin(
    String email,
    String password,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/superadmin/login'),
      headers: getHeaders(),
      body: json.encode({'email': email, 'password': password}),
    );

    return _handleResponse(response);
  }

  // User Registration - INSTANCE METHOD
  Future<Map<String, dynamic>> registerUser({
    required String firstName,
    required String email,
    required String phoneNumber,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/register'),
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

  // Vendor Registration - INSTANCE METHOD
  Future<Map<String, dynamic>> registerVendor({
    required Map<String, dynamic> formData,
    required List<http.MultipartFile> files,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/vendor/register'),
      );

      // Add form fields
      formData.forEach((key, value) {
        if (value != null) {
          request.fields[key] = value.toString();
        }
      });

      // Add files
      for (var file in files) {
        request.files.add(file);
      }

      // Add headers
      request.headers.addAll({'Accept': 'application/json'});

      // Send request
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (error) {
      throw Exception('Registration failed: $error');
    }
  }

  // Verify Token - INSTANCE METHOD
  Future<Map<String, dynamic>> verifyToken(String token) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/verify'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ PROFILE ENDPOINTS ================

  // Get User Profile - INSTANCE METHOD
  Future<Map<String, dynamic>> getUserProfile(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/user-profile'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Update User Profile - INSTANCE METHOD
  Future<Map<String, dynamic>> updateUserProfile({
    required String token,
    required Map<String, dynamic> data,
    String? photoPath,
  }) async {
    var request = http.MultipartRequest(
      'PUT',
      Uri.parse('$baseUrl/api/user-profile'),
    );

    // Add headers
    request.headers.addAll(getHeaders(token: token));

    // Add form fields
    data.forEach((key, value) {
      if (value != null) {
        request.fields[key] = value.toString();
      }
    });

    // Add photo if provided
    if (photoPath != null && photoPath.isNotEmpty) {
      var file = await http.MultipartFile.fromPath('photo', photoPath);
      request.files.add(file);
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    return _handleResponse(response);
  }

  // ================ VENDOR PROFILE ENDPOINTS ================

  // Get Vendor Profile (Complete) - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/vendor/profile'),
        headers: getHeaders(token: token),
      );

      print('Vendor Profile Response status: ${response.statusCode}');
      print('Vendor Profile Response body: ${response.body}');

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        return responseData;
      } else {
        throw Exception(
          responseData['message'] ??
              'Failed to fetch vendor profile. Status: ${response.statusCode}',
        );
      }
    } catch (error) {
      print('Get Vendor Profile error: $error');
      rethrow;
    }
  }

  // Update Vendor Profile - INSTANCE METHOD
  // Update Vendor Profile - Platform aware
  Future<Map<String, dynamic>> updateVendorProfile({
    required String token,
    required Map<String, dynamic> data,
    String? profileImagePath,
    Uint8List? profileImageBytes,
    String? profileImageName,
  }) async {
    try {
      if (kIsWeb) {
        // Web platform - use different approach
        return await _updateVendorProfileWeb(
          token: token,
          data: data,
          imageBytes: profileImageBytes,
          imageName: profileImageName,
        );
      } else {
        // Mobile/Desktop platform - use Multipart
        return await _updateVendorProfileMobile(
          token: token,
          data: data,
          imagePath: profileImagePath,
        );
      }
    } catch (error) {
      print('Update Vendor Profile error: $error');
      rethrow;
    }
  }

  // Mobile/Desktop version
  Future<Map<String, dynamic>> _updateVendorProfileMobile({
    required String token,
    required Map<String, dynamic> data,
    String? imagePath,
  }) async {
    var request = http.MultipartRequest(
      'PUT',
      Uri.parse('$baseUrl/api/vendor/profile'),
    );

    // Add headers
    request.headers.addAll(getHeaders(token: token));

    // Add form fields
    data.forEach((key, value) {
      if (value != null) {
        request.fields[key] = value.toString();
      }
    });

    // Add image if provided
    if (imagePath != null && imagePath.isNotEmpty) {
      var file = await http.MultipartFile.fromPath('profile_image', imagePath);
      request.files.add(file);
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    return _handleResponse(response);
  }

  // Web version
  Future<Map<String, dynamic>> _updateVendorProfileWeb({
    required String token,
    required Map<String, dynamic> data,
    Uint8List? imageBytes,
    String? imageName,
  }) async {
    try {
      // For web, we need to handle image upload differently
      if (imageBytes != null && imageName != null) {
        // Convert image to base64 for web
        final base64Image = base64Encode(imageBytes);
        data['profile_image_base64'] = base64Image;
        data['profile_image_name'] = imageName;
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/vendor/profile'),
        headers: getHeaders(token: token),
        body: json.encode(data),
      );

      return _handleResponse(response);
    } catch (error) {
      throw Exception('Web profile update failed: $error');
    }
  }

  // ================ VENDOR DOCUMENT ENDPOINTS ================

  // Upload Vendor Document - INSTANCE METHOD
  Future<Map<String, dynamic>> uploadVendorDocument({
    required String token,
    required String
    documentType, // 'nid_front', 'nid_back', 'cv', 'trade_license'
    required String filePath,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/vendor/documents'),
      );

      // Add headers
      request.headers.addAll(getHeaders(token: token));

      // Add document type
      request.fields['document_type'] = documentType;

      // Add file
      var file = await http.MultipartFile.fromPath('document', filePath);
      request.files.add(file);

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (error) {
      throw Exception('Document upload failed: $error');
    }
  }

  // Get Vendor Documents - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorDocuments(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/vendor/documents'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ VENDOR DASHBOARD ================

  // Get Vendor Dashboard Stats - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorDashboardStats(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/vendor/dashboard'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ ORDER ENDPOINTS ================

  // Place Order - INSTANCE METHOD
  Future<Map<String, dynamic>> placeOrder({
    required String token,
    required Map<String, dynamic> orderData,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/place-order'),
      headers: getHeaders(token: token),
      body: json.encode(orderData),
    );

    return _handleResponse(response);
  }

  // Get User Orders - INSTANCE METHOD
  Future<Map<String, dynamic>> getUserOrders(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/orders'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Cancel Order - INSTANCE METHOD
  Future<Map<String, dynamic>> cancelOrder({
    required String token,
    required String orderId,
    required String reason,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/orders/$orderId/cancel'),
      headers: getHeaders(token: token),
      body: json.encode({'reason': reason}),
    );

    return _handleResponse(response);
  }

  // Get Order Tracking - INSTANCE METHOD
  Future<Map<String, dynamic>> getOrderTracking({
    required String token,
    required String orderId,
  }) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/orders/$orderId/tracking'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ VENDOR ORDERS ================

  // Get Vendor Orders - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorOrders(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/vendor/orders'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Update Order Status (Vendor) - INSTANCE METHOD
  Future<Map<String, dynamic>> updateOrderStatus({
    required String token,
    required String orderId,
    required String status,
    String? notes,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/vendor/orders/$orderId/status'),
      headers: getHeaders(token: token),
      body: json.encode({'status': status, if (notes != null) 'notes': notes}),
    );

    return _handleResponse(response);
  }

  // Get Vendor Order Details - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorOrderDetails({
    required String token,
    required String orderId,
  }) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/vendor/orders/$orderId'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ SERVICE ENDPOINTS ================

  // Get All Services - INSTANCE METHOD
  Future<List<dynamic>> getAllServices() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/services'),
      headers: getHeaders(),
    );

    final result = json.decode(response.body);
    if (response.statusCode == 200) {
      return List<dynamic>.from(result);
    } else {
      throw Exception('Failed to load services');
    }
  }

  // Get Services by Category - INSTANCE METHOD
  Future<List<dynamic>> getServicesByCategory(String category) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/services/$category'),
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

  // Forgot Password - INSTANCE METHOD
  Future<Map<String, dynamic>> forgotPassword(String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/forgot-password'),
      headers: getHeaders(),
      body: json.encode({'email': email}),
    );

    return _handleResponse(response);
  }

  // Verify Reset Token - INSTANCE METHOD
  Future<Map<String, dynamic>> verifyResetToken({
    required String token,
    required String email,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/verify-reset-token'),
      headers: getHeaders(),
      body: json.encode({'token': token, 'email': email}),
    );

    return _handleResponse(response);
  }

  // Reset Password - INSTANCE METHOD
  Future<Map<String, dynamic>> resetPassword({
    required String token,
    required String email,
    required String newPassword,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/reset-password'),
      headers: getHeaders(),
      body: json.encode({
        'token': token,
        'email': email,
        'newPassword': newPassword,
      }),
    );

    return _handleResponse(response);
  }

  // Change Password - INSTANCE METHOD
  Future<Map<String, dynamic>> changePassword({
    required String token,
    required String currentPassword,
    required String newPassword,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/change-password'),
      headers: getHeaders(token: token),
      body: json.encode({
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      }),
    );

    return _handleResponse(response);
  }

  // ================ ADMIN ENDPOINTS ================

  // Get Dashboard Stats - INSTANCE METHOD
  Future<Map<String, dynamic>> getDashboardStats(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/admin/dashboard'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Get All Orders (Admin) - INSTANCE METHOD
  Future<Map<String, dynamic>> getAllOrders(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/admin/all-orders'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Get All Users (Admin) - INSTANCE METHOD
  Future<Map<String, dynamic>> getAllUsers(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/admin/all-users'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Get All Vendors (Admin) - INSTANCE METHOD
  Future<Map<String, dynamic>> getAllVendors(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/admin/vendors'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Update Vendor Status (Admin) - INSTANCE METHOD
  Future<Map<String, dynamic>> updateVendorStatus({
    required String token,
    required String vendorId,
    required String status,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/admin/vendors/$vendorId/status'),
      headers: getHeaders(token: token),
      body: json.encode({'status': status}),
    );

    return _handleResponse(response);
  }

  // ================ TECHNICIAN MANAGEMENT ================

  // Get Vendor Technicians - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorTechnicians(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/vendor/technicians'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Add Technician - INSTANCE METHOD
  Future<Map<String, dynamic>> addTechnician({
    required String token,
    required Map<String, dynamic> technicianData,
    String? photoPath,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/vendor/technicians'),
      );

      // Add headers
      request.headers.addAll(getHeaders(token: token));

      // Add form fields
      technicianData.forEach((key, value) {
        if (value != null) {
          request.fields[key] = value.toString();
        }
      });

      // Add photo if provided
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

  // Update Technician Status - INSTANCE METHOD
  Future<Map<String, dynamic>> updateTechnicianStatus({
    required String token,
    required String technicianId,
    required String status,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/vendor/technicians/$technicianId/status'),
      headers: getHeaders(token: token),
      body: json.encode({'status': status}),
    );

    return _handleResponse(response);
  }

  // Delete Technician - INSTANCE METHOD
  Future<Map<String, dynamic>> deleteTechnician({
    required String token,
    required String technicianId,
  }) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/vendor/technicians/$technicianId'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ NOTIFICATIONS ================

  // Get Vendor Notifications - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorNotifications(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/vendor/notifications'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Mark Notification as Read - INSTANCE METHOD
  Future<Map<String, dynamic>> markNotificationAsRead({
    required String token,
    required String notificationId,
  }) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/vendor/notifications/$notificationId/read'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // ================ REVIEWS & RATINGS ================

  // Get Vendor Reviews - INSTANCE METHOD
  Future<Map<String, dynamic>> getVendorReviews(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/vendor/reviews'),
      headers: getHeaders(token: token),
    );

    return _handleResponse(response);
  }

  // Reply to Review - INSTANCE METHOD
  Future<Map<String, dynamic>> replyToReview({
    required String token,
    required String reviewId,
    required String reply,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/vendor/reviews/$reviewId/reply'),
      headers: getHeaders(token: token),
      body: json.encode({'reply': reply}),
    );

    return _handleResponse(response);
  }

  // ================ STATIC METHODS (Alternative approach) ================

  // Static method for login (alternative)
  static Future<Map<String, dynamic>> staticLogin(
    String baseUrl,
    String email,
    String password,
  ) async {
    final apiService = ApiService();
    // Update base URL temporarily
    final originalBaseUrl = dotenv.env['API_BASE_URL'];
    dotenv.env['API_BASE_URL'] = baseUrl;

    try {
      return await apiService.login(email, password);
    } finally {
      dotenv.env['API_BASE_URL'] = originalBaseUrl!;
    }
  }

  // Static method for vendor profile (alternative)
  static Future<Map<String, dynamic>> staticGetVendorProfile(
    String baseUrl,
    String token,
  ) async {
    final apiService = ApiService();
    // Update base URL temporarily
    final originalBaseUrl = dotenv.env['API_BASE_URL'];
    dotenv.env['API_BASE_URL'] = baseUrl;

    try {
      return await apiService.getVendorProfile(token);
    } finally {
      dotenv.env['API_BASE_URL'] = originalBaseUrl!;
    }
  }

  // ================ UTILITY METHODS ================

  // Test API Connection - INSTANCE METHOD
  Future<Map<String, dynamic>> testConnection() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/health'),
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

  // Clear Cache (if needed) - INSTANCE METHOD
  Future<void> clearCache() async {
    // Implement cache clearing logic if you're using caching
  }
}
