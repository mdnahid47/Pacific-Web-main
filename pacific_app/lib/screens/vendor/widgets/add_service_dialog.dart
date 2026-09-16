import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../services/api_service.dart';

class AddServiceDialog extends StatefulWidget {
  final String orderId;
  const AddServiceDialog({super.key, required this.orderId});

  @override
  State<AddServiceDialog> createState() => _AddServiceDialogState();
}

class _AddServiceDialogState extends State<AddServiceDialog> {
  final _searchController = TextEditingController();
  final _customNameController = TextEditingController();
  final _customDescController = TextEditingController();
  final _customPriceController = TextEditingController();
  final ApiService _apiService = ApiService();

  List<dynamic> _masterServices = [];
  List<dynamic> _filteredServices = [];
  bool _loading = true;
  bool _showCustomForm = false;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _customNameController.dispose();
    _customDescController.dispose();
    _customPriceController.dispose();
    super.dispose();
  }

  Future<void> _loadServices() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) {
        setState(() => _loading = false);
        return;
      }

      // ✅ Admin এর AdditionalServicesPage থেকে services আনুন
      final response = await _apiService.getMasterServices(token);
      if (mounted) {
        setState(() {
          _masterServices = response['services'] ?? [];
          _filteredServices = _masterServices;
          _loading = false;
        });
      }
    } catch (e) {
      debugPrint('Load services error: $e');
      if (mounted) setState(() => _loading = false);
    }
  }

  void _searchService(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredServices = _masterServices;
      } else {
        _filteredServices = _masterServices.where((s) {
          final name = (s['service_name'] ?? s['name'] ?? '').toString().toLowerCase();
          final category = (s['category'] ?? '').toString().toLowerCase();
          return name.contains(query.toLowerCase()) ||
              category.contains(query.toLowerCase());
        }).toList();
      }
    });
  }

  Future<void> _addMasterService(dynamic service) async {
    setState(() => _submitting = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) throw Exception('No token');

      final serviceName = service['service_name'] ?? service['name'] ?? '';
      final price = double.tryParse(service['price'].toString()) ?? 0;

      await _apiService.addServiceToOrder(
        token: token,
        orderId: widget.orderId,
        serviceName: serviceName,
        description: service['service_description'] ?? service['description'] ?? '',
        price: price,
        quantity: 1,
        source: 'master',
        masterServiceId: service['id'],
      );

      if (mounted) {
        Navigator.pop(context, true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ $serviceName added'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _submitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _addCustomService() async {
    if (_customNameController.text.isEmpty || _customPriceController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Name and price required'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() => _submitting = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) throw Exception('No token');

      await _apiService.addServiceToOrder(
        token: token,
        orderId: widget.orderId,
        serviceName: _customNameController.text.trim(),
        description: _customDescController.text.trim(),
        price: double.tryParse(_customPriceController.text) ?? 0,
        source: 'custom',
      );

      if (mounted) {
        Navigator.pop(context, true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Custom service added'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _submitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        constraints: const BoxConstraints(maxHeight: 650),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade700,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Iconsax.add_square5, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Add Service',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        Text('Add extra service to order',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchController,
                onChanged: _searchService,
                decoration: InputDecoration(
                  hintText: 'Search services...',
                  prefixIcon: const Icon(Iconsax.search_normal, size: 20),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            _searchService('');
                          },
                        )
                      : null,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                ),
              ),
            ),

            // Content
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Custom Service Button
                          if (!_showCustomForm)
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton.icon(
                                onPressed: () => setState(() => _showCustomForm = true),
                                icon: const Icon(Iconsax.add_circle, size: 18),
                                label: const Text('Add Custom Service'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.orange.shade800,
                                  side: BorderSide(color: Colors.orange.shade300),
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                              ),
                            ),

                          // Custom Service Form
                          if (_showCustomForm) ...[
                            Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.orange.withValues(alpha: 0.05),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.orange.withValues(alpha: 0.3)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          Icon(Iconsax.edit, size: 18, color: Colors.orange.shade800),
                                          const SizedBox(width: 6),
                                          Text('Custom Service',
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              color: Colors.orange.shade800,
                                            ),
                                          ),
                                        ],
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.close, size: 20),
                                        onPressed: () {
                                          setState(() {
                                            _showCustomForm = false;
                                            _customNameController.clear();
                                            _customDescController.clear();
                                            _customPriceController.clear();
                                          });
                                        },
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  TextField(
                                    controller: _customNameController,
                                    decoration: InputDecoration(
                                      labelText: 'Service Name *',
                                      prefixIcon: const Icon(Iconsax.category, size: 18),
                                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  TextField(
                                    controller: _customDescController,
                                    decoration: InputDecoration(
                                      labelText: 'Description',
                                      prefixIcon: const Icon(Iconsax.document_text, size: 18),
                                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  TextField(
                                    controller: _customPriceController,
                                    keyboardType: TextInputType.number,
                                    decoration: InputDecoration(
                                      labelText: 'Price *',
                                      prefixText: '৳ ',
                                      prefixIcon: const Icon(Iconsax.money, size: 18),
                                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton.icon(
                                      onPressed: _submitting ? null : _addCustomService,
                                      icon: _submitting
                                          ? const SizedBox(
                                              width: 16, height: 16,
                                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                            )
                                          : const Icon(Iconsax.add, size: 18),
                                      label: Text(_submitting ? 'Adding...' : 'Add Custom'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.orange.shade700,
                                        foregroundColor: Colors.white,
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),
                          ],

                          // Available Services List (from Admin)
                          if (_filteredServices.isNotEmpty) ...[
                            Row(
                              children: [
                                Icon(Iconsax.category, size: 16, color: Colors.grey.shade600),
                                const SizedBox(width: 6),
                                Text('Available Services',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                                const Spacer(),
                                Text('${_filteredServices.length} items',
                                  style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            ..._filteredServices.map((service) {
                              final serviceName = service['service_name'] ?? service['name'] ?? '';
                              final category = service['category'] ?? '';
                              final price = service['price'] ?? 0;

                              return GestureDetector(
                                onTap: _submitting ? null : () => _addMasterService(service),
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
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
                                        child: Icon(Iconsax.category, size: 18, color: Colors.blue.shade700),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(serviceName,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.w600,
                                                fontSize: 14,
                                              ),
                                            ),
                                            if (category.isNotEmpty)
                                              Text(category,
                                                style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                              ),
                                          ],
                                        ),
                                      ),
                                      Text('৳$price',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.green.shade700,
                                          fontSize: 14,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.all(6),
                                        decoration: BoxDecoration(
                                          color: Colors.blue.shade700,
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: const Icon(Icons.add, size: 16, color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            }),
                          ] else if (_searchController.text.isNotEmpty) ...[
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.all(32),
                                child: Column(
                                  children: [
                                    Icon(Iconsax.search_status, size: 48, color: Colors.grey.shade300),
                                    const SizedBox(height: 12),
                                    Text('No services found for "${_searchController.text}"',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                                    ),
                                    const SizedBox(height: 8),
                                    Text('Try "Add Custom Service"',
                                      style: TextStyle(color: Colors.orange.shade700, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ] else if (_masterServices.isEmpty) ...[
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.all(32),
                                child: Column(
                                  children: [
                                    Icon(Iconsax.category, size: 48, color: Colors.grey.shade300),
                                    const SizedBox(height: 12),
                                    Text('No services available',
                                      style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                                    ),
                                    const SizedBox(height: 8),
                                    Text('Use "Add Custom Service"',
                                      style: TextStyle(color: Colors.orange.shade700, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],

                          const SizedBox(height: 16),
                        ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}