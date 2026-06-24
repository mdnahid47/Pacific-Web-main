import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pacific_app/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    print('🔄 SplashScreen initState');
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    // Wait for initial token loading to complete
    while (authProvider.loading) {
      await Future.delayed(const Duration(milliseconds: 100));
    }

    print('✅ SplashScreen - Auth check complete');
    print('   IsAuthenticated: ${authProvider.isAuthenticated}');
    print('   UserRole: ${authProvider.userRole}');

    // Navigate based on authentication status
    if (authProvider.isAuthenticated) {
      _navigateBasedOnRole(authProvider.userRole);
    } else {
      _navigateToLogin();
    }
  }

  void _navigateBasedOnRole(String? role) {
    print('🔄 SplashScreen navigating based on role: $role');

    Future.delayed(const Duration(milliseconds: 500), () {
      if (role == 'vendor') {
        Navigator.pushReplacementNamed(context, '/vendor/dashboard');
      } else if (role == 'technician') {
        Navigator.pushReplacementNamed(context, '/technician/dashboard');
      } else {
        Navigator.pushReplacementNamed(context, '/login');
      }
    });
  }

  void _navigateToLogin() {
    print('🚪 SplashScreen navigating to login');
    Future.delayed(const Duration(milliseconds: 500), () {
      Navigator.pushReplacementNamed(context, '/login');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF7C3AED),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo
            Image.asset(
              'assets/icon.png',
              width: 150,
              height: 150,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(
                  Icons.business,
                  size: 150,
                  color: Colors.white,
                );
              },
            ),
            const SizedBox(height: 30),
            // Title
            Text(
              'Pacific Service Hub',
              style: GoogleFonts.inter(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Vendor & Technician Portal',
              style: GoogleFonts.inter(fontSize: 16, color: Colors.white70),
            ),
            const SizedBox(height: 50),
            // Loading indicator
            const CircularProgressIndicator(color: Colors.white),
            const SizedBox(height: 20),
            Text(
              'Loading...',
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white70),
            ),
          ],
        ),
      ),
    );
  }
}
