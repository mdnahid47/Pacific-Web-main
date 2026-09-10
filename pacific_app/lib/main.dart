import 'package:flutter/material.dart';
import 'package:pacific_app/screens/vendor/buisness_overview/active_techs_screen.dart';
import 'package:pacific_app/screens/vendor/buisness_overview/pending_orders_screen.dart';
import 'package:pacific_app/screens/vendor/buisness_overview/revenue_details_screen.dart';
import 'package:pacific_app/screens/vendor/buisness_overview/total_orders_screen.dart';
import 'package:pacific_app/screens/vendor/notifications/all_notifications_screen.dart';
import 'package:pacific_app/screens/vendor/notifications/notification_details_screen.dart';
import 'package:pacific_app/screens/vendor/quick_actions/add_service_screen.dart';
import 'package:pacific_app/screens/vendor/quick_actions/complete_orders_screen.dart';
import 'package:pacific_app/screens/vendor/quick_actions/due_pay_screen.dart';
import 'package:pacific_app/screens/vendor/quick_actions/revenue_screen.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/vendor/vendor_dashboard_screen.dart';
import 'screens/technician/technician_dashboard_screen.dart';
import 'screens/registration_screen.dart';
import 'config/env_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // ✅ Initialize environment
  await EnvConfig.init();
  
  // Debug: Print loaded environment
  print('✅ Environment initialized');
  print('🌐 API Base URL: ${EnvConfig.baseUrl}');
  print('🌐 Environment: ${EnvConfig.getEnvironment()}');
  print('🔍 Debug Mode: ${EnvConfig.isDebugEnabled()}');
  print('📝 Logging: ${EnvConfig.isLoggingEnabled()}');
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          return MaterialApp(
            title: 'Pacific Service Hub',
            theme: ThemeData(
              primaryColor: const Color(0xFF3B82F6),
              scaffoldBackgroundColor: Colors.white,
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFF3B82F6),
                brightness: Brightness.light,
                primary: const Color(0xFF3B82F6),
                secondary: const Color(0xFF3B82F6),
              ),
              fontFamily: GoogleFonts.inter().fontFamily,
              textTheme: GoogleFonts.interTextTheme(),
              appBarTheme: const AppBarTheme(
                backgroundColor: Colors.white,
                elevation: 0,
                centerTitle: true,
                iconTheme: IconThemeData(color: Colors.black),
              ),
              useMaterial3: true,
            ),
            debugShowCheckedModeBanner: false,
            home: _buildHome(authProvider),
            routes: _buildRoutes(),
          );
        },
      ),
    );
  }

  Widget _buildHome(AuthProvider authProvider) {
    // Show splash screen only during initial token loading
    if (authProvider.loading) {
      return const SplashScreen();
    }

    // Check authentication status
    if (authProvider.isAuthenticated) {
      final userRole = authProvider.userRole;

      // Navigate based on user role
      switch (userRole) {
        case 'technician':
          return const TechnicianDashboardScreen();
        case 'vendor':
          return const VendorDashboardScreen();
        case 'admin':
        case 'superadmin':
          return Scaffold(
            appBar: AppBar(title: const Text('Admin Dashboard')),
            body: const Center(child: Text('Admin Dashboard')),
          );
        case 'user':
          return Scaffold(
            appBar: AppBar(title: const Text('User Dashboard')),
            body: const Center(child: Text('User Dashboard')),
          );
        default:
          return const LoginScreen();
      }
    }

    return const LoginScreen();
  }

  Map<String, WidgetBuilder> _buildRoutes() {
    return {
      '/login': (context) => const LoginScreen(),
      '/splash': (context) => const SplashScreen(),
      '/register': (context) => const RegistrationScreen(),
      '/vendor/dashboard': (context) => const VendorDashboardScreen(),
      '/vendor/total-orders': (context) => const TotalOrdersScreen(),
      '/vendor/active-techs': (context) => const ActiveTechsScreen(),
      '/vendor/pending-orders': (context) => const PendingOrdersScreen(),
      '/vendor/revenue-details': (context) => const RevenueDetailsScreen(),
      '/vendor/revenue': (context) => const RevenueScreen(),
      '/vendor/due-pay': (context) => const DuePayScreen(),
      '/vendor/add-service': (context) => const AddServiceScreen(),
      '/vendor/complete-orders': (context) => const CompleteOrdersScreen(),
      '/vendor/notification-details': (context) {
        final args = ModalRoute.of(context)!.settings.arguments as Map;
        return NotificationDetailsScreen(
          notificationId: args['id'],
          title: args['title'],
          subtitle: args['subtitle'],
          time: args['time'],
        );
      },
      '/vendor/all-notifications': (context) => const AllNotificationsScreen(),
      '/technician/dashboard': (context) => const TechnicianDashboardScreen(),
    };
  }
}