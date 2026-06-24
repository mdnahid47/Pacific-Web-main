import 'package:flutter/material.dart';
import 'package:pacific_app/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome, ${authProvider.userName ?? authProvider.vendorName ?? 'User'}!',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Role: ${authProvider.userRole?.toUpperCase() ?? 'N/A'}',
                      style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                    ),
                    if (authProvider.userEmail != null) ...[
                      const SizedBox(height: 5),
                      Text(
                        'Email: ${authProvider.userEmail}',
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            const SizedBox(height: 30),

            // Quick Actions
            Text(
              'Quick Actions',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 10),

            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              children: [
                // Different actions based on role
                if (authProvider.userRole == 'user') ...[
                  _buildActionCard(
                    context,
                    'Place Order',
                    Icons.add_shopping_cart,
                    Colors.blue,
                    () => Navigator.pushNamed(context, '/place-order'),
                  ),
                  _buildActionCard(
                    context,
                    'My Orders',
                    Icons.history,
                    Colors.green,
                    () => Navigator.pushNamed(context, '/orders'),
                  ),
                  _buildActionCard(
                    context,
                    'Profile',
                    Icons.person,
                    Colors.purple,
                    () => Navigator.pushNamed(context, '/profile'),
                  ),
                  _buildActionCard(
                    context,
                    'Services',
                    Icons.category,
                    Colors.orange,
                    () => Navigator.pushNamed(context, '/services'),
                  ),
                ],

                if (authProvider.userRole == 'vendor') ...[
                  _buildActionCard(
                    context,
                    'My Orders',
                    Icons.assignment,
                    Colors.blue,
                    () => Navigator.pushNamed(context, '/vendor/orders'),
                  ),
                  _buildActionCard(
                    context,
                    'Dashboard',
                    Icons.dashboard,
                    Colors.green,
                    () => Navigator.pushNamed(context, '/vendor/dashboard'),
                  ),
                  _buildActionCard(
                    context,
                    'Profile',
                    Icons.person,
                    Colors.purple,
                    () => Navigator.pushNamed(context, '/vendor/profile'),
                  ),
                  _buildActionCard(
                    context,
                    'Earnings',
                    Icons.monetization_on,
                    Colors.orange,
                    () => Navigator.pushNamed(context, '/vendor/earnings'),
                  ),
                ],

                if (authProvider.userRole == 'admin' ||
                    authProvider.userRole == 'superadmin') ...[
                  _buildActionCard(
                    context,
                    'All Orders',
                    Icons.list_alt,
                    Colors.blue,
                    () => Navigator.pushNamed(context, '/admin/orders'),
                  ),
                  _buildActionCard(
                    context,
                    'Users',
                    Icons.people,
                    Colors.green,
                    () => Navigator.pushNamed(context, '/admin/users'),
                  ),
                  _buildActionCard(
                    context,
                    'Vendors',
                    Icons.business,
                    Colors.purple,
                    () => Navigator.pushNamed(context, '/admin/vendors'),
                  ),
                  _buildActionCard(
                    context,
                    'Dashboard',
                    Icons.dashboard,
                    Colors.orange,
                    () => Navigator.pushNamed(context, '/admin/dashboard'),
                  ),
                ],
              ],
            ),

            const SizedBox(height: 30),

            // Recent Activity Section
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 10),

            Expanded(
              child: ListView(
                children: [
                  ListTile(
                    leading: const Icon(
                      Icons.check_circle,
                      color: Colors.green,
                    ),
                    title: const Text('Successfully logged in'),
                    subtitle: Text('Just now'),
                    trailing: const Icon(Icons.chevron_right),
                  ),
                  ListTile(
                    leading: const Icon(Icons.info, color: Colors.blue),
                    title: Text('Account type: ${authProvider.userRole}'),
                    subtitle: const Text('View details'),
                    trailing: const Icon(Icons.chevron_right),
                  ),
                  // Add more activity items as needed
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 40, color: color),
              const SizedBox(height: 10),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
