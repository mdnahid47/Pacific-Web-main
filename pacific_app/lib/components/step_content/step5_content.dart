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

import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:pacific_app/models/file_model.dart';
import 'package:pacific_app/services/image_picker_service.dart';
import '../form_card.dart';
import '../../models/file_model.dart'; // Import AppFile
import '../../services/image_picker_service.dart'; // Import the service

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
  Future<void> _pickImage(Function(AppFile?) callback) async {
    final image = await ImagePickerService.showImageSourceDialog(context);
    if (image != null) {
      callback(image);
    }
  }

  // Helper to display image from AppFile
  Widget _buildImagePreview(AppFile? image) {
    if (image == null) {
      return Container(
        width: double.infinity,
        height: 200,
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[300]!),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.photo_camera, size: 48, color: Colors.grey[400]),
            const SizedBox(height: 8),
            Text(
              'No image selected',
              style: TextStyle(color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }

    // Check if we're on web (has bytes) or mobile (has path)
    if (image.isWebFile && image.bytes != null) {
      // For web - use MemoryImage
      return Container(
        width: double.infinity,
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          image: DecorationImage(
            image: MemoryImage(Uint8List.fromList(image.bytes!)),
            fit: BoxFit.cover,
          ),
        ),
      );
    } else if (image.path != null) {
      // For mobile/desktop - use FileImage
      final file = File(image.path!);
      if (file.existsSync()) {
        return Container(
          width: double.infinity,
          height: 200,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            image: DecorationImage(image: FileImage(file), fit: BoxFit.cover),
          ),
        );
      }
    }

    // Fallback if image can't be displayed
    return Container(
      width: double.infinity,
      height: 200,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.image, size: 48, color: Colors.grey[400]),
          const SizedBox(height: 8),
          Text('Image loaded', style: TextStyle(color: Colors.grey[500])),
          const SizedBox(height: 4),
          Text(
            '${(image.size / 1024).toStringAsFixed(1)} KB',
            style: TextStyle(color: Colors.grey[500], fontSize: 12),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          FormCard(
            icon: Icons.verified_user,
            title: 'KYC Verification',
            description: 'Please provide valid identification documents',
            children: [
              Text(
                'Please capture clear images for verification. You can either take a photo or upload from gallery.',
                style: TextStyle(color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              // Selfie Image Section
              _buildImageSection(
                context,
                icon: Icons.face,
                title: 'Selfie Image',
                description: 'Take a clear selfie with good lighting',
                image: widget.selfieImage,
                onChange: widget.onSelfieChanged,
                onPick: () => _pickImage(widget.onSelfieChanged),
                onRemove: () => widget.onSelfieChanged(null),
              ),

              const SizedBox(height: 24),
              const Divider(),
              const SizedBox(height: 24),

              // NID Front Image Section
              _buildImageSection(
                context,
                icon: Icons.credit_card,
                title: 'NID Front Side',
                description: 'Capture the front side of your NID card',
                image: widget.nidFrontImage,
                onChange: widget.onNidFrontChanged,
                onPick: () => _pickImage(widget.onNidFrontChanged),
                onRemove: () => widget.onNidFrontChanged(null),
              ),

              const SizedBox(height: 24),
              const Divider(),
              const SizedBox(height: 24),

              // NID Back Image Section
              _buildImageSection(
                context,
                icon: Icons.credit_card,
                title: 'NID Back Side',
                description: 'Capture the back side of your NID card',
                image: widget.nidBackImage,
                onChange: widget.onNidBackChanged,
                onPick: () => _pickImage(widget.onNidBackChanged),
                onRemove: () => widget.onNidBackChanged(null),
              ),

              const SizedBox(height: 24),

              // Image Requirements
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '📋 Image Requirements:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Theme.of(context).primaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text('• High quality and clear images'),
                    const Text('• Good lighting with no shadows'),
                    const Text('• All text should be readable'),
                    const Text('• No glare or reflections'),
                    const Text('• Image should be in focus'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildImageSection(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String description,
    required AppFile? image,
    required Function(AppFile?) onChange,
    required VoidCallback onPick,
    required VoidCallback onRemove,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: Theme.of(context).primaryColor),
            const SizedBox(width: 8),
            Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(width: 4),
            const Text(
              '*',
              style: TextStyle(
                color: Colors.red,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          description,
          style: const TextStyle(fontSize: 14, color: Colors.grey),
        ),
        const SizedBox(height: 12),

        // Image Preview and Controls
        if (image != null)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildImagePreview(image),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton.icon(
                      onPressed: onPick,
                      icon: const Icon(Icons.edit),
                      label: const Text('Change'),
                    ),
                    const SizedBox(width: 8),
                    TextButton.icon(
                      onPressed: onRemove,
                      icon: const Icon(Icons.delete, color: Colors.red),
                      label: const Text(
                        'Remove',
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

        if (image == null)
          Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Take Photo Button
                  ElevatedButton.icon(
                    onPressed: onPick,
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Take Photo'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                  ),
                  // Choose from Gallery Button
                  OutlinedButton.icon(
                    onPressed: onPick,
                    icon: const Icon(Icons.photo_library),
                    label: const Text('From Gallery'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: onPick,
                child: const Text('Or choose another option'),
              ),
            ],
          ),
      ],
    );
  }
}
