// import 'package:flutter/material.dart';
// import 'dart:io';
// import '../form_card.dart';
// import '../custom_imagepicker.dart'; // Custom ImagePicker import

// class Step4Content extends StatelessWidget {
//   final File? selfieImage;
//   final File? nidFrontImage;
//   final File? nidBackImage;
//   final VoidCallback onTakeSelfie;
//   final VoidCallback onTakeNidFront;
//   final VoidCallback onTakeNidBack;
//   final bool isImageProcessing;

//   const Step4Content({
//     Key? key,
//     this.selfieImage,
//     this.nidFrontImage,
//     this.nidBackImage,
//     required this.onTakeSelfie,
//     required this.onTakeNidFront,
//     required this.onTakeNidBack,
//     this.isImageProcessing = false,
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return SingleChildScrollView(
//       padding: EdgeInsets.all(16),
//       child: Column(
//         children: [
//           FormCard(
//             icon: Icons.verified_user,
//             title: 'KYC Verification',
//             description: 'Please provide valid identification documents',
//             children: [
//               Text(
//                 'Please capture clear images for verification',
//                 style: TextStyle(color: Colors.grey[600]),
//                 textAlign: TextAlign.center,
//               ),
//               SizedBox(height: 24),

//               // Selfie Image - Custom ImagePicker
//               CustomImagePicker(
//                 label: 'Selfie Image',
//                 description: 'Take a clear selfie with good lighting',
//                 image: selfieImage,
//                 onPick: onTakeSelfie,
//                 icon: Icons.face,
//                 isRequired: true,
//                 isLoading: isImageProcessing,
//               ),

//               SizedBox(height: 24),

//               // NID Front - Custom ImagePicker
//               CustomImagePicker(
//                 label: 'NID Front Side',
//                 description: 'Capture the front side of your NID card',
//                 image: nidFrontImage,
//                 onPick: onTakeNidFront,
//                 icon: Icons.credit_card,
//                 isRequired: true,
//                 isLoading: isImageProcessing,
//               ),

//               SizedBox(height: 24),

//               // NID Back - Custom ImagePicker
//               CustomImagePicker(
//                 label: 'NID Back Side',
//                 description: 'Capture the back side of your NID card',
//                 image: nidBackImage,
//                 onPick: onTakeNidBack,
//                 icon: Icons.credit_card,
//                 isRequired: true,
//                 isLoading: isImageProcessing,
//               ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import '../form_card.dart';
import '../custom_textfield.dart';

class Step4Content extends StatefulWidget {
  final String password;
  final String confirmPassword;
  final bool showPassword;
  final bool showConfirmPassword;
  final ValueChanged<String> onPasswordChanged;
  final ValueChanged<String> onConfirmPasswordChanged;
  final VoidCallback onTogglePassword;
  final VoidCallback onToggleConfirmPassword;

  const Step4Content({
    Key? key,
    required this.password,
    required this.confirmPassword,
    required this.showPassword,
    required this.showConfirmPassword,
    required this.onPasswordChanged,
    required this.onConfirmPasswordChanged,
    required this.onTogglePassword,
    required this.onToggleConfirmPassword,
  }) : super(key: key);

  @override
  State<Step4Content> createState() => _Step4ContentState();
}

class _Step4ContentState extends State<Step4Content> {
  String? _passwordError;
  String? _confirmPasswordError;

  void _validatePassword(String value) {
    setState(() {
      if (value.length < 6) {
        _passwordError = 'Password must be at least 6 characters';
      } else {
        _passwordError = null;
      }

      // Also validate confirm password when password changes
      if (widget.confirmPassword.isNotEmpty &&
          value != widget.confirmPassword) {
        _confirmPasswordError = 'Passwords do not match';
      } else {
        _confirmPasswordError = null;
      }
    });
  }

  void _validateConfirmPassword(String value) {
    setState(() {
      if (value != widget.password) {
        _confirmPasswordError = 'Passwords do not match';
      } else {
        _confirmPasswordError = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          FormCard(
            icon: Icons.lock,
            title: 'Create Password',
            description: 'Set a secure password for your account',
            children: [
              CustomTextField(
                label: 'Password',
                value: widget.password,
                onChanged: (value) {
                  widget.onPasswordChanged(value);
                  _validatePassword(value);
                },
                obscureText: !widget.showPassword,
                suffixIcon: IconButton(
                  icon: Icon(
                    widget.showPassword
                        ? Icons.visibility_off
                        : Icons.visibility,
                    color: Colors.grey[600],
                  ),
                  onPressed: widget.onTogglePassword,
                ),
                errorText: _passwordError,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 8),

              // Password requirements
              Padding(
                padding: const EdgeInsets.only(left: 16, bottom: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Password requirements:',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                    Text(
                      '• At least 6 characters',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                    Text(
                      '• Make it strong and memorable',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              CustomTextField(
                label: 'Confirm Password',
                value: widget.confirmPassword,
                onChanged: (value) {
                  widget.onConfirmPasswordChanged(value);
                  _validateConfirmPassword(value);
                },
                obscureText: !widget.showConfirmPassword,
                suffixIcon: IconButton(
                  icon: Icon(
                    widget.showConfirmPassword
                        ? Icons.visibility_off
                        : Icons.visibility,
                    color: Colors.grey[600],
                  ),
                  onPressed: widget.onToggleConfirmPassword,
                ),
                errorText: _confirmPasswordError,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please confirm password';
                  }
                  if (value != widget.password) {
                    return 'Passwords do not match';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 8),

              // Match indicator
              if (widget.password.isNotEmpty &&
                  widget.confirmPassword.isNotEmpty)
                Row(
                  children: [
                    Icon(
                      widget.password == widget.confirmPassword
                          ? Icons.check_circle
                          : Icons.error,
                      color: widget.password == widget.confirmPassword
                          ? Colors.green
                          : Colors.red,
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      widget.password == widget.confirmPassword
                          ? 'Passwords match'
                          : 'Passwords do not match',
                      style: TextStyle(
                        fontSize: 12,
                        color: widget.password == widget.confirmPassword
                            ? Colors.green
                            : Colors.red,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ],
      ),
    );
  }
}
