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

// import 'package:flutter/material.dart';
import 'package:flutter/material.dart';

import '../form_card.dart';
import '../../screens/registration/widgets/custom_textfield.dart';
import '../../config/app_colors.dart';

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
    super.key,
    required this.password,
    required this.confirmPassword,
    required this.showPassword,
    required this.showConfirmPassword,
    required this.onPasswordChanged,
    required this.onConfirmPasswordChanged,
    required this.onTogglePassword,
    required this.onToggleConfirmPassword,
  });

  @override
  State<Step4Content> createState() => _Step4ContentState();
}

class _Step4ContentState extends State<Step4Content> {
  String? _passwordError;
  String? _confirmPasswordError;

  void _validatePassword(String value) {
    setState(() {
      _passwordError = value.length < 6
          ? 'Password must be at least 6 characters'
          : null;
      _confirmPasswordError =
          (widget.confirmPassword.isNotEmpty && value != widget.confirmPassword)
              ? 'Passwords do not match'
              : null;
    });
  }

  void _validateConfirm(String value) {
    setState(() {
      _confirmPasswordError =
          (value != widget.password) ? 'Passwords do not match' : null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final match = widget.password.isNotEmpty &&
        widget.confirmPassword.isNotEmpty &&
        widget.password == widget.confirmPassword;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      child: FormCard(
        icon: Icons.lock_outline_rounded,
        title: 'Create Password',
        description: 'Set a secure password for your account',
        children: [
          CustomTextField(
            label: 'Password',
            value: widget.password,
            onChanged: (v) {
              widget.onPasswordChanged(v);
              _validatePassword(v);
            },
            obscureText: !widget.showPassword,
            hintText: '••••••••',
            errorText: _passwordError,
            suffixIcon: IconButton(
              icon: Icon(
                widget.showPassword
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
                color: AppColors.muted,
                size: 20,
              ),
              onPressed: widget.onTogglePassword,
            ),
            validator: (v) {
              if (v == null || v.isEmpty) return 'Please enter password';
              if (v.length < 6) return 'Password must be at least 6 characters';
              return null;
            },
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Password requirements:',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.text,
                  ),
                ),
                SizedBox(height: 6),
                _Requirement(text: 'At least 6 characters'),
                SizedBox(height: 4),
                _Requirement(text: 'Make it strong and memorable'),
              ],
            ),
          ),
          const SizedBox(height: 18),
          CustomTextField(
            label: 'Confirm Password',
            value: widget.confirmPassword,
            onChanged: (v) {
              widget.onConfirmPasswordChanged(v);
              _validateConfirm(v);
            },
            obscureText: !widget.showConfirmPassword,
            hintText: '••••••••',
            errorText: _confirmPasswordError,
            suffixIcon: IconButton(
              icon: Icon(
                widget.showConfirmPassword
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
                color: AppColors.muted,
                size: 20,
              ),
              onPressed: widget.onToggleConfirmPassword,
            ),
            validator: (v) {
              if (v == null || v.isEmpty) return 'Please confirm password';
              if (v != widget.password) return 'Passwords do not match';
              return null;
            },
          ),
          Offstage(
            offstage: !(widget.password.isNotEmpty &&
                widget.confirmPassword.isNotEmpty),
            child: Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Row(
                children: [
                  Icon(
                    match ? Icons.check_circle : Icons.error_outline,
                    color: match ? AppColors.success : AppColors.error,
                    size: 16,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    match ? 'Passwords match' : 'Passwords do not match',
                    style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                      color: match ? AppColors.success : AppColors.error,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Requirement extends StatelessWidget {
  final String text;
  const _Requirement({required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.circle, size: 5, color: AppColors.muted),
        const SizedBox(width: 8),
        Text(
          text,
          style: const TextStyle(fontSize: 12, color: AppColors.muted),
        ),
      ],
    );
  }
}