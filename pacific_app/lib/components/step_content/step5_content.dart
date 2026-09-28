// // import 'dart:io';
// // import 'package:flutter/material.dart';

// // class Step5Content extends StatelessWidget {
// //   final String name;
// //   final String email;
// //   final String phone;
// //   final DateTime dob;
// //   final String businessName;
// //   final String? selectedDivision;
// //   final String? selectedDistrict;
// //   final String? selectedThana;
// //   final List<String> selectedServiceThanas;
// //   final File? selfieImage;
// //   final File? nidFrontImage;
// //   final File? nidBackImage;
// //   final File? cvFile;
// //   final File? tradeLicenseFile;
// //   final bool isLoading;
// //   final VoidCallback onSubmit;
// //   final VoidCallback onEdit;
// //   final int currentStep;

// //   const Step5Content({
// //     super.key,
// //     required this.name,
// //     required this.email,
// //     required this.phone,
// //     required this.dob,
// //     required this.businessName,
// //     required this.selectedDivision,
// //     required this.selectedDistrict,
// //     required this.selectedThana,
// //     required this.selectedServiceThanas,
// //     required this.selfieImage,
// //     required this.nidFrontImage,
// //     required this.nidBackImage,
// //     required this.cvFile,
// //     required this.tradeLicenseFile,
// //     required this.isLoading,
// //     required this.onSubmit,
// //     required this.onEdit,
// //     required this.currentStep,
// //   });

// //   @override
// //   Widget build(BuildContext context) {
// //     return SingleChildScrollView(
// //       padding: EdgeInsets.all(16),
// //       child: Column(
// //         children: [
// //           // Header with icon
// //           _buildHeader(context),

// //           SizedBox(height: 24),

// //           // Summary Cards
// //           _buildPersonalInfoCard(context),
// //           SizedBox(height: 16),
// //           _buildBusinessInfoCard(context),
// //           SizedBox(height: 16),
// //           _buildAddressCard(context),
// //           SizedBox(height: 16),
// //           _buildDocumentsCard(context),
// //           SizedBox(height: 16),
// //           _buildKycCard(context),

// //           SizedBox(height: 32),

// //           // Edit Button
// //           if (currentStep == 4) // Only show edit button in summary step
// //             _buildEditButton(context),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildHeader(BuildContext context) {
// //     return Container(
// //       padding: EdgeInsets.all(20),
// //       decoration: BoxDecoration(
// //         color: Colors.white,
// //         borderRadius: BorderRadius.circular(16),
// //         boxShadow: [
// //           BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2)),
// //         ],
// //       ),
// //       child: Column(
// //         children: [
// //           Container(
// //             width: 80,
// //             height: 80,
// //             decoration: BoxDecoration(
// //               color: Color(0xFFebf5ff),
// //               shape: BoxShape.circle,
// //             ),
// //             child: Icon(
// //               Icons.check_circle_outline,
// //               color: Color(0xFF3c8ce7),
// //               size: 40,
// //             ),
// //           ),
// //           SizedBox(height: 16),
// //           Text(
// //             'Registration Summary',
// //             style: TextStyle(
// //               fontSize: 24,
// //               fontWeight: FontWeight.bold,
// //               color: Color(0xFF1e293b),
// //             ),
// //           ),
// //           SizedBox(height: 8),
// //           Text(
// //             'Please review your information before submitting',
// //             textAlign: TextAlign.center,
// //             style: TextStyle(fontSize: 16, color: Colors.grey[600]),
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildPersonalInfoCard(BuildContext context) {
// //     return Container(
// //       decoration: BoxDecoration(
// //         color: Colors.white,
// //         borderRadius: BorderRadius.circular(16),
// //         boxShadow: [
// //           BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
// //         ],
// //       ),
// //       child: Column(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Padding(
// //             padding: EdgeInsets.all(16),
// //             child: Row(
// //               children: [
// //                 Icon(Icons.person, color: Color(0xFF3c8ce7), size: 20),
// //                 SizedBox(width: 12),
// //                 Text(
// //                   'Personal Information',
// //                   style: TextStyle(
// //                     fontSize: 18,
// //                     fontWeight: FontWeight.bold,
// //                     color: Color(0xFF1e293b),
// //                   ),
// //                 ),
// //               ],
// //             ),
// //           ),
// //           Divider(height: 0),
// //           _buildSummaryItem('Name', name),
// //           _buildSummaryItem('Email', email),
// //           _buildSummaryItem('Phone', phone),
// //           _buildSummaryItem(
// //             'Date of Birth',
// //             '${dob.day}/${dob.month}/${dob.year}',
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildBusinessInfoCard(BuildContext context) {
// //     return Container(
// //       decoration: BoxDecoration(
// //         color: Colors.white,
// //         borderRadius: BorderRadius.circular(16),
// //         boxShadow: [
// //           BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
// //         ],
// //       ),
// //       child: Column(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Padding(
// //             padding: EdgeInsets.all(16),
// //             child: Row(
// //               children: [
// //                 Icon(Icons.business, color: Color(0xFF3c8ce7), size: 20),
// //                 SizedBox(width: 12),
// //                 Text(
// //                   'Business Information',
// //                   style: TextStyle(
// //                     fontSize: 18,
// //                     fontWeight: FontWeight.bold,
// //                     color: Color(0xFF1e293b),
// //                   ),
// //                 ),
// //               ],
// //             ),
// //           ),
// //           Divider(height: 0),
// //           _buildSummaryItem('Business Name', businessName),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildAddressCard(BuildContext context) {
// //     return Container(
// //       decoration: BoxDecoration(
// //         color: Colors.white,
// //         borderRadius: BorderRadius.circular(16),
// //         boxShadow: [
// //           BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
// //         ],
// //       ),
// //       child: Column(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Padding(
// //             padding: EdgeInsets.all(16),
// //             child: Row(
// //               children: [
// //                 Icon(Icons.location_on, color: Color(0xFF3c8ce7), size: 20),
// //                 SizedBox(width: 12),
// //                 Text(
// //                   'Address Information',
// //                   style: TextStyle(
// //                     fontSize: 18,
// //                     fontWeight: FontWeight.bold,
// //                     color: Color(0xFF1e293b),
// //                   ),
// //                 ),
// //               ],
// //             ),
// //           ),
// //           Divider(height: 0),
// //           _buildSummaryItem('Division', selectedDivision ?? 'Not selected'),
// //           _buildSummaryItem('District', selectedDistrict ?? 'Not selected'),
// //           _buildSummaryItem('Thana', selectedThana ?? 'Not selected'),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildDocumentsCard(BuildContext context) {
// //     return Container(
// //       decoration: BoxDecoration(
// //         color: Colors.white,
// //         borderRadius: BorderRadius.circular(16),
// //         boxShadow: [
// //           BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
// //         ],
// //       ),
// //       child: Column(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Padding(
// //             padding: EdgeInsets.all(16),
// //             child: Row(
// //               children: [
// //                 Icon(Icons.attach_file, color: Color(0xFF3c8ce7), size: 20),
// //                 SizedBox(width: 12),
// //                 Text(
// //                   'Documents',
// //                   style: TextStyle(
// //                     fontSize: 18,
// //                     fontWeight: FontWeight.bold,
// //                     color: Color(0xFF1e293b),
// //                   ),
// //                 ),
// //               ],
// //             ),
// //           ),
// //           Divider(height: 0),
// //           _buildDocumentItem('CV/Resume', cvFile),
// //           _buildDocumentItem('Trade License', tradeLicenseFile),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildKycCard(BuildContext context) {
// //     return Container(
// //       decoration: BoxDecoration(
// //         color: Colors.white,
// //         borderRadius: BorderRadius.circular(16),
// //         boxShadow: [
// //           BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
// //         ],
// //       ),
// //       child: Column(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Padding(
// //             padding: EdgeInsets.all(16),
// //             child: Row(
// //               children: [
// //                 Icon(Icons.verified_user, color: Color(0xFF3c8ce7), size: 20),
// //                 SizedBox(width: 12),
// //                 Text(
// //                   'KYC Verification',
// //                   style: TextStyle(
// //                     fontSize: 18,
// //                     fontWeight: FontWeight.bold,
// //                     color: Color(0xFF1e293b),
// //                   ),
// //                 ),
// //               ],
// //             ),
// //           ),
// //           Divider(height: 0),
// //           _buildImageItem('Selfie', selfieImage),
// //           _buildImageItem('NID Front', nidFrontImage),
// //           _buildImageItem('NID Back', nidBackImage),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildSummaryItem(String label, String value) {
// //     return Padding(
// //       padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
// //       child: Row(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Expanded(
// //             child: Text(
// //               label,
// //               style: TextStyle(
// //                 fontSize: 14,
// //                 fontWeight: FontWeight.w500,
// //                 color: Color(0xFF475569),
// //               ),
// //             ),
// //           ),
// //           Expanded(
// //             flex: 2,
// //             child: Text(
// //               value,
// //               style: TextStyle(
// //                 fontSize: 14,
// //                 color: Color(0xFF1e293b),
// //                 fontWeight: FontWeight.w500,
// //               ),
// //               textAlign: TextAlign.right,
// //             ),
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildDocumentItem(String label, File? file) {
// //     return Padding(
// //       padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
// //       child: Row(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Expanded(
// //             child: Text(
// //               label,
// //               style: TextStyle(
// //                 fontSize: 14,
// //                 fontWeight: FontWeight.w500,
// //                 color: Color(0xFF475569),
// //               ),
// //             ),
// //           ),
// //           Expanded(
// //             flex: 2,
// //             child: Text(
// //               file != null
// //                   ? '✓ Uploaded (${file.path.split('/').last})'
// //                   : '✗ Not uploaded',
// //               style: TextStyle(
// //                 fontSize: 14,
// //                 color: file != null ? Color(0xFF10b981) : Color(0xFFef4444),
// //                 fontWeight: FontWeight.w500,
// //               ),
// //               textAlign: TextAlign.right,
// //             ),
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildImageItem(String label, File? image) {
// //     return Padding(
// //       padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
// //       child: Row(
// //         crossAxisAlignment: CrossAxisAlignment.start,
// //         children: [
// //           Expanded(
// //             child: Text(
// //               label,
// //               style: TextStyle(
// //                 fontSize: 14,
// //                 fontWeight: FontWeight.w500,
// //                 color: Color(0xFF475569),
// //               ),
// //             ),
// //           ),
// //           Expanded(
// //             flex: 2,
// //             child: Row(
// //               mainAxisAlignment: MainAxisAlignment.end,
// //               children: [
// //                 Text(
// //                   image != null ? '✓ Captured' : '✗ Not captured',
// //                   style: TextStyle(
// //                     fontSize: 14,
// //                     color: image != null
// //                         ? Color(0xFF10b981)
// //                         : Color(0xFFef4444),
// //                     fontWeight: FontWeight.w500,
// //                   ),
// //                 ),
// //                 SizedBox(width: 8),
// //                 if (image != null)
// //                   Container(
// //                     width: 40,
// //                     height: 40,
// //                     decoration: BoxDecoration(
// //                       borderRadius: BorderRadius.circular(8),
// //                       image: DecorationImage(
// //                         image: FileImage(image),
// //                         fit: BoxFit.cover,
// //                       ),
// //                     ),
// //                   ),
// //               ],
// //             ),
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildEditButton(BuildContext context) {
// //     return OutlinedButton.icon(
// //       onPressed: onEdit,
// //       icon: Icon(Icons.edit, size: 20),
// //       label: Text('Edit Information'),
// //       style: OutlinedButton.styleFrom(
// //         padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
// //         side: BorderSide(color: Color(0xFF3c8ce7)),
// //         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
// //       ),
// //     );
// //   }
// // }

// import 'package:flutter/material.dart';
// import 'dart:io';
// import '../form_card.dart';
// import '../custom_imagepicker.dart'; // Custom ImagePicker import

// class Step5Content extends StatelessWidget {
//   final File? selfieImage;
//   final File? nidFrontImage;
//   final File? nidBackImage;
//   final VoidCallback onTakeSelfie;
//   final VoidCallback onTakeNidFront;
//   final VoidCallback onTakeNidBack;
//   final bool isImageProcessing;

//   const Step5Content({
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
//       padding: const EdgeInsets.all(16),
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
//               const SizedBox(height: 24),

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

//               const SizedBox(height: 24),

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

//               const SizedBox(height: 24),

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

import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:pacific_app/models/file_model.dart';
import 'package:pacific_app/services/image_picker_service.dart';
import '../form_card.dart';
import '../../config/app_colors.dart';

class Step5Content extends StatefulWidget {
  final AppFile? selfieImage;
  final AppFile? nidFrontImage;
  final AppFile? nidBackImage;
  final Function(AppFile?) onSelfieChanged;
  final Function(AppFile?) onNidFrontChanged;
  final Function(AppFile?) onNidBackChanged;
  final bool isImageProcessing;

  const Step5Content({
    super.key,
    this.selfieImage,
    this.nidFrontImage,
    this.nidBackImage,
    required this.onSelfieChanged,
    required this.onNidFrontChanged,
    required this.onNidBackChanged,
    this.isImageProcessing = false,
  });

  @override
  State<Step5Content> createState() => _Step5ContentState();
}

class _Step5ContentState extends State<Step5Content> {
  Future<void> _pick(Function(AppFile?) cb) async {
    final image = await ImagePickerService.showImageSourceDialog(context);
    if (image != null) cb(image);
  }

  Widget _preview(AppFile? image) {
    if (image == null) {
      return Container(
        height: 180,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: AppColors.border,
            width: 1.4,
            style: BorderStyle.solid,
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.add_photo_alternate_outlined,
                  size: 42, color: AppColors.muted),
              SizedBox(height: 8),
              Text(
                'No image selected',
                style: TextStyle(
                  color: AppColors.muted,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }

    ImageProvider? provider;
    if (image.isWebFile && image.bytes != null) {
      provider = MemoryImage(Uint8List.fromList(image.bytes!));
    } else if (image.path != null) {
      final file = File(image.path!);
      if (file.existsSync()) provider = FileImage(file);
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: Container(
        height: 180,
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppColors.surface,
          image: provider != null
              ? DecorationImage(image: provider, fit: BoxFit.cover)
              : null,
        ),
        child: provider == null
            ? const Center(
                child: Icon(Icons.image, size: 42, color: AppColors.muted),
              )
            : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      child: FormCard(
        icon: Icons.verified_user_outlined,
        title: 'KYC Verification',
        description: 'Clear images with good lighting',
        children: [
          _imageBlock(
            icon: Icons.face_outlined,
            title: 'Selfie',
            description: 'Take a clear selfie',
            image: widget.selfieImage,
            onPick: () => _pick(widget.onSelfieChanged),
            onRemove: () => widget.onSelfieChanged(null),
          ),
          const Divider(height: 32, color: AppColors.border),
          _imageBlock(
            icon: Icons.credit_card_outlined,
            title: 'NID Front Side',
            description: 'Front of your NID card',
            image: widget.nidFrontImage,
            onPick: () => _pick(widget.onNidFrontChanged),
            onRemove: () => widget.onNidFrontChanged(null),
          ),
          const Divider(height: 32, color: AppColors.border),
          _imageBlock(
            icon: Icons.credit_card_outlined,
            title: 'NID Back Side',
            description: 'Back of your NID card',
            image: widget.nidBackImage,
            onPick: () => _pick(widget.onNidBackChanged),
            onRemove: () => widget.onNidBackChanged(null),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.olympic.withValues(alpha: 0.15),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  '📋 Image Requirements',
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.olympic,
                  ),
                ),
                SizedBox(height: 8),
                _Bullet('High quality, clear images'),
                _Bullet('Good lighting, no shadows'),
                _Bullet('All text should be readable'),
                _Bullet('No glare or reflections'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _imageBlock({
    required IconData icon,
    required String title,
    required String description,
    required AppFile? image,
    required VoidCallback onPick,
    required VoidCallback onRemove,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.primarySoft,
                borderRadius: BorderRadius.circular(9),
              ),
              child: Icon(icon, color: AppColors.olympic, size: 17),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.text,
                        ),
                      ),
                      const Text(
                        ' *',
                        style: TextStyle(
                          color: AppColors.error,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    description,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: AppColors.muted,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _preview(image),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onPick,
                icon: const Icon(Icons.camera_alt_outlined, size: 18),
                label: Text(image == null ? 'Take Photo' : 'Change'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  side: const BorderSide(color: AppColors.olympic),
                  foregroundColor: AppColors.olympic,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ),
            if (image != null) ...[
              const SizedBox(width: 8),
              IconButton(
                onPressed: onRemove,
                icon: const Icon(Icons.delete_outline, color: AppColors.error),
                tooltip: 'Remove',
              ),
            ],
          ],
        ),
      ],
    );
  }
}

class _Bullet extends StatelessWidget {
  final String text;
  const _Bullet(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          const Icon(Icons.circle, size: 5, color: AppColors.olympic),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 12.5,
                color: AppColors.text,
              ),
            ),
          ),
        ],
      ),
    );
  }
}