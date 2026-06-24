import 'package:flutter/material.dart';

class ActiveTechsScreen extends StatelessWidget {
  const ActiveTechsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Active Technicians')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundImage: NetworkImage('https://picsum.photos/100'),
              ),
              title: Text('Technician ${index + 1}'),
              subtitle: const Text('AC Specialist'),
              trailing: Chip(
                label: const Text('Active'),
                backgroundColor: Colors.green[100],
              ),
            ),
          );
        },
      ),
    );
  }
}
