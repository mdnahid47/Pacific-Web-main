import 'package:flutter/material.dart';
import 'package:pacific_app/screens/vendor/notifications/notification_details_screen.dart';

class AllNotificationsScreen extends StatelessWidget {
  const AllNotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('All Notifications'),
        actions: [
          IconButton(icon: const Icon(Icons.delete_sweep), onPressed: () {}),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 15,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('${index + 1}'),
              ),
              title: Text('Notification ${index + 1}'),
              subtitle: const Text('This is a notification message'),
              trailing: const Text('2h ago'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => NotificationDetailsScreen(
                      notificationId: index + 1,
                      title: 'Notification ${index + 1}',
                      subtitle: 'This is a detailed notification message',
                      time: '2 hours ago',
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
