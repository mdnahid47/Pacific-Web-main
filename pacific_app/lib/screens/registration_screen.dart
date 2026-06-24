import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:pacific_app/components/step_content/step6_content.dart';
import 'package:pacific_app/models/file_model.dart';
import 'package:pacific_app/services/image_picker_service.dart';
import '../components/step_indicator.dart';
import '../components/step_content/step1_content.dart';
import '../components/step_content/step2_content.dart';
import '../components/step_content/step3_content.dart';
import '../components/step_content/step4_content.dart' as step4;
import '../components/step_content/step5_content.dart';
import '../components/navigation_buttons.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;
  bool _isLoading = false;
  bool _isSubmitted = false;
  bool _isImageProcessing = false;

  // Present Address Variables
  String _presentAddress = '';
  String? _presentDivision;
  String? _presentDistrict;
  String? _presentThana;

  // Permanent Address Variables
  String _permanentAddress = '';
  String? _permanentDivision;
  String? _permanentDistrict;
  String? _permanentThana;
  bool _sameAsPresentAddress = false;

  // Business Address Variables
  String _businessAddress = '';
  String? _businessDivision;
  String? _businessDistrict;
  String? _businessThana;

  // Step 1 - Personal Information Variables
  String _name = '';
  String _email = '';
  String _phone = ''; // Made final as suggested
  DateTime _dob = DateTime.now();
  String _nidNumber = '';
  // Made final as unused
  String _companyName = '';
  // Made final as unused
  String _businessDescription = '';

  // Step 4 - Password Variables
  String _password = '';
  String _confirmPassword = '';
  bool _showPassword = false;
  bool _showConfirmPassword = false;

  // Step 3 - Service Areas and Documents Variables
  String? _serviceDivision;
  String? _serviceDistrict;
  List<String> _selectedServiceThanas = [];
  AppFile? _cvFile;
  AppFile? _tradeLicenseFile;

  // Step 5 - KYC Variables
  AppFile? _selfieImage;
  AppFile? _nidFrontImage;
  AppFile? _nidBackImage;

  // Image Picker instance
  final ImagePicker _imagePicker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Theme.of(context).primaryColor),
          onPressed: _handleBackPress,
        ),
        title: const Text('Vendor Registration'),
        actions: [
          if (_currentStep > 0 && !_isSubmitted)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Center(
                child: Text(
                  'Step ${_currentStep + 1}/6', // 6 steps
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          // Step Indicator - only if not submitted
          if (!_isSubmitted)
            CompactStepIndicator(
              currentStep: _currentStep,
              steps: const [
                'Personal Information',
                'Address',
                'Service Area & Documents',
                'Password',
                'KYC',
                'Review & Submit',
              ],
              totalSteps: 6,
            ),

          // Step Title - only if not submitted
          if (!_isSubmitted)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Text(
                _getStepTitle(),
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).primaryColor,
                ),
              ),
            ),

          // Form Content
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              children: <Widget>[
                // Step 1 - Personal Information
                Step1Content(
                  name: _name,
                  email: _email,
                  phone: _phone,
                  dob: _dob,
                  nidNumber: _nidNumber, // নতুন যোগ করুন
                  businessName: _companyName,
                  businessDescription: _businessDescription,
                  onNameChanged: (value) => setState(() => _name = value),
                  onEmailChanged: (value) => setState(() => _email = value),
                  onPhoneChanged: (value) => setState(() => _phone = value),
                  onDobChanged: (value) => setState(() => _dob = value),
                  onNidNumberChanged: (value) =>
                      setState(() => _nidNumber = value), // নতুন যোগ করুন
                  onBusinessNameChanged: (value) =>
                      setState(() => _companyName = value),
                  onBusinessDescriptionChanged: (value) =>
                      setState(() => _businessDescription = value),
                ),

                // Step 2 - Address
                _buildStep2Content(),

                // Step 3 - Service Areas & Documents
                _buildStep3Content(),

                // Step 4 - Password
                _buildStep4Content(),

                // Step 5 - KYC
                _buildStep5Content(),

                // Step 6 - Summary
                _buildStep6Content(),
              ],
            ),
          ),

          // Navigation Buttons - only if not submitted
          if (!_isSubmitted)
            NavigationButtons(
              currentStep: _currentStep,
              isLoading: _isLoading,
              onPrevious: _goToPreviousStep,
              onNext: _goToNextStep,
              onSubmit: _currentStep == 5 ? _showSubmitConfirmation : null,
              totalSteps: 6,
            ),
        ],
      ),
    );
  }

  // Step 2 Content
  Widget _buildStep2Content() {
    return Step2Content(
      // Present Address
      presentAddress: _presentAddress,
      presentDivision: _presentDivision,
      presentDistrict: _presentDistrict,
      presentThana: _presentThana,

      // Permanent Address
      permanentAddress: _permanentAddress,
      permanentDivision: _permanentDivision,
      permanentDistrict: _permanentDistrict,
      permanentThana: _permanentThana,
      sameAsPresentAddress: _sameAsPresentAddress,

      // Business Address
      businessAddress: _businessAddress,
      businessDivision: _businessDivision,
      businessDistrict: _businessDistrict,
      businessThana: _businessThana,

      // Present Address Callbacks
      onPresentAddressChanged: (value) =>
          setState(() => _presentAddress = value),
      onPresentDivisionChanged: (value) {
        setState(() {
          _presentDivision = value;
          _presentDistrict = null;
          _presentThana = null;
        });
      },
      onPresentDistrictChanged: (value) {
        setState(() {
          _presentDistrict = value;
          _presentThana = null;
        });
      },
      onPresentThanaChanged: (value) => setState(() => _presentThana = value),

      // Permanent Address Callbacks
      onPermanentAddressChanged: (value) =>
          setState(() => _permanentAddress = value),
      onPermanentDivisionChanged: (value) {
        setState(() {
          _permanentDivision = value;
          _permanentDistrict = null;
          _permanentThana = null;
        });
      },
      onPermanentDistrictChanged: (value) {
        setState(() {
          _permanentDistrict = value;
          _permanentThana = null;
        });
      },
      onPermanentThanaChanged: (value) =>
          setState(() => _permanentThana = value),
      onSameAsPresentChanged: (value) {
        setState(() {
          _sameAsPresentAddress = value;
          if (value) {
            // Copy present address to permanent address
            _permanentAddress = _presentAddress;
            _permanentDivision = _presentDivision;
            _permanentDistrict = _presentDistrict;
            _permanentThana = _presentThana;
          }
        });
      },

      // Business Address Callbacks
      onBusinessAddressChanged: (value) =>
          setState(() => _businessAddress = value),
      onBusinessDivisionChanged: (value) {
        setState(() {
          _businessDivision = value;
          _businessDistrict = null;
          _businessThana = null;
        });
      },
      onBusinessDistrictChanged: (value) {
        setState(() {
          _businessDistrict = value;
          _businessThana = null;
        });
      },
      onBusinessThanaChanged: (value) => setState(() => _businessThana = value),
    );
  }

  // Step 3 Content
  Widget _buildStep3Content() {
    return Step3Content(
      // Service Area
      selectedDivision: _serviceDivision,
      selectedDistrict: _serviceDistrict,
      selectedServiceThanas: _selectedServiceThanas,

      // Documents - now using AppFile
      cvFile: _cvFile,
      tradeLicenseFile: _tradeLicenseFile,

      // Service Area Callbacks
      onDivisionChanged: (value) {
        setState(() {
          _serviceDivision = value;
          _serviceDistrict = null;
          _selectedServiceThanas = [];
        });
      },
      onDistrictChanged: (value) {
        setState(() {
          _serviceDistrict = value;
          _selectedServiceThanas = [];
        });
      },
      onServiceThanasChanged: (value) =>
          setState(() => _selectedServiceThanas = value),

      // Documents Callbacks
      onPickCv: _pickCvFile,
      onPickTradeLicense: _pickTradeLicenseFile,
      onRemoveCv: _cvFile != null ? () => setState(() => _cvFile = null) : null,
      onRemoveTradeLicense: _tradeLicenseFile != null
          ? () => setState(() => _tradeLicenseFile = null)
          : null,
    );
  }

  // Step 4 Content - Password
  Widget _buildStep4Content() {
    return step4.Step4Content(
      password: _password,
      confirmPassword: _confirmPassword,
      showPassword: _showPassword,
      showConfirmPassword: _showConfirmPassword,
      onPasswordChanged: (value) => setState(() => _password = value),
      onConfirmPasswordChanged: (value) =>
          setState(() => _confirmPassword = value),
      onTogglePassword: () => setState(() => _showPassword = !_showPassword),
      onToggleConfirmPassword: () =>
          setState(() => _showConfirmPassword = !_showConfirmPassword),
    );
  }

  // Step 5 Content - KYC
  // Widget _buildStep5Content() {
  //   return Step5Content(
  //     selfieImage: _selfieImage,
  //     nidFrontImage: _nidFrontImage,
  //     nidBackImage: _nidBackImage,
  //     onTakeSelfie: _takeSelfieImage,
  //     onTakeNidFront: _takeNidFrontImage,
  //     onTakeNidBack: _takeNidBackImage,
  //     isImageProcessing: _isImageProcessing,
  //   );
  // }

  // Step 5 Content - KYC
  Widget _buildStep5Content() {
    return Step5Content(
      selfieImage: _selfieImage,
      nidFrontImage: _nidFrontImage,
      nidBackImage: _nidBackImage,
      onSelfieChanged: (file) => setState(() => _selfieImage = file),
      onNidFrontChanged: (file) => setState(() => _nidFrontImage = file),
      onNidBackChanged: (file) => setState(() => _nidBackImage = file),
      isImageProcessing: _isImageProcessing,
    );
  }

  // Step 6 Content - Review & Submit
  Widget _buildStep6Content() {
    return Step6Content(
      name: _name,
      email: _email,
      phone: _phone,
      dob: _dob,
      nidNumber: _nidNumber,
      password: _password,
      companyName: _companyName,

      // Present Address
      presentAddress: _presentAddress,
      presentDivision: _presentDivision,
      presentDistrict: _presentDistrict,
      presentThana: _presentThana,

      // Permanent Address
      permanentAddress: _permanentAddress,
      permanentDivision: _permanentDivision,
      permanentDistrict: _permanentDistrict,
      permanentThana: _permanentThana,
      sameAsPresentAddress: _sameAsPresentAddress,

      // Business Address
      businessAddress: _businessAddress,
      businessDivision: _businessDivision,
      businessDistrict: _businessDistrict,
      businessThana: _businessThana,

      // Service Area
      serviceDivision: _serviceDivision,
      serviceDistrict: _serviceDistrict,
      selectedServiceThanas: _selectedServiceThanas,

      // Documents
      cvFile: _cvFile,
      tradeLicenseFile: _tradeLicenseFile,

      // KYC
      selfieImage: _selfieImage,
      nidFrontImage: _nidFrontImage,
      nidBackImage: _nidBackImage,

      isLoading: _isLoading,
      onEdit: _goToStep1,
      currentStep: _currentStep,
      onSubmissionComplete: (success, message) {
        if (success) {
          _showSuccessDialog();
        } else {
          _showSnackBar(message, isError: true);
        }
      },
    );
  }

  String _getStepTitle() {
    const List<String> titles = [
      'Personal Information',
      'Address Information',
      'Service Area & Documents',
      'Password',
      'KYC Verification',
      'Review & Submit',
    ];
    return titles[_currentStep];
  }

  void _goToNextStep() {
    if (_validateCurrentStep()) {
      if (_currentStep < 5) {
        // 5 is the last step index (6 steps: 0-5)
        _pageController.nextPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
        setState(() {
          _currentStep++;
        });
      }
    }
  }

  void _goToPreviousStep() {
    if (_currentStep > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() {
        _currentStep--;
      });
    }
  }

  void _goToStep1() {
    _pageController.jumpToPage(0);
    setState(() {
      _currentStep = 0;
    });
  }

  void _handleBackPress() {
    if (_currentStep > 0) {
      _goToPreviousStep();
    } else {
      Navigator.pop(context);
    }
  }

  Future<void> _pickCvFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'doc', 'docx'],
        allowMultiple: false,
      );

      if (result != null && result.files.isNotEmpty) {
        final platformFile = result.files.first;
        if (mounted) {
          setState(() {
            _cvFile = AppFile.fromPlatformFile(platformFile);
          });
        }
      }
    } catch (e) {
      // Use debugPrint instead of print
      debugPrint('Error picking CV file: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to pick file: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _pickTradeLicenseFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'],
        allowMultiple: false,
      );

      if (result != null && result.files.isNotEmpty) {
        final platformFile = result.files.first;
        if (mounted) {
          setState(() {
            _tradeLicenseFile = AppFile.fromPlatformFile(platformFile);
          });
        }
      }
    } catch (e) {
      debugPrint('Error picking trade license file: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to pick file: ${e.toString()}')),
        );
      }
    }
  }

  // Image picker methods for KYC (Step 5)
  Future<void> _pickSelfieImage(BuildContext context) async {
    final image = await ImagePickerService.showImageSourceDialog(context);

    if (image != null && mounted) {
      setState(() {
        _selfieImage = image;
      });
      _showSnackBar('Selfie captured successfully');
    }
  }

  Future<void> _pickNidFrontImage(BuildContext context) async {
    final image = await ImagePickerService.showImageSourceDialog(context);

    if (image != null && mounted) {
      setState(() {
        _nidFrontImage = image;
      });
      _showSnackBar('NID front captured successfully');
    }
  }

  Future<void> _pickNidBackImage(BuildContext context) async {
    final image = await ImagePickerService.showImageSourceDialog(context);

    if (image != null && mounted) {
      setState(() {
        _nidBackImage = image;
      });
      _showSnackBar('NID back captured successfully');
    }
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError ? Icons.error_outline : Icons.check_circle,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(message, style: const TextStyle(color: Colors.white)),
            ),
          ],
        ),
        backgroundColor: isError
            ? const Color(0xFFef4444)
            : const Color(0xFF10b981),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  bool _validateCurrentStep() {
    switch (_currentStep) {
      case 0: // Step 1 - Personal Information
        if (_name.isEmpty || _name.length < 3) {
          _showSnackBar('Name must be at least 3 characters', isError: true);
          return false;
        }
        if (_email.isEmpty || !_email.contains('@')) {
          _showSnackBar('Please enter a valid email', isError: true);
          return false;
        }
        if (_phone.isEmpty || _phone.length < 11) {
          _showSnackBar('Please enter valid phone number', isError: true);
          return false;
        }
        if (_nidNumber.isEmpty || _nidNumber.length < 10) {
          // NID validation
          _showSnackBar(
            'Please enter valid NID number (10-17 digits)',
            isError: true,
          );
          return false;
        }
        if (_companyName.isEmpty || _companyName.length < 3) {
          _showSnackBar(
            'Company name must be at least 3 characters',
            isError: true,
          );
          return false;
        }
        final age = DateTime.now().difference(_dob).inDays ~/ 365;
        if (age < 18) {
          _showSnackBar('You must be at least 18 years old', isError: true);
          return false;
        }
        break;

      case 1: // Step 2 - Address Information
        // Present Address validation
        if (_presentAddress.isEmpty) {
          _showSnackBar('Please enter present address', isError: true);
          return false;
        }
        if (_presentDivision == null) {
          _showSnackBar('Please select present division', isError: true);
          return false;
        }
        if (_presentDistrict == null) {
          _showSnackBar('Please select present district', isError: true);
          return false;
        }
        if (_presentThana == null) {
          _showSnackBar('Please select present thana', isError: true);
          return false;
        }

        // Permanent Address validation
        if (!_sameAsPresentAddress) {
          if (_permanentAddress.isEmpty) {
            _showSnackBar('Please enter permanent address', isError: true);
            return false;
          }
          if (_permanentDivision == null) {
            _showSnackBar('Please select permanent division', isError: true);
            return false;
          }
          if (_permanentDistrict == null) {
            _showSnackBar('Please select permanent district', isError: true);
            return false;
          }
          if (_permanentThana == null) {
            _showSnackBar('Please select permanent thana', isError: true);
            return false;
          }
        }

        // Business Address validation
        if (_businessAddress.isEmpty) {
          _showSnackBar('Please enter business address', isError: true);
          return false;
        }
        if (_businessDivision == null) {
          _showSnackBar('Please select business division', isError: true);
          return false;
        }
        if (_businessDistrict == null) {
          _showSnackBar('Please select business district', isError: true);
          return false;
        }
        if (_businessThana == null) {
          _showSnackBar('Please select business thana', isError: true);
          return false;
        }
        break;

      case 2: // Step 3 - Service Areas and Documents
        if (_serviceDivision == null) {
          _showSnackBar(
            'Please select division for service area',
            isError: true,
          );
          return false;
        }
        if (_serviceDistrict == null) {
          _showSnackBar(
            'Please select district for service area',
            isError: true,
          );
          return false;
        }
        if (_selectedServiceThanas.isEmpty) {
          _showSnackBar(
            'Please select at least one thana for service area',
            isError: true,
          );
          return false;
        }
        if (_cvFile == null) {
          _showSnackBar('Please upload CV', isError: true);
          return false;
        }
        if (_tradeLicenseFile == null) {
          _showSnackBar('Please upload Trade License', isError: true);
          return false;
        }
        break;

      case 3: // Step 4 - Password
        if (_password.length < 6) {
          _showSnackBar(
            'Password must be at least 6 characters',
            isError: true,
          );
          return false;
        }
        if (_password != _confirmPassword) {
          _showSnackBar('Passwords do not match', isError: true);
          return false;
        }
        break;

      case 4: // Step 5 - KYC Verification
        if (_selfieImage == null) {
          _showSnackBar('Please take a selfie image', isError: true);
          return false;
        }
        if (_nidFrontImage == null) {
          _showSnackBar('Please capture NID front side', isError: true);
          return false;
        }
        if (_nidBackImage == null) {
          _showSnackBar('Please capture NID back side', isError: true);
          return false;
        }
        break;

      case 5: // Step 6 - Summary
        // Summary step doesn't need validation, just check if all previous steps are valid
        break;
    }

    return true;
  }

  void _showSubmitConfirmation() {
    if (!_validateAllSteps()) {
      _showSnackBar(
        'Please complete all required fields before submitting',
        isError: true,
      );
      return;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Icon(
              Icons.check_circle_outline,
              color: Color(0xFF3c8ce7),
              size: 24,
            ),
            const SizedBox(width: 12),
            Text(
              'Confirm Submission',
              style: TextStyle(
                color: const Color(0xFF1e293b),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Are you sure you want to submit your registration?',
              style: TextStyle(
                fontSize: 14,
                color: Color.fromARGB(255, 8, 8, 8),
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Please review all information carefully before proceeding.',
              style: TextStyle(
                fontSize: 12,
                color: Color.fromARGB(255, 5, 5, 5),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Review Again',
              style: TextStyle(color: Color(0xFF3c8ce7)),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _submitRegistration();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10b981),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Submit Registration'),
          ),
        ],
      ),
    );
  }

  Future<void> _submitRegistration() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 3));

      // Show success message
      _showSuccessDialog();
    } catch (error) {
      _showSnackBar('Registration failed: $error', isError: true);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.check_circle, color: Color(0xFF10b981), size: 30),
            const SizedBox(width: 12),
            const Text('Registration Successful!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Your vendor registration has been submitted successfully.'),
            SizedBox(height: 16),
            Text('Next Steps:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('• Application review within 3-5 business days'),
            Text('• Confirmation email will be sent'),
            Text('• Team may contact for verification'),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _isSubmitted = true;
              });
              // Navigate to login or home page
              Navigator.pushReplacementNamed(context, '/login');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF3c8ce7),
            ),
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  bool _validateAllSteps() {
    // Check all required fields
    bool isPersonalValid =
        _name.isNotEmpty &&
        _name.length >= 3 &&
        _email.isNotEmpty &&
        _email.contains('@') &&
        _phone.isNotEmpty &&
        _companyName.isNotEmpty &&
        _companyName.length >= 3 &&
        DateTime.now().difference(_dob).inDays ~/ 365 >= 18;

    bool isAddressValid =
        _presentAddress.isNotEmpty &&
        _presentDivision != null &&
        _presentDistrict != null &&
        _presentThana != null &&
        (_sameAsPresentAddress ||
            (_permanentAddress.isNotEmpty &&
                _permanentDivision != null &&
                _permanentDistrict != null &&
                _permanentThana != null)) &&
        _businessAddress.isNotEmpty &&
        _businessDivision != null &&
        _businessDistrict != null &&
        _businessThana != null;

    bool isServiceValid =
        _serviceDivision != null &&
        _serviceDistrict != null &&
        _selectedServiceThanas.isNotEmpty;

    bool isPasswordValid =
        _password.length >= 6 && _password == _confirmPassword;

    bool isDocumentsValid = _cvFile != null && _tradeLicenseFile != null;

    bool isKycValid =
        _selfieImage != null && _nidFrontImage != null && _nidBackImage != null;

    return isPersonalValid &&
        isAddressValid &&
        isServiceValid &&
        isPasswordValid &&
        isDocumentsValid &&
        isKycValid;
  }
}
