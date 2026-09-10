import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_service.dart';

class NewOrdersScreen extends StatefulWidget {
  const NewOrdersScreen({super.key});

  @override
  State<NewOrdersScreen> createState() => _NewOrdersScreenState();
}

class _NewOrdersScreenState extends State<NewOrdersScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _orders = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  Future<void> _loadOrders() async {
    setState(() => _loading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) throw Exception('No token');

      final response = await _apiService.getVendorOrders(token);
      final allOrders = response['orders'] ?? [];

      // ✅ Filter NEW (Pending) orders
      setState(() {
        _orders = allOrders.where((o) => o['status'] == 'Pending').toList();
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Future<void> _updateStatus(String orderId, String newStatus) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return;

      await _apiService.updateOrderStatus(
        token: token,
        orderId: orderId,
        status: newStatus,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Order updated to $newStatus'),
            backgroundColor: Colors.green,
          ),
        );
        _loadOrders();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Orders'),
        actions: [
          IconButton(icon: const Icon(Iconsax.refresh), onPressed: _loadOrders),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : _orders.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Iconsax.box, size: 60, color: Colors.grey),
                          SizedBox(height: 16),
                          Text('No new orders 🎉'),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadOrders,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(20),
                        itemCount: _orders.length,
                        itemBuilder: (context, index) {
                          final order = _orders[index];
                          final orderId = (order['order_id'] ?? 'N/A')
                              .toString()
                              .replaceAll('#', '');
                          final customerName =
                              order['customer_name'] ?? 'Unknown';
                          final customerPhone = order['customer_phone'] ?? '';
                          final total = order['total'] ?? '0';
                          final date = order['order_date'] ?? 'N/A';
                          final address = order['address'];

                          return Card(
                            margin: const EdgeInsets.only(bottom: 15),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        '#$orderId',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      Chip(
                                        label: const Text('Pending'),
                                        backgroundColor: Colors.orange[100],
                                        labelStyle: const TextStyle(
                                          color: Colors.orange,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    customerName,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  _buildInfoRow('Phone:', customerPhone),
                                  _buildInfoRow('Amount:', '৳$total'),
                                  _buildInfoRow('Date:', date),
                                  const SizedBox(height: 15),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      OutlinedButton.icon(
                                        icon: const Icon(
                                          Iconsax.play_circle,
                                          size: 16,
                                        ),
                                        label: const Text('Start'),
                                        onPressed: () =>
                                            _updateStatus(orderId, 'Active'),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Text(label, style: TextStyle(color: Colors.grey[600])),
          const SizedBox(width: 10),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}