// import 'package:flutter/material.dart';
// import 'dart:io';
// import '../form_card.dart';
// import '../custom_textfield.dart';
// import '../custom_filepicker.dart'; // Custom FilePicker import

// class Step3Content extends StatelessWidget {
//   final String password;
//   final String confirmPassword;
//   final bool showPassword;
//   final bool showConfirmPassword;
//   final File? cvFile;
//   final File? tradeLicenseFile;
//   final ValueChanged<String> onPasswordChanged;
//   final ValueChanged<String> onConfirmPasswordChanged;
//   final VoidCallback onTogglePassword;
//   final VoidCallback onToggleConfirmPassword;
//   final VoidCallback onPickCv;
//   final VoidCallback onPickTradeLicense;
//   final VoidCallback? onRemoveCv;
//   final VoidCallback? onRemoveTradeLicense;

//   const Step3Content({
//     Key? key,
//     required this.password,
//     required this.confirmPassword,
//     required this.showPassword,
//     required this.showConfirmPassword,
//     this.cvFile,
//     this.tradeLicenseFile,
//     required this.onPasswordChanged,
//     required this.onConfirmPasswordChanged,
//     required this.onTogglePassword,
//     required this.onToggleConfirmPassword,
//     required this.onPickCv,
//     required this.onPickTradeLicense,
//     this.onRemoveCv,
//     this.onRemoveTradeLicense,
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return SingleChildScrollView(
//       padding: EdgeInsets.all(16),
//       child: Column(
//         children: [
//           // Password Section
//           FormCard(
//             icon: Icons.lock,
//             title: 'Password',
//             description: 'Enter your password and confirm it',
//             children: [
//               CustomTextField(
//                 label: 'Password',
//                 value: password,
//                 onChanged: onPasswordChanged,
//                 obscureText: !showPassword,
//                 suffixIcon: IconButton(
//                   icon: Icon(
//                     showPassword ? Icons.visibility_off : Icons.visibility,
//                     color: Colors.grey[600],
//                   ),
//                   onPressed: onTogglePassword,
//                 ),
//               ),
//               SizedBox(height: 16),
//               CustomTextField(
//                 label: 'Confirm Password',
//                 value: confirmPassword,
//                 onChanged: onConfirmPasswordChanged,
//                 obscureText: !showConfirmPassword,
//                 suffixIcon: IconButton(
//                   icon: Icon(
//                     showConfirmPassword
//                         ? Icons.visibility_off
//                         : Icons.visibility,
//                     color: Colors.grey[600],
//                   ),
//                   onPressed: onToggleConfirmPassword,
//                 ),
//               ),
//             ],
//           ),

//           SizedBox(height: 16),

//           // Documents Section - Custom FilePicker ব্যবহার
//           FormCard(
//             icon: Icons.attach_file,
//             title: 'Documents',
//             description: 'Upload required documents in PDF format',
//             children: [
//               Text(
//                 'Please upload the following documents (PDF format only)',
//                 style: TextStyle(fontSize: 14, color: Colors.grey[600]),
//               ),
//               SizedBox(height: 16),

//               // CV/Resume Upload - Custom FilePicker
//               CustomFilePicker(
//                 label: 'CV/Resume (PDF)',
//                 file: cvFile,
//                 onPick: onPickCv,
//                 onRemove: onRemoveCv,
//               ),

//               SizedBox(height: 16),

//               // Trade License Upload - Custom FilePicker
//               CustomFilePicker(
//                 label: 'Trade License (PDF)',
//                 file: tradeLicenseFile,
//                 onPick: onPickTradeLicense,
//                 onRemove: onRemoveTradeLicense,
//               ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }
// }

// step3_content.dart
import 'package:flutter/material.dart';
import '../form_card.dart';
import '../searchable_dropdown.dart';
import '../custom_filepicker.dart';
import '../../models/file_model.dart';
import '../../services/location_service.dart';
import '../../config/app_colors.dart';

class Step3Content extends StatefulWidget {
  final String? selectedDivision;
  final String? selectedDistrict;
  final List<String> selectedServiceThanas;
  final AppFile? cvFile;
  final AppFile? tradeLicenseFile;
  final ValueChanged<String?> onDivisionChanged;
  final ValueChanged<String?> onDistrictChanged;
  final ValueChanged<List<String>> onServiceThanasChanged;
  final VoidCallback onPickCv;
  final VoidCallback onPickTradeLicense;
  final VoidCallback? onRemoveCv;
  final VoidCallback? onRemoveTradeLicense;

  const Step3Content({
    super.key,
    required this.selectedDivision,
    required this.selectedDistrict,
    required this.selectedServiceThanas,
    this.cvFile,
    this.tradeLicenseFile,
    required this.onDivisionChanged,
    required this.onDistrictChanged,
    required this.onServiceThanasChanged,
    required this.onPickCv,
    required this.onPickTradeLicense,
    this.onRemoveCv,
    this.onRemoveTradeLicense,
  });

  @override
  State<Step3Content> createState() => _Step3ContentState();
}

class _Step3ContentState extends State<Step3Content> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    if (!LocationService.isLoaded) {
      await LocationService.loadLocations();
    }
    if (!mounted) return;
    setState(() => _isLoading = false);
  }

  List<String> _availableThanas() {
    if (widget.selectedDivision == null) {
      return LocationService.getAllThanas();
    }
    if (widget.selectedDistrict == null) {
      return LocationService.getThanasByDivision(widget.selectedDivision!);
    }
    return LocationService.getThanasByDivisionAndDistrict(
      widget.selectedDivision!,
      widget.selectedDistrict!,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Center(child: CircularProgressIndicator());

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      child: Column(
        children: [
          FormCard(
            icon: Icons.map_outlined,
            title: 'Service Areas',
            description: 'Where do you provide services?',
            children: [
              _label('Division'),
              SearchableDropdown(
                value: widget.selectedDivision,
                items: LocationService.getDivisionNames(),
                hintText: 'Search division...',
                onChanged: (v) {
                  widget.onDivisionChanged(v);
                  widget.onDistrictChanged(null);
                  widget.onServiceThanasChanged([]);
                },
                showClearButton: true,
                showSelectedChips: true,
              ),
              const SizedBox(height: 18),
              _label('District'),
              SearchableDropdown(
                value: widget.selectedDistrict,
                items: widget.selectedDivision != null
                    ? LocationService.getDistrictNames(widget.selectedDivision!)
                    : [],
                hintText: widget.selectedDivision != null
                    ? 'Search district...'
                    : 'Select division first',
                onChanged: widget.selectedDivision != null
                    ? (v) {
                        widget.onDistrictChanged(v);
                        widget.onServiceThanasChanged([]);
                      }
                    : null,
                enabled: widget.selectedDivision != null,
                showClearButton: true,
                showSelectedChips: true,
              ),
              const SizedBox(height: 18),
              _label('Service Thanas'),
              SearchableDropdown(
                selectedValues: widget.selectedServiceThanas,
                items: _availableThanas(),
                hintText: widget.selectedDivision != null
                    ? 'Search and select thanas...'
                    : 'Select division first',
                onMultiChanged: widget.onServiceThanasChanged,
                enabled: widget.selectedDivision != null,
                showClearButton: true,
                isMultiSelect: true,
                showSelectedChips: true,
              ),
              Offstage(
                offstage: widget.selectedServiceThanas.isEmpty,
                child: Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.check_circle_outline,
                          size: 16,
                          color: AppColors.olympic,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${widget.selectedServiceThanas.length} thana(s) selected',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.olympic,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          FormCard(
            icon: Icons.attach_file_rounded,
            title: 'Documents',
            description: 'PDF preferred',
            children: [
              CustomFilePicker(
                label: 'CV / Resume',
                file: widget.cvFile,
                onPick: widget.onPickCv,
                onRemove: widget.onRemoveCv,
              ),
              const SizedBox(height: 14),
              CustomFilePicker(
                label: 'Trade License',
                file: widget.tradeLicenseFile,
                onPick: widget.onPickTradeLicense,
                onRemove: widget.onRemoveTradeLicense,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Text(
          text,
          style: const TextStyle(
            fontSize: 13.5,
            fontWeight: FontWeight.w600,
            color: AppColors.text,
          ),
        ),
      );
}