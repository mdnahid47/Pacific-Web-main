// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../../providers/auth_provider.dart';

// class VendorDashboardScreen extends StatelessWidget {
//   const VendorDashboardScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     final authProvider = Provider.of<AuthProvider>(context);

//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Vendor Dashboard'),
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.logout),
//             onPressed: () async {
//               await authProvider.logout();
//             },
//           ),
//         ],
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(20),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Welcome Card
//             Card(
//               child: Padding(
//                 padding: const EdgeInsets.all(20),
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Row(
//                       children: [
//                         const CircleAvatar(
//                           radius: 30,
//                           child: Icon(Icons.business, size: 30),
//                         ),
//                         const SizedBox(width: 20),
//                         Expanded(
//                           child: Column(
//                             crossAxisAlignment: CrossAxisAlignment.start,
//                             children: [
//                               Text(
//                                 'Welcome, ${authProvider.vendorName ?? 'Vendor'}!',
//                                 style: const TextStyle(
//                                   fontSize: 20,
//                                   fontWeight: FontWeight.bold,
//                                 ),
//                               ),
//                               const SizedBox(height: 5),
//                               Text(
//                                 'Email: ${authProvider.vendorEmail}',
//                                 style: TextStyle(color: Colors.grey[600]),
//                               ),
//                               const SizedBox(height: 5),
//                               Chip(
//                                 label: Text(
//                                   authProvider.vendorStatus?.toUpperCase() ??
//                                       'VENDOR',
//                                   style: const TextStyle(fontSize: 12),
//                                 ),
//                                 backgroundColor: Colors.orange,
//                                 labelStyle: const TextStyle(
//                                   color: Colors.white,
//                                 ),
//                               ),
//                             ],
//                           ),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//               ),
//             ),

//             const SizedBox(height: 30),

//             // Quick Actions
//             Text(
//               'Quick Actions',
//               style: Theme.of(context).textTheme.titleLarge,
//             ),
//             const SizedBox(height: 10),

//             GridView.count(
//               shrinkWrap: true,
//               crossAxisCount: 2,
//               crossAxisSpacing: 10,
//               mainAxisSpacing: 10,
//               children: [
//                 _buildActionCard(
//                   context,
//                   'Add Technician',
//                   Icons.person_add,
//                   Colors.blue,
//                   () => Navigator.pushNamed(context, '/vendor/add-technician'),
//                 ),
//                 _buildActionCard(
//                   context,
//                   'Manage Technicians',
//                   Icons.people,
//                   Colors.green,
//                   () => Navigator.pushNamed(context, '/vendor/technicians'),
//                 ),
//                 _buildActionCard(
//                   context,
//                   'View Orders',
//                   Icons.shopping_cart,
//                   Colors.orange,
//                   () => Navigator.pushNamed(context, '/vendor/orders'),
//                 ),
//                 _buildActionCard(
//                   context,
//                   'Manage Services',
//                   Icons.category,
//                   Colors.purple,
//                   () => Navigator.pushNamed(context, '/vendor/services'),
//                 ),
//               ],
//             ),

//             const SizedBox(height: 30),

//             // Stats Overview
//             Text(
//               'Business Overview',
//               style: Theme.of(context).textTheme.titleLarge,
//             ),
//             const SizedBox(height: 10),

//             GridView.count(
//               shrinkWrap: true,
//               crossAxisCount: 2,
//               crossAxisSpacing: 10,
//               mainAxisSpacing: 10,
//               children: [
//                 _buildStatCard(
//                   'Total Orders',
//                   '0',
//                   Icons.shopping_cart,
//                   Colors.blue,
//                 ),
//                 _buildStatCard('Active Techs', '0', Icons.people, Colors.green),
//                 _buildStatCard('Pending', '0', Icons.pending, Colors.orange),
//                 _buildStatCard(
//                   'Earnings',
//                   '৳0',
//                   Icons.monetization_on,
//                   Colors.purple,
//                 ),
//               ],
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildActionCard(
//     BuildContext context,
//     String title,
//     IconData icon,
//     Color color,
//     VoidCallback onTap,
//   ) {
//     return Card(
//       elevation: 4,
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(8),
//         child: Padding(
//           padding: const EdgeInsets.all(16),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Icon(icon, size: 40, color: color),
//               const SizedBox(height: 10),
//               Text(
//                 title,
//                 style: const TextStyle(
//                   fontSize: 16,
//                   fontWeight: FontWeight.bold,
//                 ),
//                 textAlign: TextAlign.center,
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildStatCard(
//     String title,
//     String value,
//     IconData icon,
//     Color color,
//   ) {
//     return Card(
//       elevation: 4,
//       child: Padding(
//         padding: const EdgeInsets.all(16),
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Icon(icon, size: 40, color: color),
//             const SizedBox(height: 10),
//             Text(
//               value,
//               style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
//             ),
//             const SizedBox(height: 5),
//             Text(
//               title,
//               style: TextStyle(fontSize: 14, color: Colors.grey[600]),
//               textAlign: TextAlign.center,
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:pacific_app/screens/vendor/vendor_profile_screen.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import '../../providers/auth_provider.dart';
import './new_orders_screen.dart';
import './active_orders_screen.dart';
import '../technician_management_screen.dart';

// Business Overview পেজগুলি
import './buisness_overview/total_orders_screen.dart';
import './buisness_overview/active_techs_screen.dart';
import './buisness_overview/pending_orders_screen.dart';
import './buisness_overview/revenue_details_screen.dart';

// Quick Actions পেজগুলি
import './quick_actions/revenue_screen.dart';
import './quick_actions/due_pay_screen.dart';
import './quick_actions/add_service_screen.dart';
import './quick_actions/complete_orders_screen.dart';

// Notification পেজগুলি
import './notifications/notification_details_screen.dart';
import './notifications/all_notifications_screen.dart';

class VendorDashboardScreen extends StatefulWidget {
  const VendorDashboardScreen({super.key});

  @override
  State<VendorDashboardScreen> createState() => _VendorDashboardScreenState();
}

class _VendorDashboardScreenState extends State<VendorDashboardScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const DashboardHomeScreen(),
    const NewOrdersScreen(),
    const ActiveOrdersScreen(),
    const TechnicianManagementScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isActive = authProvider.vendorStatus?.toLowerCase() == 'active';

    // ডিবাগিং
    print('🎯 Building VendorDashboardScreen');
    print('📸 Vendor Photo: ${authProvider.vendorPhoto}');
    print('👤 Vendor Name: ${authProvider.vendorName}');

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            // উন্নত প্রোফাইল ইমেজ লোডার
            _buildProfileImage(authProvider),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  authProvider.vendorName ?? 'Vendor',
                  style: const TextStyle(fontSize: 16),
                ),
                Row(
                  children: [
                    Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: isActive ? Colors.green : Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      isActive ? 'Active' : 'Suspended',
                      style: TextStyle(
                        fontSize: 12,
                        color: isActive ? Colors.green : Colors.red,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        actions: [
          // নোটিফিকেশন আইকন
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const AllNotificationsScreen(),
                    ),
                  );
                },
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  constraints: const BoxConstraints(
                    minWidth: 16,
                    minHeight: 16,
                  ),
                  child: const Text(
                    '3',
                    style: TextStyle(color: Colors.white, fontSize: 10),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
          // প্রোফাইল আইকন
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const VendorProfileScreen(),
                ),
              );
            },
          ),
        ],
      ),
      drawer: _buildDrawer(context, authProvider),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Iconsax.home), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Iconsax.box), label: 'New Orders'),
          BottomNavigationBarItem(icon: Icon(Iconsax.clock), label: 'Active'),
          BottomNavigationBarItem(
            icon: Icon(Iconsax.people),
            label: 'Technicians',
          ),
        ],
      ),
    );
  }

  // Drawer তৈরি
  Drawer _buildDrawer(BuildContext context, AuthProvider authProvider) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Drawer হেডার
          DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue[700]),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildProfileImage(authProvider, size: 50),
                const SizedBox(height: 10),
                Text(
                  authProvider.vendorName ?? 'Vendor',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  authProvider.vendorEmail ?? 'vendor@example.com',
                  style: const TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
          // Drawer মেনু আইটেম
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.pop(context);
              setState(() {
                _selectedIndex = 0;
              });
            },
          ),
          ListTile(
            leading: const Icon(Icons.business),
            title: const Text('My Business'),
            onTap: () {
              Navigator.pop(context);
              // Business Overview পেজে নেভিগেট
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: () {
              Navigator.pop(context);
              // Settings পেজে নেভিগেট
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () => _confirmLogout(context, authProvider),
          ),
        ],
      ),
    );
  }

  // প্রোফাইল ইমেজ লোডার
  Widget _buildProfileImage(AuthProvider authProvider, {double size = 36}) {
    final imageUrl = authProvider.vendorPhoto;

    if (imageUrl == null || imageUrl.isEmpty) {
      return CircleAvatar(
        radius: size / 2,
        backgroundColor: Colors.blue[100],
        child: Icon(Icons.business, size: size * 0.6, color: Colors.blue),
      );
    }

    return CircleAvatar(
      radius: size / 2,
      backgroundColor: Colors.grey[200],
      child: ClipOval(
        child: CachedNetworkImage(
          imageUrl: imageUrl,
          width: size,
          height: size,
          fit: BoxFit.cover,
          placeholder: (context, url) => Container(
            color: Colors.grey[200],
            child: Center(
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.blue,
              ),
            ),
          ),
          errorWidget: (context, url, error) => Container(
            color: Colors.grey[200],
            child: Icon(Icons.business, size: size * 0.6, color: Colors.blue),
          ),
        ),
      ),
    );
  }

  // লগআউট কনফার্মেশন
  Future<void> _confirmLogout(
    BuildContext context,
    AuthProvider authProvider,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (result == true) {
      await authProvider.logout();
      // Login পেজে নেভিগেট
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
    }
  }
}

// ================= Dashboard Home Screen =================

class DashboardHomeScreen extends StatelessWidget {
  const DashboardHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Business Overview সেকশন
          _buildSectionHeader(
            'Business Overview',
            onViewAll: () => Navigator.pushNamed(context, '/business-overview'),
          ),
          const SizedBox(height: 15),

          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            children: [
              _buildBusinessCard(
                context: context,
                title: 'Total Orders',
                value: '48',
                icon: Icons.shopping_cart,
                color: Colors.blue,
                screen: const TotalOrdersScreen(),
              ),
              _buildBusinessCard(
                context: context,
                title: 'Active Techs',
                value: '5',
                icon: Icons.people,
                color: Colors.green,
                screen: const ActiveTechsScreen(),
              ),
              _buildBusinessCard(
                context: context,
                title: 'Pending Orders',
                value: '12',
                icon: Icons.pending,
                color: Colors.orange,
                screen: const PendingOrdersScreen(),
              ),
              _buildBusinessCard(
                context: context,
                title: 'Total Revenue',
                value: '৳25,800',
                icon: Icons.monetization_on,
                color: Colors.purple,
                screen: const RevenueDetailsScreen(),
              ),
            ],
          ),

          const SizedBox(height: 30),

          // Quick Actions সেকশন
          _buildSectionHeader(
            'Quick Actions',
            onViewAll: () => Navigator.pushNamed(context, '/quick-actions'),
          ),
          const SizedBox(height: 15),

          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            children: [
              _buildQuickActionCard(
                title: 'Revenue',
                icon: Iconsax.chart,
                color: Colors.blue,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const RevenueScreen(),
                  ),
                ),
              ),
              _buildQuickActionCard(
                title: 'Due/Pay',
                icon: Iconsax.money_time,
                color: Colors.red,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const DuePayScreen()),
                ),
              ),
              _buildQuickActionCard(
                title: 'Add Service',
                icon: Iconsax.add_square,
                color: Colors.green,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AddServiceScreen(),
                  ),
                ),
              ),
              _buildQuickActionCard(
                title: 'Complete Orders',
                icon: Iconsax.tick_circle,
                color: Colors.purple,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CompleteOrdersScreen(),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 30),

          // Recent Activity সেকশন
          _buildSectionHeader(
            'Recent Activity',
            onViewAll: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const AllNotificationsScreen(),
              ),
            ),
          ),
          const SizedBox(height: 15),

          _buildActivityList(context),

          const SizedBox(height: 30),

          // Quick Summary সেকশন
          _buildSectionHeader(
            'Quick Summary',
            onViewAll: () => Navigator.pushNamed(context, '/quick-summary'),
          ),
          const SizedBox(height: 15),

          _buildSummaryCards(),
        ],
      ),
    );
  }

  // সেকশন হেডার
  Widget _buildSectionHeader(String title, {VoidCallback? onViewAll}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        if (onViewAll != null)
          TextButton(
            onPressed: onViewAll,
            child: const Text('View All', style: TextStyle(fontSize: 14)),
          ),
      ],
    );
  }

  // Business Card
  Widget _buildBusinessCard({
    required BuildContext context,
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required Widget screen,
  }) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => screen),
          );
        },
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 32, color: color),
              const SizedBox(height: 10),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                title,
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Quick Action Card
  Widget _buildQuickActionCard({
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
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
              Icon(icon, size: 32, color: color),
              const SizedBox(height: 10),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
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

  // Activity List
  Widget _buildActivityList(BuildContext context) {
    final activities = [
      {
        'title': 'New Order Received',
        'subtitle': 'AC Repair - Mirpur',
        'time': '10 min ago',
      },
      {
        'title': 'Payment Received',
        'subtitle': '৳1,500 - Order #1001',
        'time': '1 hour ago',
      },
      {
        'title': 'Technician Assigned',
        'subtitle': 'John Doe - Order #1002',
        'time': '2 hours ago',
      },
      {
        'title': 'Service Completed',
        'subtitle': 'Order #1000 - 5 star rating',
        'time': '3 hours ago',
      },
      {
        'title': 'New Message',
        'subtitle': 'Customer: Alex Johnson',
        'time': '4 hours ago',
      },
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: activities.length,
      itemBuilder: (context, index) {
        final activity = activities[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          child: InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => NotificationDetailsScreen(
                    notificationId: index + 1,
                    title: activity['title']!,
                    subtitle: activity['subtitle']!,
                    time: activity['time']!,
                  ),
                ),
              );
            },
            borderRadius: BorderRadius.circular(8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: _getActivityColor(index),
                child: Icon(_getActivityIcon(index), color: Colors.white),
              ),
              title: Text(activity['title']!),
              subtitle: Text(activity['subtitle']!),
              trailing: Text(
                activity['time']!,
                style: TextStyle(color: Colors.grey[600], fontSize: 12),
              ),
            ),
          ),
        );
      },
    );
  }

  // Summary Cards
  Widget _buildSummaryCards() {
    return Row(
      children: [
        Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const Text(
                    'Today',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 5),
                  const Text(
                    '৳5,200',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    'Revenue',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const Text(
                    'This Week',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 5),
                  const Text(
                    '৳18,400',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    'Revenue',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  // হেল্পার ফাংশন
  Color _getActivityColor(int index) {
    final colors = [
      Colors.blue,
      Colors.green,
      Colors.orange,
      Colors.purple,
      Colors.red,
    ];
    return colors[index % colors.length];
  }

  IconData _getActivityIcon(int index) {
    final icons = [
      Icons.shopping_cart,
      Icons.monetization_on,
      Icons.people,
      Icons.check_circle,
      Icons.message,
    ];
    return icons[index % icons.length];
  }
}
