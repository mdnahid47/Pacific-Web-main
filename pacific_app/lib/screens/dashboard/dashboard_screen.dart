import 'package:flutter/material.dart';
import 'package:pacific_app/providers/auth_provider.dart';
import 'package:pacific_app/services/api_service.dart';
import 'package:provider/provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with TickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  Map<String, dynamic>? _dashboardData;
  String? _error;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
    _loadDashboardData();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final role = authProvider.userRole;
      final token = authProvider.token;

      if (token == null || token.isEmpty) {
        throw Exception('Authentication token not found');
      }

      Map<String, dynamic>? data;

      if (role == 'admin' || role == 'superadmin') {
        data = await _apiService.getAdminDashboard(token);
      } else if (role == 'vendor') {
        data = await _apiService.getVendorDashboard(token);
      } else if (role == 'user') {
        data = await _apiService.getUserDashboard(token);
      }

      setState(() {
        _dashboardData = data;
        _isLoading = false;
      });
      _animationController.forward();
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final role = authProvider.userRole;

    if (_isLoading) {
      return _buildLoadingScreen(isDark, role);
    }

    if (_error != null) {
      return _buildErrorScreen(isDark);
    }

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF8FAFC),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        color: _getRoleColor(role),
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: SlideTransition(
            position: _slideAnimation,
            child: CustomScrollView(
              physics: const BouncingScrollPhysics(
                parent: AlwaysScrollableScrollPhysics(),
              ),
              slivers: [
                // ✅ New Beautiful App Bar
                _buildSliverAppBar(authProvider, isDark, role),

                // ✅ Main Content
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      const SizedBox(height: 20),

                      // Stats Section
                      if (_dashboardData != null &&
                          _dashboardData!['stats'] != null) ...[
                        _buildStatsSection(
                          _dashboardData!['stats'],
                          isDark,
                          role,
                        ),
                        const SizedBox(height: 28),
                      ],

                      // Quick Actions
                      _buildQuickActionsSection(context, authProvider, isDark),

                      const SizedBox(height: 28),

                      // Recent Activity
                      _buildRecentActivitySection(isDark),
                    ]),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ============================================================
  // ✅ BEAUTIFUL LOADING SCREEN
  // ============================================================
  Widget _buildLoadingScreen(bool isDark, String? role) {
    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF8FAFC),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: _getGradientColors(role),
                ),
                shape: BoxShape.circle,
              ),
              child: const Padding(
                padding: EdgeInsets.all(20),
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Loading your dashboard',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: isDark ? Colors.white70 : Colors.black54,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // ✅ BEAUTIFUL ERROR SCREEN
  // ============================================================
  Widget _buildErrorScreen(bool isDark) {
    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF8FAFC),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.error_outline_rounded,
                  size: 64,
                  color: Colors.red,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Oops! Something went wrong',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                _error ?? 'Unknown error',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: isDark ? Colors.white60 : Colors.black54,
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: _loadDashboardData,
                icon: const Icon(Icons.refresh),
                label: const Text('Try Again'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // ✅ NEW BEAUTIFUL SLIVER APP BAR
  // ============================================================
  Widget _buildSliverAppBar(
    AuthProvider authProvider,
    bool isDark,
    String? role,
  ) {
    return SliverAppBar(
      expandedHeight: 260,
      floating: false,
      pinned: true,
      elevation: 0,
      backgroundColor: _getRoleColor(role),
      leading: IconButton(
        icon: const Icon(Icons.menu_rounded, color: Colors.white),
        onPressed: () {},
      ),
      actions: [
        Stack(
          children: [
            IconButton(
              icon: const Icon(
                Icons.notifications_outlined,
                color: Colors.white,
              ),
              onPressed: () => Navigator.pushNamed(context, '/notifications'),
            ),
            Positioned(
              right: 8,
              top: 8,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
                child: const Text(
                  '3',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
        IconButton(
          icon: const Icon(Icons.logout_rounded, color: Colors.white),
          onPressed: () => _handleLogout(authProvider),
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: _getGradientColors(role),
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  // User Avatar with Ring
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.5),
                        width: 2,
                      ),
                    ),
                    child: CircleAvatar(
                      radius: 32,
                      backgroundColor: Colors.white.withValues(alpha: 0.3),
                      child: Text(
                        (authProvider.userName ??
                                authProvider.vendorName ??
                                'U')
                            .substring(0, 1)
                            .toUpperCase(),
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Greeting
                  Text(
                    '${_getGreeting()},',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withValues(alpha: 0.85),
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // User Name
                  Text(
                    authProvider.userName ??
                        authProvider.vendorName ??
                        'User',
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),

                  // Role Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _getRoleIcon(role),
                          size: 16,
                          color: Colors.white,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _getRoleDisplayName(role),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ============================================================
  // ✅ BEAUTIFUL STATS SECTION
  // ============================================================
  Widget _buildStatsSection(
    Map<String, dynamic> stats,
    bool isDark,
    String? role,
  ) {
    final statItems = _getStatItems(stats, role);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          'Overview',
          Icons.analytics_outlined,
          isDark,
          subtitle: 'Your performance at a glance',
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            childAspectRatio: 1.4,
          ),
          itemCount: statItems.length,
          itemBuilder: (context, index) {
            return _buildBeautifulStatCard(
              statItems[index],
              isDark,
              index,
            );
          },
        ),
      ],
    );
  }

  List<Map<String, dynamic>> _getStatItems(
    Map<String, dynamic> stats,
    String? role,
  ) {
    if (role == 'vendor') {
      return [
        {
          'label': 'Total Orders',
          'value': stats['total_orders']?.toString() ?? '0',
          'icon': Icons.shopping_bag_rounded,
          'color': const Color(0xFF3B82F6),
          'gradient': [const Color(0xFF3B82F6), const Color(0xFF60A5FA)],
        },
        {
          'label': 'Active',
          'value': stats['active_orders']?.toString() ?? '0',
          'icon': Icons.local_shipping_rounded,
          'color': const Color(0xFF10B981),
          'gradient': [const Color(0xFF10B981), const Color(0xFF34D399)],
        },
        {
          'label': 'Completed',
          'value': stats['completed_orders']?.toString() ?? '0',
          'icon': Icons.check_circle_rounded,
          'color': const Color(0xFF8B5CF6),
          'gradient': [const Color(0xFF8B5CF6), const Color(0xFFA78BFA)],
        },
        {
          'label': 'Wallet',
          'value': '৳${stats['wallet_balance']?.toString() ?? '0'}',
          'icon': Icons.account_balance_wallet_rounded,
          'color': const Color(0xFFF59E0B),
          'gradient': [const Color(0xFFF59E0B), const Color(0xFFFBBF24)],
        },
      ];
    }

    return [
      {
        'label': 'Total Orders',
        'value': stats['totalOrders']?.toString() ?? '0',
        'icon': Icons.shopping_bag_rounded,
        'color': const Color(0xFF3B82F6),
        'gradient': [const Color(0xFF3B82F6), const Color(0xFF60A5FA)],
      },
      {
        'label': 'Active',
        'value': stats['activeOrders']?.toString() ?? '0',
        'icon': Icons.local_shipping_rounded,
        'color': const Color(0xFF10B981),
        'gradient': [const Color(0xFF10B981), const Color(0xFF34D399)],
      },
      {
        'label': 'Completed',
        'value': stats['completedOrders']?.toString() ?? '0',
        'icon': Icons.check_circle_rounded,
        'color': const Color(0xFF8B5CF6),
        'gradient': [const Color(0xFF8B5CF6), const Color(0xFFA78BFA)],
      },
      {
        'label': 'Pending',
        'value': stats['pendingOrders']?.toString() ?? '0',
        'icon': Icons.pending_actions_rounded,
        'color': const Color(0xFFF59E0B),
        'gradient': [const Color(0xFFF59E0B), const Color(0xFFFBBF24)],
      },
    ];
  }

  Widget _buildBeautifulStatCard(
    Map<String, dynamic> item,
    bool isDark,
    int index,
  ) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 400 + (index * 100)),
      curve: Curves.easeOutBack,
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1A1A2E) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: (item['color'] as Color).withValues(alpha: 0.15),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
              border: Border.all(
                color: (item['color'] as Color).withValues(alpha: 0.1),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: item['gradient'] as List<Color>,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: (item['color'] as Color).withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    item['icon'] as IconData,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['value'] as String,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      item['label'] as String,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? Colors.white60 : Colors.black54,
                        fontWeight: FontWeight.w500,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ============================================================
  // ✅ BEAUTIFUL QUICK ACTIONS
  // ============================================================
  Widget _buildQuickActionsSection(
    BuildContext context,
    AuthProvider authProvider,
    bool isDark,
  ) {
    final actions = _getActionsForRole(authProvider.userRole);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          'Quick Actions',
          Icons.bolt_rounded,
          isDark,
          subtitle: 'Everything you need, one tap away',
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            childAspectRatio: 1.3,
          ),
          itemCount: actions.length,
          itemBuilder: (context, index) {
            final action = actions[index];
            return _buildBeautifulActionCard(
              context,
              action['title'] as String,
              action['icon'] as IconData,
              action['color'] as Color,
              action['route'] as String,
              isDark,
              index,
            );
          },
        ),
      ],
    );
  }

  Widget _buildBeautifulActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    String route,
    bool isDark,
    int index,
  ) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 500 + (index * 100)),
      curve: Curves.easeOutBack,
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => Navigator.pushNamed(context, route),
              borderRadius: BorderRadius.circular(20),
              child: Ink(
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1A1A2E) : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              color.withValues(alpha: 0.2),
                              color.withValues(alpha: 0.1),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(icon, size: 24, color: color),
                      ),
                      const SizedBox(height: 14),
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: isDark ? Colors.white : Colors.black87,
                          letterSpacing: -0.2,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  // ============================================================
  // ✅ BEAUTIFUL RECENT ACTIVITY
  // ============================================================
  Widget _buildRecentActivitySection(bool isDark) {
    final activities = _dashboardData?['recentActivity'] as List? ?? [];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          'Recent Activity',
          Icons.history_rounded,
          isDark,
          subtitle: 'Your latest updates',
        ),
        const SizedBox(height: 16),
        if (activities.isEmpty)
          _buildEmptyActivity(isDark)
        else
          Container(
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1A1A2E) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              children: List.generate(activities.length, (index) {
                final activity = activities[index];
                final statusColor = _getStatusColor(activity['status']);
                final isLast = index == activities.length - 1;

                return Column(
                  children: [
                    ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: statusColor.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          _getStatusIcon(activity['status']),
                          color: statusColor,
                          size: 20,
                        ),
                      ),
                      title: Text(
                        'Order #${activity['orderId'] ?? 'N/A'}',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: statusColor.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                activity['status'] ?? 'Unknown',
                                style: TextStyle(
                                  color: statusColor,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      trailing: Icon(
                        Icons.chevron_right_rounded,
                        color: isDark ? Colors.white38 : Colors.grey[400],
                      ),
                    ),
                    if (!isLast)
                      Divider(
                        height: 1,
                        indent: 70,
                        color: isDark
                            ? Colors.white.withValues(alpha: 0.05)
                            : Colors.black.withValues(alpha: 0.05),
                      ),
                  ],
                );
              }),
            ),
          ),
      ],
    );
  }

  Widget _buildEmptyActivity(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1A1A2E) : Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Center(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: (isDark ? Colors.white : Colors.black)
                    .withValues(alpha: 0.05),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.inbox_rounded,
                size: 48,
                color: isDark ? Colors.white38 : Colors.grey[400],
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'No recent activity',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white70 : Colors.black54,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Your updates will appear here',
              style: TextStyle(
                fontSize: 13,
                color: isDark ? Colors.white38 : Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // ✅ SECTION HEADER
  // ============================================================
  Widget _buildSectionHeader(
    String title,
    IconData icon,
    bool isDark, {
    String? subtitle,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            size: 18,
            color: const Color(0xFF6366F1),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                  letterSpacing: -0.3,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.white54 : Colors.black45,
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  // ============================================================
  // ✅ HELPER METHODS
  // ============================================================
  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  String _getRoleDisplayName(String? role) {
    switch (role) {
      case 'admin':
        return 'ADMIN';
      case 'superadmin':
        return 'SUPER ADMIN';
      case 'vendor':
        return 'VENDOR';
      default:
        return 'USER';
    }
  }

  Color _getRoleColor(String? role) {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return const Color(0xFF6366F1);
      case 'vendor':
        return const Color(0xFF10B981);
      default:
        return const Color(0xFF3B82F6);
    }
  }

  List<Color> _getGradientColors(String? role) {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return [const Color(0xFF6366F1), const Color(0xFF8B5CF6)];
      case 'vendor':
        return [const Color(0xFF10B981), const Color(0xFF059669)];
      default:
        return [const Color(0xFF3B82F6), const Color(0xFF06B6D4)];
    }
  }

  IconData _getRoleIcon(String? role) {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return Icons.admin_panel_settings_rounded;
      case 'vendor':
        return Icons.business_center_rounded;
      default:
        return Icons.person_rounded;
    }
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'Completed':
        return const Color(0xFF10B981);
      case 'Cancelled':
        return const Color(0xFFEF4444);
      case 'Pending':
        return const Color(0xFFF59E0B);
      case 'Active':
        return const Color(0xFF3B82F6);
      default:
        return const Color(0xFF6B7280);
    }
  }

  IconData _getStatusIcon(String? status) {
    switch (status) {
      case 'Completed':
        return Icons.check_circle_rounded;
      case 'Cancelled':
        return Icons.cancel_rounded;
      case 'Pending':
        return Icons.schedule_rounded;
      case 'Active':
        return Icons.local_shipping_rounded;
      default:
        return Icons.info_rounded;
    }
  }

  List<Map<String, dynamic>> _getActionsForRole(String? role) {
    if (role == 'admin' || role == 'superadmin') {
      return [
        {
          'title': 'All Orders',
          'icon': Icons.list_alt_rounded,
          'color': const Color(0xFF3B82F6),
          'route': '/admin/orders',
        },
        {
          'title': 'Users',
          'icon': Icons.people_rounded,
          'color': const Color(0xFF10B981),
          'route': '/admin/users',
        },
        {
          'title': 'Vendors',
          'icon': Icons.business_rounded,
          'color': const Color(0xFF8B5CF6),
          'route': '/admin/vendors',
        },
        {
          'title': 'Analytics',
          'icon': Icons.analytics_rounded,
          'color': const Color(0xFFF59E0B),
          'route': '/admin/dashboard',
        },
      ];
    } else if (role == 'vendor') {
      return [
        {
          'title': 'My Orders',
          'icon': Icons.assignment_rounded,
          'color': const Color(0xFF3B82F6),
          'route': '/vendor/orders',
        },
        {
          'title': 'Dashboard',
          'icon': Icons.dashboard_rounded,
          'color': const Color(0xFF10B981),
          'route': '/vendor/dashboard',
        },
        {
          'title': 'Profile',
          'icon': Icons.person_rounded,
          'color': const Color(0xFF8B5CF6),
          'route': '/vendor/profile',
        },
        {
          'title': 'Earnings',
          'icon': Icons.monetization_on_rounded,
          'color': const Color(0xFFF59E0B),
          'route': '/vendor/earnings',
        },
      ];
    } else {
      return [
        {
          'title': 'Place Order',
          'icon': Icons.add_shopping_cart_rounded,
          'color': const Color(0xFF3B82F6),
          'route': '/place-order',
        },
        {
          'title': 'My Orders',
          'icon': Icons.history_rounded,
          'color': const Color(0xFF10B981),
          'route': '/orders',
        },
        {
          'title': 'Profile',
          'icon': Icons.person_rounded,
          'color': const Color(0xFF8B5CF6),
          'route': '/profile',
        },
        {
          'title': 'Services',
          'icon': Icons.category_rounded,
          'color': const Color(0xFFF59E0B),
          'route': '/services',
        },
      ];
    }
  }

  Future<void> _handleLogout(AuthProvider authProvider) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Row(
          children: [
            Icon(Icons.logout_rounded, color: Colors.red),
            SizedBox(width: 12),
            Text('Logout'),
          ],
        ),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await authProvider.logout();
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    }
  }
}