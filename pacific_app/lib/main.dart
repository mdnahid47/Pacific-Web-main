import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

// Providers
import 'providers/auth_provider.dart';

// Config
import 'config/app_colors.dart';
import 'config/env_config.dart';

// Screens
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/registration/registration_screen.dart';
import 'screens/vendor/vendor_dashboard_screen.dart';
import 'screens/technician/technician_dashboard_screen.dart';
import 'screens/vendor/buisness_overview/active_techs_screen.dart';
import 'screens/vendor/buisness_overview/pending_orders_screen.dart';
import 'screens/vendor/buisness_overview/revenue_details_screen.dart';
import 'screens/vendor/buisness_overview/total_orders_screen.dart';
import 'screens/vendor/notifications/all_notifications_screen.dart';
import 'screens/vendor/notifications/notification_details_screen.dart';
import 'screens/vendor/quick_actions/add_service_screen.dart';
import 'screens/vendor/quick_actions/complete_orders_screen.dart';
import 'screens/vendor/quick_actions/due_pay_screen.dart';
import 'screens/vendor/quick_actions/revenue_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ✅ Initialize environment
  await EnvConfig.init();

  // Debug: Print loaded environment
  debugPrint('✅ Environment initialized');
  debugPrint('🌐 API Base URL: ${EnvConfig.baseUrl}');
  debugPrint('🌐 Environment: ${EnvConfig.getEnvironment()}');
  debugPrint('🔍 Debug Mode: ${EnvConfig.isDebugEnabled()}');
  debugPrint('📝 Logging: ${EnvConfig.isLoggingEnabled()}');

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
            debugShowCheckedModeBanner: false,

            // ✅ Central theme — Olympic blue as default everywhere
            theme: _buildTheme(),

            home: _buildHome(authProvider),
            routes: _buildRoutes(),
          );
        },
      ),
    );
  }

  // ── Theme ──────────────────────────────────────────────────
  ThemeData _buildTheme() {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.olympic,
      brightness: Brightness.light,
    ).copyWith(
      primary: AppColors.olympic,
      onPrimary: Colors.white,
      secondary: AppColors.olympic,
      onSecondary: Colors.white,
      surface: Colors.white,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      primaryColor: AppColors.olympic,
      scaffoldBackgroundColor: Colors.white,

      // Typography
      fontFamily: GoogleFonts.inter().fontFamily,
      textTheme: GoogleFonts.interTextTheme(),

      // AppBar — white with dark icons, but you can flip it
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.text,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: AppColors.text),
        titleTextStyle: TextStyle(
          color: AppColors.text,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
      ),

      // Elevated button — Olympic blue by default
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.olympic,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.olympic.withValues(alpha: 0.4),
          disabledForegroundColor: Colors.white70,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Text button
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.olympic,
          textStyle: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ),

      // Outlined button
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.olympic,
          side: const BorderSide(color: AppColors.olympic, width: 1.4),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ),

      // Input fields — Olympic blue focus ring
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        hintStyle: TextStyle(
          color: AppColors.muted.withValues(alpha: 0.6),
          fontSize: 15,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.border, width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.olympic, width: 1.6),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.error, width: 1.2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.error, width: 1.6),
        ),
      ),

      // Progress indicators
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.olympic,
        linearTrackColor: AppColors.primarySoft,
      ),

      // Switch
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.olympic;
          }
          return Colors.white;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.olympic.withValues(alpha: 0.5);
          }
          return AppColors.border;
        }),
      ),

      // Checkbox
      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.olympic;
          }
          return Colors.transparent;
        }),
        side: const BorderSide(color: AppColors.border, width: 1.6),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),

      // Radio
      radioTheme: RadioThemeData(
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.olympic;
          }
          return AppColors.muted;
        }),
      ),

      // Slider
      sliderTheme: const SliderThemeData(
        activeTrackColor: AppColors.olympic,
        thumbColor: AppColors.olympic,
        inactiveTrackColor: AppColors.primarySoft,
      ),

      // SnackBar
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentTextStyle: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),

      // Divider
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
        space: 1,
      ),

      // Chip
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.primarySoft,
        selectedColor: AppColors.olympic,
        labelStyle: const TextStyle(
          color: AppColors.olympic,
          fontWeight: FontWeight.w600,
        ),
        side: BorderSide(
          color: AppColors.olympic.withValues(alpha: 0.15),
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  // ── Home ───────────────────────────────────────────────────
  Widget _buildHome(AuthProvider authProvider) {
    if (authProvider.loading) {
      return const SplashScreen();
    }

    if (authProvider.isAuthenticated) {
      final userRole = authProvider.userRole;

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

  // ── Routes ─────────────────────────────────────────────────
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