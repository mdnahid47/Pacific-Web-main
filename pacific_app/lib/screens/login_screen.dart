// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:iconsax/iconsax.dart';
// import '../providers/auth_provider.dart';
// import '../widgets/custom_button.dart';

// class LoginScreen extends StatefulWidget {
//   const LoginScreen({super.key});

//   @override
//   State<LoginScreen> createState() => _LoginScreenState();
// }

// class _LoginScreenState extends State<LoginScreen> {
//   final TextEditingController _emailController = TextEditingController();
//   final TextEditingController _passwordController = TextEditingController();
//   final _formKey = GlobalKey<FormState>();
//   bool _showPassword = false;
//   String? _loginError;

//   @override
//   void initState() {
//     super.initState();
//     // For development
//     _emailController.text = 'vendor@example.com';
//     _passwordController.text = 'password123';
//   }

//   Future<void> _handleLogin() async {
//     if (!_formKey.currentState!.validate()) return;

//     setState(() {
//       _loginError = null;
//     });

//     final authProvider = Provider.of<AuthProvider>(context, listen: false);
//     final email = _emailController.text.trim();
//     final password = _passwordController.text.trim();

//     try {
//       debugPrint('🔄 LoginScreen: Attempting login with email: $email');

//       final user = await authProvider.login(email, password);

//       debugPrint('✅ LoginScreen: Login successful!');
//       debugPrint('   User Role: ${authProvider.userRole}');
//       debugPrint('   User Data: $user');

//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//             content: Text(
//               'Welcome, ${user['name'] ?? user['firstName'] ?? 'User'}!',
//             ),
//             backgroundColor: Colors.green,
//             duration: const Duration(seconds: 2),
//           ),
//         );
//         _navigateBasedOnRole(authProvider.userRole);
//       }
//     } catch (error) {
//       debugPrint('❌ LoginScreen error: $error');
//       if (mounted) {
//         setState(() {
//           _loginError = error.toString().replaceAll('Exception: ', '');
//         });
//       }
//     }
//   }

//   void _navigateBasedOnRole(String? role) {
//     debugPrint('🔄 LoginScreen navigating based on role: $role');

//     if (role == null) {
//       debugPrint('⚠️ Role is null, staying on login screen');
//       return;
//     }

//     switch (role.toLowerCase()) {
//       case 'vendor':
//         debugPrint('🏢 Redirecting to Vendor Dashboard');
//         Navigator.pushReplacementNamed(context, '/vendor/dashboard');
//         break;
//       case 'technician':
//         debugPrint('🔧 Redirecting to Technician Dashboard');
//         Navigator.pushReplacementNamed(context, '/technician/dashboard');
//         break;
//       case 'admin':
//       case 'superadmin':
//         debugPrint('👑 Redirecting to Admin Dashboard');
//         Navigator.pushReplacementNamed(context, '/admin/dashboard');
//         break;
//       default:
//         debugPrint('⚠️ Unknown role: $role, staying on login');
//         break;
//     }
//   }

//   void _fillTestCredentials(String email, String password) {
//     setState(() {
//       _emailController.text = email;
//       _passwordController.text = password;
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     final authProvider = Provider.of<AuthProvider>(context);
//     final size = MediaQuery.of(context).size;

//     return Scaffold(
//       body: Container(
//         decoration: BoxDecoration(
//           gradient: LinearGradient(
//             begin: Alignment.topLeft,
//             end: Alignment.bottomRight,
//             colors: [
//               const Color(0xFF3B82F6).withValues(alpha: 0.05),
//               const Color(0xFF3B82F6).withValues(alpha: 0.02),
//               Colors.white,
//             ],
//           ),
//         ),
//         child: SafeArea(
//           child: SingleChildScrollView(
//             child: Padding(
//               padding: EdgeInsets.symmetric(
//                 horizontal: 24,
//                 vertical: size.height * 0.06,
//               ),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.center,
//                 children: [
//                   // Header Section
//                   Center(
//                     child: Column(
//                       children: [
//                         // Logo Container with Gradient
//                         Container(
//                           width: 100,
//                           height: 100,
//                           decoration: BoxDecoration(
//                             gradient: LinearGradient(
//                               begin: Alignment.topLeft,
//                               end: Alignment.bottomRight,
//                               colors: [
//                                 const Color(0xFF3B82F6),
//                                 const Color(0xFF60A5FA),
//                               ],
//                             ),
//                             shape: BoxShape.circle,
//                             boxShadow: [
//                               BoxShadow(
//                                 color: const Color(0xFF3B82F6).withValues(alpha: 0.3),
//                                 blurRadius: 30,
//                                 offset: const Offset(0, 10),
//                               ),
//                             ],
//                           ),
//                           child: Center(
//                             child: Image.asset(
//                               'assets/icon.png',
//                               width: 60,
//                               height: 60,
//                               color: Colors.white,
//                             ),
//                           ),
//                         ),
//                         const SizedBox(height: 24),
                        
//                         Text(
//                           'Welcome Back!',
//                           style: Theme.of(context).textTheme.headlineMedium?.copyWith(
//                             fontWeight: FontWeight.w800,
//                             color: const Color(0xFF1E293B),
//                             fontSize: 28,
//                             letterSpacing: -0.5,
//                           ),
//                         ),
//                         const SizedBox(height: 8),
//                         Text(
//                           'Sign in to continue to your account',
//                           style: Theme.of(context).textTheme.bodyLarge?.copyWith(
//                             color: Colors.grey[600],
//                             fontSize: 16,
//                             fontWeight: FontWeight.w400,
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),

//                   const SizedBox(height: 40),

//                   // Login Form
//                   Form(
//                     key: _formKey,
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         // Email Field
//                         Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               'Email Address',
//                               style: TextStyle(
//                                 fontSize: 14,
//                                 fontWeight: FontWeight.w600,
//                                 color: const Color(0xFF1E293B),
//                               ),
//                             ),
//                             const SizedBox(height: 8),
//                             Container(
//                               decoration: BoxDecoration(
//                                 color: Colors.white,
//                                 borderRadius: BorderRadius.circular(16),
//                                 boxShadow: [
//                                   BoxShadow(
//                                     color: Colors.black.withValues(alpha: 0.04),
//                                     blurRadius: 10,
//                                     offset: const Offset(0, 4),
//                                   ),
//                                 ],
//                               ),
//                               child: TextFormField(
//                                 controller: _emailController,
//                                 keyboardType: TextInputType.emailAddress,
//                                 style: const TextStyle(
//                                   fontSize: 16,
//                                   color: Color(0xFF1E293B),
//                                 ),
//                                 decoration: InputDecoration(
//                                   hintText: 'Enter your email address',
//                                   hintStyle: TextStyle(
//                                     color: Colors.grey[400],
//                                     fontSize: 15,
//                                   ),
//                                   prefixIcon: Icon(
//                                     Iconsax.sms,
//                                     color: const Color(0xFF3B82F6),
//                                     size: 22,
//                                   ),
//                                   border: OutlineInputBorder(
//                                     borderRadius: BorderRadius.circular(16),
//                                     borderSide: BorderSide.none,
//                                   ),
//                                   filled: true,
//                                   fillColor: Colors.grey[50],
//                                   contentPadding: const EdgeInsets.symmetric(
//                                     horizontal: 20,
//                                     vertical: 16,
//                                   ),
//                                 ),
//                                 validator: (value) {
//                                   if (value == null || value.isEmpty) {
//                                     return 'Please enter your email';
//                                   }
//                                   if (!RegExp(
//                                     r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
//                                   ).hasMatch(value)) {
//                                     return 'Please enter a valid email';
//                                   }
//                                   return null;
//                                 },
//                               ),
//                             ),
//                           ],
//                         ),

//                         const SizedBox(height: 20),

//                         // Password Field
//                         Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Row(
//                               mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                               children: [
//                                 Text(
//                                   'Password',
//                                   style: TextStyle(
//                                     fontSize: 14,
//                                     fontWeight: FontWeight.w600,
//                                     color: const Color(0xFF1E293B),
//                                   ),
//                                 ),
//                                 TextButton(
//                                   onPressed: () {
//                                     ScaffoldMessenger.of(context).showSnackBar(
//                                       const SnackBar(
//                                         content: Text(
//                                           'Forgot password feature coming soon!',
//                                         ),
//                                       ),
//                                     );
//                                   },
//                                   child: Text(
//                                     'Forgot Password?',
//                                     style: TextStyle(
//                                       fontSize: 13,
//                                       fontWeight: FontWeight.w500,
//                                       color: const Color(0xFF3B82F6),
//                                     ),
//                                   ),
//                                 ),
//                               ],
//                             ),
//                             const SizedBox(height: 8),
//                             Container(
//                               decoration: BoxDecoration(
//                                 color: Colors.white,
//                                 borderRadius: BorderRadius.circular(16),
//                                 boxShadow: [
//                                   BoxShadow(
//                                     color: Colors.black.withValues(alpha: 0.04),
//                                     blurRadius: 10,
//                                     offset: const Offset(0, 4),
//                                   ),
//                                 ],
//                               ),
//                               child: TextFormField(
//                                 controller: _passwordController,
//                                 obscureText: !_showPassword,
//                                 style: const TextStyle(
//                                   fontSize: 16,
//                                   color: Color(0xFF1E293B),
//                                 ),
//                                 decoration: InputDecoration(
//                                   hintText: 'Enter your password',
//                                   hintStyle: TextStyle(
//                                     color: Colors.grey[400],
//                                     fontSize: 15,
//                                   ),
//                                   prefixIcon: Icon(
//                                     Iconsax.lock,
//                                     color: const Color(0xFF3B82F6),
//                                     size: 22,
//                                   ),
//                                   suffixIcon: IconButton(
//                                     icon: Icon(
//                                       _showPassword 
//                                           ? Iconsax.eye_slash 
//                                           : Iconsax.eye,
//                                       color: Colors.grey[500],
//                                       size: 20,
//                                     ),
//                                     onPressed: () {
//                                       setState(() {
//                                         _showPassword = !_showPassword;
//                                       });
//                                     },
//                                   ),
//                                   border: OutlineInputBorder(
//                                     borderRadius: BorderRadius.circular(16),
//                                     borderSide: BorderSide.none,
//                                   ),
//                                   filled: true,
//                                   fillColor: Colors.grey[50],
//                                   contentPadding: const EdgeInsets.symmetric(
//                                     horizontal: 20,
//                                     vertical: 16,
//                                   ),
//                                 ),
//                                 validator: (value) {
//                                   if (value == null || value.isEmpty) {
//                                     return 'Please enter your password';
//                                   }
//                                   if (value.length < 6) {
//                                     return 'Password must be at least 6 characters';
//                                   }
//                                   return null;
//                                 },
//                               ),
//                             ),
//                           ],
//                         ),

//                         // Error Message
//                         if (_loginError != null) ...[
//                           const SizedBox(height: 12),
//                           Container(
//                             padding: const EdgeInsets.all(12),
//                             decoration: BoxDecoration(
//                               color: Colors.red.withValues(alpha: 0.05),
//                               borderRadius: BorderRadius.circular(12),
//                               border: Border.all(
//                                 color: Colors.red.withValues(alpha: 0.2),
//                               ),
//                             ),
//                             child: Row(
//                               children: [
//                                 Icon(
//                                   Iconsax.warning_2,
//                                   color: Colors.red[400],
//                                   size: 18,
//                                 ),
//                                 const SizedBox(width: 10),
//                                 Expanded(
//                                   child: Text(
//                                     _loginError!,
//                                     style: TextStyle(
//                                       color: Colors.red[700],
//                                       fontSize: 13,
//                                       fontWeight: FontWeight.w500,
//                                     ),
//                                   ),
//                                 ),
//                               ],
//                             ),
//                           ),
//                         ],

//                         const SizedBox(height: 30),

//                         // Login Button
//                         CustomButton(
//                           onPressed: authProvider.loading ? null : _handleLogin,
//                           isLoading: authProvider.loading,
//                           text: 'Sign In',
//                           width: double.infinity,
//                           height: 56,
//                           backgroundColor: const Color(0xFF3B82F6),
//                         ),

//                         const SizedBox(height: 30),

//                         // Divider
//                         Row(
//                           children: [
//                             Expanded(
//                               child: Divider(
//                                 color: Colors.grey[200],
//                                 thickness: 1,
//                               ),
//                             ),
//                             Padding(
//                               padding: const EdgeInsets.symmetric(horizontal: 16),
//                               child: Text(
//                                 'Quick Login',
//                                 style: TextStyle(
//                                   color: Colors.grey[500],
//                                   fontSize: 12,
//                                   fontWeight: FontWeight.w500,
//                                 ),
//                               ),
//                             ),
//                             Expanded(
//                               child: Divider(
//                                 color: Colors.grey[200],
//                                 thickness: 1,
//                               ),
//                             ),
//                           ],
//                         ),

//                         const SizedBox(height: 20),

//                         // Quick Login Buttons
//                         Row(
//                           children: [
//                             Expanded(
//                               child: _buildQuickLoginButton(
//                                 label: 'Vendor',
//                                 email: 'vendor@example.com',
//                                 password: 'password123',
//                                 color: const Color(0xFF3B82F6),
//                                 icon: Iconsax.building,
//                               ),
//                             ),
//                             const SizedBox(width: 12),
//                             Expanded(
//                               child: _buildQuickLoginButton(
//                                 label: 'Technician',
//                                 email: 'technician@example.com',
//                                 password: 'password123',
//                                 color: const Color(0xFF3B82F6),
//                                 icon: Iconsax.user,
//                               ),
//                             ),
//                           ],
//                         ),

//                         const SizedBox(height: 30),

//                         // Register Link
//                         Row(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Text(
//                               "Don't have an account? ",
//                               style: TextStyle(
//                                 color: Colors.grey[600],
//                                 fontSize: 15,
//                               ),
//                             ),
//                             GestureDetector(
//                               onTap: () {
//                                 Navigator.pushNamed(context, '/register');
//                               },
//                               child: Text(
//                                 'Register as Vendor',
//                                 style: TextStyle(
//                                   fontWeight: FontWeight.w700,
//                                   color: const Color(0xFF3B82F6),
//                                   fontSize: 15,
//                                 ),
//                               ),
//                             ),
//                           ],
//                         ),
                        
//                         const SizedBox(height: 12),
                        
//                         // Note
//                         Center(
//                           child: Text(
//                             'Technicians are added by Vendors only',
//                             style: TextStyle(
//                               fontSize: 12,
//                               color: Colors.grey[400],
//                               fontStyle: FontStyle.italic,
//                             ),
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildQuickLoginButton({
//     required String label,
//     required String email,
//     required String password,
//     required Color color,
//     required IconData icon,
//   }) {
//     return InkWell(
//       onTap: () => _fillTestCredentials(email, password),
//       borderRadius: BorderRadius.circular(12),
//       child: Container(
//         padding: const EdgeInsets.symmetric(vertical: 14),
//         decoration: BoxDecoration(
//           gradient: LinearGradient(
//             begin: Alignment.topLeft,
//             end: Alignment.bottomRight,
//             colors: [
//               color,
//               color.withValues(alpha: 0.8),
//             ],
//           ),
//           borderRadius: BorderRadius.circular(12),
//           boxShadow: [
//             BoxShadow(
//               color: color.withValues(alpha: 0.3),
//               blurRadius: 15,
//               offset: const Offset(0, 4),
//             ),
//           ],
//         ),
//         child: Row(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Icon(
//               icon,
//               color: Colors.white,
//               size: 18,
//             ),
//             const SizedBox(width: 8),
//             Text(
//               label,
//               style: const TextStyle(
//                 color: Colors.white,
//                 fontWeight: FontWeight.w600,
//                 fontSize: 14,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import '../providers/auth_provider.dart';
import '../widgets/custom_button.dart';
import '../config/app_colors.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _passwordFocus = FocusNode();
  final _formKey = GlobalKey<FormState>();

  bool _showPassword = false;
  String? _loginError;

  // ── Palette (Olympic blue via AppColors) ───────────────────
  static const _primary = AppColors.olympic;
  static const _primaryLight = AppColors.primaryLight;
  static const _text = AppColors.text;
  static const _muted = AppColors.muted;
  static const _border = AppColors.border;
  static const _surface = AppColors.surface;
  static const _error = AppColors.error;
  static const _success = AppColors.success;

  @override
  void initState() {
    super.initState();
    // Fields start empty — hints only.
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loginError = null);

    final auth = Provider.of<AuthProvider>(context, listen: false);

    try {
      final user = await auth.login(
        _emailController.text.trim(),
        _passwordController.text.trim(),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Welcome, ${user['name'] ?? user['firstName'] ?? 'User'}!',
          ),
          backgroundColor: _success,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          duration: const Duration(seconds: 2),
        ),
      );

      _navigateBasedOnRole(auth.userRole);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loginError = e.toString().replaceAll('Exception: ', '');
      });
    }
  }

  void _navigateBasedOnRole(String? role) {
    if (role == null) return;
    switch (role.toLowerCase()) {
      case 'vendor':
        Navigator.pushReplacementNamed(context, '/vendor/dashboard');
        break;
      case 'technician':
        Navigator.pushReplacementNamed(context, '/technician/dashboard');
        break;
      case 'admin':
      case 'superadmin':
        Navigator.pushReplacementNamed(context, '/admin/dashboard');
        break;
    }
  }

  void _quickFill(String email, String password) {
    setState(() {
      _emailController.text = email;
      _passwordController.text = password;
      _loginError = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight - 56,
                ),
                child: IntrinsicHeight(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const SizedBox(height: 16),
                      _header(),
                      const SizedBox(height: 40),
                      _form(auth),
                      const SizedBox(height: 28),
                      _quickLogin(),
                      const SizedBox(height: 32),
                      _footer(),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ── Header ────────────────────────────────────────────────
  Widget _header() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              // ✅ Olympic blue gradient
              colors: [_primary, _primaryLight],
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: _primary.withValues(alpha: 0.30),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Center(
            child: Image.asset(
              'assets/icon.png',
              width: 36,
              height: 36,
              color: Colors.white,
              errorBuilder: (_, _, _) => const Icon(
                Iconsax.box,
                color: Colors.white,
                size: 30,
              ),
            ),
          ),
        ),
        const SizedBox(height: 28),
        const Text(
          'Welcome back 👋',
          style: TextStyle(
            fontSize: 30,
            fontWeight: FontWeight.w800,
            color: _text,
            letterSpacing: -0.9,
            height: 1.1,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          "Let's get you signed in.",
          style: TextStyle(
            fontSize: 16,
            color: _muted,
            fontWeight: FontWeight.w400,
            height: 1.4,
          ),
        ),
      ],
    );
  }

  // ── Form ──────────────────────────────────────────────────
  Widget _form(AuthProvider auth) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _label('Email'),
          const SizedBox(height: 8),
          _input(
            controller: _emailController,
            hint: 'you@example.com',
            icon: Iconsax.sms,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            onSubmitted: (_) => _passwordFocus.requestFocus(),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Enter your email';
              if (!RegExp(r'^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$')
                  .hasMatch(v.trim())) {
                return 'Enter a valid email address';
              }
              return null;
            },
          ),
          const SizedBox(height: 18),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _label('Password'),
              GestureDetector(
                onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Password reset coming soon'),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                child: const Padding(
                  padding: EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    'Forgot?',
                    style: TextStyle(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w600,
                      color: _primary,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          _input(
            controller: _passwordController,
            focusNode: _passwordFocus,
            hint: 'Enter your password',
            icon: Iconsax.lock,
            obscureText: !_showPassword,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _handleLogin(),
            suffix: IconButton(
              splashRadius: 20,
              tooltip: _showPassword ? 'Hide password' : 'Show password',
              icon: Icon(
                _showPassword ? Iconsax.eye_slash : Iconsax.eye,
                color: _muted,
                size: 20,
              ),
              onPressed: () =>
                  setState(() => _showPassword = !_showPassword),
            ),
            validator: (v) {
              if (v == null || v.isEmpty) return 'Enter your password';
              if (v.length < 6) return 'At least 6 characters';
              return null;
            },
          ),

          // ✅ Safe Offstage pattern — keeps structure stable
          Offstage(
            offstage: _loginError == null,
            child: _loginError == null
                ? const SizedBox(width: double.infinity)
                : Padding(
                    padding: const EdgeInsets.only(top: 16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: _error.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _error.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Iconsax.warning_2,
                            color: _error,
                            size: 18,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              _loginError!,
                              style: const TextStyle(
                                color: Color(0xFFB91C1C),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                height: 1.35,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
          ),

          const SizedBox(height: 24),
          SizedBox(
            height: 54,
            child: CustomButton(
              onPressed: auth.loading ? null : _handleLogin,
              isLoading: auth.loading,
              text: 'Sign In',
              width: double.infinity,
              height: 54,
              // ✅ Olympic blue button
              backgroundColor: _primary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _label(String text) => Text(
        text,
        style: const TextStyle(
          fontSize: 13.5,
          fontWeight: FontWeight.w600,
          color: _text,
          letterSpacing: -0.1,
        ),
      );

  Widget _input({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    FocusNode? focusNode,
    TextInputType? keyboardType,
    TextInputAction? textInputAction,
    bool obscureText = false,
    Widget? suffix,
    ValueChanged<String>? onSubmitted,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      focusNode: focusNode,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      obscureText: obscureText,
      onFieldSubmitted: onSubmitted,
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      style: const TextStyle(
        fontSize: 15.5,
        color: _text,
        fontWeight: FontWeight.w500,
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(
          color: _muted.withValues(alpha: 0.55),
          fontSize: 15,
          fontWeight: FontWeight.w400,
        ),
        prefixIcon: Padding(
          padding: const EdgeInsets.only(left: 4),
          // ✅ Olympic blue icon
          child: Icon(icon, color: _primary, size: 20),
        ),
        prefixIconConstraints: const BoxConstraints(minWidth: 48),
        suffixIcon: suffix,
        filled: true,
        fillColor: _surface,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: _border, width: 1.2),
        ),
        // ✅ Olympic blue focus ring
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: _primary, width: 1.6),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: _error, width: 1.2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: _error, width: 1.6),
        ),
        errorStyle: const TextStyle(
          fontSize: 12,
          color: _error,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  // ── Quick login ───────────────────────────────────────────
  Widget _quickLogin() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            const Expanded(child: Divider(color: _border, thickness: 1)),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Text(
                'or try a demo',
                style: TextStyle(
                  color: _muted.withValues(alpha: 0.85),
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const Expanded(child: Divider(color: _border, thickness: 1)),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _demoChip(
                label: 'Vendor',
                icon: Iconsax.building,
                onTap: () =>
                    _quickFill('vendor@example.com', 'password123'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _demoChip(
                label: 'Technician',
                icon: Iconsax.user,
                onTap: () =>
                    _quickFill('technician@example.com', 'password123'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _demoChip({
    required String label,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          height: 48,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            // ✅ Soft Olympic tint background
            color: AppColors.primarySoft,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: _primary.withValues(alpha: 0.15),
              width: 1.2,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // ✅ Olympic blue icon
              Icon(icon, color: _primary, size: 18),
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(
                  // ✅ Olympic blue text
                  color: _primary,
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Footer ────────────────────────────────────────────────
  Widget _footer() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "New here? ",
              style: TextStyle(fontSize: 14.5, color: _muted),
            ),
            GestureDetector(
              onTap: () => Navigator.pushNamed(context, '/register'),
              child: const Text(
                'Create an account',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  // ✅ Olympic blue link
                  color: _primary,
                  fontSize: 14.5,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Text(
          'Technicians are onboarded by Vendors only.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            color: _muted.withValues(alpha: 0.85),
            height: 1.4,
          ),
        ),
      ],
    );
  }
}