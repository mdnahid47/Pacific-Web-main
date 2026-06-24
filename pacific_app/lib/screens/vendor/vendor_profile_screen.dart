import 'dart:io';
import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:iconsax/iconsax.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import 'package:cached_network_image/cached_network_image.dart';

class VendorProfileScreen extends StatefulWidget {
  const VendorProfileScreen({super.key});

  @override
  State<VendorProfileScreen> createState() => _VendorProfileScreenState();
}

class _VendorProfileScreenState extends State<VendorProfileScreen> {
  final ApiService _apiService = ApiService();
  final ImagePicker _picker = ImagePicker();
  bool _isEditing = false;
  bool _isLoading = true;
  bool _isSaving = false;
  Map<String, dynamic>? _vendorDetails;
  File? _selectedImage;
  String? _tempProfileImage; // Temporary profile image URL
  // For web
  Uint8List? _selectedImageBytes;
  String? _selectedImageName;

  // Form controllers
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _companyController = TextEditingController();
  final TextEditingController _nidController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();
  final TextEditingController _presentAddressController =
      TextEditingController();
  final TextEditingController _permanentAddressController =
      TextEditingController();
  final TextEditingController _businessAddressController =
      TextEditingController();
  final TextEditingController _technicianQuantityController =
      TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadVendorData();
    });
  }

  Future<void> _loadVendorData() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;

      final response = await _apiService.getVendorProfile(token!);

      debugPrint('📊 Full API Response: $response');

      if (response['success']) {
        _vendorDetails = response['vendor'];

        // Debug all vendor details
        debugPrint('📊 Vendor Details:');
        _vendorDetails?.forEach((key, value) {
          debugPrint('   - $key: $value');
        });

        // Check profile image specifically
        debugPrint('🔍 Profile Image URL: ${_vendorDetails?['profileImage']}');
        debugPrint(
          '🔍 Profile Image Type: ${_vendorDetails?['profileImage']?.runtimeType}',
        );
        debugPrint(
          '🔍 Profile Image is empty: ${_vendorDetails?['profileImage']?.toString().isEmpty}',
        );

        // Set form values
        _nameController.text = _vendorDetails?['name'] ?? '';
        _emailController.text = _vendorDetails?['email'] ?? '';
        _phoneController.text = _vendorDetails?['phone'] ?? '';
        _companyController.text = _vendorDetails?['companyName'] ?? '';
        _nidController.text = _vendorDetails?['nidNumber'] ?? '';
        _dobController.text = _vendorDetails?['dob'] ?? '';
        _presentAddressController.text =
            _vendorDetails?['presentAddress'] ?? '';
        _permanentAddressController.text =
            _vendorDetails?['permanentAddress'] ?? '';
        _businessAddressController.text =
            _vendorDetails?['businessAddress'] ?? '';
        _technicianQuantityController.text =
            _vendorDetails?['technicianQuantity']?.toString() ?? '0';

        // Store original profile image
        final profileImage = _vendorDetails?['profileImage'];
        debugPrint('💾 Storing profile image: $profileImage');

        if (profileImage != null &&
            profileImage is String &&
            profileImage.isNotEmpty) {
          _tempProfileImage = profileImage;
          debugPrint('✅ Profile image stored: $_tempProfileImage');
        } else {
          _tempProfileImage = null;
          debugPrint('⚠️ No valid profile image found');
        }

        // Update auth provider
        authProvider.updateVendorProfile(
          _vendorDetails?['name'],
          _vendorDetails?['email'],
          _vendorDetails?['phone'],
          _tempProfileImage,
          _vendorDetails?['status'],
        );
      }
    } catch (error) {
      debugPrint('❌ Error loading vendor data: $error');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load profile data: $error'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _pickImage() async {
    try {
      final pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        if (kIsWeb) {
          // For web platform
          final bytes = await pickedFile.readAsBytes();
          setState(() {
            _selectedImageBytes = bytes;
            _selectedImageName = pickedFile.name;
            _selectedImage = null;
          });
        } else {
          // For mobile/desktop platform
          setState(() {
            _selectedImage = File(pickedFile.path);
            _selectedImageBytes = null;
            _selectedImageName = null;
          });
        }
      }
    } catch (error) {
      debugPrint('Error picking image: $error');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to pick image: $error'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _saveProfile() async {
    if (!_isEditing) return;

    setState(() {
      _isSaving = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;

      // Prepare update data
      final updateData = {
        'name': _nameController.text.trim(),
        'phone': _phoneController.text.trim(),
        'company_name': _companyController.text.trim(),
        'dob': _dobController.text.trim(),
        'permanent_address': _permanentAddressController.text.trim(),
        'present_address': _presentAddressController.text.trim(),
        'business_address': _businessAddressController.text.trim(),
        'technician_quantity': _technicianQuantityController.text.trim(),
      };

      // Call API to update profile with platform-specific parameters
      final response = await _apiService.updateVendorProfile(
        token: token!,
        data: updateData,
        profileImagePath: kIsWeb ? null : _selectedImage?.path,
        profileImageBytes: kIsWeb ? _selectedImageBytes : null,
        profileImageName: kIsWeb ? _selectedImageName : null,
      );

      if (response['success']) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                response['message'] ?? 'Profile updated successfully',
              ),
              backgroundColor: Colors.green,
            ),
          );
        }

        setState(() {
          _isEditing = false;
          _selectedImage = null;
          _selectedImageBytes = null;
          _selectedImageName = null;
        });

        // Reload data to get updated profile image
        await _loadVendorData();
      } else {
        throw Exception(response['message'] ?? 'Update failed');
      }
    } catch (error) {
      debugPrint('❌ Error updating profile: $error');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update profile: $error'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
      }
    }
  }

  Future<void> _viewDocument(String url) async {
    if (url.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Document not available'),
            backgroundColor: Colors.orange,
          ),
        );
      }
      return;
    }

    try {
      // Check if URL is full URL or relative path
      String fullUrl = url;
      if (!url.startsWith('http')) {
        // Assuming your server is running on localhost:5001
        // Replace with your actual server URL
        fullUrl = 'http://10.0.2.2:5001$url'; // For Android emulator
        // fullUrl = 'http://localhost:5001$url'; // For iOS simulator
      }

      final uri = Uri.parse(fullUrl);

      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw Exception('Could not launch $fullUrl');
      }
    } catch (error) {
      debugPrint('❌ Error opening document: $error');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Cannot open document: $error'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Widget _buildProfileImage() {
    // Priority 1: Selected image (temporary)
    if (kIsWeb && _selectedImageBytes != null) {
      return CircleAvatar(
        radius: 60,
        backgroundImage: MemoryImage(_selectedImageBytes!),
      );
    } else if (!kIsWeb && _selectedImage != null) {
      return CircleAvatar(
        radius: 60,
        backgroundImage: FileImage(_selectedImage!),
      );
    }

    // Priority 2: Profile image from server using CachedNetworkImage
    if (_tempProfileImage != null && _tempProfileImage!.isNotEmpty) {
      String imageUrl = _tempProfileImage!;

      // Make URL absolute if it's relative
      if (_tempProfileImage!.startsWith('/uploads')) {
        imageUrl = 'http://localhost:5001$_tempProfileImage';
      }

      return CircleAvatar(
        radius: 60,
        backgroundColor: Colors.grey.shade200,
        child: ClipOval(
          child: CachedNetworkImage(
            imageUrl: imageUrl,
            width: 120,
            height: 120,
            fit: BoxFit.cover,
            placeholder: (context, url) => const CircularProgressIndicator(),
            errorWidget: (context, url, error) =>
                const Icon(Icons.business, size: 50, color: Colors.blue),
          ),
        ),
      );
    }

    // Priority 3: Default icon
    return CircleAvatar(
      radius: 60,
      backgroundColor: Colors.blue.shade100,
      child: const Icon(Icons.business, size: 50, color: Colors.blue),
    );
  }

  List<dynamic> _parseServiceList(dynamic data) {
    if (data == null) return [];

    if (data is List) {
      return data;
    } else if (data is String) {
      try {
        // Try to parse as JSON
        final parsed = json.decode(data);
        if (parsed is List) return parsed;
      } catch (e) {
        // If not JSON, try comma-separated
        if (data.contains(',')) {
          return data
              .split(',')
              .map((item) => item.trim())
              .where((item) => item.isNotEmpty)
              .toList();
        } else if (data.isNotEmpty) {
          return [data];
        }
      }
    }

    return [];
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isActive = authProvider.vendorStatus?.toLowerCase() == 'active';

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Vendor Profile')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final serviceAreasList = _parseServiceList(_vendorDetails?['serviceAreas']);
    final servicesList = _parseServiceList(_vendorDetails?['services']);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Vendor Profile'),
        actions: [
          if (!_isEditing)
            IconButton(
              icon: const Icon(Iconsax.edit),
              onPressed: () {
                setState(() {
                  _isEditing = true;
                });
              },
              tooltip: 'Edit Profile',
            ),
          if (_isEditing)
            IconButton(
              icon: _isSaving
                  ? SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          Theme.of(context).colorScheme.onPrimary,
                        ),
                      ),
                    )
                  : const Icon(Iconsax.tick_circle),
              onPressed: _isSaving ? null : _saveProfile,
              tooltip: 'Save Changes',
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Profile Header
            Stack(
              alignment: Alignment.bottomRight,
              children: [
                _buildProfileImage(),
                if (_isEditing)
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.blue,
                    child: IconButton(
                      icon: const Icon(
                        Iconsax.camera,
                        size: 18,
                        color: Colors.white,
                      ),
                      onPressed: _pickImage,
                      tooltip: 'Change Profile Picture',
                    ),
                  ),
              ],
            ),

            const SizedBox(height: 20),

            // Status Badge
            Chip(
              label: Text(
                isActive ? 'ACTIVE' : 'PENDING',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
              backgroundColor: isActive ? Colors.green : Colors.orange,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
            ),

            const SizedBox(height: 30),

            // Profile Form
            Form(
              child: Column(
                children: [
                  _buildProfileField(
                    label: 'Company Name',
                    icon: Iconsax.building,
                    controller: _companyController,
                    enabled: _isEditing,
                  ),
                  _buildProfileField(
                    label: 'Your Name',
                    icon: Iconsax.user,
                    controller: _nameController,
                    enabled: _isEditing,
                  ),
                  _buildProfileField(
                    label: 'Email',
                    icon: Iconsax.sms,
                    controller: _emailController,
                    enabled: false,
                  ),
                  _buildProfileField(
                    label: 'Phone Number',
                    icon: Iconsax.call,
                    controller: _phoneController,
                    enabled: _isEditing,
                    keyboardType: TextInputType.phone,
                  ),
                  _buildProfileField(
                    label: 'NID Number',
                    icon: Iconsax.card,
                    controller: _nidController,
                    enabled: false,
                  ),
                  _buildProfileField(
                    label: 'Date of Birth',
                    icon: Iconsax.calendar,
                    controller: _dobController,
                    enabled: _isEditing,
                    onTap: _isEditing ? () => _selectDate(context) : null,
                  ),
                  _buildProfileField(
                    label: 'Present Address',
                    icon: Iconsax.location,
                    controller: _presentAddressController,
                    enabled: _isEditing,
                    maxLines: 2,
                  ),
                  _buildProfileField(
                    label: 'Permanent Address',
                    icon: Iconsax.home,
                    controller: _permanentAddressController,
                    enabled: _isEditing,
                    maxLines: 2,
                  ),
                  _buildProfileField(
                    label: 'Business Address',
                    icon: Iconsax.building_3,
                    controller: _businessAddressController,
                    enabled: _isEditing,
                    maxLines: 2,
                  ),
                  _buildProfileField(
                    label: 'Number of Technicians',
                    icon: Iconsax.people,
                    controller: _technicianQuantityController,
                    enabled: _isEditing,
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Services Information
            if (servicesList.isNotEmpty)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Services Offered',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: servicesList
                            .where(
                              (service) =>
                                  service != null &&
                                  service.toString().trim().isNotEmpty,
                            )
                            .map(
                              (service) => Chip(
                                label: Text(service.toString()),
                                backgroundColor: Colors.blue.shade50,
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 20),

            // Service Areas
            if (serviceAreasList.isNotEmpty)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Service Areas',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: serviceAreasList
                            .where(
                              (area) =>
                                  area != null &&
                                  area.toString().trim().isNotEmpty,
                            )
                            .map(
                              (area) => Chip(
                                label: Text(area.toString()),
                                backgroundColor: Colors.green.shade50,
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 20),

            // Account Information
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Account Information',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 15),
                    _buildInfoRow(
                      'Registration Date',
                      _vendorDetails?['createdAt'] != null
                          ? _formatDate(_vendorDetails!['createdAt'])
                          : 'N/A',
                    ),
                    _buildInfoRow(
                      'Last Updated',
                      _vendorDetails?['updatedAt'] != null
                          ? _formatDate(_vendorDetails!['updatedAt'])
                          : 'N/A',
                    ),
                    _buildInfoRow(
                      'Account Status',
                      _vendorDetails?['status']?.toString().toUpperCase() ??
                          'N/A',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 30),

            // Documents Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Documents',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 15),
                    if (_vendorDetails?['tradeLicense'] != null &&
                        _vendorDetails!['tradeLicense'].toString().isNotEmpty)
                      _buildDocumentRow(
                        'Trade License',
                        _vendorDetails!['tradeLicense'].toString(),
                      ),
                    if (_vendorDetails?['nidFront'] != null &&
                        _vendorDetails!['nidFront'].toString().isNotEmpty)
                      _buildDocumentRow(
                        'NID Front',
                        _vendorDetails!['nidFront'].toString(),
                      ),
                    if (_vendorDetails?['nidBack'] != null &&
                        _vendorDetails!['nidBack'].toString().isNotEmpty)
                      _buildDocumentRow(
                        'NID Back',
                        _vendorDetails!['nidBack'].toString(),
                      ),
                    if (_vendorDetails?['cv'] != null &&
                        _vendorDetails!['cv'].toString().isNotEmpty)
                      _buildDocumentRow(
                        'CV/Resume',
                        _vendorDetails!['cv'].toString(),
                      ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 30),

            // Action Buttons
            if (!_isEditing)
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Iconsax.lock),
                      label: const Text('Change Password'),
                      onPressed: () {
                        // Navigate to change password screen
                        // Navigator.pushNamed(context, '/vendor/change-password');
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 15),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      icon: const Icon(Iconsax.logout),
                      label: const Text('Logout'),
                      onPressed: () {
                        authProvider.logout();
                        Navigator.pushNamedAndRemoveUntil(
                          context,
                          '/login',
                          (route) => false,
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 15),
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileField({
    required String label,
    required IconData icon,
    required TextEditingController controller,
    required bool enabled,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    VoidCallback? onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: TextFormField(
        controller: controller,
        enabled: enabled,
        keyboardType: keyboardType,
        maxLines: maxLines,
        readOnly: onTap != null,
        onTap: onTap,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon),
          border: const OutlineInputBorder(),
          filled: !enabled,
          fillColor: Colors.grey.shade100,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: TextStyle(color: Colors.grey.shade600)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildDocumentRow(String title, String url) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  url.length > 40
                      ? '${url.substring(0, math.min(40, url.length))}...'
                      : url,
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 10),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Iconsax.eye, size: 20),
            onPressed: () => _viewDocument(url),
            tooltip: 'View $title',
          ),
        ],
      ),
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      initialDatePickerMode: DatePickerMode.year,
    );

    if (picked != null && mounted) {
      setState(() {
        _dobController.text =
            "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      });
    }
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return "${date.day}/${date.month}/${date.year}";
    } catch (e) {
      return dateString;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _companyController.dispose();
    _nidController.dispose();
    _dobController.dispose();
    _presentAddressController.dispose();
    _permanentAddressController.dispose();
    _businessAddressController.dispose();
    _technicianQuantityController.dispose();
    super.dispose();
  }
}
