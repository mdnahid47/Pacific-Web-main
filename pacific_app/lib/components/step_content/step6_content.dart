import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'dart:convert';
import 'package:pacific_app/models/file_model.dart';

class Step6Content extends StatefulWidget {
  final String name;
  final String email;
  final String phone;
  final DateTime dob;
  final String nidNumber;
  final String password;
  final String companyName;

  // Present Address
  final String presentAddress;
  final String? presentDivision;
  final String? presentDistrict;
  final String? presentThana;

  // Permanent Address
  final String permanentAddress;
  final String? permanentDivision;
  final String? permanentDistrict;
  final String? permanentThana;
  final bool sameAsPresentAddress;

  // Business Address
  final String businessAddress;
  final String? businessDivision;
  final String? businessDistrict;
  final String? businessThana;

  // Service Area
  final String? serviceDivision;
  final String? serviceDistrict;
  final List<String> selectedServiceThanas;

  // Documents
  final AppFile? cvFile;
  final AppFile? tradeLicenseFile;

  // KYC
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
  // ✅ FIXED: CORRECT URL CONFIGURATION
  static const String baseUrl = 'http://localhost:5001';
  static const String registerEndpoint = '/api/vendor/register';
  static const String healthEndpoint = '/api/vendor/health';

  // ✅ Get full URLs
  String get registerUrl => '$baseUrl$registerEndpoint';
  String get healthUrl => '$baseUrl$healthEndpoint';

  bool _isSubmitting = false;
  String? _errorMessage;
  String? _successMessage;
  bool _showValidationErrors = false;
  List<String> _validationErrors = [];
  Map<String, dynamic>? _lastApiResponse;

  Future<void> _submitRegistration() async {
    if (_isSubmitting) return;

    if (!_validateForm()) {
      setState(() {
        _showValidationErrors = true;
        _errorMessage = 'দয়া করে নিচের সমস্যাগুলো সমাধান করুন:';
      });
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
      _successMessage = null;
      _showValidationErrors = false;
      _lastApiResponse = null;
    });

    try {
      // সার্ভার কানেকশন চেক করুন
      final isServerReachable = await _checkServerConnection();
      if (!isServerReachable) {
        _showServerUnavailableDialog();
        return;
      }

      // ফর্ম ডাটা তৈরি করুন
      final formData = await _buildFormData();

      // ডিবাগিং: ফর্ম ডাটা দেখুন
      debugPrint(
        '📋 FormData keys: ${formData.fields.map((e) => e.key).toList()}',
      );
      debugPrint(
        '📁 FormData files: ${formData.files.map((e) => e.key).toList()}',
      );

      // ✅ FIXED: Use Dio WITHOUT baseUrl
      final dio = Dio();

      // Set timeouts
      dio.options.connectTimeout = const Duration(seconds: 30);
      dio.options.sendTimeout = const Duration(seconds: 30);
      dio.options.receiveTimeout = const Duration(seconds: 30);

      debugPrint('✅ Making API request to: $registerUrl');

      // Add interceptors for debugging
      dio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            debugPrint('🚀 API Request to: ${options.uri}');
            debugPrint('📦 Headers: ${options.headers}');
            debugPrint('📤 Method: ${options.method}');
            return handler.next(options);
          },
          onResponse: (response, handler) {
            debugPrint('✅ API Response Status: ${response.statusCode}');
            debugPrint('📨 Response Headers: ${response.headers}');
            return handler.next(response);
          },
          onError: (error, handler) {
            debugPrint('❌ API Error Type: ${error.type}');
            debugPrint('❌ API Error Message: ${error.message}');
            return handler.next(error);
          },
        ),
      );

      // Make the POST request
      final response = await dio.post(
        registerUrl, // ✅ সরাসরি full URL
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-App-Source': 'vendor_registration',
            'X-App-Version': '1.0.0',
            'X-Request-ID': DateTime.now().millisecondsSinceEpoch.toString(),
          },
          validateStatus: (status) => status! < 500,
        ),
        onSendProgress: (sent, total) {
          if (total != -1) {
            final progress = (sent / total * 100).toStringAsFixed(1);
            debugPrint('📤 Upload progress: $progress%');
          }
        },
      );

      // রেসপন্স হ্যান্ডেল করুন
      await _handleApiResponse(response);
    } on DioException catch (e) {
      await _handleDioException(e);
    } catch (e, stackTrace) {
      await _handleGeneralException(e, stackTrace);
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  // Alternative: Use this simpler method
  Future<void> _submitRegistrationSimple() async {
    if (_isSubmitting) return;

    if (!_validateForm()) {
      setState(() {
        _showValidationErrors = true;
        _errorMessage = 'দয়া করে নিচের সমস্যাগুলো সমাধান করুন:';
      });
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
      _successMessage = null;
      _showValidationErrors = false;
      _lastApiResponse = null;
    });

    try {
      // সার্ভার কানেকশন চেক করুন
      final isServerReachable = await _checkServerConnection();
      if (!isServerReachable) {
        _showServerUnavailableDialog();
        return;
      }

      // ফর্ম ডাটা তৈরি করুন
      final formData = await _buildFormData();

      debugPrint('✅ Making API request to: $registerUrl');

      // Simple Dio instance
      final dio = Dio();

      // Make the request
      final response = await dio.post(
        registerUrl,
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        ),
      );

      await _handleApiResponse(response);
    } catch (e) {
      debugPrint('❌ Error: $e');
      _handleError('রেজিস্ট্রেশন ব্যর্থ: $e', true, null);
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  bool _validateForm() {
    _validationErrors.clear();

    if (widget.name.isEmpty || widget.name.length < 3) {
      _validationErrors.add('নাম কমপক্ষে ৩ অক্ষর হতে হবে');
    }

    if (widget.email.isEmpty || !_isValidEmail(widget.email)) {
      _validationErrors.add('সঠিক ইমেইল দিন');
    }

    if (widget.phone.isEmpty || widget.phone.length < 11) {
      _validationErrors.add('ফোন নাম্বার কমপক্ষে ১১ ডিজিট হতে হবে');
    }

    if (widget.nidNumber.isEmpty || widget.nidNumber.length < 10) {
      _validationErrors.add('এনআইডি নাম্বার কমপক্ষে ১০ ডিজিট হতে হবে');
    }

    if (widget.password.isEmpty || widget.password.length < 6) {
      _validationErrors.add('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
    }

    if (widget.companyName.isEmpty) {
      _validationErrors.add('কোম্পানি নাম দিন');
    }

    if (widget.presentAddress.isEmpty) {
      _validationErrors.add('বর্তমান ঠিকানা দিন');
    }

    if (widget.businessAddress.isEmpty) {
      _validationErrors.add('ব্যবসায়িক ঠিকানা দিন');
    }

    if (widget.serviceDivision == null) {
      _validationErrors.add('সার্ভিস ডিভিশন নির্বাচন করুন');
    }

    if (widget.selectedServiceThanas.isEmpty) {
      _validationErrors.add('কমপক্ষে একটি সার্ভিস থানা নির্বাচন করুন');
    }

    if (widget.cvFile == null) {
      _validationErrors.add('সিভি/রিজিউম আপলোড করুন');
    }

    if (widget.tradeLicenseFile == null) {
      _validationErrors.add('ট্রেড লাইসেন্স আপলোড করুন');
    }

    if (widget.selfieImage == null) {
      _validationErrors.add('সেলফি ছবি আপলোড করুন');
    }

    if (widget.nidFrontImage == null) {
      _validationErrors.add('এনআইডির সামনের দিকের ছবি আপলোড করুন');
    }

    if (widget.nidBackImage == null) {
      _validationErrors.add('এনআইডির পিছনের দিকের ছবি আপলোড করুন');
    }

    return _validationErrors.isEmpty;
  }

  bool _isValidEmail(String email) {
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    return emailRegex.hasMatch(email);
  }

  Future<FormData> _buildFormData() async {
    final formData = FormData.fromMap({
      'name': widget.name,
      'email': widget.email,
      'phone': widget.phone,
      'dob': widget.dob.toIso8601String().split('T')[0],
      'password': widget.password,
      'confirmPassword': widget.password,
      'nid_number': widget.nidNumber,
      'company_name': widget.companyName,

      'permanent_address': _buildFullAddress(
        widget.permanentAddress,
        widget.permanentThana,
        widget.permanentDistrict,
        widget.permanentDivision,
      ),
      'present_address': _buildFullAddress(
        widget.presentAddress,
        widget.presentThana,
        widget.presentDistrict,
        widget.presentDivision,
      ),
      'business_address': _buildFullAddress(
        widget.businessAddress,
        widget.businessThana,
        widget.businessDistrict,
        widget.businessDivision,
      ),

      'service_areas': jsonEncode(_buildServiceAreasForAPI()),
      'services': jsonEncode([]),
      'technician_quantity': 0,

      'registration_timestamp': DateTime.now().toIso8601String(),
      'app_version': '1.0.0',
      'device_type': 'web',
    });

    await _addFileToFormData(formData, 'profile_image', widget.selfieImage);
    await _addFileToFormData(formData, 'nid_front', widget.nidFrontImage);
    await _addFileToFormData(formData, 'nid_back', widget.nidBackImage);
    await _addFileToFormData(formData, 'cv', widget.cvFile);
    await _addFileToFormData(
      formData,
      'trade_license',
      widget.tradeLicenseFile,
    );

    return formData;
  }

  Future<bool> _checkServerConnection() async {
    try {
      final dio = Dio();
      dio.options.connectTimeout = const Duration(seconds: 5);
      dio.options.receiveTimeout = const Duration(seconds: 5);

      debugPrint('🔍 Checking server health at: $healthUrl');

      final response = await dio.get(healthUrl);

      if (response.statusCode == 200) {
        debugPrint('✅ Server is reachable and healthy');
        return true;
      } else {
        debugPrint('⚠️ Server returned status: ${response.statusCode}');
        return false;
      }
    } on DioException catch (e) {
      debugPrint('❌ Server connection failed: ${e.message}');
      return false;
    } catch (e) {
      debugPrint('❌ Unexpected error checking server: $e');
      return false;
    }
  }

  Future<void> _addFileToFormData(
    FormData formData,
    String fieldName,
    AppFile? appFile,
  ) async {
    if (appFile == null) {
      debugPrint('⚠️ $fieldName: No file provided');
      return;
    }

    try {
      if (appFile.bytes != null && appFile.bytes!.isNotEmpty) {
        final fileSize = appFile.bytes!.length;
        final filename = _generateFilename(fieldName, appFile.name);

        formData.files.add(
          MapEntry(
            fieldName,
            MultipartFile.fromBytes(appFile.bytes!, filename: filename),
          ),
        );

        debugPrint('✅ Added $fieldName: $filename ($fileSize bytes)');
      } else if (appFile.path != null && appFile.path!.isNotEmpty) {
        try {
          final file = File(appFile.path!);
          final exists = await file.exists();

          if (exists) {
            final fileSize = await file.length();
            if (fileSize > 0) {
              final filename = _generateFilename(fieldName, appFile.name);

              formData.files.add(
                MapEntry(
                  fieldName,
                  await MultipartFile.fromFile(
                    appFile.path!,
                    filename: filename,
                  ),
                ),
              );

              debugPrint('✅ Added $fieldName: $filename ($fileSize bytes)');
            }
          }
        } catch (e) {
          debugPrint('❌ $fieldName: Error processing file: $e');
        }
      }
    } catch (e) {
      debugPrint('❌ $fieldName: Error adding to form data: $e');
    }
  }

  String _generateFilename(String fieldName, String originalName) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final random = DateTime.now().microsecondsSinceEpoch % 1000;
    final extension = originalName.split('.').last.toLowerCase();
    final sanitizedFieldName = fieldName.replaceAll('_', '-');
    return '${sanitizedFieldName}_${timestamp}_$random.$extension';
  }

  Future<void> _handleApiResponse(Response response) async {
    final rawData = response.data;
    Map<String, dynamic>? responseMap;

    if (rawData is Map) {
      try {
        responseMap = Map<String, dynamic>.from(rawData);
      } catch (_) {
        responseMap = (rawData as Map).cast<String, dynamic>();
      }
    }

    _lastApiResponse = {
      'status': response.statusCode,
      'data': responseMap ?? rawData,
    };

    debugPrint('📊 API Response: ${jsonEncode(_lastApiResponse)}');

    if (response.statusCode == 200 || response.statusCode == 201) {
      if (responseMap != null) {
        final bool isSuccess =
            responseMap['success'] == true ||
            responseMap['status'] == 'success' ||
            (responseMap['error'] == null && responseMap['message'] != null);

        if (isSuccess) {
          final successMsg =
              responseMap['message'] ??
              responseMap['success_message'] ??
              'রেজিস্ট্রেশন সফল!';

          final registrationId =
              responseMap['registration_id'] ??
              responseMap['id'] ??
              responseMap['vendor_id'];

          if (mounted) {
            setState(() {
              _successMessage = successMsg;
              _errorMessage = null;
            });
          }

          widget.onSubmissionComplete(true, successMsg);
          _showSuccessDialog(successMsg, registrationId, responseMap);
        } else {
          final errorMsg =
              responseMap['message'] ??
              responseMap['error'] ??
              'রেজিস্ট্রেশন ব্যর্থ';
          _handleError(errorMsg, false, responseMap);
        }
      }
    } else {
      final errorMsg = 'সার্ভার এরর: ${response.statusCode}';
      _handleError(errorMsg, false, response.data);
    }
  }

  Future<void> _handleDioException(DioException e) async {
    String errorMsg = 'নেটওয়ার্ক এরর। ইন্টারনেট চেক করুন।';

    if (e.response != null) {
      final responseData = e.response!.data;
      final statusCode = e.response!.statusCode;

      if (responseData is Map) {
        errorMsg =
            responseData['message'] ??
            responseData['error'] ??
            'সার্ভার এরর: $statusCode';
      }

      switch (statusCode) {
        case 400:
          errorMsg = 'ভুল রিকোয়েস্ট। তথ্য চেক করুন।';
          break;
        case 409:
          errorMsg = 'ইমেইল/ফোন আগেই রেজিস্টার্ড।';
          break;
        case 422:
          errorMsg = 'ভ্যালিডেশন ব্যর্থ। তথ্য চেক করুন।';
          break;
        case 500:
          errorMsg = 'সার্ভার এরর। পরে চেষ্টা করুন।';
          break;
      }
    } else {
      switch (e.type) {
        case DioExceptionType.connectionTimeout:
          errorMsg = 'কানেকশন টাইমআউট।';
          break;
        case DioExceptionType.receiveTimeout:
          errorMsg = 'সার্ভার রেসপন্স দেরি করছে।';
          break;
        case DioExceptionType.connectionError:
          errorMsg = 'কানেকশন এরর। ইন্টারনেট চেক করুন।';
          break;
        default:
          errorMsg = 'নেটওয়ার্ক সমস্যা।';
      }
    }

    _handleError(errorMsg, true, null);
  }

  Future<void> _handleGeneralException(dynamic e, StackTrace stackTrace) async {
    debugPrint('❌ General Exception: $e');
    _handleError('অপ্রত্যাশিত এরর: $e', true, null);
  }

  void _handleError(String message, bool isNetworkError, dynamic responseData) {
    if (mounted) {
      setState(() {
        _errorMessage = message;
        _successMessage = null;
      });
    }

    widget.onSubmissionComplete(false, message);

    if (isNetworkError) {
      _showErrorDialog(message, responseData);
    }
  }

  void _showServerUnavailableDialog() {
    if (!mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.cloud_off, color: Colors.orange),
            SizedBox(width: 12),
            Text('সার্ভার unavailable'),
          ],
        ),
        content: const Text('সার্ভারে connect করা যাচ্ছে না।'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _isSubmitting = false;
              });
            },
            child: const Text('বাতিল'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _submitRegistration();
            },
            child: const Text('আবার চেষ্টা করুন'),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String message, dynamic responseData) {
    if (!mounted) return;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.error_outline, color: Colors.red),
            SizedBox(width: 12),
            Text('রেজিস্ট্রেশন ব্যর্থ'),
          ],
        ),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('ঠিক আছে'),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(
    String message,
    dynamic registrationId,
    Map<String, dynamic> responseData,
  ) {
    if (!mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green),
            SizedBox(width: 12),
            Text('রেজিস্ট্রেশন সফল!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(message),
            if (registrationId != null) ...[
              const SizedBox(height: 16),
              const Text('রেজিস্ট্রেশন আইডি:'),
              Text(
                registrationId.toString(),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
            child: const Text('কন্টিনিউ'),
          ),
        ],
      ),
    );
  }

  List<String> _buildServiceAreasForAPI() {
    List<String> serviceAreas = [];

    if (widget.serviceDivision != null && widget.serviceDistrict != null) {
      for (String thana in widget.selectedServiceThanas) {
        serviceAreas.add(
          '$thana, ${widget.serviceDistrict}, ${widget.serviceDivision}',
        );
      }
    }

    return serviceAreas;
  }

  String _buildFullAddress(
    String address,
    String? thana,
    String? district,
    String? division,
  ) {
    List<String> parts = [];
    if (address.isNotEmpty) parts.add(address);
    if (thana != null && thana.isNotEmpty) parts.add(thana);
    if (district != null && district.isNotEmpty) parts.add(district);
    if (division != null && division.isNotEmpty) parts.add(division);
    return parts.isNotEmpty ? parts.join(', ') : 'Not provided';
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildHeader(context),
          const SizedBox(height: 24),

          if (_errorMessage != null) _buildMessageCard(_errorMessage!, true),
          if (_successMessage != null)
            _buildMessageCard(_successMessage!, false),

          if (_showValidationErrors && _validationErrors.isNotEmpty)
            _buildValidationErrorsCard(),

          const SizedBox(height: 16),

          _buildPersonalInfoCard(context),
          const SizedBox(height: 16),
          _buildPresentAddressCard(context),
          const SizedBox(height: 16),
          _buildPermanentAddressCard(context),
          const SizedBox(height: 16),
          _buildBusinessAddressCard(context),
          const SizedBox(height: 16),
          _buildServiceAreaCard(context),
          const SizedBox(height: 16),
          _buildDocumentsCard(context),
          const SizedBox(height: 16),
          _buildKycCard(context),

          const SizedBox(height: 32),

          if (widget.currentStep == 5) _buildSubmitButton(context),

          const SizedBox(height: 16),

          if (widget.currentStep == 5) _buildEditButton(context),

          if (_lastApiResponse != null) _buildDebugInfoCard(),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildDebugInfoCard() {
    return Container(
      padding: const EdgeInsets.all(12),
      margin: const EdgeInsets.only(top: 16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.bug_report, size: 16, color: Colors.blue),
              SizedBox(width: 8),
              Text('ডিবাগ তথ্য', style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          Text('API URL: $registerUrl', style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildValidationErrorsCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFfff7ed),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFfed7aa)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.warning_amber, color: Color(0xFFf97316)),
              const SizedBox(width: 12),
              const Text(
                'ভ্যালিডেশন এরর',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ..._validationErrors
              .map(
                (error) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.circle,
                        size: 8,
                        color: Color(0xFFf97316),
                      ),
                      const SizedBox(width: 8),
                      Expanded(child: Text(error)),
                    ],
                  ),
                ),
              )
              .toList(),
          const SizedBox(height: 8),
          TextButton(
            onPressed: widget.onEdit,
            child: const Row(
              children: [
                Icon(Icons.edit, size: 16),
                SizedBox(width: 4),
                Text('তথ্য এডিট করুন'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageCard(String message, bool isError) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: isError ? const Color(0xFFfef2f2) : const Color(0xFFf0fdf4),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isError ? const Color(0xFFfecaca) : const Color(0xFFbbf7d0),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isError ? Icons.error_outline : Icons.check_circle,
            color: isError ? const Color(0xFFef4444) : const Color(0xFF10b981),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isError ? 'এরর' : 'সফল',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: isError
                        ? const Color(0xFF991b1b)
                        : const Color(0xFF065f46),
                  ),
                ),
                Text(
                  message,
                  style: TextStyle(
                    color: isError
                        ? const Color(0xFF991b1b)
                        : const Color(0xFF065f46),
                  ),
                ),
              ],
            ),
          ),
          if (isError)
            IconButton(
              onPressed: () => setState(() {
                _errorMessage = null;
              }),
              icon: const Icon(Icons.close, size: 16),
            ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              color: Color(0xFFebf5ff),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_outline,
              color: Color(0xFF3c8ce7),
              size: 40,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'রেজিস্ট্রেশন সামারি',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'সাবমিট করার আগে আপনার তথ্যগুলো রিভিউ করুন',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.blue[50],
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.info, size: 14, color: Colors.blue[700]),
                const SizedBox(width: 4),
                Text(
                  'API URL: $registerUrl',
                  style: TextStyle(fontSize: 12, color: Colors.blue[700]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPersonalInfoCard(BuildContext context) {
    return _buildCard(
      icon: Icons.person,
      title: 'ব্যক্তিগত তথ্য',
      children: [
        _buildSummaryItem('নাম', widget.name),
        _buildSummaryItem('ইমেইল', widget.email),
        _buildSummaryItem('ফোন', widget.phone),
        _buildSummaryItem('এনআইডি', widget.nidNumber),
        _buildSummaryItem(
          'জন্ম তারিখ',
          '${widget.dob.day}/${widget.dob.month}/${widget.dob.year}',
        ),
        _buildSummaryItem('কোম্পানি', widget.companyName),
      ],
    );
  }

  Widget _buildPresentAddressCard(BuildContext context) {
    return _buildCard(
      icon: Icons.home,
      title: 'বর্তমান ঠিকানা',
      children: [
        _buildSummaryItem('ঠিকানা', widget.presentAddress),
        _buildSummaryItem('বিভাগ', widget.presentDivision ?? 'নির্বাচন করেননি'),
        _buildSummaryItem('জেলা', widget.presentDistrict ?? 'নির্বাচন করেননি'),
        _buildSummaryItem('থানা', widget.presentThana ?? 'নির্বাচন করেননি'),
      ],
    );
  }

  Widget _buildPermanentAddressCard(BuildContext context) {
    if (widget.sameAsPresentAddress) {
      return _buildCard(
        icon: Icons.location_city,
        title: 'স্থায়ী ঠিকানা',
        children: [_buildSummaryItem('বর্তমান ঠিকানার মতই', 'হ্যাঁ')],
      );
    }

    return _buildCard(
      icon: Icons.location_city,
      title: 'স্থায়ী ঠিকানা',
      children: [
        _buildSummaryItem('ঠিকানা', widget.permanentAddress),
        _buildSummaryItem(
          'বিভাগ',
          widget.permanentDivision ?? 'নির্বাচন করেননি',
        ),
        _buildSummaryItem(
          'জেলা',
          widget.permanentDistrict ?? 'নির্বাচন করেননি',
        ),
        _buildSummaryItem('থানা', widget.permanentThana ?? 'নির্বাচন করেননি'),
      ],
    );
  }

  Widget _buildBusinessAddressCard(BuildContext context) {
    return _buildCard(
      icon: Icons.business,
      title: 'ব্যবসায়িক ঠিকানা',
      children: [
        _buildSummaryItem('ঠিকানা', widget.businessAddress),
        _buildSummaryItem(
          'বিভাগ',
          widget.businessDivision ?? 'নির্বাচন করেননি',
        ),
        _buildSummaryItem('জেলা', widget.businessDistrict ?? 'নির্বাচন করেননি'),
        _buildSummaryItem('থানা', widget.businessThana ?? 'নির্বাচন করেননি'),
      ],
    );
  }

  Widget _buildServiceAreaCard(BuildContext context) {
    return _buildCard(
      icon: Icons.location_city,
      title: 'সার্ভিস এরিয়া',
      children: [
        _buildSummaryItem('বিভাগ', widget.serviceDivision ?? 'নির্বাচন করেননি'),
        _buildSummaryItem('জেলা', widget.serviceDistrict ?? 'নির্বাচন করেননি'),
        _buildSummaryItem('থানা', widget.selectedServiceThanas.join(', ')),
        _buildSummaryItem(
          'মোট থানা',
          widget.selectedServiceThanas.length.toString(),
        ),
      ],
    );
  }

  Widget _buildDocumentsCard(BuildContext context) {
    return _buildCard(
      icon: Icons.attach_file,
      title: 'ডকুমেন্টস',
      children: [
        _buildDocumentItem('সিভি/রিজিউম', widget.cvFile),
        _buildDocumentItem('ট্রেড লাইসেন্স', widget.tradeLicenseFile),
      ],
    );
  }

  Widget _buildKycCard(BuildContext context) {
    return _buildCard(
      icon: Icons.verified_user,
      title: 'কেওয়াইসি',
      children: [
        _buildImageItem('সেলফি', widget.selfieImage),
        _buildImageItem('এনআইডি সামনের দিক', widget.nidFrontImage),
        _buildImageItem('এনআইডি পিছনের দিক', widget.nidBackImage),
      ],
    );
  }

  Widget _buildSubmitButton(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: (_isSubmitting || widget.isLoading)
                ? null
                : _submitRegistration,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10b981),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isSubmitting
                ? const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      ),
                      SizedBox(width: 12),
                      Text('সাবমিট হচ্ছে...'),
                    ],
                  )
                : const Text(
                    'রেজিস্ট্রেশন সাবমিট করুন',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'API URL: $registerUrl',
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
      ],
    );
  }

  Widget _buildCard({
    required IconData icon,
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(icon, color: const Color(0xFF3c8ce7)),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 0),
          ...children,
        ],
      ),
    );
  }

  Widget _buildSummaryItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(flex: 2, child: Text(value, textAlign: TextAlign.right)),
        ],
      ),
    );
  }

  Widget _buildDocumentItem(String label, AppFile? file) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            flex: 2,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  file != null ? '✓ আপলোড হয়েছে' : '✗ আপলোড হয়নি',
                  style: TextStyle(
                    color: file != null
                        ? const Color(0xFF10b981)
                        : const Color(0xFFef4444),
                  ),
                ),
                if (file != null)
                  const SizedBox(
                    width: 8,
                    child: Icon(
                      Icons.check_circle,
                      size: 16,
                      color: Colors.green,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImageItem(String label, AppFile? image) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            flex: 2,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  image != null ? '✓ আপলোড হয়েছে' : '✗ আপলোড হয়নি',
                  style: TextStyle(
                    color: image != null
                        ? const Color(0xFF10b981)
                        : const Color(0xFFef4444),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEditButton(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: widget.onEdit,
      icon: const Icon(Icons.edit),
      label: const Text('তথ্য এডিট করুন'),
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        side: const BorderSide(color: Color(0xFF3c8ce7)),
      ),
    );
  }
}
