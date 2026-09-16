import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_service.dart';
import 'widgets/add_service_dialog.dart';
import 'invoice_screen.dart';

class OrderDetailScreen extends StatefulWidget {
  final Map<String, dynamic> order;
  final VoidCallback? onUpdate;

  const OrderDetailScreen({
    super.key,
    required this.order,
    this.onUpdate,
  });

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  final ApiService _apiService = ApiService();
  late Map<String, dynamic> _order;
  List<dynamic> _services = [];
  bool _loading = true;
  double _serviceTotal = 0;

  @override
  void initState() {
    super.initState();
    _order = Map<String, dynamic>.from(widget.order);
    _loadServices();
  }

  Future<void> _loadServices() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return;

      final orderId = (_order['order_id'] ?? '').toString().replaceAll('#', '');
      final response = await _apiService.getOrderServices(
        token: token,
        orderId: orderId,
      );

      if (mounted) {
        setState(() {
          _services = response['services'] ?? [];
          _serviceTotal = double.tryParse(response['total']?.toString() ?? '0') ?? 0;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loading = false);
    }
  }

  // ✅ Add Service
  Future<void> _addService() async {
    final orderId = (_order['order_id'] ?? '').toString().replaceAll('#', '');

    final result = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (context) => AddServiceDialog(orderId: orderId),
    );

    if (result == true) {
      await _loadServices();
      widget.onUpdate?.call();
    }
  }

  // ✅ Delete Service
  Future<void> _deleteService(int serviceId, String name) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove Service?'),
        content: Text('Remove "$name" from this order?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Remove'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return;

      await _apiService.deleteOrderService(token: token, serviceId: serviceId);
      await _loadServices();
      widget.onUpdate?.call();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Service removed'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  // ✅ Complete Order + Invoice
  Future<void> _completeOrder() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green),
            SizedBox(width: 8),
            Text('Complete Order?'),
          ],
        ),
        content: const Text(
          'This will generate an invoice automatically.\n\nContinue?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
            child: const Text('Complete'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    // Show loading
    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) throw Exception('No token');

      final orderId = (_order['order_id'] ?? '').toString().replaceAll('#', '');

      final response = await _apiService.completeOrderWithInvoice(
        token: token,
        orderId: orderId,
        discount: 0,
      );

      // Close loading
      if (mounted) Navigator.pop(context);

      if (response['success'] == true && mounted) {
        final invoice = response['invoice'];

        // Navigate to Invoice
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => InvoiceScreen(invoice: invoice),
          ),
        );

        // Return to list
        widget.onUpdate?.call();
        if (mounted) Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) Navigator.pop(context);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: Text('#${(_order['order_id'] ?? '').toString().replaceAll('#', '')}'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Iconsax.refresh),
            onPressed: _loadServices,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadServices,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Status Card
                    _buildStatusCard(),
                    const SizedBox(height: 16),

                    // Customer Info
                    _buildSection(
                      title: 'Customer Information',
                      icon: Iconsax.user,
                      child: _buildCustomerInfo(),
                    ),
                    const SizedBox(height: 16),

                    // Delivery Info
                    _buildSection(
                      title: 'Delivery Information',
                      icon: Iconsax.location,
                      child: _buildDeliveryInfo(),
                    ),
                    const SizedBox(height: 16),

                    // Original Order Items
                    _buildSection(
                      title: 'Order Items',
                      icon: Iconsax.shopping_bag,
                      child: _buildCartItems(),
                    ),
                    const SizedBox(height: 16),

                    // Additional Services
                    _buildSection(
                      title: 'Additional Services',
                      icon: Iconsax.category,
                      trailing: GestureDetector(
                        onTap: _addService,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.blue.shade200),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.add, size: 14, color: Colors.blue.shade700),
                              const SizedBox(width: 4),
                              Text('Add',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.blue.shade700,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      child: _buildServices(),
                    ),
                    const SizedBox(height: 16),

                    // Total Summary
                    _buildSection(
                      title: 'Total Summary',
                      icon: Iconsax.calculator,
                      child: _buildSummary(),
                    ),
                    const SizedBox(height: 24),

                    // Action Buttons
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _addService,
                            icon: const Icon(Iconsax.add_square, size: 18),
                            label: const Text('Add Service'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.blue.shade700,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              side: BorderSide(color: Colors.blue.shade200),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _completeOrder,
                            icon: const Icon(Iconsax.tick_circle, size: 18),
                            label: const Text('Complete'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green.shade600,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
    );
  }

  // ============================================================
  // WIDGETS
  // ============================================================

  Widget _buildStatusCard() {
    final status = _order['status'] ?? 'Active';
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.green.shade600, Colors.green.shade400],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.green.withValues(alpha: 0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Iconsax.activity, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Order Status',
                  style: TextStyle(color: Colors.white70, fontSize: 11),
                ),
                const SizedBox(height: 2),
                Text(status,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              children: [
                Icon(Iconsax.tick_circle, size: 14, color: Colors.white),
                SizedBox(width: 4),
                Text('Active',
                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required Widget child,
    Widget? trailing,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.blue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 16, color: Colors.blue.shade700),
              ),
              const SizedBox(width: 10),
              Text(title,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              const Spacer(),
              if (trailing != null) trailing,
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _buildCustomerInfo() {
    return Column(
      children: [
        _buildInfoRow(Iconsax.user, 'Name', _order['customer_name'] ?? 'N/A'),
        _buildInfoRow(Iconsax.call, 'Phone', _order['customer_phone'] ?? 'N/A'),
        _buildInfoRow(Iconsax.sms, 'Email', _order['customer_email'] ?? 'N/A'),
      ],
    );
  }

  Widget _buildDeliveryInfo() {
    final address = _order['address'];
    String fullAddress = '';
    if (address is Map) {
      final parts = [];
      if (address['houseNo'] != null && address['houseNo'].toString().isNotEmpty) {
        parts.add('House ${address['houseNo']}');
      }
      if (address['roadNo'] != null && address['roadNo'].toString().isNotEmpty) {
        parts.add('Road ${address['roadNo']}');
      }
      if (address['areaName'] != null && address['areaName'].toString().isNotEmpty) {
        parts.add(address['areaName'].toString());
      }
      if (address['thana'] != null && address['thana'].toString().isNotEmpty) {
        parts.add('Thana: ${address['thana']}');
      }
      if (address['district'] != null && address['district'].toString().isNotEmpty) {
        parts.add(address['district'].toString());
      }
      if (address['division'] != null && address['division'].toString().isNotEmpty) {
        parts.add(address['division'].toString());
      }
      fullAddress = parts.join(', ');
    }

    return Column(
      children: [
        _buildInfoRow(Iconsax.calendar, 'Date', _formatDate(_order['order_date'])),
        _buildInfoRow(Iconsax.clock, 'Time Slot', _order['time_slot'] ?? 'N/A'),
        _buildInfoRow(Iconsax.location, 'Address', fullAddress.isEmpty ? 'N/A' : fullAddress),
        if ((_order['recipient_name'] ?? '').toString().isNotEmpty)
          _buildInfoRow(Iconsax.user, 'Recipient', _order['recipient_name']),
        if ((_order['recipient_phone'] ?? '').toString().isNotEmpty)
          _buildInfoRow(Iconsax.call, 'Recipient Phone', _order['recipient_phone']),
      ],
    );
  }

  Widget _buildCartItems() {
    final cartItems = _order['cart_items'] as List? ?? [];

    if (cartItems.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Text('No items', style: TextStyle(color: Colors.grey)),
        ),
      );
    }

    return Column(
      children: cartItems.map((item) {
        final name = item['name'] ?? 'Item';
        final price = double.tryParse(item['price'].toString()) ?? 0;
        final qty = int.tryParse(item['quantity'].toString()) ?? 1;
        final total = price * qty;

        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Iconsax.box, size: 16, color: Colors.blue.shade700),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name,
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                    Text('৳${price.toStringAsFixed(2)} × $qty',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
              Text('৳${total.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: Colors.green,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildServices() {
    if (_services.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Icon(Iconsax.category, size: 40, color: Colors.grey.shade300),
              const SizedBox(height: 8),
              Text('No additional services',
                style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
              ),
              const SizedBox(height: 4),
              Text('Click "Add" to add a service',
                style: TextStyle(color: Colors.blue.shade700, fontSize: 11),
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      children: _services.map((service) {
        final name = service['service_name'] ?? 'Service';
        final price = double.tryParse(service['price'].toString()) ?? 0;
        final qty = int.tryParse(service['quantity'].toString()) ?? 1;
        final isCustom = (service['source'] ?? '') == 'custom';
        final total = price * qty;

        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isCustom ? Colors.orange.shade50 : Colors.blue.shade50,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isCustom ? Colors.orange.shade200 : Colors.blue.shade200,
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isCustom ? Colors.orange.shade100 : Colors.blue.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  isCustom ? Iconsax.edit : Iconsax.category,
                  size: 16,
                  color: isCustom ? Colors.orange.shade800 : Colors.blue.shade700,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(name,
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: isCustom ? Colors.orange.shade200 : Colors.blue.shade200,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(isCustom ? 'Custom' : 'Master',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w600,
                              color: isCustom ? Colors.orange.shade900 : Colors.blue.shade900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Text('৳${price.toStringAsFixed(2)} × $qty',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
              Text('৳${total.toStringAsFixed(2)}',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: isCustom ? Colors.orange.shade800 : Colors.blue.shade700,
                ),
              ),
              IconButton(
                icon: Icon(Icons.delete_outline, size: 18, color: Colors.red.shade400),
                onPressed: () => _deleteService(service['id'], name),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSummary() {
    final orderTotal = double.tryParse(_order['total']?.toString() ?? '0') ?? 0;
    final subtotal = orderTotal + _serviceTotal;
    final tax = subtotal * 0.05;
    final total = subtotal + tax;

    return Column(
      children: [
        _buildSummaryRow('Order Amount', orderTotal),
        const SizedBox(height: 8),
        _buildSummaryRow('Services Amount', _serviceTotal),
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 10),
          child: Divider(height: 1),
        ),
        _buildSummaryRow('Subtotal', subtotal),
        const SizedBox(height: 8),
        _buildSummaryRow('Tax (5%)', tax),
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 10),
          child: Divider(height: 1, thickness: 2),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('TOTAL',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1),
            ),
            Text(
              '৳${total.toStringAsFixed(2)}',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.green.shade700,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSummaryRow(String label, double amount) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
          style: TextStyle(fontSize: 13, color: Colors.grey.shade700),
        ),
        Text(
          '৳${amount.toStringAsFixed(2)}',
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: Colors.grey.shade500),
          const SizedBox(width: 10),
          SizedBox(
            width: 90,
            child: Text(label,
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ),
          Expanded(
            child: Text(value,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(dynamic date) {
    if (date == null) return 'N/A';
    try {
      final d = DateTime.parse(date.toString());
      return '${d.day}/${d.month}/${d.year}';
    } catch (e) {
      return date.toString();
    }
  }
}