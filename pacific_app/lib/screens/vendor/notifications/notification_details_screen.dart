import 'package:flutter/material.dart';

class NotificationDetailsScreen extends StatelessWidget {
  final int notificationId;
  final String title;
  final String subtitle;
  final String time;

  const NotificationDetailsScreen({
    super.key,
    required this.notificationId,
    required this.title,
    required this.subtitle,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(time, style: TextStyle(color: Colors.grey[600])),
            const Divider(height: 30),
            Text(subtitle, style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 20),
            const Text(
              'Details:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text(
              'This is the detailed description of the notification. '
              'You can add more information here about the specific activity.',
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Back to Notifications'),
            ),
          ],
        ),
      ),
    );
  }
}
