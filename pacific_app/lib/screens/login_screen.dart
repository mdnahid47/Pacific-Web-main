import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import '../providers/auth_provider.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_input.dart';

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
      print('🔄 LoginScreen: Attempting login with email: $email');

      // Universal login
      final user = await authProvider.login(email, password);

      print('✅ LoginScreen: Login successful!');
      print('   User Role: ${authProvider.userRole}');
      print('   User Data: $user');

      // Success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Welcome, ${user['name'] ?? user['firstName'] ?? 'User'}!',
          ),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 2),
        ),
      );

      // ✅ Navigation based on role
      _navigateBasedOnRole(authProvider.userRole);
    } catch (error) {
      print('❌ LoginScreen error: $error');
      // ... error handling ...
    }
  }

  void _navigateBasedOnRole(String? role) {
    print('🔄 LoginScreen navigating based on role: $role');

    if (role == null) {
      print('⚠️ Role is null, staying on login screen');
      return;
    }

    // Use Navigator.pushReplacementNamed to replace login screen
    switch (role.toLowerCase()) {
      case 'vendor':
        print('🏢 Redirecting to Vendor Dashboard');
        Navigator.pushReplacementNamed(context, '/vendor/dashboard');
        break;
      case 'technician':
        print('🔧 Redirecting to Technician Dashboard');
        Navigator.pushReplacementNamed(context, '/technician/dashboard');
        break;
      case 'admin':
      case 'superadmin':
        print('👑 Redirecting to Admin Dashboard');
        Navigator.pushReplacementNamed(context, '/admin/dashboard');
        break;
      default:
        print('⚠️ Unknown role: $role, staying on login');
        // Stay on login screen for unknown roles
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

    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const SizedBox(height: 80),

              // Logo
              Image.asset('assets/icon.png', width: 120, height: 120),
              const SizedBox(height: 20),

              Text(
                'Pacific Service Hub',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF7C3AED),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Vendor & Technician Portal',
                style: Theme.of(
                  context,
                ).textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
              ),
              const SizedBox(height: 40),

              // Login Form
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    CustomInput(
                      controller: _emailController,
                      label: 'Email',
                      hintText: 'Enter your email',
                      prefixIcon: const Icon(Iconsax.sms),
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
                    const SizedBox(height: 20),
                    CustomInput(
                      controller: _passwordController,
                      label: 'Password',
                      hintText: 'Enter your password',
                      obscureText: !_showPassword,
                      prefixIcon: const Icon(Iconsax.lock),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _showPassword ? Iconsax.eye_slash : Iconsax.eye,
                        ),
                        onPressed: () {
                          setState(() {
                            _showPassword = !_showPassword;
                          });
                        },
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

                    // Error message
                    if (_loginError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 10),
                        child: Text(
                          _loginError!,
                          style: const TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      ),

                    // Forgot Password Link
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {
                          // Navigator.pushNamed(context, '/forgot-password');
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Forgot password feature coming soon!',
                              ),
                            ),
                          );
                        },
                        child: const Text(
                          'Forgot Password?',
                          style: TextStyle(fontSize: 14),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Login Button
                    CustomButton(
                      onPressed: authProvider.loading ? null : _handleLogin,
                      isLoading: authProvider.loading,
                      text: 'Login',
                      width: double.infinity,
                      height: 50,
                      backgroundColor: const Color(0xFF7C3AED),
                    ),

                    const SizedBox(height: 30),

                    // Test Credentials Section
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            const Text(
                              'Quick Login (Development Only)',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 10),
                            const Text(
                              'Click any button to auto-fill credentials:',
                              style: TextStyle(fontSize: 12),
                            ),
                            const SizedBox(height: 15),
                            Wrap(
                              spacing: 10,
                              runSpacing: 10,
                              children: [
                                ElevatedButton(
                                  onPressed: () => _fillTestCredentials(
                                    'vendor@example.com',
                                    'password123',
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.orange,
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Vendor'),
                                ),
                                ElevatedButton(
                                  onPressed: () => _fillTestCredentials(
                                    'technician@example.com',
                                    'password123',
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue,
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Technician'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 30),

                    // Register Link (Only for Vendors)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "New to Pacific Service Hub? ",
                          style: TextStyle(color: Colors.grey),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/register');
                          },
                          child: const Text(
                            'Register as Vendor',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF7C3AED),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 10),
                    const Text(
                      'Note: Technicians are added by Vendors only',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
