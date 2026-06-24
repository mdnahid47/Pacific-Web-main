import 'package:flutter/material.dart';

class PendingOrdersScreen extends StatelessWidget {
  const PendingOrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pending Orders')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 8,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.orange[100],
                child: const Icon(Icons.pending, color: Colors.orange),
              ),
              title: Text('Order #${2000 + index}'),
              subtitle: const Text('Waiting for technician'),
              trailing: const Text('৳1,500'),
            ),
          );
        },
      ),
    );
  }
}
