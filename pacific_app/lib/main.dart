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
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => AuthProvider())],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          print('🔄 MyApp rebuild - Auth state:');
          print('   Loading: ${authProvider.loading}');
          print('   Authenticated: ${authProvider.isAuthenticated}');
          print('   User Role: ${authProvider.userRole}');
          print('   Token: ${authProvider.token != null ? "Exists" : "Null"}');

          return MaterialApp(
            title: 'Pacific Service Hub',
            theme: ThemeData(
              primaryColor: const Color(0xFF7C3AED),
              scaffoldBackgroundColor: Colors.white,
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFF7C3AED),
                brightness: Brightness.light,
                primary: const Color(0xFF7C3AED),
                secondary: const Color(0xFF8B5CF6),
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
            // Remove onUnknownRoute temporarily for debugging
          );
        },
      ),
    );
  }

  Widget _buildHome(AuthProvider authProvider) {
    print('🏠 _buildHome called');
    print('   Loading: ${authProvider.loading}');
    print('   IsAuthenticated: ${authProvider.isAuthenticated}');
    print('   UserRole: ${authProvider.userRole}');

    // Show splash screen only during initial token loading
    if (authProvider.loading) {
      print('🔄 Showing SplashScreen (loading...)');
      return const SplashScreen();
    }

    // Check authentication status
    if (authProvider.isAuthenticated) {
      final userRole = authProvider.userRole;
      print('✅ User is authenticated. Role: $userRole');

      // Navigate based on user role
      switch (userRole) {
        case 'technician':
          print('🔧 Redirecting to TechnicianDashboardScreen');
          return const TechnicianDashboardScreen();
        case 'vendor':
          print('🏢 Redirecting to VendorDashboardScreen');
          return const VendorDashboardScreen();
        case 'admin':
        case 'superadmin':
          print('👑 Redirecting to Admin Dashboard');
          return Scaffold(
            appBar: AppBar(title: const Text('Admin Dashboard')),
            body: const Center(child: Text('Admin Dashboard')),
          );
        case 'user':
          print('👤 Redirecting to User Dashboard');
          return Scaffold(
            appBar: AppBar(title: const Text('User Dashboard')),
            body: const Center(child: Text('User Dashboard')),
          );
        default:
          print('⚠️ Unknown role: $userRole, redirecting to login');
          return const LoginScreen();
      }
    }

    print('🚪 User not authenticated, showing LoginScreen');
    return const LoginScreen();
  }

  Map<String, WidgetBuilder> _buildRoutes() {
    return {
      // 🔐 Authentication
      '/login': (context) => const LoginScreen(),
      '/splash': (context) => const SplashScreen(),

      // 👤 Registration (Only Vendor)
      '/register': (context) => const RegistrationScreen(),

      '/vendor/dashboard': (context) => const VendorDashboardScreen(),

      // Business Overview রাউট
      '/vendor/total-orders': (context) => const TotalOrdersScreen(),
      '/vendor/active-techs': (context) => const ActiveTechsScreen(),
      '/vendor/pending-orders': (context) => const PendingOrdersScreen(),
      '/vendor/revenue-details': (context) => const RevenueDetailsScreen(),

      // Quick Actions রাউট
      '/vendor/revenue': (context) => const RevenueScreen(),
      '/vendor/due-pay': (context) => const DuePayScreen(),
      '/vendor/add-service': (context) => const AddServiceScreen(),
      '/vendor/complete-orders': (context) => const CompleteOrdersScreen(),

      // Notifications রাউট
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

      // 🔧 Technician Routes
      '/technician/dashboard': (context) => const TechnicianDashboardScreen(),
    };
  }
}
