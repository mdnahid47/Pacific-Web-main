import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

import 'package:pacific_app/components/step_content/step6_content.dart';
import 'package:pacific_app/models/file_model.dart';

import '../../config/app_colors.dart';
import '../../widgets/modern_step_indicator.dart';
import '../../components/step_content/step1_content.dart';
import '../../components/step_content/step2_content.dart';
import '../../components/step_content/step3_content.dart';
import '../../components/step_content/step4_content.dart' as step4;
import '../../components/step_content/step5_content.dart';
import '../../components/navigation_buttons.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  int _currentStep = 0;
  bool _isLoading = false;
  bool _isSubmitted = false;
  final bool _isImageProcessing = false;

  // Present Address
  String _presentAddress = '';
  String? _presentDivision;
  String? _presentDistrict;
  String? _presentThana;

  // Permanent Address
  String _permanentAddress = '';
  String? _permanentDivision;
  String? _permanentDistrict;
  String? _permanentThana;
  bool _sameAsPresentAddress = false;

  // Business Address
  String _businessAddress = '';
  String? _businessDivision;
  String? _businessDistrict;
  String? _businessThana;

  // Step 1
  String _name = '';
  String _email = '';
  String _phone = '';
  DateTime _dob = DateTime.now();
  String _nidNumber = '';
  String _companyName = '';
  String _businessDescription = '';

  // Step 4
  String _password = '';
  String _confirmPassword = '';
  bool _showPassword = false;
  bool _showConfirmPassword = false;

  // Step 3
  String? _serviceDivision;
  String? _serviceDistrict;
  List<String> _selectedServiceThanas = [];
  AppFile? _cvFile;
  AppFile? _tradeLicenseFile;

  // Step 5
  AppFile? _selfieImage;
  AppFile? _nidFrontImage;
  AppFile? _nidBackImage;

  static const List<String> _stepLabels = [
    'Personal',
    'Address',
    'Services',
    'Password',
    'KYC',
    'Review',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppColors.text, size: 20),
          onPressed: _handleBackPress,
        ),
        title: const Text(
          'Vendor Registration',
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w700,
            color: AppColors.text,
            letterSpacing: -0.3,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: AppColors.border),
        ),
      ),
      body: Column(
        children: [
          // ✅ Modern step indicator (only when not submitted)
          Offstage(
            offstage: _isSubmitted,
            child: _isSubmitted
                ? const SizedBox.shrink()
                : ModernStepIndicator(
                    currentStep: _currentStep,
                    steps: _stepLabels,
                    onStepTap: (index) {
                      if (index < _currentStep) {
                        setState(() => _currentStep = index);
                      }
                    },
                  ),
          ),

          // ✅ Step content with slide + fade transition
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 350),
              switchInCurve: Curves.easeOutCubic,
              switchOutCurve: Curves.easeInCubic,
              transitionBuilder: (child, animation) {
                final offset = Tween<Offset>(
                  begin: const Offset(0.06, 0),
                  end: Offset.zero,
                ).animate(animation);
                return FadeTransition(
                  opacity: animation,
                  child: SlideTransition(
                    position: offset,
                    child: child,
                  ),
                );
              },
              child: KeyedSubtree(
                key: ValueKey(_currentStep),
                child: _buildStepContent(),
              ),
            ),
          ),

          // ✅ Navigation buttons (only when not submitted)
          Offstage(
            offstage: _isSubmitted,
            child: _isSubmitted
                ? const SizedBox.shrink()
                : NavigationButtons(
                    currentStep: _currentStep,
                    isLoading: _isLoading,
                    onPrevious: _goToPreviousStep,
                    onNext: _goToNextStep,
                    onSubmit:
                        _currentStep == 5 ? _showSubmitConfirmation : null,
                    totalSteps: 6,
                  ),
          ),
        ],
      ),
    );
  }

  // ── Step content router ────────────────────────────────────
  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildStep1Content();
      case 1:
        return _buildStep2Content();
      case 2:
        return _buildStep3Content();
      case 3:
        return _buildStep4Content();
      case 4:
        return _buildStep5Content();
      case 5:
        return _buildStep6Content();
      default:
        return _buildStep1Content();
    }
  }

  // ── Step 1 ────────────────────────────────────────────────
  Widget _buildStep1Content() {
    return Step1Content(
      name: _name,
      email: _email,
      phone: _phone,
      dob: _dob,
      nidNumber: _nidNumber,
      businessName: _companyName,
      businessDescription: _businessDescription,
      onNameChanged: (v) => setState(() => _name = v),
      onEmailChanged: (v) => setState(() => _email = v),
      onPhoneChanged: (v) => setState(() => _phone = v),
      onDobChanged: (v) => setState(() => _dob = v),
      onNidNumberChanged: (v) => setState(() => _nidNumber = v),
      onBusinessNameChanged: (v) => setState(() => _companyName = v),
      onBusinessDescriptionChanged: (v) =>
          setState(() => _businessDescription = v),
    );
  }

  // ── Step 2 ────────────────────────────────────────────────
  Widget _buildStep2Content() {
    return Step2Content(
      presentAddress: _presentAddress,
      presentDivision: _presentDivision,
      presentDistrict: _presentDistrict,
      presentThana: _presentThana,
      permanentAddress: _permanentAddress,
      permanentDivision: _permanentDivision,
      permanentDistrict: _permanentDistrict,
      permanentThana: _permanentThana,
      sameAsPresentAddress: _sameAsPresentAddress,
      businessAddress: _businessAddress,
      businessDivision: _businessDivision,
      businessDistrict: _businessDistrict,
      businessThana: _businessThana,
      onPresentAddressChanged: (v) => setState(() => _presentAddress = v),
      onPresentDivisionChanged: (v) => setState(() {
        _presentDivision = v;
        _presentDistrict = null;
        _presentThana = null;
      }),
      onPresentDistrictChanged: (v) => setState(() {
        _presentDistrict = v;
        _presentThana = null;
      }),
      onPresentThanaChanged: (v) => setState(() => _presentThana = v),
      onPermanentAddressChanged: (v) =>
          setState(() => _permanentAddress = v),
      onPermanentDivisionChanged: (v) => setState(() {
        _permanentDivision = v;
        _permanentDistrict = null;
        _permanentThana = null;
      }),
      onPermanentDistrictChanged: (v) => setState(() {
        _permanentDistrict = v;
        _permanentThana = null;
      }),
      onPermanentThanaChanged: (v) => setState(() => _permanentThana = v),
      onSameAsPresentChanged: (v) => setState(() {
        _sameAsPresentAddress = v;
        if (v) {
          _permanentAddress = _presentAddress;
          _permanentDivision = _presentDivision;
          _permanentDistrict = _presentDistrict;
          _permanentThana = _presentThana;
        }
      }),
      onBusinessAddressChanged: (v) => setState(() => _businessAddress = v),
      onBusinessDivisionChanged: (v) => setState(() {
        _businessDivision = v;
        _businessDistrict = null;
        _businessThana = null;
      }),
      onBusinessDistrictChanged: (v) => setState(() {
        _businessDistrict = v;
        _businessThana = null;
      }),
      onBusinessThanaChanged: (v) => setState(() => _businessThana = v),
    );
  }

  // ── Step 3 ────────────────────────────────────────────────
  Widget _buildStep3Content() {
    return Step3Content(
      selectedDivision: _serviceDivision,
      selectedDistrict: _serviceDistrict,
      selectedServiceThanas: _selectedServiceThanas,
      cvFile: _cvFile,
      tradeLicenseFile: _tradeLicenseFile,
      onDivisionChanged: (v) => setState(() {
        _serviceDivision = v;
        _serviceDistrict = null;
        _selectedServiceThanas = [];
      }),
      onDistrictChanged: (v) => setState(() {
        _serviceDistrict = v;
        _selectedServiceThanas = [];
      }),
      onServiceThanasChanged: (v) =>
          setState(() => _selectedServiceThanas = v),
      onPickCv: _pickCvFile,
      onPickTradeLicense: _pickTradeLicenseFile,
      onRemoveCv: _cvFile != null ? () => setState(() => _cvFile = null) : null,
      onRemoveTradeLicense: _tradeLicenseFile != null
          ? () => setState(() => _tradeLicenseFile = null)
          : null,
    );
  }

  // ── Step 4 ────────────────────────────────────────────────
  Widget _buildStep4Content() {
    return step4.Step4Content(
      password: _password,
      confirmPassword: _confirmPassword,
      showPassword: _showPassword,
      showConfirmPassword: _showConfirmPassword,
      onPasswordChanged: (v) => setState(() => _password = v),
      onConfirmPasswordChanged: (v) => setState(() => _confirmPassword = v),
      onTogglePassword: () => setState(() => _showPassword = !_showPassword),
      onToggleConfirmPassword: () =>
          setState(() => _showConfirmPassword = !_showConfirmPassword),
    );
  }

  // ── Step 5 ────────────────────────────────────────────────
  Widget _buildStep5Content() {
    return Step5Content(
      selfieImage: _selfieImage,
      nidFrontImage: _nidFrontImage,
      nidBackImage: _nidBackImage,
      onSelfieChanged: (f) => setState(() => _selfieImage = f),
      onNidFrontChanged: (f) => setState(() => _nidFrontImage = f),
      onNidBackChanged: (f) => setState(() => _nidBackImage = f),
      isImageProcessing: _isImageProcessing,
    );
  }

  // ── Step 6 ────────────────────────────────────────────────
  Widget _buildStep6Content() {
    return Step6Content(
      name: _name,
      email: _email,
      phone: _phone,
      dob: _dob,
      nidNumber: _nidNumber,
      password: _password,
      companyName: _companyName,
      presentAddress: _presentAddress,
      presentDivision: _presentDivision,
      presentDistrict: _presentDistrict,
      presentThana: _presentThana,
      permanentAddress: _permanentAddress,
      permanentDivision: _permanentDivision,
      permanentDistrict: _permanentDistrict,
      permanentThana: _permanentThana,
      sameAsPresentAddress: _sameAsPresentAddress,
      businessAddress: _businessAddress,
      businessDivision: _businessDivision,
      businessDistrict: _businessDistrict,
      businessThana: _businessThana,
      serviceDivision: _serviceDivision,
      serviceDistrict: _serviceDistrict,
      selectedServiceThanas: _selectedServiceThanas,
      cvFile: _cvFile,
      tradeLicenseFile: _tradeLicenseFile,
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

  // ── Navigation ────────────────────────────────────────────
  void _goToNextStep() {
    if (!_validateCurrentStep()) return;
    if (_currentStep < 5) {
      setState(() => _currentStep++);
    }
  }

  void _goToPreviousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  void _goToStep1() {
    setState(() => _currentStep = 0);
  }

  void _handleBackPress() {
    if (_currentStep > 0) {
      _goToPreviousStep();
    } else {
      Navigator.pop(context);
    }
  }

  // ── File pickers ──────────────────────────────────────────
  Future<void> _pickCvFile() async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'doc', 'docx'],
        allowMultiple: false,
      );
      if (result != null && result.files.isNotEmpty && mounted) {
        setState(() {
          _cvFile = AppFile.fromPlatformFile(result.files.first);
        });
      }
    } catch (e) {
      _showSnackBar('Failed to pick file: $e', isError: true);
    }
  }

  Future<void> _pickTradeLicenseFile() async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'],
        allowMultiple: false,
      );
      if (result != null && result.files.isNotEmpty && mounted) {
        setState(() {
          _tradeLicenseFile = AppFile.fromPlatformFile(result.files.first);
        });
      }
    } catch (e) {
      _showSnackBar('Failed to pick file: $e', isError: true);
    }
  }

  // ── Snackbar ──────────────────────────────────────────────
  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError ? Icons.error_outline : Icons.check_circle_outline,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        backgroundColor: isError ? AppColors.error : AppColors.success,
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  // ── Per-step validation ───────────────────────────────────
  bool _validateCurrentStep() {
    switch (_currentStep) {
      case 0:
        if (_name.isEmpty || _name.length < 3) {
          _showSnackBar('Name must be at least 3 characters', isError: true);
          return false;
        }
        if (_email.isEmpty || !_email.contains('@')) {
          _showSnackBar('Please enter a valid email', isError: true);
          return false;
        }
        if (_phone.isEmpty || _phone.length < 11) {
          _showSnackBar('Please enter a valid phone number', isError: true);
          return false;
        }
        if (_nidNumber.isEmpty || _nidNumber.length < 10) {
          _showSnackBar('NID must be 10–17 digits', isError: true);
          return false;
        }
        if (_companyName.isEmpty || _companyName.length < 3) {
          _showSnackBar('Company name must be at least 3 characters',
              isError: true);
          return false;
        }
        final age = DateTime.now().difference(_dob).inDays ~/ 365;
        if (age < 18) {
          _showSnackBar('You must be at least 18 years old', isError: true);
          return false;
        }
        return true;

      case 1:
        if (_presentAddress.isEmpty) {
          _showSnackBar('Please enter present address', isError: true);
          return false;
        }
        if (_presentDivision == null ||
            _presentDistrict == null ||
            _presentThana == null) {
          _showSnackBar('Please complete present address dropdowns',
              isError: true);
          return false;
        }
        if (!_sameAsPresentAddress) {
          if (_permanentAddress.isEmpty ||
              _permanentDivision == null ||
              _permanentDistrict == null ||
              _permanentThana == null) {
            _showSnackBar('Please complete permanent address', isError: true);
            return false;
          }
        }
        if (_businessAddress.isEmpty ||
            _businessDivision == null ||
            _businessDistrict == null ||
            _businessThana == null) {
          _showSnackBar('Please complete business address', isError: true);
          return false;
        }
        return true;

      case 2:
        if (_serviceDivision == null || _serviceDistrict == null) {
          _showSnackBar('Please select service division and district',
              isError: true);
          return false;
        }
        if (_selectedServiceThanas.isEmpty) {
          _showSnackBar('Please select at least one service thana',
              isError: true);
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
        return true;

      case 3:
        if (_password.length < 6) {
          _showSnackBar('Password must be at least 6 characters',
              isError: true);
          return false;
        }
        if (_password != _confirmPassword) {
          _showSnackBar('Passwords do not match', isError: true);
          return false;
        }
        return true;

      case 4:
        if (_selfieImage == null) {
          _showSnackBar('Please take a selfie', isError: true);
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
        return true;

      case 5:
        return true;

      default:
        return true;
    }
  }

  // ── Submit confirmation ───────────────────────────────────
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
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
        ),
        title: const Row(
          children: [
            Icon(Icons.check_circle_outline,
                color: AppColors.olympic, size: 24),
            SizedBox(width: 12),
            Text(
              'Confirm Submission',
              style: TextStyle(
                color: AppColors.text,
                fontWeight: FontWeight.w700,
                fontSize: 17,
              ),
            ),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Are you sure you want to submit your registration?',
              style: TextStyle(fontSize: 14, color: AppColors.text),
            ),
            SizedBox(height: 8),
            Text(
              'Please review all information carefully before proceeding.',
              style: TextStyle(fontSize: 12.5, color: AppColors.muted),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Review Again',
              style: TextStyle(
                color: AppColors.olympic,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _submitRegistration();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.success,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding:
                  const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
            ),
            child: const Text(
              'Submit Registration',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _submitRegistration() async {
    setState(() => _isLoading = true);
    try {
      await Future.delayed(const Duration(seconds: 3));
      _showSuccessDialog();
    } catch (error) {
      _showSnackBar('Registration failed: $error', isError: true);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // ── Success dialog ────────────────────────────────────────
  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
        ),
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: AppColors.success, size: 28),
            SizedBox(width: 12),
            Text(
              'Registration Successful!',
              style: TextStyle(
                color: AppColors.text,
                fontWeight: FontWeight.w700,
                fontSize: 17,
              ),
            ),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your vendor registration has been submitted successfully.',
              style: TextStyle(fontSize: 14, color: AppColors.text),
            ),
            SizedBox(height: 16),
            Text(
              'Next Steps',
              style: TextStyle(
                fontWeight: FontWeight.w700,
                color: AppColors.text,
              ),
            ),
            SizedBox(height: 8),
            _NextStep(text: 'Application review within 3–5 business days'),
            _NextStep(text: 'Confirmation email will be sent'),
            _NextStep(text: 'Team may contact for verification'),
          ],
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                setState(() => _isSubmitted = true);
                Navigator.pushReplacementNamed(context, '/login');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.olympic,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Continue to Login',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Full validation ───────────────────────────────────────
  bool _validateAllSteps() {
    final isPersonalValid = _name.isNotEmpty &&
        _name.length >= 3 &&
        _email.isNotEmpty &&
        _email.contains('@') &&
        _phone.isNotEmpty &&
        _companyName.isNotEmpty &&
        _companyName.length >= 3 &&
        DateTime.now().difference(_dob).inDays ~/ 365 >= 18;

    final isAddressValid = _presentAddress.isNotEmpty &&
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

    final isServiceValid = _serviceDivision != null &&
        _serviceDistrict != null &&
        _selectedServiceThanas.isNotEmpty;

    final isPasswordValid =
        _password.length >= 6 && _password == _confirmPassword;

    final isDocumentsValid = _cvFile != null && _tradeLicenseFile != null;

    final isKycValid =
        _selfieImage != null && _nidFrontImage != null && _nidBackImage != null;

    return isPersonalValid &&
        isAddressValid &&
        isServiceValid &&
        isPasswordValid &&
        isDocumentsValid &&
        isKycValid;
  }
}

// ── Small helper widget ────────────────────────────────────
class _NextStep extends StatelessWidget {
  final String text;
  const _NextStep({required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 6),
            child: Icon(Icons.circle, size: 5, color: AppColors.olympic),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 13, color: AppColors.text),
            ),
          ),
        ],
      ),
    );
  }
}