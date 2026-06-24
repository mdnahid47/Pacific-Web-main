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
import '../custom_textfield.dart';
import '../searchable_dropdown.dart';
import '../../services/location_service.dart';

class Step2Content extends StatefulWidget {
  // Present Address Fields
  final String presentAddress;
  final String? presentDivision;
  final String? presentDistrict;
  final String? presentThana;

  // Permanent Address Fields
  final String permanentAddress;
  final String? permanentDivision;
  final String? permanentDistrict;
  final String? permanentThana;
  final bool sameAsPresentAddress;

  // Business Address Fields
  final String businessAddress;
  final String? businessDivision;
  final String? businessDistrict;
  final String? businessThana;

  // Callbacks for Present Address
  final ValueChanged<String> onPresentAddressChanged;
  final ValueChanged<String?> onPresentDivisionChanged;
  final ValueChanged<String?> onPresentDistrictChanged;
  final ValueChanged<String?> onPresentThanaChanged;

  // Callbacks for Permanent Address
  final ValueChanged<String> onPermanentAddressChanged;
  final ValueChanged<String?> onPermanentDivisionChanged;
  final ValueChanged<String?> onPermanentDistrictChanged;
  final ValueChanged<String?> onPermanentThanaChanged;
  final ValueChanged<bool> onSameAsPresentChanged;

  // Callbacks for Business Address
  final ValueChanged<String> onBusinessAddressChanged;
  final ValueChanged<String?> onBusinessDivisionChanged;
  final ValueChanged<String?> onBusinessDistrictChanged;
  final ValueChanged<String?> onBusinessThanaChanged;

  const Step2Content({
    super.key,
    // Present Address
    required this.presentAddress,
    required this.presentDivision,
    required this.presentDistrict,
    required this.presentThana,

    // Permanent Address
    required this.permanentAddress,
    required this.permanentDivision,
    required this.permanentDistrict,
    required this.permanentThana,
    required this.sameAsPresentAddress,

    // Business Address
    required this.businessAddress,
    required this.businessDivision,
    required this.businessDistrict,
    required this.businessThana,

    // Present Address Callbacks
    required this.onPresentAddressChanged,
    required this.onPresentDivisionChanged,
    required this.onPresentDistrictChanged,
    required this.onPresentThanaChanged,

    // Permanent Address Callbacks
    required this.onPermanentAddressChanged,
    required this.onPermanentDivisionChanged,
    required this.onPermanentDistrictChanged,
    required this.onPermanentThanaChanged,
    required this.onSameAsPresentChanged,

    // Business Address Callbacks
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

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    if (!LocationService.isLoaded) {
      await LocationService.loadLocations();
    }
    setState(() => _isLoading = false);
  }

  // Copy present address to permanent address
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

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Present Address Section
          FormCard(
            icon: Icons.home,
            title: 'Present Address',
            children: [
              CustomTextField(
                label: 'Present Address',
                value: widget.presentAddress,
                onChanged: widget.onPresentAddressChanged,
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter present address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),

              _buildLabel('Division'),
              SearchableDropdown(
                value: widget.presentDivision,
                items: LocationService.getDivisionNames(),
                hintText: 'Search division...',
                onChanged: (value) {
                  widget.onPresentDivisionChanged(value);
                  widget.onPresentDistrictChanged(null);
                  widget.onPresentThanaChanged(null);
                },
                enabled: true,
                showClearButton: true,
                isMultiSelect: false,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                showSelectedChips: true,
              ),
              const SizedBox(height: 20),

              _buildLabel('District'),
              SearchableDropdown(
                value: widget.presentDistrict,
                items: widget.presentDivision != null
                    ? LocationService.getDistrictNames(widget.presentDivision!)
                    : [],
                hintText: widget.presentDivision != null
                    ? 'Search district...'
                    : 'Select division first',
                onChanged: widget.presentDivision != null
                    ? (value) {
                        widget.onPresentDistrictChanged(value);
                        widget.onPresentThanaChanged(null);
                      }
                    : null,
                enabled: widget.presentDivision != null,
                showClearButton: true,
                isMultiSelect: false,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                showSelectedChips: true,
              ),
              const SizedBox(height: 20),

              _buildLabel('Thana/Police Station'),
              SearchableDropdown(
                value: widget.presentThana,
                items:
                    widget.presentDivision != null &&
                        widget.presentDistrict != null
                    ? LocationService.getStationNames(
                        widget.presentDivision!,
                        widget.presentDistrict!,
                      )
                    : [],
                hintText:
                    widget.presentDivision != null &&
                        widget.presentDistrict != null
                    ? 'Search thana...'
                    : 'Select district first',
                onChanged:
                    widget.presentDivision != null &&
                        widget.presentDistrict != null
                    ? widget.onPresentThanaChanged
                    : null,
                enabled:
                    widget.presentDivision != null &&
                    widget.presentDistrict != null,
                showClearButton: true,
                isMultiSelect: false,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                showSelectedChips: true,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Permanent Address Section
          FormCard(
            icon: Icons.location_city,
            title: 'Permanent Address',
            children: [
              // Checkbox for same as present address
              Row(
                children: [
                  Checkbox(
                    value: widget.sameAsPresentAddress,
                    onChanged: (value) {
                      widget.onSameAsPresentChanged(value ?? false);
                      if (value == true) {
                        _copyPresentToPermanent();
                      }
                    },
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Same as Present Address',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[700],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              if (!widget.sameAsPresentAddress) ...[
                CustomTextField(
                  label: 'Permanent Address',
                  value: widget.permanentAddress,
                  onChanged: widget.onPermanentAddressChanged,
                  maxLines: 3,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter permanent address';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                _buildLabel('Division'),
                SearchableDropdown(
                  value: widget.permanentDivision,
                  items: LocationService.getDivisionNames(),
                  hintText: 'Search division...',
                  onChanged: (value) {
                    widget.onPermanentDivisionChanged(value);
                    widget.onPermanentDistrictChanged(null);
                    widget.onPermanentThanaChanged(null);
                  },
                  enabled: !widget.sameAsPresentAddress,
                  showClearButton: true,
                  isMultiSelect: false,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  showSelectedChips: true,
                ),
                const SizedBox(height: 20),

                _buildLabel('District'),
                SearchableDropdown(
                  value: widget.permanentDistrict,
                  items: widget.permanentDivision != null
                      ? LocationService.getDistrictNames(
                          widget.permanentDivision!,
                        )
                      : [],
                  hintText: widget.permanentDivision != null
                      ? 'Search district...'
                      : 'Select division first',
                  onChanged:
                      !widget.sameAsPresentAddress &&
                          widget.permanentDivision != null
                      ? (value) {
                          widget.onPermanentDistrictChanged(value);
                          widget.onPermanentThanaChanged(null);
                        }
                      : null,
                  enabled:
                      !widget.sameAsPresentAddress &&
                      widget.permanentDivision != null,
                  showClearButton: true,
                  isMultiSelect: false,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  showSelectedChips: true,
                ),
                const SizedBox(height: 20),

                _buildLabel('Thana/Police Station'),
                SearchableDropdown(
                  value: widget.permanentThana,
                  items:
                      widget.permanentDivision != null &&
                          widget.permanentDistrict != null
                      ? LocationService.getStationNames(
                          widget.permanentDivision!,
                          widget.permanentDistrict!,
                        )
                      : [],
                  hintText:
                      widget.permanentDivision != null &&
                          widget.permanentDistrict != null
                      ? 'Search thana...'
                      : 'Select district first',
                  onChanged:
                      !widget.sameAsPresentAddress &&
                          widget.permanentDivision != null &&
                          widget.permanentDistrict != null
                      ? widget.onPermanentThanaChanged
                      : null,
                  enabled:
                      !widget.sameAsPresentAddress &&
                      widget.permanentDivision != null &&
                      widget.permanentDistrict != null,
                  showClearButton: true,
                  isMultiSelect: false,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  showSelectedChips: true,
                ),
              ],
            ],
          ),

          const SizedBox(height: 24),

          // Business Address Section
          FormCard(
            icon: Icons.business,
            title: 'Business Address',
            children: [
              CustomTextField(
                label: 'Business Address',
                value: widget.businessAddress,
                onChanged: widget.onBusinessAddressChanged,
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter business address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),

              _buildLabel('Division'),
              SearchableDropdown(
                value: widget.businessDivision,
                items: LocationService.getDivisionNames(),
                hintText: 'Search division...',
                onChanged: (value) {
                  widget.onBusinessDivisionChanged(value);
                  widget.onBusinessDistrictChanged(null);
                  widget.onBusinessThanaChanged(null);
                },
                enabled: true,
                showClearButton: true,
                isMultiSelect: false,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                showSelectedChips: true,
              ),
              const SizedBox(height: 20),

              _buildLabel('District'),
              SearchableDropdown(
                value: widget.businessDistrict,
                items: widget.businessDivision != null
                    ? LocationService.getDistrictNames(widget.businessDivision!)
                    : [],
                hintText: widget.businessDivision != null
                    ? 'Search district...'
                    : 'Select division first',
                onChanged: widget.businessDivision != null
                    ? (value) {
                        widget.onBusinessDistrictChanged(value);
                        widget.onBusinessThanaChanged(null);
                      }
                    : null,
                enabled: widget.businessDivision != null,
                showClearButton: true,
                isMultiSelect: false,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                showSelectedChips: true,
              ),
              const SizedBox(height: 20),

              _buildLabel('Thana/Police Station'),
              SearchableDropdown(
                value: widget.businessThana,
                items:
                    widget.businessDivision != null &&
                        widget.businessDistrict != null
                    ? LocationService.getStationNames(
                        widget.businessDivision!,
                        widget.businessDistrict!,
                      )
                    : [],
                hintText:
                    widget.businessDivision != null &&
                        widget.businessDistrict != null
                    ? 'Search thana...'
                    : 'Select district first',
                onChanged:
                    widget.businessDivision != null &&
                        widget.businessDistrict != null
                    ? widget.onBusinessThanaChanged
                    : null,
                enabled:
                    widget.businessDivision != null &&
                    widget.businessDistrict != null,
                showClearButton: true,
                isMultiSelect: false,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                showSelectedChips: true,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: Colors.grey[700],
        ),
      ),
    );
  }
}
