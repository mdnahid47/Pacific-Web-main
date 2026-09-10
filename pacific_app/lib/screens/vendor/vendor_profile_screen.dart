import 'dart:io';
import 'dart:convert';
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
  String? _tempProfileImage;

  Uint8List? _selectedImageBytes;
  String? _selectedImageName;

  // Controllers
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _companyController = TextEditingController();
  final _nidController = TextEditingController();
  final _dobController = TextEditingController();
  final _presentAddressController = TextEditingController();
  final _permanentAddressController = TextEditingController();
  final _businessAddressController = TextEditingController();
  final _technicianQuantityController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadVendorData());
  }

  // ==================== LOAD DATA ====================

  Future<void> _loadVendorData() async {
    if (!mounted) return;
    setState(() => _isLoading = true);

    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final token = auth.token;
      if (token == null) throw Exception('No authentication token');

      final response = await _apiService.getVendorProfile(token);

      if (response['success'] == true) {
        final vendor = response['vendor'] ?? {};
        setState(() {
          _vendorDetails = vendor;

          _nameController.text = vendor['name'] ?? '';
          _emailController.text = vendor['email'] ?? '';
          _phoneController.text = vendor['phone'] ?? '';
          _companyController.text = vendor['companyName'] ?? '';
          _nidController.text = vendor['nidNumber'] ?? '';
          _dobController.text = vendor['dob'] ?? '';
          _presentAddressController.text = vendor['presentAddress'] ?? '';
          _permanentAddressController.text = vendor['permanentAddress'] ?? '';
          _businessAddressController.text = vendor['businessAddress'] ?? '';
          _technicianQuantityController.text =
              vendor['technicianQuantity']?.toString() ?? '0';

          final img = vendor['profileImage'];
          _tempProfileImage =
              (img is String && img.isNotEmpty) ? img : null;
        });

        auth.updateVendorProfile(
          vendor['name'],
          vendor['email'],
          vendor['phone'],
          _tempProfileImage,
          vendor['status'],
        );
      }
    } catch (e) {
      debugPrint('❌ Load profile error: $e');
      if (mounted) {
        _showSnackBar('Failed to load profile: $e', isError: true);
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // ==================== SAVE PROFILE ====================

  Future<void> _saveProfile() async {
    if (!_isEditing) return;

    // Validation
    if (_nameController.text.trim().isEmpty) {
      _showSnackBar('Name is required', isError: true);
      return;
    }

    setState(() => _isSaving = true);

    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final token = auth.token;
      if (token == null) throw Exception('No authentication token');

      final data = {
        'name': _nameController.text.trim(),
        'phone': _phoneController.text.trim(),
        'company_name': _companyController.text.trim(),
        'dob': _dobController.text.trim(),
        'permanent_address': _permanentAddressController.text.trim(),
        'present_address': _presentAddressController.text.trim(),
        'business_address': _businessAddressController.text.trim(),
        'technician_quantity': _technicianQuantityController.text.trim(),
      };

      final response = await _apiService.updateVendorProfile(
        token: token,
        data: data,
        profileImagePath: kIsWeb ? null : _selectedImage?.path,
        profileImageBytes: kIsWeb ? _selectedImageBytes : null,
        profileImageName: kIsWeb ? _selectedImageName : null,
      );

      if (response['success'] == true) {
        _showSnackBar('Profile updated successfully');
        setState(() {
          _isEditing = false;
          _selectedImage = null;
          _selectedImageBytes = null;
          _selectedImageName = null;
        });
        await _loadVendorData();
      } else {
        throw Exception(response['message'] ?? 'Update failed');
      }
    } catch (e) {
      debugPrint('❌ Save profile error: $e');
      _showSnackBar('Failed to save: $e', isError: true);
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  // ==================== IMAGE PICKER ====================

  Future<void> _pickImage() async {
    try {
      final picked = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (picked != null) {
        if (kIsWeb) {
          final bytes = await picked.readAsBytes();
          setState(() {
            _selectedImageBytes = bytes;
            _selectedImageName = picked.name;
            _selectedImage = null;
          });
        } else {
          setState(() {
            _selectedImage = File(picked.path);
            _selectedImageBytes = null;
            _selectedImageName = null;
          });
        }
      }
    } catch (e) {
      _showSnackBar('Failed to pick image: $e', isError: true);
    }
  }

  // ==================== HELPERS ====================

  void _showSnackBar(String message, {bool isError = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red.shade400 : Colors.green.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  Future<void> _viewDocument(String url) async {
    if (url.isEmpty) {
      _showSnackBar('Document not available', isError: true);
      return;
    }
    try {
      String fullUrl = url;
      if (!url.startsWith('http')) {
        fullUrl = 'http://10.0.2.2:5001$url';
      }
      final uri = Uri.parse(fullUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw Exception('Could not open document');
      }
    } catch (e) {
      _showSnackBar('Cannot open document', isError: true);
    }
  }

  List<dynamic> _parseList(dynamic data) {
    if (data == null) return [];
    if (data is List) return data;
    if (data is String && data.isNotEmpty) {
      try {
        final parsed = json.decode(data);
        if (parsed is List) return parsed;
      } catch (_) {
        if (data.contains(',')) {
          return data.split(',').map((e) => e.trim()).toList();
        }
        return [data];
      }
    }
    return [];
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final d = DateTime.parse(dateString);
      return '${d.day}/${d.month}/${d.year}';
    } catch (_) {
      return dateString;
    }
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      initialDatePickerMode: DatePickerMode.year,
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: ColorScheme.light(
            primary: Colors.blue.shade700,
            onPrimary: Colors.white,
            surface: Colors.white,
            onSurface: Colors.black87,
          ),
        ),
        child: child!,
      ),
    );

    if (picked != null && mounted) {
      setState(() {
        _dobController.text =
            '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      });
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

  // ==================== BUILD ====================

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final auth = Provider.of<AuthProvider>(context);
    final isActive = auth.vendorStatus?.toLowerCase() == 'active';
    final services = _parseList(_vendorDetails?['services']);
    final serviceAreas = _parseList(_vendorDetails?['serviceAreas']);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC),
      body: CustomScrollView(
        slivers: [
          // ==================== SLIVER APP BAR ====================
          SliverAppBar(
            expandedHeight: 260,
            pinned: true,
            elevation: 0,
            backgroundColor: Colors.blue.shade700,
            foregroundColor: Colors.white,
            leading: IconButton(
              icon: const Icon(Iconsax.arrow_left_2),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              if (!_isEditing)
                IconButton(
                  icon: const Icon(Iconsax.edit_2),
                  onPressed: () => setState(() => _isEditing = true),
                  tooltip: 'Edit',
                )
              else ...[
                IconButton(
                  icon: const Icon(Iconsax.close_circle),
                  onPressed: () {
                    setState(() => _isEditing = false);
                    _loadVendorData();
                  },
                  tooltip: 'Cancel',
                ),
                IconButton(
                  icon: _isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Iconsax.tick_circle),
                  onPressed: _isSaving ? null : _saveProfile,
                  tooltip: 'Save',
                ),
              ],
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue.shade700, Colors.blue.shade400],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 50),
                    // Profile image
                    Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 4),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.2),
                                blurRadius: 20,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: _buildProfileImage(),
                        ),
                        if (_isEditing)
                          GestureDetector(
                            onTap: _pickImage,
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.15),
                                    blurRadius: 8,
                                  ),
                                ],
                              ),
                              child: Icon(
                                Iconsax.camera,
                                size: 18,
                                color: Colors.blue.shade700,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    // Name
                    Text(
                      _vendorDetails?['name'] ?? 'Vendor',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    // Status chip
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: isActive ? Colors.green : Colors.orange,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isActive ? Iconsax.tick_circle : Iconsax.clock,
                            size: 14,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            isActive ? 'Active' : 'Pending',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ),

          // ==================== CONTENT ====================
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Stats row
                _buildStatsCard(),
                const SizedBox(height: 12),

                // Personal Information
                _buildSection(
                  title: 'Personal Information',
                  icon: Iconsax.user,
                  children: [
                    _buildField(
                      label: 'Full Name',
                      controller: _nameController,
                      icon: Iconsax.user,
                    ),
                    _buildField(
                      label: 'Email',
                      controller: _emailController,
                      icon: Iconsax.sms,
                      enabled: false,
                    ),
                    _buildField(
                      label: 'Phone',
                      controller: _phoneController,
                      icon: Iconsax.call,
                      keyboardType: TextInputType.phone,
                    ),
                    _buildField(
                      label: 'Date of Birth',
                      controller: _dobController,
                      icon: Iconsax.calendar,
                      readOnly: true,
                      onTap: _isEditing ? _selectDate : null,
                    ),
                    _buildField(
                      label: 'NID Number',
                      controller: _nidController,
                      icon: Iconsax.card,
                      enabled: false,
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Business Information
                _buildSection(
                  title: 'Business Information',
                  icon: Iconsax.building,
                  children: [
                    _buildField(
                      label: 'Company Name',
                      controller: _companyController,
                      icon: Iconsax.building_3,
                    ),
                    _buildField(
                      label: 'Technicians',
                      controller: _technicianQuantityController,
                      icon: Iconsax.people,
                      keyboardType: TextInputType.number,
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Address
                _buildSection(
                  title: 'Addresses',
                  icon: Iconsax.location,
                  children: [
                    _buildField(
                      label: 'Present Address',
                      controller: _presentAddressController,
                      icon: Iconsax.location,
                      maxLines: 2,
                    ),
                    _buildField(
                      label: 'Permanent Address',
                      controller: _permanentAddressController,
                      icon: Iconsax.home,
                      maxLines: 2,
                    ),
                    _buildField(
                      label: 'Business Address',
                      controller: _businessAddressController,
                      icon: Iconsax.building_3,
                      maxLines: 2,
                    ),
                  ],
                ),

                // Services
                if (services.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  _buildChipSection(
                    title: 'Services Offered',
                    icon: Iconsax.category,
                    items: services,
                    color: Colors.blue,
                  ),
                ],

                // Service Areas
                if (serviceAreas.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  _buildChipSection(
                    title: 'Service Areas',
                    icon: Iconsax.map,
                    items: serviceAreas,
                    color: Colors.green,
                  ),
                ],

                const SizedBox(height: 16),

                // Documents
                _buildDocumentsCard(),

                const SizedBox(height: 16),

                // Account Info
                _buildAccountInfoCard(),

                const SizedBox(height: 24),

                // Action buttons
                if (!_isEditing) ...[
                  _buildActionButton(
                    label: 'Change Password',
                    icon: Iconsax.lock,
                    onPressed: () {},
                    isOutlined: true,
                  ),
                  const SizedBox(height: 12),
                  _buildActionButton(
                    label: 'Logout',
                    icon: Iconsax.logout,
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          title: const Text('Confirm Logout'),
                          content:
                              const Text('Are you sure you want to logout?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Cancel'),
                            ),
                            TextButton(
                              onPressed: () async {
                                Navigator.pop(context);
                                await auth.logout();
                                if (context.mounted) {
                                  Navigator.pushNamedAndRemoveUntil(
                                    context,
                                    '/login',
                                    (_) => false,
                                  );
                                }
                              },
                              style:
                                  TextButton.styleFrom(foregroundColor: Colors.red),
                              child: const Text('Logout'),
                            ),
                          ],
                        ),
                      );
                    },
                    isOutlined: true,
                    isDestructive: true,
                  ),
                ],

                const SizedBox(height: 30),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  // ==================== WIDGETS ====================

  Widget _buildProfileImage() {
    // Selected image (temporary)
    if (kIsWeb && _selectedImageBytes != null) {
      return CircleAvatar(
        radius: 55,
        backgroundImage: MemoryImage(_selectedImageBytes!),
      );
    }
    if (!kIsWeb && _selectedImage != null) {
      return CircleAvatar(
        radius: 55,
        backgroundImage: FileImage(_selectedImage!),
      );
    }

    // Server image
    if (_tempProfileImage != null && _tempProfileImage!.isNotEmpty) {
      String imageUrl = _tempProfileImage!;
      if (imageUrl.startsWith('/uploads')) {
        imageUrl = 'http://10.0.2.2:5001$imageUrl';
      }

      return CircleAvatar(
        radius: 55,
        backgroundColor: Colors.grey.shade200,
        child: ClipOval(
          child: CachedNetworkImage(
            imageUrl: imageUrl,
            width: 110,
            height: 110,
            fit: BoxFit.cover,
            placeholder: (_, _) => const Center(
              child: SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),
            errorWidget: (_, _, _) => Icon(
              Iconsax.shop,
              size: 50,
              color: Colors.blue.shade700,
            ),
          ),
        ),
      );
    }

    // Default
    return CircleAvatar(
      radius: 55,
      backgroundColor: Colors.blue.shade100,
      child: Icon(
        Iconsax.shop,
        size: 50,
        color: Colors.blue.shade700,
      ),
    );
  }

  Widget _buildStatsCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          _buildStatItem(
            'Orders',
            '${_vendorDetails?['stats']?['total_orders'] ?? 0}',
            Iconsax.box,
            Colors.blue,
          ),
          _buildDivider(),
          _buildStatItem(
            'Completed',
            '${_vendorDetails?['stats']?['completed_orders'] ?? 0}',
            Iconsax.tick_circle,
            Colors.green,
          ),
          _buildDivider(),
          _buildStatItem(
            'Rating',
            '${_vendorDetails?['stats']?['average_rating'] ?? '0.0'}',
            Iconsax.star,
            Colors.amber,
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    return Expanded(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 20, color: color),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 50,
      color: Colors.grey.shade200,
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.blue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, size: 18, color: Colors.blue.shade700),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildField({
    required String label,
    required TextEditingController controller,
    required IconData icon,
    bool enabled = true,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    bool readOnly = false,
    VoidCallback? onTap,
  }) {
    final isEnabled = _isEditing && enabled;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: controller,
        enabled: isEnabled,
        keyboardType: keyboardType,
        maxLines: maxLines,
        readOnly: readOnly || onTap != null,
        onTap: onTap,
        style: TextStyle(
          color: isEnabled ? Colors.black87 : Colors.grey.shade700,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: TextStyle(
            color: isEnabled ? Colors.blue.shade700 : Colors.grey.shade600,
            fontWeight: FontWeight.w500,
            fontSize: 13,
          ),
          prefixIcon: Icon(
            icon,
            size: 20,
            color: isEnabled ? Colors.blue.shade700 : Colors.grey.shade500,
          ),
          filled: true,
          fillColor: isEnabled ? Colors.white : Colors.grey.shade100,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: isEnabled ? Colors.blue.shade200 : Colors.grey.shade300,
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: isEnabled ? Colors.blue.shade200 : Colors.grey.shade300,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.blue.shade700, width: 1.5),
          ),
          disabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade200),
          ),
        ),
      ),
    );
  }

  Widget _buildChipSection({
    required String title,
    required IconData icon,
    required List<dynamic> items,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, size: 18, color: color),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: items
                .where((e) => e != null && e.toString().trim().isNotEmpty)
                .map((e) => Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: color.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Text(
                        e.toString(),
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: color,
                        ),
                      ),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentsCard() {
    final docs = <Map<String, String>>[];
    void add(String title, dynamic url) {
      if (url != null && url.toString().isNotEmpty) {
        docs.add({'title': title, 'url': url.toString()});
      }
    }

    add('Trade License', _vendorDetails?['tradeLicense']);
    add('NID Front', _vendorDetails?['nidFront']);
    add('NID Back', _vendorDetails?['nidBack']);
    add('CV / Resume', _vendorDetails?['cv']);

    if (docs.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.purple.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  Iconsax.document,
                  size: 18,
                  color: Colors.purple.shade700,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Documents',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...docs.map((doc) => _buildDocumentRow(doc['title']!, doc['url']!)),
        ],
      ),
    );
  }

  Widget _buildDocumentRow(String title, String url) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.blue.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              Iconsax.document_text,
              size: 18,
              color: Colors.blue.shade700,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  url.length > 40 ? '${url.substring(0, 40)}...' : url,
                  style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(
              Iconsax.export_1,
              size: 18,
              color: Colors.blue.shade700,
            ),
            onPressed: () => _viewDocument(url),
            tooltip: 'View',
          ),
        ],
      ),
    );
  }

  Widget _buildAccountInfoCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  Iconsax.info_circle,
                  size: 18,
                  color: Colors.green.shade700,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Account Information',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildInfoRow(
            'Registration Date',
            _formatDate(_vendorDetails?['createdAt']),
          ),
          _buildInfoRow(
            'Last Updated',
            _formatDate(_vendorDetails?['updatedAt']),
          ),
          _buildInfoRow(
            'Status',
            (_vendorDetails?['status'] ?? 'N/A').toString().toUpperCase(),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({
    required String label,
    required IconData icon,
    required VoidCallback onPressed,
    bool isOutlined = false,
    bool isDestructive = false,
  }) {
    final color = isDestructive ? Colors.red : Colors.blue.shade700;

    if (isOutlined) {
      return SizedBox(
        width: double.infinity,
        height: 50,
        child: OutlinedButton.icon(
          icon: Icon(icon, size: 20),
          label: Text(label),
          onPressed: onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: color,
            side: BorderSide(color: color.withValues(alpha: 0.5)),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      );
    }

    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton.icon(
        icon: Icon(icon, size: 20),
        label: Text(label),
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
      ),
    );
  }
}