import 'package:flutter/material.dart';

class TotalOrdersScreen extends StatelessWidget {
  const TotalOrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Total Orders')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 20,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('${index + 1}'),
              ),
              title: Text('Order #${1000 + index}'),
              subtitle: const Text('AC Repair Service'),
              trailing: const Text('৳1,200'),
            ),
          );
        },
      ),
    );
  }
}
