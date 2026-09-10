import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  static bool _initialized = false;
  
  // Fallback URLs
  static const String _fallbackDevBaseUrl = 'http://192.168.0.16:5001';
  static const String _fallbackProdBaseUrl = 'https://pacific-web-main-production.up.railway.app';
  
  static Future<void> init() async {
    if (_initialized) return;
    
    try {
      await dotenv.load(fileName: 'assets/.env');
      _initialized = true;
      debugPrint('✅ Environment loaded successfully');
      debugPrint('🌐 API Base URL: ${getBaseUrl()}');
    } catch (e) {
      debugPrint('⚠️ Could not load .env: $e');
      _initialized = true;
    }
  }
  
  static bool _hasEnvKey(String key) {
    try {
      return dotenv.isEveryDefined([key]);
    } catch (e) {
      return false;
    }
  }
  
  // ✅ Base URL WITHOUT /api (endpoints include /api)
  static String getBaseUrl() {
    try {
      if (_initialized && _hasEnvKey('API_BASE_URL')) {
        final url = dotenv.env['API_BASE_URL'];
        if (url != null && url.isNotEmpty) {
          String cleanUrl = url;
          // Remove /api suffix
          if (cleanUrl.endsWith('/api')) {
            cleanUrl = cleanUrl.substring(0, cleanUrl.length - 4);
          }
          // Remove trailing slash
          if (cleanUrl.endsWith('/')) {
            cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1);
          }
          return cleanUrl;
        }
      }
    } catch (e) {
      debugPrint('⚠️ Error reading API_BASE_URL: $e');
    }
    
    if (kReleaseMode) {
      return _fallbackProdBaseUrl;
    }
    return _fallbackDevBaseUrl;
  }
  
  static String get baseUrl => getBaseUrl();
  
  static int get connectionTimeout {
    try {
      if (_initialized && _hasEnvKey('API_TIMEOUT')) {
        final timeout = dotenv.env['API_TIMEOUT'];
        if (timeout != null && timeout.isNotEmpty) {
          return int.tryParse(timeout) ?? 30;
        }
      }
    } catch (e) {}
    return 30;
  }
  
  static int get receiveTimeout => connectionTimeout;
  static int get sendTimeout => connectionTimeout;
  
  static String getEnvironment() {
    try {
      if (_initialized && _hasEnvKey('ENVIRONMENT')) {
        final env = dotenv.env['ENVIRONMENT'];
        if (env != null && env.isNotEmpty) return env;
      }
    } catch (e) {}
    return kReleaseMode ? 'production' : 'development';
  }
  
  // ============================================================
  // ✅ AUTH ENDPOINTS
  // ============================================================
  static String get loginEndpoint => '/api/login';
  static String get registerEndpoint => '/api/register';
  static String get forgotPasswordEndpoint => '/api/forgot-password';
  static String get resetPasswordEndpoint => '/api/reset-password';
  static String get verifyResetTokenEndpoint => '/api/verify-reset-token';
  static String get verifyTokenEndpoint => '/api/auth/verify';
  static String get verifyRoleEndpoint => '/api/auth/verify-role';
  static String get superAdminRegisterEndpoint => '/api/superadmin/register';
  static String get superAdminLoginEndpoint => '/api/superadmin/login';
  
  // ============================================================
  // ✅ USER ENDPOINTS
  // ============================================================
  static String get userProfileEndpoint => '/api/user-profile';
  static String get userProfileUpdateEndpoint => '/api/user-profile';
  static String get placeOrderEndpoint => '/api/place-order';
  static String get userOrdersEndpoint => '/api/orders';
  
  // ============================================================
  // ✅ VENDOR ENDPOINTS
  // ============================================================
  static String get vendorRegisterEndpoint => '/api/vendor/register';
  static String get vendorHealthEndpoint => '/api/vendor/health';
  static String get vendorProfileEndpoint => '/api/vendor/profile';
  static String get vendorDashboardEndpoint => '/api/vendor/dashboard';
  static String get vendorOrdersEndpoint => '/api/vendor/orders';
  static String get vendorReviewsEndpoint => '/api/vendor/reviews';
  static String get vendorTechniciansEndpoint => '/api/vendor/technicians';
  static String get vendorNotificationsEndpoint => '/api/vendor/notifications';
  
  // ============================================================
  // ✅ ORDER ENDPOINTS - সব /api সহ
  // ============================================================
  static String get orderStatusEndpoint => '/api/orders/:orderId/status';
  static String get orderCancelEndpoint => '/api/orders/:orderId/cancel';
  static String get orderHoldEndpoint => '/api/orders/:orderId/hold';
  static String get orderScheduleEndpoint => '/api/orders/:orderId/schedule';
  static String get scheduleHistoryEndpoint => '/api/orders/:orderId/schedule-history';
  static String get canChangeScheduleEndpoint => '/api/orders/:orderId/can-change-schedule';
  static String get orderCompleteEndpoint => '/api/orders/:orderId/complete';
  static String get orderConfirmEndpoint => '/api/orders/:orderId/confirm';
  static String get orderAssignEndpoint => '/api/orders/:orderId/assign';
  static String get orderTrackingEndpoint => '/api/orders/:orderId/tracking';
  static String get orderReviewEndpoint => '/api/orders/:orderId/review';
  static String get orderReviewsEndpoint => '/api/orders/:orderId/reviews';
  static String get orderReportEndpoint => '/api/orders/:orderId/report';
  static String get filterOrdersEndpoint => '/api/orders/filter';
  static String get orderCancelCheckEndpoint => '/api/orders/:orderId/cancel-check';
  
  // ============================================================
  // ✅ ADMIN ENDPOINTS
  // ============================================================
  static String get adminDashboardEndpoint => '/api/admin/dashboard';
  static String get adminAllOrdersEndpoint => '/api/admin/all-orders';
  static String get adminAllUsersEndpoint => '/api/admin/all-users';
  static String get adminUserStatsEndpoint => '/api/admin/user-stats';
  static String get adminVendorsEndpoint => '/api/admin/vendors';
  static String get adminVendorDetailsEndpoint => '/api/admin/vendors/:id';
  static String get adminVendorStatusEndpoint => '/api/admin/vendors/:id/status';
  static String get adminVendorVerifyEndpoint => '/api/admin/vendors/:id/verify';
  static String get adminUserOrdersEndpoint => '/api/admin/user-orders/:userId';
  static String get adminUserEndpoint => '/api/admin/user/:id';
  static String get adminCreateEndpoint => '/api/admin/create';
  static String get adminTechniciansEndpoint => '/api/admin/technicians';
  static String get adminTechnicianStatusEndpoint => '/api/admin/technicians/:id/status';
  
  // ============================================================
  // ✅ TECHNICIAN ENDPOINTS
  // ============================================================
  static String get technicianRegisterEndpoint => '/api/technician/register';
  static String get technicianProfileEndpoint => '/api/technician/profile';
  
  // ============================================================
  // ✅ NOTIFICATION ENDPOINTS
  // ============================================================
  static String get notificationsEndpoint => '/api/notifications';
  static String get unreadCountEndpoint => '/api/notifications/unread-count';
  static String get markAllReadEndpoint => '/api/notifications/mark-all-read';
  static String get notificationReadEndpoint => '/api/notifications/:id/read';
  static String get notificationDeleteEndpoint => '/api/notifications/:id';
  
  // ============================================================
  // ✅ SERVICE ENDPOINTS
  // ============================================================
  static String get servicesEndpoint => '/api/services';
  static String get servicesByCategoryEndpoint => '/api/services/:category';
  
  // ============================================================
  // ✅ HEALTH CHECK
  // ============================================================
  static String get healthEndpoint => '/api/health';
  
  // ============================================================
  // ✅ FULL URLs
  // ============================================================
  static String get loginUrl => '${baseUrl}$loginEndpoint';
  static String get registerUrl => '${baseUrl}$registerEndpoint';
  static String get forgotPasswordUrl => '${baseUrl}$forgotPasswordEndpoint';
  static String get resetPasswordUrl => '${baseUrl}$resetPasswordEndpoint';
  static String get verifyResetTokenUrl => '${baseUrl}$verifyResetTokenEndpoint';
  
  static String get userProfileUrl => '${baseUrl}$userProfileEndpoint';
  static String get placeOrderUrl => '${baseUrl}$placeOrderEndpoint';
  static String get userOrdersUrl => '${baseUrl}$userOrdersEndpoint';
  
  static String get vendorRegisterUrl => '${baseUrl}$vendorRegisterEndpoint';
  static String get vendorHealthUrl => '${baseUrl}$vendorHealthEndpoint';
  static String get vendorProfileUrl => '${baseUrl}$vendorProfileEndpoint';
  static String get vendorDashboardUrl => '${baseUrl}$vendorDashboardEndpoint';
  static String get vendorOrdersUrl => '${baseUrl}$vendorOrdersEndpoint';
  static String get vendorReviewsUrl => '${baseUrl}$vendorReviewsEndpoint';
  static String get vendorTechniciansUrl => '${baseUrl}$vendorTechniciansEndpoint';
  
  static String get adminDashboardUrl => '${baseUrl}$adminDashboardEndpoint';
  static String get adminAllOrdersUrl => '${baseUrl}$adminAllOrdersEndpoint';
  static String get adminAllUsersUrl => '${baseUrl}$adminAllUsersEndpoint';
  static String get adminVendorsUrl => '${baseUrl}$adminVendorsEndpoint';
  
  static String get technicianRegisterUrl => '${baseUrl}$technicianRegisterEndpoint';
  static String get technicianProfileUrl => '${baseUrl}$technicianProfileEndpoint';
  
  static String get notificationsUrl => '${baseUrl}$notificationsEndpoint';
  static String get unreadCountUrl => '${baseUrl}$unreadCountEndpoint';
  static String get markAllReadUrl => '${baseUrl}$markAllReadEndpoint';
  
  static String get servicesUrl => '${baseUrl}$servicesEndpoint';
  static String get healthUrl => '${baseUrl}$healthEndpoint';
  
  // ============================================================
  // ✅ DYNAMIC URL BUILDERS (with parameters)
  // ============================================================
  
  // Order URLs
  static String orderStatusUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/status';
  
  static String orderCancelUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/cancel';
  
  static String orderHoldUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/hold';
  
  static String orderScheduleUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/schedule';
  
  static String scheduleHistoryUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/schedule-history';
  
  static String canChangeScheduleUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/can-change-schedule';
  
  static String orderCompleteUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/complete';
  
  static String orderConfirmUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/confirm';
  
  static String orderAssignUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/assign';
  
  static String orderTrackingUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/tracking';
  
  static String orderReviewUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/review';
  
  static String orderReviewsUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/reviews';
  
  static String orderReportUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/report';
  
  static String orderCancelCheckUrl(String orderId) => 
      '${baseUrl}/api/orders/${_cleanOrderId(orderId)}/cancel-check';
  
  static String vendorOrderDetailsUrl(String orderId) => 
      '${baseUrl}/api/vendor/orders/${_cleanOrderId(orderId)}';
  
  // Admin URLs
  static String adminVendorDetailsUrl(String vendorId) => 
      '${baseUrl}/api/admin/vendors/$vendorId';
  
  static String adminVendorStatusUrl(String vendorId) => 
      '${baseUrl}/api/admin/vendors/$vendorId/status';
  
  static String adminVendorVerifyUrl(String vendorId) => 
      '${baseUrl}/api/admin/vendors/$vendorId/verify';
  
  static String adminUserOrdersUrl(String userId) => 
      '${baseUrl}/api/admin/user-orders/$userId';
  
  static String adminUserUrl(String userId) => 
      '${baseUrl}/api/admin/user/$userId';
  
  static String adminTechnicianStatusUrl(String technicianId) => 
      '${baseUrl}/api/admin/technicians/$technicianId/status';
  
  // Notification URLs
  static String notificationReadUrl(String notificationId) => 
      '${baseUrl}/api/notifications/$notificationId/read';
  
  static String notificationDeleteUrl(String notificationId) => 
      '${baseUrl}/api/notifications/$notificationId';
  
  // Service URLs
  static String servicesByCategoryUrl(String category) => 
      '${baseUrl}/api/services/$category';
  
  // ============================================================
  // ✅ HELPER - Clean order ID (remove # prefix)
  // ============================================================
  static String _cleanOrderId(String orderId) {
    return orderId.replaceFirst('#', '');
  }
  
  // ============================================================
  // ✅ APP CONFIGURATION
  // ============================================================
  static String get appVersion => '1.0.0';
  
  static String get deviceType {
    if (Platform.isAndroid) return 'android';
    if (Platform.isIOS) return 'ios';
    return 'web';
  }
  
  static bool isDebugEnabled() => !kReleaseMode;
  static bool isLoggingEnabled() => !kReleaseMode;
}