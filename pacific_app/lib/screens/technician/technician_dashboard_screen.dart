import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class TechnicianDashboardScreen extends StatelessWidget {
  const TechnicianDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Technician Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout();
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const CircleAvatar(
                          radius: 30,
                          child: Icon(Icons.person, size: 30),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Welcome, ${authProvider.userName ?? 'Technician'}!',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                'Email: ${authProvider.userEmail}',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                              const SizedBox(height: 5),
                              const Chip(
                                label: Text(
                                  'TECHNICIAN',
                                  style: TextStyle(fontSize: 12),
                                ),
                                backgroundColor: Colors.blue,
                                labelStyle: TextStyle(color: Colors.white),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 30),

            // Stats Grid
            Text(
              'Today\'s Overview',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 10),

            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              children: [
                _buildStatCard(
                  'Assigned Jobs',
                  '0',
                  Icons.assignment,
                  Colors.blue,
                ),
                _buildStatCard(
                  'Completed',
                  '0',
                  Icons.check_circle,
                  Colors.green,
                ),
                _buildStatCard('Pending', '0', Icons.pending, Colors.orange),
                _buildStatCard(
                  'Earnings',
                  '৳0',
                  Icons.monetization_on,
                  Colors.purple,
                ),
              ],
            ),

            const SizedBox(height: 30),

            // Quick Actions
            Text(
              'Quick Actions',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 10),

            Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.assignment, color: Colors.blue),
                  title: const Text('View Assigned Jobs'),
                  subtitle: const Text('See all your assigned tasks'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () =>
                      Navigator.pushNamed(context, '/technician/orders'),
                ),
                ListTile(
                  leading: const Icon(Icons.schedule, color: Colors.green),
                  title: const Text('My Schedule'),
                  subtitle: const Text('View your work schedule'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () =>
                      Navigator.pushNamed(context, '/technician/schedule'),
                ),
                ListTile(
                  leading: const Icon(Icons.person, color: Colors.orange),
                  title: const Text('Update Profile'),
                  subtitle: const Text('Edit your information'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () =>
                      Navigator.pushNamed(context, '/technician/profile'),
                ),
                ListTile(
                  leading: const Icon(Icons.money, color: Colors.purple),
                  title: const Text('My Earnings'),
                  subtitle: const Text('View your earnings'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () =>
                      Navigator.pushNamed(context, '/technician/earnings'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 10),
            Text(
              value,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 5),
            Text(
              title,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
