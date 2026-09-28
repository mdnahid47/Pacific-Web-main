import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:pacific_app/models/file_model.dart';
import 'package:pacific_app/config/env_config.dart';
import '../../config/app_colors.dart';

class Step6Content extends StatefulWidget {
  final String name;
  final String email;
  final String phone;
  final DateTime dob;
  final String nidNumber;
  final String password;
  final String companyName;
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
  final String? serviceDivision;
  final String? serviceDistrict;
  final List<String> selectedServiceThanas;
  final AppFile? cvFile;
  final AppFile? tradeLicenseFile;
  final AppFile? selfieImage;
  final AppFile? nidFrontImage;
  final AppFile? nidBackImage;
  final bool isLoading;
  final VoidCallback onEdit;
  final int currentStep;
  final Function(bool success, String message) onSubmissionComplete;

  const Step6Content({
    super.key,
    required this.name,
    required this.email,
    required this.phone,
    required this.dob,
    required this.nidNumber,
    required this.password,
    required this.companyName,
    required this.presentAddress,
    required this.presentDivision,
    required this.presentDistrict,
    required this.presentThana,
    required this.permanentAddress,
    required this.permanentDivision,
    required this.permanentDistrict,
    required this.permanentThana,
    required this.sameAsPresentAddress,
    required this.businessAddress,
    required this.businessDivision,
    required this.businessDistrict,
    required this.businessThana,
    required this.serviceDivision,
    required this.serviceDistrict,
    required this.selectedServiceThanas,
    required this.cvFile,
    required this.tradeLicenseFile,
    required this.selfieImage,
    required this.nidFrontImage,
    required this.nidBackImage,
    required this.isLoading,
    required this.onEdit,
    required this.currentStep,
    required this.onSubmissionComplete,
  });

  @override
  State<Step6Content> createState() => _Step6ContentState();
}

class _Step6ContentState extends State<Step6Content> {
  String get registerUrl => EnvConfig.registerUrl;
  String get healthUrl => EnvConfig.healthUrl;

  bool _isSubmitting = false;
  String? _errorMessage;
  String? _successMessage;
  bool _showValidationErrors = false;
  final List<String> _validationErrors = [];

  Future<void> _submitRegistration() async {
    if (_isSubmitting) return;

    if (!_validateForm()) {
      setState(() {
        _showValidationErrors = true;
        _errorMessage = 'Please resolve the issues below';
      });
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
      _successMessage = null;
      _showValidationErrors = false;
    });

    try {
      final reachable = await _checkServerConnection();
      if (!reachable) {
        _showServerUnavailableDialog();
        return;
      }

      final formData = await _buildFormData();
      final dio = Dio()
        ..options.connectTimeout =
            Duration(seconds: EnvConfig.connectionTimeout)
        ..options.sendTimeout = Duration(seconds: EnvConfig.sendTimeout)
        ..options.receiveTimeout = Duration(seconds: EnvConfig.receiveTimeout);

      final response = await dio.post(
        registerUrl,
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-App-Source': 'vendor_registration',
            'X-App-Version': EnvConfig.appVersion,
            'X-Device-Type': EnvConfig.deviceType,
          },
          validateStatus: (s) => s! < 500,
        ),
      );

      await _handleApiResponse(response);
    } on DioException catch (e) {
      _handleDioException(e);
    } catch (e) {
      _handleError('Unexpected error: $e', true);
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  bool _validateForm() {
    _validationErrors.clear();
    if (widget.name.isEmpty || widget.name.length < 3) {
      _validationErrors.add('Name must be at least 3 characters');
    }
    if (widget.email.isEmpty || !_isValidEmail(widget.email)) {
      _validationErrors.add('Enter a valid email');
    }
    if (widget.phone.isEmpty || widget.phone.length < 11) {
      _validationErrors.add('Phone must be at least 11 digits');
    }
    if (widget.nidNumber.isEmpty || widget.nidNumber.length < 10) {
      _validationErrors.add('NID must be at least 10 digits');
    }
    if (widget.password.isEmpty || widget.password.length < 6) {
      _validationErrors.add('Password must be at least 6 characters');
    }
    if (widget.companyName.isEmpty) {
      _validationErrors.add('Enter a company name');
    }
    if (widget.presentAddress.isEmpty) {
      _validationErrors.add('Enter a present address');
    }
    if (widget.businessAddress.isEmpty) {
      _validationErrors.add('Enter a business address');
    }
    if (widget.serviceDivision == null) {
      _validationErrors.add('Select a service division');
    }
    if (widget.selectedServiceThanas.isEmpty) {
      _validationErrors.add('Select at least one service thana');
    }
    if (widget.cvFile == null) _validationErrors.add('Upload CV/Resume');
    if (widget.tradeLicenseFile == null) {
      _validationErrors.add('Upload Trade License');
    }
    if (widget.selfieImage == null) _validationErrors.add('Upload selfie');
    if (widget.nidFrontImage == null) {
      _validationErrors.add('Upload NID front image');
    }
    if (widget.nidBackImage == null) {
      _validationErrors.add('Upload NID back image');
    }
    return _validationErrors.isEmpty;
  }

  bool _isValidEmail(String email) =>
      RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(email);

  Future<FormData> _buildFormData() async {
    final fd = FormData.fromMap({
      'name': widget.name,
      'email': widget.email,
      'phone': widget.phone,
      'dob': widget.dob.toIso8601String().split('T')[0],
      'password': widget.password,
      'confirmPassword': widget.password,
      'nid_number': widget.nidNumber,
      'company_name': widget.companyName,
      'permanent_address': _fullAddress(widget.permanentAddress,
          widget.permanentThana, widget.permanentDistrict, widget.permanentDivision),
      'present_address': _fullAddress(widget.presentAddress,
          widget.presentThana, widget.presentDistrict, widget.presentDivision),
      'business_address': _fullAddress(widget.businessAddress,
          widget.businessThana, widget.businessDistrict, widget.businessDivision),
      'service_areas': jsonEncode(_serviceAreas()),
      'services': jsonEncode([]),
      'technician_quantity': 0,
      'registration_timestamp': DateTime.now().toIso8601String(),
      'app_version': EnvConfig.appVersion,
      'device_type': EnvConfig.deviceType,
    });

    await _addFile(fd, 'profile_image', widget.selfieImage);
    await _addFile(fd, 'nid_front', widget.nidFrontImage);
    await _addFile(fd, 'nid_back', widget.nidBackImage);
    await _addFile(fd, 'cv', widget.cvFile);
    await _addFile(fd, 'trade_license', widget.tradeLicenseFile);
    return fd;
  }

  Future<bool> _checkServerConnection() async {
    try {
      final dio = Dio()
        ..options.connectTimeout =
            Duration(seconds: EnvConfig.connectionTimeout)
        ..options.receiveTimeout = Duration(seconds: EnvConfig.receiveTimeout);
      final r = await dio.get(healthUrl);
      return r.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<void> _addFile(FormData fd, String name, AppFile? f) async {
    if (f == null) return;
    try {
      if (f.bytes != null && f.bytes!.isNotEmpty) {
        fd.files.add(MapEntry(
          name,
          MultipartFile.fromBytes(f.bytes!,
              filename: _genFilename(name, f.name)),
        ));
      } else if (f.path != null && f.path!.isNotEmpty) {
        final file = File(f.path!);
        if (await file.exists()) {
          fd.files.add(MapEntry(
            name,
            await MultipartFile.fromFile(f.path!,
                filename: _genFilename(name, f.name)),
          ));
        }
      }
    } catch (_) {}
  }

  String _genFilename(String field, String orig) {
    final ts = DateTime.now().millisecondsSinceEpoch;
    final r = DateTime.now().microsecondsSinceEpoch % 1000;
    final ext = orig.split('.').last.toLowerCase();
    return '${field.replaceAll('_', '-')}_${ts}_$r.$ext';
  }

  Future<void> _handleApiResponse(Response response) async {
    Map<String, dynamic>? m;
    if (response.data is Map) m = Map<String, dynamic>.from(response.data);

    if (response.statusCode == 200 || response.statusCode == 201) {
      final ok = (m?['success'] == true) ||
          (m?['status'] == 'success') ||
          (m?['error'] == null && m?['message'] != null);

      if (ok) {
        final msg = (m?['message'] as String?) ?? 'Registration successful!';
        if (mounted) {
          setState(() {
            _successMessage = msg;
            _errorMessage = null;
          });
        }
        widget.onSubmissionComplete(true, msg);
        _showSuccessDialog(msg, m?['id'] ?? m?['vendor_id']);
      } else {
        final msg = (m?['message'] as String?) ??
            (m?['error'] as String?) ??
            'Registration failed';
        _handleError(msg, false);
      }
    } else {
      _handleError('Server error: ${response.statusCode}', false);
    }
  }

  void _handleDioException(DioException e) {
    String msg = 'Network error. Check your internet.';
    if (e.response != null) {
      final d = e.response!.data;
      if (d is Map) {
        msg = (d['message'] as String?) ?? (d['error'] as String?) ?? msg;
      }
      switch (e.response!.statusCode) {
        case 400:
          msg = 'Bad request. Check your info.';
          break;
        case 409:
          msg = 'Email/phone already registered.';
          break;
        case 422:
          msg = 'Validation failed. Check your info.';
          break;
        case 500:
          msg = 'Server error. Try again later.';
          break;
      }
    } else if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      msg = 'Connection timeout.';
    } else if (e.type == DioExceptionType.connectionError) {
      msg = 'Connection error. Check your internet.';
    }
    _handleError(msg, true);
  }

  void _handleError(String msg, bool network) {
    if (mounted) {
      setState(() {
        _errorMessage = msg;
        _successMessage = null;
      });
    }
    widget.onSubmissionComplete(false, msg);
    if (network) _showErrorDialog(msg);
  }

  void _showServerUnavailableDialog() {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.cloud_off, color: AppColors.warning),
            SizedBox(width: 10),
            Text('Server unavailable'),
          ],
        ),
        content: const Text('Could not connect to the server.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() => _isSubmitting = false);
            },
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _submitRegistration();
            },
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String msg) {
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.error_outline, color: AppColors.error),
            SizedBox(width: 10),
            Text('Registration failed'),
          ],
        ),
        content: Text(msg),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(String msg, dynamic id) {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: AppColors.success),
            SizedBox(width: 10),
            Text('Registration Successful!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(msg),
            if (id != null) ...[
              const SizedBox(height: 14),
              const Text('Registration ID:'),
              Text(
                id.toString(),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  List<String> _serviceAreas() {
    final list = <String>[];
    if (widget.serviceDivision != null && widget.serviceDistrict != null) {
      for (final t in widget.selectedServiceThanas) {
        list.add('$t, ${widget.serviceDistrict}, ${widget.serviceDivision}');
      }
    }
    return list;
  }

  String _fullAddress(String a, String? th, String? d, String? dv) {
    final parts = <String>[];
    if (a.isNotEmpty) parts.add(a);
    if (th != null && th.isNotEmpty) parts.add(th);
    if (d != null && d.isNotEmpty) parts.add(d);
    if (dv != null && dv.isNotEmpty) parts.add(dv);
    return parts.isEmpty ? 'Not provided' : parts.join(', ');
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 40),
      child: Column(
        children: [
          _header(),
          const SizedBox(height: 20),

          // ✅ Stable structure with Offstage
          Offstage(
            offstage: _errorMessage == null,
            child: _errorMessage == null
                ? const SizedBox(width: double.infinity)
                : _messageCard(_errorMessage!, true),
          ),
          Offstage(
            offstage: _successMessage == null,
            child: _successMessage == null
                ? const SizedBox(width: double.infinity)
                : _messageCard(_successMessage!, false),
          ),
          Offstage(
            offstage: !(_showValidationErrors && _validationErrors.isNotEmpty),
            child: _validationCard(),
          ),
          const SizedBox(height: 16),

          _summaryCard(
            icon: Icons.person_outline_rounded,
            title: 'Personal Information',
            items: [
              ('Name', widget.name),
              ('Email', widget.email),
              ('Phone', widget.phone),
              ('NID', widget.nidNumber),
              ('Date of Birth',
                  '${widget.dob.day}/${widget.dob.month}/${widget.dob.year}'),
              ('Company', widget.companyName),
            ],
          ),
          const SizedBox(height: 16),
          _summaryCard(
            icon: Icons.home_outlined,
            title: 'Present Address',
            items: [
              ('Address', widget.presentAddress),
              ('Division', widget.presentDivision ?? '—'),
              ('District', widget.presentDistrict ?? '—'),
              ('Thana', widget.presentThana ?? '—'),
            ],
          ),
          const SizedBox(height: 16),
          _summaryCard(
            icon: Icons.location_city_outlined,
            title: 'Permanent Address',
            items: widget.sameAsPresentAddress
                ? [('Same as present address', 'Yes')]
                : [
                    ('Address', widget.permanentAddress),
                    ('Division', widget.permanentDivision ?? '—'),
                    ('District', widget.permanentDistrict ?? '—'),
                    ('Thana', widget.permanentThana ?? '—'),
                  ],
          ),
          const SizedBox(height: 16),
          _summaryCard(
            icon: Icons.business_center_outlined,
            title: 'Business Address',
            items: [
              ('Address', widget.businessAddress),
              ('Division', widget.businessDivision ?? '—'),
              ('District', widget.businessDistrict ?? '—'),
              ('Thana', widget.businessThana ?? '—'),
            ],
          ),
          const SizedBox(height: 16),
          _summaryCard(
            icon: Icons.map_outlined,
            title: 'Service Area',
            items: [
              ('Division', widget.serviceDivision ?? '—'),
              ('District', widget.serviceDistrict ?? '—'),
              ('Thanas', widget.selectedServiceThanas.join(', ')),
              ('Total', '${widget.selectedServiceThanas.length}'),
            ],
          ),
          const SizedBox(height: 16),
          _summaryCard(
            icon: Icons.attach_file_rounded,
            title: 'Documents',
            items: [
              ('CV / Resume', widget.cvFile != null ? 'Uploaded' : 'Not uploaded'),
              ('Trade License',
                  widget.tradeLicenseFile != null ? 'Uploaded' : 'Not uploaded'),
            ],
          ),
          const SizedBox(height: 16),
          _summaryCard(
            icon: Icons.verified_user_outlined,
            title: 'KYC',
            items: [
              ('Selfie', widget.selfieImage != null ? 'Uploaded' : 'Not uploaded'),
              ('NID Front',
                  widget.nidFrontImage != null ? 'Uploaded' : 'Not uploaded'),
              ('NID Back',
                  widget.nidBackImage != null ? 'Uploaded' : 'Not uploaded'),
            ],
          ),
          const SizedBox(height: 32),

          // ✅ Always visible
          _submitButton(),
          const SizedBox(height: 12),
          _editButton(),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _header() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.olympic, AppColors.primaryLight],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.olympic.withValues(alpha: 0.25),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_outline,
              color: Colors.white,
              size: 34,
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            'Review & Submit',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Please review your information before submitting.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13.5,
              color: Colors.white.withValues(alpha: 0.9),
            ),
          ),
        ],
      ),
    );
  }

  Widget _messageCard(String msg, bool isError) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: isError ? AppColors.errorSoft : AppColors.successSoft,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isError
              ? AppColors.error.withValues(alpha: 0.25)
              : AppColors.success.withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isError ? Icons.error_outline : Icons.check_circle_outline,
            color: isError ? AppColors.error : AppColors.success,
            size: 20,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              msg,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isError ? AppColors.error : AppColors.success,
              ),
            ),
          ),
          if (isError)
            IconButton(
              onPressed: () => setState(() => _errorMessage = null),
              icon: const Icon(Icons.close, size: 16),
              splashRadius: 18,
            ),
        ],
      ),
    );
  }

  Widget _validationCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.warningSoft,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: AppColors.warning),
              SizedBox(width: 10),
              Text(
                'Validation Errors',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ..._validationErrors.map(
            (e) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 3),
              child: Row(
                children: [
                  const Icon(Icons.circle, size: 5, color: AppColors.warning),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(e, style: const TextStyle(fontSize: 13)),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          TextButton.icon(
            onPressed: widget.onEdit,
            icon: const Icon(Icons.edit, size: 16),
            label: const Text('Edit information'),
          ),
        ],
      ),
    );
  }

  Widget _summaryCard({
    required IconData icon,
    required String title,
    required List<(String, String)> items,
  }) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
            child: Row(
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
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.border),
          ...items.map(
            (e) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      e.$1,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.muted,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: Text(
                      e.$2,
                      textAlign: TextAlign.right,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.text,
                      ),
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

  Widget _submitButton() {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        onPressed:
            (_isSubmitting || widget.isLoading) ? null : _submitRegistration,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.olympic,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          elevation: 0,
        ),
        child: _isSubmitting
            ? const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2,
                    ),
                  ),
                  SizedBox(width: 12),
                  Text(
                    'Submitting...',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                  ),
                ],
              )
            : const Text(
                'Submit Registration',
                style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w700),
              ),
      ),
    );
  }

  Widget _editButton() {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: OutlinedButton.icon(
        onPressed: widget.onEdit,
        icon: const Icon(Icons.edit_outlined, size: 18),
        label: const Text('Edit Information'),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.olympic,
          side: const BorderSide(color: AppColors.olympic, width: 1.4),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }
}