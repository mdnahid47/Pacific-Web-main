import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

class NewOrdersScreen extends StatefulWidget {
  const NewOrdersScreen({super.key});

  @override
  State<NewOrdersScreen> createState() => _NewOrdersScreenState();
}

class _NewOrdersScreenState extends State<NewOrdersScreen> {
  List<Map<String, dynamic>> orders = [
    {
      'id': 'ORD-001',
      'service': 'AC Repair',
      'customer': 'John Doe',
      'address': 'Mirpur, Dhaka',
      'amount': '৳1500',
      'time': '10 min ago',
      'priority': 'High',
    },
    {
      'id': 'ORD-002',
      'service': 'Refrigerator Service',
      'customer': 'Sarah Smith',
      'address': 'Uttara, Dhaka',
      'amount': '৳1200',
      'time': '25 min ago',
      'priority': 'Medium',
    },
    // Add more orders...
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Orders'),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.filter),
            onPressed: () {
              // Show filter options
            },
          ),
        ],
      ),
      body: orders.isEmpty
          ? const Center(child: Text('No new orders'))
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: orders.length,
              itemBuilder: (context, index) {
                final order = orders[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 15),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              order['id'],
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Chip(
                              label: Text(order['priority']),
                              backgroundColor: order['priority'] == 'High'
                                  ? Colors.red[100]
                                  : Colors.orange[100],
                              labelStyle: TextStyle(
                                color: order['priority'] == 'High'
                                    ? Colors.red
                                    : Colors.orange,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          order['service'],
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        _buildInfoRow('Customer:', order['customer']),
                        _buildInfoRow('Address:', order['address']),
                        _buildInfoRow('Amount:', order['amount']),
                        const SizedBox(height: 15),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              order['time'],
                              style: TextStyle(color: Colors.grey[600]),
                            ),
                            Row(
                              children: [
                                OutlinedButton.icon(
                                  icon: const Icon(
                                    Iconsax.close_circle,
                                    size: 16,
                                  ),
                                  label: const Text('Cancel'),
                                  onPressed: () {
                                    _cancelOrder(order['id']);
                                  },
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.red,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                ElevatedButton.icon(
                                  icon: const Icon(Iconsax.user, size: 16),
                                  label: const Text('Assign Tech'),
                                  onPressed: () {
                                    _assignTechnician(order['id']);
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
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

  void _cancelOrder(String orderId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Order'),
        content: const Text('Are you sure you want to cancel this order?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('No'),
          ),
          ElevatedButton(
            onPressed: () {
              // API call to cancel order
              setState(() {
                orders.removeWhere((order) => order['id'] == orderId);
              });
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Yes, Cancel'),
          ),
        ],
      ),
    );
  }

  void _assignTechnician(String orderId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.7,
          maxChildSize: 0.9,
          minChildSize: 0.5,
          expand: false,
          builder: (context, scrollController) {
            return Container(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Text(
                    'Assign Technician',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: ListView.builder(
                      controller: scrollController,
                      itemCount: 5,
                      itemBuilder: (context, index) {
                        return ListTile(
                          leading: const CircleAvatar(
                            child: Icon(Icons.person),
                          ),
                          title: Text('Technician ${index + 1}'),
                          subtitle: const Text('AC Specialist | 4.5 ⭐'),
                          trailing: ElevatedButton(
                            onPressed: () {
                              // Assign technician
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Technician assigned successfully',
                                  ),
                                ),
                              );
                            },
                            child: const Text('Assign'),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
