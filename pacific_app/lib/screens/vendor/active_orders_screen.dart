import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

class ActiveOrdersScreen extends StatefulWidget {
  const ActiveOrdersScreen({super.key});

  @override
  State<ActiveOrdersScreen> createState() => _ActiveOrdersScreenState();
}

class _ActiveOrdersScreenState extends State<ActiveOrdersScreen> {
  List<Map<String, dynamic>> activeOrders = [
    {
      'id': 'ORD-101',
      'service': 'AC Installation',
      'technician': 'Rahim Khan',
      'customer': 'Ali Ahmed',
      'address': 'Gulshan, Dhaka',
      'scheduledTime': '09:00 AM',
      'actualStartTime': '09:05 AM',
      'status': 'Late Start',
      'fine': '৳100',
    },
    {
      'id': 'ORD-102',
      'service': 'Washing Machine Repair',
      'technician': 'Karim Uddin',
      'customer': 'Fatima Begum',
      'address': 'Banani, Dhaka',
      'scheduledTime': '10:30 AM',
      'actualStartTime': '10:28 AM',
      'status': 'On Time',
      'fine': '৳0',
    },
    // Add more orders...
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Active Orders'),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.timer),
            onPressed: () {
              // Show timer summary
            },
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: activeOrders.length,
        itemBuilder: (context, index) {
          final order = activeOrders[index];
          final isLate = order['status'] == 'Late Start';

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
                        label: Text(order['status']),
                        backgroundColor: isLate
                            ? Colors.red[100]
                            : Colors.green[100],
                        labelStyle: TextStyle(
                          color: isLate ? Colors.red : Colors.green,
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
                  const SizedBox(height: 10),

                  // Time Information
                  Card(
                    color: Colors.grey[50],
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Scheduled:'),
                              Text(
                                order['scheduledTime'],
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Actual Start:',
                                style: TextStyle(
                                  color: isLate ? Colors.red : Colors.green,
                                ),
                              ),
                              Text(
                                order['actualStartTime'],
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: isLate ? Colors.red : Colors.green,
                                ),
                              ),
                            ],
                          ),
                          if (isLate)
                            Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text('Late Fine:'),
                                  Text(
                                    order['fine'],
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),
                  _buildInfoRow('Technician:', order['technician']),
                  _buildInfoRow('Customer:', order['customer']),
                  _buildInfoRow('Address:', order['address']),

                  const SizedBox(height: 20),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Iconsax.add_square),
                          label: const Text('Add Service'),
                          onPressed: () {
                            _addAdditionalService(order['id']);
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton.icon(
                          icon: const Icon(Iconsax.tick_circle),
                          label: const Text('Complete'),
                          onPressed: () {
                            _completeOrder(order['id']);
                          },
                        ),
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
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(label, style: TextStyle(color: Colors.grey[600])),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  void _addAdditionalService(String orderId) {
    showDialog(
      context: context,
      builder: (context) {
        String selectedService = '';
        double serviceAmount = 0.0;

        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Add Additional Service'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Select Service',
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: 'Gas Refill',
                        child: Text('Gas Refill'),
                      ),
                      DropdownMenuItem(
                        value: 'Pipe Cleaning',
                        child: Text('Pipe Cleaning'),
                      ),
                      DropdownMenuItem(
                        value: 'Filter Change',
                        child: Text('Filter Change'),
                      ),
                    ],
                    onChanged: (value) {
                      setState(() {
                        selectedService = value!;
                        // Set default amount based on service
                        if (value == 'Gas Refill') serviceAmount = 800;
                        if (value == 'Pipe Cleaning') serviceAmount = 500;
                        if (value == 'Filter Change') serviceAmount = 300;
                      });
                    },
                  ),
                  const SizedBox(height: 20),
                  TextFormField(
                    decoration: const InputDecoration(
                      labelText: 'Amount (৳)',
                      border: OutlineInputBorder(),
                      prefixText: '৳',
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (value) {
                      setState(() {
                        serviceAmount = double.tryParse(value) ?? 0.0;
                      });
                    },
                    initialValue: serviceAmount.toString(),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: selectedService.isEmpty
                      ? null
                      : () {
                          // Add service to order
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                '$selectedService added (৳$serviceAmount)',
                              ),
                            ),
                          );
                        },
                  child: const Text('Add Service'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _completeOrder(String orderId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Complete Order'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Generate receipt for customer?'),
            const SizedBox(height: 20),
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Final Amount (৳)',
                border: OutlineInputBorder(),
                prefixText: '৳',
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              // Complete order and generate receipt
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Order completed. Receipt generated.'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: const Text('Complete & Generate Receipt'),
          ),
        ],
      ),
    );
  }
}
