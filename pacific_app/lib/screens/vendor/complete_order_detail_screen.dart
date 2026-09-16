import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_service.dart';
import 'invoice_screen.dart';

class CompleteOrderDetailScreen extends StatefulWidget {
  final Map<String, dynamic> order;
  const CompleteOrderDetailScreen({super.key, required this.order});

  @override
  State<CompleteOrderDetailScreen> createState() =>
      _CompleteOrderDetailScreenState();
}

class _CompleteOrderDetailScreenState extends State<CompleteOrderDetailScreen> {
  final ApiService _apiService = ApiService();
  late Map<String, dynamic> _order;
  List<dynamic> _services = [];
  Map<String, dynamic>? _invoice;
  bool _loading = true;
  double _serviceTotal = 0;

  @override
  void initState() {
    super.initState();
    _order = Map<String, dynamic>.from(widget.order);
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return;

      final orderId = (_order['order_id'] ?? '').toString().replaceAll('#', '');

      // Load services
      final servicesRes = await _apiService.getOrderServices(
        token: token,
        orderId: orderId,
      );

      // Try to load invoice
      Map<String, dynamic>? invoiceData;
      try {
        final invoicesRes = await _apiService.getVendorInvoices(token);
        final invoices = invoicesRes['invoices'] as List? ?? [];
        final matchingInvoices = invoices.where((inv) {
          final invOrderId = (inv['order_id'] ?? '').toString().replaceAll('#', '');
          return invOrderId == orderId;
        }).toList();

        if (matchingInvoices.isNotEmpty) {
          invoiceData = Map<String, dynamic>.from(matchingInvoices.first);
          // Fetch full invoice
          final fullInvoice = await _apiService.getInvoice(
            token: token,
            invoiceId: invoiceData['id'].toString(),
          );
          invoiceData = fullInvoice['invoice'];
        }
      } catch (e) {
        debugPrint('Invoice load error: $e');
      }

      if (mounted) {
        setState(() {
          _services = servicesRes['services'] ?? [];
          _serviceTotal = double.tryParse(servicesRes['total']?.toString() ?? '0') ?? 0;
          _invoice = invoiceData;
          _loading = false;
        });
      }
    } catch (e) {
      debugPrint('Load data error: $e');
      if (mounted) setState(() => _loading = false);
    }
  }

  // ✅ View Invoice
  Future<void> _viewInvoice() async {
    if (_invoice == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Invoice not found'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => InvoiceScreen(invoice: _invoice!),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final status = _order['status'] ?? 'Completed';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: Text('#${(_order['order_id'] ?? '').toString().replaceAll('#', '')}'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        actions: [
          if (_invoice != null)
            IconButton(
              icon: const Icon(Iconsax.document_download),
              tooltip: 'View Invoice',
              onPressed: _viewInvoice,
            ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Completed Status Card
                    _buildCompletedStatusCard(status),
                    const SizedBox(height: 16),

                    // Invoice Info (if exists)
                    if (_invoice != null) ...[
                      _buildInvoiceCard(),
                      const SizedBox(height: 16),
                    ],

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

                    // Order Items
                    _buildSection(
                      title: 'Order Items',
                      icon: Iconsax.shopping_bag,
                      child: _buildCartItems(),
                    ),
                    const SizedBox(height: 16),

                    // Additional Services
                    if (_services.isNotEmpty) ...[
                      _buildSection(
                        title: 'Additional Services',
                        icon: Iconsax.category,
                        child: _buildServices(),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Total Summary
                    _buildSection(
                      title: 'Final Summary',
                      icon: Iconsax.calculator,
                      child: _buildSummary(),
                    ),
                    const SizedBox(height: 24),

                    // Action Buttons
                    if (_invoice != null)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _viewInvoice,
                          icon: const Icon(Iconsax.document_download, size: 20),
                          label: const Text('View / Download Invoice'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
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

  Widget _buildCompletedStatusCard(String status) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade600, Colors.blue.shade400],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withValues(alpha: 0.3),
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
            child: const Icon(Iconsax.tick_circle5, color: Colors.white, size: 24),
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
                Text('Completed',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInvoiceCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.green.shade50, Colors.green.shade100],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.shade700,
              shape: BoxShape.circle,
            ),
            child: const Icon(Iconsax.document_text, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Invoice Generated',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.green.shade800,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  _invoice?['invoice_number'] ?? 'N/A',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Total: ৳${_invoice?['total_amount'] ?? '0'}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.green.shade700,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(Iconsax.arrow_right_3, color: Colors.green.shade700),
            onPressed: _viewInvoice,
          ),
        ],
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required Widget child,
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
        if ((_order['completed_date'] ?? '').toString().isNotEmpty)
          _buildInfoRow(Iconsax.tick_circle, 'Completed', _formatDate(_order['completed_date'])),
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
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
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

    // If invoice exists, use its values
    if (_invoice != null) {
      final invOrderAmount = double.tryParse(_invoice!['order_amount'].toString()) ?? orderTotal;
      final invServiceAmount = double.tryParse(_invoice!['service_amount'].toString()) ?? _serviceTotal;
      final invSubtotal = double.tryParse(_invoice!['subtotal'].toString()) ?? subtotal;
      final invTax = double.tryParse(_invoice!['tax'].toString()) ?? tax;
      final invDiscount = double.tryParse(_invoice!['discount'].toString()) ?? 0;
      final invTotal = double.tryParse(_invoice!['total_amount'].toString()) ?? total;

      return Column(
        children: [
          _buildSummaryRow('Order Amount', invOrderAmount),
          const SizedBox(height: 8),
          _buildSummaryRow('Services Amount', invServiceAmount),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(height: 1),
          ),
          _buildSummaryRow('Subtotal', invSubtotal),
          const SizedBox(height: 8),
          if (invDiscount > 0) ...[
            _buildSummaryRow('Discount', -invDiscount, color: Colors.red.shade600),
            const SizedBox(height: 8),
          ],
          _buildSummaryRow('Tax (5%)', invTax),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(height: 1, thickness: 2),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('TOTAL',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
              Text(
                '৳${invTotal.toStringAsFixed(2)}',
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

    // Otherwise calculate
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
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
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

  Widget _buildSummaryRow(String label, double amount, {Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
          style: TextStyle(
            fontSize: 13,
            color: color ?? Colors.grey.shade700,
          ),
        ),
        Text(
          '${amount < 0 ? '-' : ''}৳${amount.abs().toStringAsFixed(2)}',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: color,
          ),
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