import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import '../providers/auth_provider.dart';
import '../widgets/custom_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _showPassword = false;
  String? _loginError;

  @override
  void initState() {
    super.initState();
    // For development
    _emailController.text = 'vendor@example.com';
    _passwordController.text = 'password123';
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loginError = null;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    try {
      debugPrint('🔄 LoginScreen: Attempting login with email: $email');

      final user = await authProvider.login(email, password);

      debugPrint('✅ LoginScreen: Login successful!');
      debugPrint('   User Role: ${authProvider.userRole}');
      debugPrint('   User Data: $user');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Welcome, ${user['name'] ?? user['firstName'] ?? 'User'}!',
            ),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
          ),
        );
        _navigateBasedOnRole(authProvider.userRole);
      }
    } catch (error) {
      debugPrint('❌ LoginScreen error: $error');
      if (mounted) {
        setState(() {
          _loginError = error.toString().replaceAll('Exception: ', '');
        });
      }
    }
  }

  void _navigateBasedOnRole(String? role) {
    debugPrint('🔄 LoginScreen navigating based on role: $role');

    if (role == null) {
      debugPrint('⚠️ Role is null, staying on login screen');
      return;
    }

    switch (role.toLowerCase()) {
      case 'vendor':
        debugPrint('🏢 Redirecting to Vendor Dashboard');
        Navigator.pushReplacementNamed(context, '/vendor/dashboard');
        break;
      case 'technician':
        debugPrint('🔧 Redirecting to Technician Dashboard');
        Navigator.pushReplacementNamed(context, '/technician/dashboard');
        break;
      case 'admin':
      case 'superadmin':
        debugPrint('👑 Redirecting to Admin Dashboard');
        Navigator.pushReplacementNamed(context, '/admin/dashboard');
        break;
      default:
        debugPrint('⚠️ Unknown role: $role, staying on login');
        break;
    }
  }

  void _fillTestCredentials(String email, String password) {
    setState(() {
      _emailController.text = email;
      _passwordController.text = password;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(0xFF3B82F6).withValues(alpha: 0.05),
              const Color(0xFF3B82F6).withValues(alpha: 0.02),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: 24,
                vertical: size.height * 0.06,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Header Section
                  Center(
                    child: Column(
                      children: [
                        // Logo Container with Gradient
                        Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                const Color(0xFF3B82F6),
                                const Color(0xFF60A5FA),
                              ],
                            ),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF3B82F6).withValues(alpha: 0.3),
                                blurRadius: 30,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Image.asset(
                              'assets/icon.png',
                              width: 60,
                              height: 60,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        
                        Text(
                          'Welcome Back!',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF1E293B),
                            fontSize: 28,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Sign in to continue to your account',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.grey[600],
                            fontSize: 16,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Login Form
                  Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Email Field
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Email Address',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.04),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: TextFormField(
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Color(0xFF1E293B),
                                ),
                                decoration: InputDecoration(
                                  hintText: 'Enter your email address',
                                  hintStyle: TextStyle(
                                    color: Colors.grey[400],
                                    fontSize: 15,
                                  ),
                                  prefixIcon: Icon(
                                    Iconsax.sms,
                                    color: const Color(0xFF3B82F6),
                                    size: 22,
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(16),
                                    borderSide: BorderSide.none,
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[50],
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 20,
                                    vertical: 16,
                                  ),
                                ),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter your email';
                                  }
                                  if (!RegExp(
                                    r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                                  ).hasMatch(value)) {
                                    return 'Please enter a valid email';
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        // Password Field
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Password',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF1E293B),
                                  ),
                                ),
                                TextButton(
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                          'Forgot password feature coming soon!',
                                        ),
                                      ),
                                    );
                                  },
                                  child: Text(
                                    'Forgot Password?',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                      color: const Color(0xFF3B82F6),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.04),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: TextFormField(
                                controller: _passwordController,
                                obscureText: !_showPassword,
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Color(0xFF1E293B),
                                ),
                                decoration: InputDecoration(
                                  hintText: 'Enter your password',
                                  hintStyle: TextStyle(
                                    color: Colors.grey[400],
                                    fontSize: 15,
                                  ),
                                  prefixIcon: Icon(
                                    Iconsax.lock,
                                    color: const Color(0xFF3B82F6),
                                    size: 22,
                                  ),
                                  suffixIcon: IconButton(
                                    icon: Icon(
                                      _showPassword 
                                          ? Iconsax.eye_slash 
                                          : Iconsax.eye,
                                      color: Colors.grey[500],
                                      size: 20,
                                    ),
                                    onPressed: () {
                                      setState(() {
                                        _showPassword = !_showPassword;
                                      });
                                    },
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(16),
                                    borderSide: BorderSide.none,
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[50],
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 20,
                                    vertical: 16,
                                  ),
                                ),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter your password';
                                  }
                                  if (value.length < 6) {
                                    return 'Password must be at least 6 characters';
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),

                        // Error Message
                        if (_loginError != null) ...[
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: Colors.red.withValues(alpha: 0.2),
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Iconsax.warning_2,
                                  color: Colors.red[400],
                                  size: 18,
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    _loginError!,
                                    style: TextStyle(
                                      color: Colors.red[700],
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],

                        const SizedBox(height: 30),

                        // Login Button
                        CustomButton(
                          onPressed: authProvider.loading ? null : _handleLogin,
                          isLoading: authProvider.loading,
                          text: 'Sign In',
                          width: double.infinity,
                          height: 56,
                          backgroundColor: const Color(0xFF3B82F6),
                        ),

                        const SizedBox(height: 30),

                        // Divider
                        Row(
                          children: [
                            Expanded(
                              child: Divider(
                                color: Colors.grey[200],
                                thickness: 1,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: Text(
                                'Quick Login',
                                style: TextStyle(
                                  color: Colors.grey[500],
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            Expanded(
                              child: Divider(
                                color: Colors.grey[200],
                                thickness: 1,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        // Quick Login Buttons
                        Row(
                          children: [
                            Expanded(
                              child: _buildQuickLoginButton(
                                label: 'Vendor',
                                email: 'vendor@example.com',
                                password: 'password123',
                                color: const Color(0xFF3B82F6),
                                icon: Iconsax.building,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _buildQuickLoginButton(
                                label: 'Technician',
                                email: 'technician@example.com',
                                password: 'password123',
                                color: const Color(0xFF3B82F6),
                                icon: Iconsax.user,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 30),

                        // Register Link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Don't have an account? ",
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 15,
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(context, '/register');
                              },
                              child: Text(
                                'Register as Vendor',
                                style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  color: const Color(0xFF3B82F6),
                                  fontSize: 15,
                                ),
                              ),
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 12),
                        
                        // Note
                        Center(
                          child: Text(
                            'Technicians are added by Vendors only',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[400],
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickLoginButton({
    required String label,
    required String email,
    required String password,
    required Color color,
    required IconData icon,
  }) {
    return InkWell(
      onTap: () => _fillTestCredentials(email, password),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              color,
              color.withValues(alpha: 0.8),
            ],
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.3),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: Colors.white,
              size: 18,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}