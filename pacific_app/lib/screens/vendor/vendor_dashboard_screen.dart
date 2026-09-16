import 'dart:async';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:pacific_app/screens/vendor/vendor_profile_screen.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../services/socket_service.dart';
import '../../services/notification_service.dart';
import 'incoming_order_screen.dart';
import './new_orders_screen.dart';
import './active_orders_screen.dart';
import '../technician_management_screen.dart';

// Business Overview screens
import './buisness_overview/total_orders_screen.dart';
import './buisness_overview/pending_orders_screen.dart';

// Quick Actions screens
import './quick_actions/revenue_screen.dart';
import './quick_actions/due_pay_screen.dart';
import './quick_actions/add_service_screen.dart';
import './quick_actions/complete_orders_screen.dart';

// Notification screens
import './notifications/all_notifications_screen.dart';

class VendorDashboardScreen extends StatefulWidget {
  const VendorDashboardScreen({super.key});

  @override
  State<VendorDashboardScreen> createState() => _VendorDashboardScreenState();
}

class _VendorDashboardScreenState extends State<VendorDashboardScreen> {
  int _selectedIndex = 0;
  int _unreadNotifications = 0;
  final ApiService _apiService = ApiService();
  bool _isIncomingScreenOpen = false;

  final List<Widget> _screens = [
    const DashboardHomeScreen(),
    const NewOrdersScreen(),
    const ActiveOrdersScreen(),
    const TechnicianManagementScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _loadNotificationCount();
    _setupRealtimeListeners();
  }

  @override
  void dispose() {
    SocketService.disconnect();
    NotificationService.stopRing();
    super.dispose();
  }

  // ✅ Setup Socket + Notification listeners
  Future<void> _setupRealtimeListeners() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final vendorId = prefs.getString('vendorId') ?? '1';

      if (token == null) {
        debugPrint('❌ No token for socket');
        return;
      }

      // ✅ Initialize notification service
      await NotificationService.initialize();
      debugPrint('✅ Notification service ready');

      // ✅ Connect socket
      SocketService.connect(vendorId: vendorId, token: token);
      debugPrint('✅ Socket connected for vendor $vendorId');

      // ✅ Listen for new orders
      SocketService.onNewOrder = (data) {
        debugPrint('🔔 New order from socket: $data');
        if (mounted) _showIncomingOrder(data);
      };

      // ✅ Check for pending assignments (in case app was closed)
      _checkPendingAssignments(token);
    } catch (e) {
      debugPrint('❌ Realtime setup error: $e');
    }
  }

  Future<void> _checkPendingAssignments(String token) async {
    try {
      final response = await _apiService.getPendingAssignments(token);
      final orders = response['orders'] as List? ?? [];

      if (orders.isNotEmpty && mounted) {
        final firstOrder = orders.first;
        debugPrint('🔔 Pending assignment found: ${firstOrder['order_id']}');
        _showIncomingOrder({
          'orderId': firstOrder['order_id'],
          'timeLimit': firstOrder['seconds_left'] ?? 60,
          'vendorId': firstOrder['assigned_to_vendor_id'],
        });
      }
    } catch (e) {
      debugPrint('❌ Pending check error: $e');
    }
  }

  // ✅ Show incoming order screen
  void _showIncomingOrder(Map<String, dynamic> orderData) {
    if (_isIncomingScreenOpen) {
      debugPrint('⚠️ Incoming screen already open');
      return;
    }

    _isIncomingScreenOpen = true;

    // Show notification + ring
    NotificationService.showIncomingOrder(
      orderId: orderData['orderId'] ?? '',
      secondsLeft: orderData['timeLimit'] ?? 60,
    );

    Navigator.of(context)
        .push(
          MaterialPageRoute(
            fullscreenDialog: true,
            builder: (context) => IncomingOrderScreen(
              orderData: orderData,
              onDismiss: () {
                _isIncomingScreenOpen = false;
                _loadNotificationCount();
                NotificationService.stopRing();
              },
            ),
          ),
        )
        .then((_) {
          _isIncomingScreenOpen = false;
          NotificationService.stopRing();
        });
  }

  Future<void> _loadNotificationCount() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token != null) {
        final count = await _apiService.getUnreadCount(token);
        if (mounted) setState(() => _unreadNotifications = count);
      }
    } catch (e) {
      debugPrint('❌ Notification count error: $e');
    }
  }

  void _onItemTapped(int index) => setState(() => _selectedIndex = index);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isActive = authProvider.vendorStatus?.toLowerCase() == 'active';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        title: Row(
          children: [
            _buildProfileImage(authProvider, size: 40),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    authProvider.vendorName ?? 'Vendor',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: isActive ? Colors.green : Colors.red,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 5),
                      Text(
                        isActive ? 'Active' : 'Suspended',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: isActive ? Colors.green : Colors.red,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Iconsax.notification),
                onPressed: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const AllNotificationsScreen(),
                    ),
                  );
                  _loadNotificationCount();
                },
              ),
              if (_unreadNotifications > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints:
                        const BoxConstraints(minWidth: 18, minHeight: 18),
                    child: Text(
                      _unreadNotifications > 99
                          ? '99+'
                          : '$_unreadNotifications',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          IconButton(
            icon: const Icon(Iconsax.user),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const VendorProfileScreen(),
                ),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      drawer: _buildDrawer(context, authProvider),
      body: IndexedStack(index: _selectedIndex, children: _screens),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          backgroundColor: Colors.white,
          selectedItemColor: Colors.blue[700],
          unselectedItemColor: Colors.grey[400],
          selectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 11,
          ),
          unselectedLabelStyle: const TextStyle(fontSize: 11),
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Iconsax.home),
              activeIcon: Icon(Iconsax.home5),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(Iconsax.box),
              activeIcon: Icon(Iconsax.box5),
              label: 'New Orders',
            ),
            BottomNavigationBarItem(
              icon: Icon(Iconsax.clock),
              activeIcon: Icon(Iconsax.clock5),
              label: 'Active',
            ),
            BottomNavigationBarItem(
              icon: Icon(Iconsax.people),
              activeIcon: Icon(Iconsax.people5),
              label: 'Technicians',
            ),
          ],
        ),
      ),
    );
  }

  Drawer _buildDrawer(BuildContext context, AuthProvider authProvider) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.blue[700]!, Colors.blue[400]!],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildProfileImage(authProvider, size: 70),
                const SizedBox(height: 15),
                Text(
                  authProvider.vendorName ?? 'Vendor',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  authProvider.vendorEmail ?? 'vendor@example.com',
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          _buildDrawerItem(
            icon: Iconsax.home,
            title: 'Dashboard',
            onTap: () {
              Navigator.pop(context);
              setState(() => _selectedIndex = 0);
            },
          ),
          _buildDrawerItem(
            icon: Iconsax.box,
            title: 'New Orders',
            onTap: () {
              Navigator.pop(context);
              setState(() => _selectedIndex = 1);
            },
          ),
          _buildDrawerItem(
            icon: Iconsax.clock,
            title: 'Active Orders',
            onTap: () {
              Navigator.pop(context);
              setState(() => _selectedIndex = 2);
            },
          ),
          _buildDrawerItem(
            icon: Iconsax.people,
            title: 'Technicians',
            onTap: () {
              Navigator.pop(context);
              setState(() => _selectedIndex = 3);
            },
          ),
          const Divider(height: 20),
          _buildDrawerItem(
            icon: Iconsax.user,
            title: 'Profile',
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const VendorProfileScreen(),
                ),
              );
            },
          ),
          _buildDrawerItem(
            icon: Iconsax.notification,
            title: 'Notifications',
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AllNotificationsScreen(),
                ),
              );
            },
          ),
          _buildDrawerItem(
            icon: Iconsax.setting,
            title: 'Settings',
            onTap: () => Navigator.pop(context),
          ),
          const Divider(height: 20),
          _buildDrawerItem(
            icon: Iconsax.logout,
            title: 'Logout',
            color: Colors.red,
            onTap: () => _confirmLogout(context, authProvider),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    Color? color,
  }) {
    return ListTile(
      leading: Icon(icon, color: color ?? Colors.grey[700], size: 22),
      title: Text(
        title,
        style: TextStyle(
          color: color ?? Colors.grey[800],
          fontWeight: FontWeight.w500,
          fontSize: 14,
        ),
      ),
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
    );
  }

  Widget _buildProfileImage(AuthProvider authProvider, {double size = 36}) {
    final imageUrl = authProvider.vendorPhoto;

    if (imageUrl == null || imageUrl.isEmpty) {
      return Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.blue[400]!, Colors.blue[700]!],
          ),
          shape: BoxShape.circle,
        ),
        child: Icon(Iconsax.shop, size: size * 0.5, color: Colors.white),
      );
    }

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.blue.withValues(alpha: 0.2), width: 2),
      ),
      child: ClipOval(
        child: CachedNetworkImage(
          imageUrl: imageUrl,
          width: size,
          height: size,
          fit: BoxFit.cover,
          placeholder: (context, url) => Container(
            color: Colors.grey[200],
            child: Center(
              child: SizedBox(
                width: size * 0.4,
                height: size * 0.4,
                child: const CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.blue,
                ),
              ),
            ),
          ),
          errorWidget: (context, url, error) => Container(
            color: Colors.grey[200],
            child: Icon(Iconsax.shop, size: size * 0.5, color: Colors.blue),
          ),
        ),
      ),
    );
  }

  Future<void> _confirmLogout(
    BuildContext context,
    AuthProvider authProvider,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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
      SocketService.disconnect();
      NotificationService.stopRing();
      await authProvider.logout();
      if (context.mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
      }
    }
  }
}

// ==================== Dashboard Home Screen ====================

class DashboardHomeScreen extends StatefulWidget {
  const DashboardHomeScreen({super.key});

  @override
  State<DashboardHomeScreen> createState() => _DashboardHomeScreenState();
}

class _DashboardHomeScreenState extends State<DashboardHomeScreen> {
  final ApiService _apiService = ApiService();

  Map<String, dynamic> _stats = {};
  List<dynamic> _recentOrders = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null || token.isEmpty) {
        throw Exception('No authentication token found');
      }

      final data = await _apiService.getVendorDashboard(token);

      if (mounted) {
        setState(() {
          _stats = data['stats'] ?? {};
          _recentOrders = data['recentOrders'] ?? [];
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceAll('Exception: ', '');
          _loading = false;
        });
      }
    }
  }

  Future<void> _refresh() async => await _loadDashboard();

  String _formatNumber(dynamic value) {
    if (value == null) return '0';
    final num = double.tryParse(value.toString()) ?? 0;
    if (num >= 1000000) return '${(num / 1000000).toStringAsFixed(1)}M';
    if (num >= 1000) return '${(num / 1000).toStringAsFixed(1)}K';
    return num.toStringAsFixed(0);
  }

  String _formatRating(dynamic value) {
    if (value == null) return '0.0';
    final num = double.tryParse(value.toString()) ?? 0;
    return num.toStringAsFixed(1);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text(
              'Loading dashboard...',
              style: TextStyle(color: Colors.grey, fontSize: 13),
            ),
          ],
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
              const SizedBox(height: 16),
              const Text(
                'Failed to load dashboard',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _error!,
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _loadDashboard,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _refresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWelcomeCard(),
            const SizedBox(height: 20),
            _buildSectionHeader('Business Overview'),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.15,
              children: [
                _buildBusinessCard(
                  context: context,
                  title: 'Total Orders',
                  value: _formatNumber(_stats['total_orders'] ?? 0),
                  icon: Iconsax.shopping_bag,
                  color: Colors.blue,
                  screen: const TotalOrdersScreen(),
                ),
                _buildBusinessCard(
                  context: context,
                  title: 'Active Orders',
                  value: _formatNumber(_stats['active_orders'] ?? 0),
                  icon: Iconsax.activity,
                  color: Colors.green,
                  screen: const ActiveOrdersScreen(),
                ),
                _buildBusinessCard(
                  context: context,
                  title: 'Pending Orders',
                  value: _formatNumber(_stats['pending_orders'] ?? 0),
                  icon: Iconsax.clock,
                  color: Colors.orange,
                  screen: const PendingOrdersScreen(),
                ),
                _buildBusinessCard(
                  context: context,
                  title: 'Completed',
                  value: _formatNumber(_stats['completed_orders'] ?? 0),
                  icon: Iconsax.tick_circle,
                  color: Colors.purple,
                  screen: const TotalOrdersScreen(),
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildSectionHeader('Quick Actions'),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 4,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              childAspectRatio: 0.85,
              children: [
                _buildQuickAction(
                  title: 'Revenue',
                  icon: Iconsax.chart_2,
                  color: Colors.blue,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const RevenueScreen(),
                    ),
                  ),
                ),
                _buildQuickAction(
                  title: 'Due/Pay',
                  icon: Iconsax.money_time,
                  color: Colors.red,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const DuePayScreen(),
                    ),
                  ),
                ),
                _buildQuickAction(
                  title: 'Add\nService',
                  icon: Iconsax.add_square,
                  color: Colors.green,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const AddServiceScreen(),
                    ),
                  ),
                ),
                _buildQuickAction(
                  title: 'Complete',
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
            const SizedBox(height: 24),
            _buildSectionHeader(
              'Recent Orders',
              onViewAll: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AllNotificationsScreen(),
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            if (_recentOrders.isEmpty)
              _buildEmptyState(
                icon: Iconsax.box,
                title: 'No Recent Orders',
                subtitle: 'New orders will appear here',
              )
            else
              ..._recentOrders.take(5).map(_buildRecentOrderCard),
            const SizedBox(height: 24),
            _buildSectionHeader('Performance'),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    title: 'Completed',
                    value: _formatNumber(_stats['completed_orders'] ?? 0),
                    icon: Iconsax.tick_circle,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    title: 'Rating',
                    value: '${_formatRating(_stats['average_rating'])}⭐',
                    icon: Iconsax.star_1,
                    color: Colors.amber,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    title: 'Success Rate',
                    value: '${_stats['success_rate'] ?? 0}%',
                    icon: Iconsax.chart_success,
                    color: Colors.blue,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    title: 'Cancelled',
                    value: '${_stats['canceled_orders'] ?? 0}',
                    icon: Iconsax.close_circle,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeCard() {
    final pendingCount = _stats['pending_orders'] ?? 0;
    final completedCount = _stats['completed_orders'] ?? 0;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue[600]!, Colors.blue[400]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Welcome back! 👋',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                if (pendingCount > 0)
                  Text(
                    'You have $pendingCount pending order${pendingCount > 1 ? 's' : ''}',
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  )
                else if (completedCount > 0)
                  Text(
                    'Great! $completedCount order${completedCount > 1 ? 's' : ''} completed',
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  )
                else
                  const Text(
                    'All caught up! 🎉',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
              ],
            ),
          ),
          Icon(
            Iconsax.shop5,
            size: 50,
            color: Colors.white.withValues(alpha: 0.3),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, {VoidCallback? onViewAll}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        if (onViewAll != null)
          GestureDetector(
            onTap: onViewAll,
            child: Row(
              children: [
                Text(
                  'View All',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.blue[700],
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(width: 2),
                Icon(Icons.arrow_forward_ios, size: 11, color: Colors.blue[700]),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildBusinessCard({
    required BuildContext context,
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required Widget screen,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => screen),
          ),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, size: 20, color: color),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      value,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction({
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withValues(alpha: 0.15), width: 1.5),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 24, color: color),
              const SizedBox(height: 6),
              Text(
                title,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[800],
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 20, color: color),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  title,
                  style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentOrderCard(dynamic order) {
    final status = order['status']?.toString() ?? 'Pending';
    final statusColor = _getStatusColor(status);
    final orderId = order['order_id']?.toString() ?? 'N/A';
    final cleanId = orderId.replaceAll('#', '');

    String formattedDate = 'N/A';
    if (order['order_date'] != null) {
      try {
        final date = DateTime.parse(order['order_date'].toString());
        formattedDate = '${date.day}/${date.month}/${date.year}';
      } catch (e) {
        formattedDate = order['order_date'].toString();
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(Iconsax.box, color: statusColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '#$cleanId',
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  formattedDate,
                  style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              status,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: statusColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(icon, size: 48, color: Colors.grey[300]),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.grey[700],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(fontSize: 12, color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'active':
        return Colors.green;
      case 'completed':
        return Colors.blue;
      case 'cancelled':
        return Colors.red;
      case 'processing':
        return Colors.purple;
      case 'started':
        return Colors.indigo;
      case 'hold':
        return Colors.brown;
      case 'assigned to vendor':
        return Colors.deepPurple;
      default:
        return Colors.grey;
    }
  }
}