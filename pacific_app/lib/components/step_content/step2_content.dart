// import 'package:flutter/material.dart';
// import '../form_card.dart';
// import '../custom_textfield.dart';
// import '../searchable_dropdown.dart';
// import '../../services/location_service.dart';

// class Step2Content extends StatefulWidget {
//   final String address;
//   final String? selectedDivision;
//   final String? selectedDistrict;
//   final String? selectedThana;
//   final List<String> selectedServiceThanas;
//   final ValueChanged<String> onAddressChanged;
//   final ValueChanged<String?> onDivisionChanged;
//   final ValueChanged<String?> onDistrictChanged;
//   final ValueChanged<String?> onThanaChanged;
//   final ValueChanged<List<String>> onServiceThanasChanged;

//   const Step2Content({
//     super.key,
//     required this.address,
//     required this.selectedDivision,
//     required this.selectedDistrict,
//     required this.selectedThana,
//     required this.selectedServiceThanas,
//     required this.onAddressChanged,
//     required this.onDivisionChanged,
//     required this.onDistrictChanged,
//     required this.onThanaChanged,
//     required this.onServiceThanasChanged,
//   });

//   @override
//   State<Step2Content> createState() => _Step2ContentState();
// }

// class _Step2ContentState extends State<Step2Content> {
//   bool _isLoading = true;

//   @override
//   void initState() {
//     super.initState();
//     _initializeData();
//   }

//   Future<void> _initializeData() async {
//     if (!LocationService.isLoaded) {
//       await LocationService.loadLocations();
//     }
//     setState(() => _isLoading = false);
//   }

//   // ✅ SIMPLIFIED: সরাসরি LocationService থেকে data নিন
//   List<String> _getAvailableServiceThanas() {
//     if (widget.selectedDivision == null) {
//       return LocationService.getAllThanas();
//     }

//     if (widget.selectedDistrict == null) {
//       return LocationService.getThanasByDivision(widget.selectedDivision!);
//     }

//     return LocationService.getThanasByDivisionAndDistrict(
//       widget.selectedDivision!,
//       widget.selectedDistrict!,
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     if (_isLoading) {
//       return const Center(child: CircularProgressIndicator());
//     }

//     return SingleChildScrollView(
//       padding: const EdgeInsets.all(16),
//       child: Column(
//         children: [
//           FormCard(
//             icon: Icons.location_on,
//             title: 'Business Address',
//             children: [
//               CustomTextField(
//                 label: 'Business Address',
//                 value: widget.address,
//                 onChanged: widget.onAddressChanged,
//                 maxLines: 3,
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//                     return 'Please enter business address';
//                   }
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 24),

//               _buildLabel('Division'),
//               SearchableDropdown(
//                 value: widget.selectedDivision,
//                 items: LocationService.getDivisionNames(),
//                 hintText: 'Search division...',
//                 onChanged: (value) {
//                   widget.onDivisionChanged(value);
//                   widget.onDistrictChanged(null);
//                   widget.onThanaChanged(null);
//                   widget.onServiceThanasChanged([]);
//                 },
//                 enabled: true,
//                 showClearButton: true,
//                 isMultiSelect: false,
//                 contentPadding: const EdgeInsets.symmetric(
//                   horizontal: 16,
//                   vertical: 12,
//                 ),
//                 showSelectedChips: true,
//               ),
//               const SizedBox(height: 20),

//               _buildLabel('District'),
//               SearchableDropdown(
//                 value: widget.selectedDistrict,
//                 items: widget.selectedDivision != null
//                     ? LocationService.getDistrictNames(widget.selectedDivision!)
//                     : [],
//                 hintText: widget.selectedDivision != null
//                     ? 'Search district...'
//                     : 'Select division first',
//                 onChanged: widget.selectedDivision != null
//                     ? (value) {
//                         widget.onDistrictChanged(value);
//                         widget.onThanaChanged(null);
//                         widget.onServiceThanasChanged([]);
//                       }
//                     : null,
//                 enabled: widget.selectedDivision != null,
//                 showClearButton: true,
//                 isMultiSelect: false,
//                 contentPadding: const EdgeInsets.symmetric(
//                   horizontal: 16,
//                   vertical: 12,
//                 ),
//                 showSelectedChips: true,
//               ),
//               const SizedBox(height: 20),

//               _buildLabel('Thana/Police Station (Business Location)'),
//               SearchableDropdown(
//                 value: widget.selectedThana,
//                 items:
//                     widget.selectedDivision != null &&
//                         widget.selectedDistrict != null
//                     ? LocationService.getStationNames(
//                         widget.selectedDivision!,
//                         widget.selectedDistrict!,
//                       )
//                     : [],
//                 hintText:
//                     widget.selectedDivision != null &&
//                         widget.selectedDistrict != null
//                     ? 'Search thana...'
//                     : 'Select district first',
//                 onChanged:
//                     widget.selectedDivision != null &&
//                         widget.selectedDistrict != null
//                     ? widget.onThanaChanged
//                     : null,
//                 enabled:
//                     widget.selectedDivision != null &&
//                     widget.selectedDistrict != null,
//                 showClearButton: true,
//                 isMultiSelect: false,
//                 contentPadding: const EdgeInsets.symmetric(
//                   horizontal: 16,
//                   vertical: 12,
//                 ),
//                 showSelectedChips: true,
//               ),
//             ],
//           ),

//           const SizedBox(height: 24),

//           FormCard(
//             icon: Icons.location_city,
//             title: 'Service Areas',
//             description: 'Select thanas where you provide services',
//             children: [
//               _buildLabel('Select Service Thanas'),
//               SearchableDropdown(
//                 selectedValues: widget.selectedServiceThanas,
//                 items: _getAvailableServiceThanas(),
//                 hintText: widget.selectedDivision != null
//                     ? 'Search and select thanas...'
//                     : 'Select division first',
//                 onMultiChanged: widget.onServiceThanasChanged,
//                 enabled: widget.selectedDivision != null,
//                 showClearButton: true,
//                 isMultiSelect: true,
//                 showSelectedChips: true,
//                 contentPadding: const EdgeInsets.symmetric(
//                   horizontal: 16,
//                   vertical: 12,
//                 ),
//               ),
//               const SizedBox(height: 8),

//               if (widget.selectedServiceThanas.isNotEmpty)
//                 Padding(
//                   padding: const EdgeInsets.only(top: 8.0),
//                   child: Text(
//                     'Selected: ${widget.selectedServiceThanas.length} thana(s)',
//                     style: TextStyle(
//                       fontSize: 14,
//                       fontWeight: FontWeight.w500,
//                       color: Theme.of(context).primaryColor,
//                     ),
//                   ),
//                 ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildLabel(String text) {
//     return Padding(
//       padding: const EdgeInsets.only(bottom: 8.0),
//       child: Text(
//         text,
//         style: TextStyle(
//           fontSize: 14,
//           fontWeight: FontWeight.w500,
//           color: Colors.grey[700],
//         ),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import '../form_card.dart';
import '../../screens/registration/widgets/custom_textfield.dart';
import '../searchable_dropdown.dart';
import '../../services/location_service.dart';
import '../../config/app_colors.dart';

class Step2Content extends StatefulWidget {
  final String presentAddress;
  final String? presentDivision;
  final String? presentDistrict;
  final String? presentThana;

  final String permanentAddress;
  final String? permanentDivision;
  final String? permanentDistrict;
  final String? permanentThana;
  final bool sameAsPresentAddress;

  final String businessAddress;
  final String? businessDivision;
  final String? businessDistrict;
  final String? businessThana;

  final ValueChanged<String> onPresentAddressChanged;
  final ValueChanged<String?> onPresentDivisionChanged;
  final ValueChanged<String?> onPresentDistrictChanged;
  final ValueChanged<String?> onPresentThanaChanged;

  final ValueChanged<String> onPermanentAddressChanged;
  final ValueChanged<String?> onPermanentDivisionChanged;
  final ValueChanged<String?> onPermanentDistrictChanged;
  final ValueChanged<String?> onPermanentThanaChanged;
  final ValueChanged<bool> onSameAsPresentChanged;

  final ValueChanged<String> onBusinessAddressChanged;
  final ValueChanged<String?> onBusinessDivisionChanged;
  final ValueChanged<String?> onBusinessDistrictChanged;
  final ValueChanged<String?> onBusinessThanaChanged;

  const Step2Content({
    super.key,
    required this.presentAddress,
    this.presentDivision,
    this.presentDistrict,
    this.presentThana,
    required this.permanentAddress,
    this.permanentDivision,
    this.permanentDistrict,
    this.permanentThana,
    required this.sameAsPresentAddress,
    required this.businessAddress,
    this.businessDivision,
    this.businessDistrict,
    this.businessThana,
    required this.onPresentAddressChanged,
    required this.onPresentDivisionChanged,
    required this.onPresentDistrictChanged,
    required this.onPresentThanaChanged,
    required this.onPermanentAddressChanged,
    required this.onPermanentDivisionChanged,
    required this.onPermanentDistrictChanged,
    required this.onPermanentThanaChanged,
    required this.onSameAsPresentChanged,
    required this.onBusinessAddressChanged,
    required this.onBusinessDivisionChanged,
    required this.onBusinessDistrictChanged,
    required this.onBusinessThanaChanged,
  });

  @override
  State<Step2Content> createState() => _Step2ContentState();
}

class _Step2ContentState extends State<Step2Content> {
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    try {
      setState(() => _isLoading = true);
      if (!LocationService.isLoaded) {
        await LocationService.loadLocations();
      }
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _errorMessage = LocationService.isLoaded
            ? null
            : 'Failed to load location data. Please try again.';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _errorMessage = 'Error loading location data: $e';
      });
    }
  }

  void _copyPresentToPermanent() {
    widget.onPermanentAddressChanged(widget.presentAddress);
    widget.onPermanentDivisionChanged(widget.presentDivision);
    widget.onPermanentDistrictChanged(widget.presentDistrict);
    widget.onPermanentThanaChanged(widget.presentThana);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 56, color: AppColors.error),
              const SizedBox(height: 16),
              const Text(
                'Error Loading Locations',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.muted),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _initializeData,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      child: Column(
        children: [
          _presentSection(),
          const SizedBox(height: 16),
          _permanentSection(),
          const SizedBox(height: 16),
          _businessSection(),
        ],
      ),
    );
  }

  Widget _presentSection() {
    return FormCard(
      icon: Icons.home_outlined,
      title: 'Present Address',
      description: 'Where do you currently live?',
      children: [
        CustomTextField(
          label: 'Address',
          value: widget.presentAddress,
          onChanged: widget.onPresentAddressChanged,
          hintText: 'House, Road, Area',
          maxLines: 3,
          validator: (v) =>
              (v == null || v.isEmpty) ? 'Please enter present address' : null,
        ),
        const SizedBox(height: 20),
        _label('Division'),
        SearchableDropdown(
          value: widget.presentDivision,
          items: LocationService.getDivisionNames(),
          hintText: 'Search division...',
          onChanged: (v) {
            widget.onPresentDivisionChanged(v);
            widget.onPresentDistrictChanged(null);
            widget.onPresentThanaChanged(null);
          },
          showClearButton: true,
          showSelectedChips: true,
        ),
        const SizedBox(height: 18),
        _label('District'),
        SearchableDropdown(
          value: widget.presentDistrict,
          items: widget.presentDivision != null
              ? LocationService.getDistrictNames(widget.presentDivision!)
              : [],
          hintText: widget.presentDivision != null
              ? 'Search district...'
              : 'Select division first',
          onChanged: widget.presentDivision != null
              ? (v) {
                  widget.onPresentDistrictChanged(v);
                  widget.onPresentThanaChanged(null);
                }
              : null,
          enabled: widget.presentDivision != null,
          showClearButton: true,
          showSelectedChips: true,
        ),
        const SizedBox(height: 18),
        _label('Thana / Police Station'),
        SearchableDropdown(
          value: widget.presentThana,
          items: (widget.presentDivision != null &&
                  widget.presentDistrict != null)
              ? LocationService.getStationNames(
                  widget.presentDivision!,
                  widget.presentDistrict!,
                )
              : [],
          hintText: (widget.presentDivision != null &&
                  widget.presentDistrict != null)
              ? 'Search thana...'
              : 'Select district first',
          onChanged: (widget.presentDivision != null &&
                  widget.presentDistrict != null)
              ? widget.onPresentThanaChanged
              : null,
          enabled: widget.presentDivision != null &&
              widget.presentDistrict != null,
          showClearButton: true,
          showSelectedChips: true,
        ),
      ],
    );
  }

  Widget _permanentSection() {
    return FormCard(
      icon: Icons.location_city_outlined,
      title: 'Permanent Address',
      description: 'Your home of record',
      children: [
        // Nice toggle row
        Container(
          decoration: BoxDecoration(
            color: AppColors.primarySoft,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.olympic.withValues(alpha: 0.15)),
          ),
          child: CheckboxListTile(
            value: widget.sameAsPresentAddress,
            onChanged: (v) {
              widget.onSameAsPresentChanged(v ?? false);
              if (v == true) _copyPresentToPermanent();
            },
            activeColor: AppColors.olympic,
            checkColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            title: const Text(
              'Same as present address',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.text,
              ),
            ),
            controlAffinity: ListTileControlAffinity.leading,
          ),
        ),
        Offstage(
          offstage: widget.sameAsPresentAddress,
          child: Column(
            children: [
              const SizedBox(height: 20),
              CustomTextField(
                label: 'Address',
                value: widget.permanentAddress,
                onChanged: widget.onPermanentAddressChanged,
                hintText: 'House, Road, Area',
                maxLines: 3,
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Please enter permanent address' : null,
              ),
              const SizedBox(height: 20),
              _label('Division'),
              SearchableDropdown(
                value: widget.permanentDivision,
                items: LocationService.getDivisionNames(),
                hintText: 'Search division...',
                onChanged: (v) {
                  widget.onPermanentDivisionChanged(v);
                  widget.onPermanentDistrictChanged(null);
                  widget.onPermanentThanaChanged(null);
                },
                showClearButton: true,
                showSelectedChips: true,
              ),
              const SizedBox(height: 18),
              _label('District'),
              SearchableDropdown(
                value: widget.permanentDistrict,
                items: widget.permanentDivision != null
                    ? LocationService.getDistrictNames(widget.permanentDivision!)
                    : [],
                hintText: widget.permanentDivision != null
                    ? 'Search district...'
                    : 'Select division first',
                onChanged: widget.permanentDivision != null
                    ? (v) {
                        widget.onPermanentDistrictChanged(v);
                        widget.onPermanentThanaChanged(null);
                      }
                    : null,
                enabled: widget.permanentDivision != null,
                showClearButton: true,
                showSelectedChips: true,
              ),
              const SizedBox(height: 18),
              _label('Thana / Police Station'),
              SearchableDropdown(
                value: widget.permanentThana,
                items: (widget.permanentDivision != null &&
                        widget.permanentDistrict != null)
                    ? LocationService.getStationNames(
                        widget.permanentDivision!,
                        widget.permanentDistrict!,
                      )
                    : [],
                hintText: (widget.permanentDivision != null &&
                        widget.permanentDistrict != null)
                    ? 'Search thana...'
                    : 'Select district first',
                onChanged: (widget.permanentDivision != null &&
                        widget.permanentDistrict != null)
                    ? widget.onPermanentThanaChanged
                    : null,
                enabled: widget.permanentDivision != null &&
                    widget.permanentDistrict != null,
                showClearButton: true,
                showSelectedChips: true,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _businessSection() {
    return FormCard(
      icon: Icons.business_center_outlined,
      title: 'Business Address',
      description: 'Where do you operate from?',
      children: [
        CustomTextField(
          label: 'Address',
          value: widget.businessAddress,
          onChanged: widget.onBusinessAddressChanged,
          hintText: 'Shop / Office address',
          maxLines: 3,
          validator: (v) =>
              (v == null || v.isEmpty) ? 'Please enter business address' : null,
        ),
        const SizedBox(height: 20),
        _label('Division'),
        SearchableDropdown(
          value: widget.businessDivision,
          items: LocationService.getDivisionNames(),
          hintText: 'Search division...',
          onChanged: (v) {
            widget.onBusinessDivisionChanged(v);
            widget.onBusinessDistrictChanged(null);
            widget.onBusinessThanaChanged(null);
          },
          showClearButton: true,
          showSelectedChips: true,
        ),
        const SizedBox(height: 18),
        _label('District'),
        SearchableDropdown(
          value: widget.businessDistrict,
          items: widget.businessDivision != null
              ? LocationService.getDistrictNames(widget.businessDivision!)
              : [],
          hintText: widget.businessDivision != null
              ? 'Search district...'
              : 'Select division first',
          onChanged: widget.businessDivision != null
              ? (v) {
                  widget.onBusinessDistrictChanged(v);
                  widget.onBusinessThanaChanged(null);
                }
              : null,
          enabled: widget.businessDivision != null,
          showClearButton: true,
          showSelectedChips: true,
        ),
        const SizedBox(height: 18),
        _label('Thana / Police Station'),
        SearchableDropdown(
          value: widget.businessThana,
          items: (widget.businessDivision != null &&
                  widget.businessDistrict != null)
              ? LocationService.getStationNames(
                  widget.businessDivision!,
                  widget.businessDistrict!,
                )
              : [],
          hintText: (widget.businessDivision != null &&
                  widget.businessDistrict != null)
              ? 'Search thana...'
              : 'Select district first',
          onChanged: (widget.businessDivision != null &&
                  widget.businessDistrict != null)
              ? widget.onBusinessThanaChanged
              : null,
          enabled: widget.businessDivision != null &&
              widget.businessDistrict != null,
          showClearButton: true,
          showSelectedChips: true,
        ),
      ],
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