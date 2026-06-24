import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

class TechnicianManagementScreen extends StatefulWidget {
  const TechnicianManagementScreen({super.key});

  @override
  State<TechnicianManagementScreen> createState() =>
      _TechnicianManagementScreenState();
}

class _TechnicianManagementScreenState
    extends State<TechnicianManagementScreen> {
  List<Map<String, dynamic>> technicians = [
    {
      'id': 'TECH-001',
      'name': 'Rahim Khan',
      'phone': '01712345678',
      'expertise': 'AC Specialist',
      'experience': '3 years',
      'status': 'active',
      'totalOrders': 45,
      'completeOrders': 40,
      'pendingOrders': 5,
      'rating': 4.5,
    },
    {
      'id': 'TECH-002',
      'name': 'Karim Uddin',
      'phone': '01787654321',
      'expertise': 'Refrigerator Repair',
      'experience': '2 years',
      'status': 'suspended',
      'totalOrders': 30,
      'completeOrders': 28,
      'pendingOrders': 2,
      'rating': 4.2,
    },
    {
      'id': 'TECH-003',
      'name': 'Abdul Halim',
      'phone': '01811223344',
      'expertise': 'Washing Machine',
      'experience': '4 years',
      'status': 'active',
      'totalOrders': 60,
      'completeOrders': 58,
      'pendingOrders': 2,
      'rating': 4.8,
    },
    {
      'id': 'TECH-004',
      'name': 'Mohammad Ali',
      'phone': '01955667788',
      'expertise': 'TV Repair',
      'experience': '5 years',
      'status': 'active',
      'totalOrders': 75,
      'completeOrders': 72,
      'pendingOrders': 3,
      'rating': 4.6,
    },
    {
      'id': 'TECH-005',
      'name': 'Sakib Hasan',
      'phone': '01677889900',
      'expertise': 'Microwave Repair',
      'experience': '1 year',
      'status': 'suspended',
      'totalOrders': 20,
      'completeOrders': 18,
      'pendingOrders': 2,
      'rating': 4.0,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Manage Technicians'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Active', icon: Icon(Iconsax.people)),
              Tab(text: 'Suspended', icon: Icon(Iconsax.profile_delete)),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Iconsax.add),
              onPressed: () {
                _addNewTechnician();
              },
            ),
            IconButton(
              icon: const Icon(Iconsax.filter),
              onPressed: () {
                _showFilterOptions();
              },
            ),
          ],
        ),
        body: TabBarView(
          children: [
            // Active Technicians Tab
            _buildTechnicianList('active'),

            // Suspended Technicians Tab
            _buildTechnicianList('suspended'),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () {
            _addNewTechnician();
          },
          icon: const Icon(Iconsax.add),
          label: const Text('Add Technician'),
        ),
      ),
    );
  }

  Widget _buildTechnicianList(String status) {
    final filteredTechs = technicians
        .where((tech) => tech['status'] == status)
        .toList();

    if (filteredTechs.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              status == 'active' ? Iconsax.people : Iconsax.profile_delete,
              size: 80,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 20),
            Text(
              status == 'active'
                  ? 'No Active Technicians'
                  : 'No Suspended Technicians',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              status == 'active'
                  ? 'Add new technicians to get started'
                  : 'No technicians are currently suspended',
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        // Here you can implement refresh logic
        await Future.delayed(const Duration(seconds: 1));
        setState(() {});
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: filteredTechs.length,
        itemBuilder: (context, index) {
          final tech = filteredTechs[index];
          final isActive = tech['status'] == 'active';

          return Card(
            margin: const EdgeInsets.only(bottom: 15),
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 25,
                        backgroundColor: isActive ? Colors.green : Colors.red,
                        child: Text(
                          tech['name'][0],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 15),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tech['name'],
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'ID: ${tech['id']}',
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Chip(
                        label: Text(
                          tech['status'].toUpperCase(),
                          style: const TextStyle(fontSize: 10),
                        ),
                        backgroundColor: isActive
                            ? Colors.green.withAlpha(25)
                            : Colors.red.withAlpha(25),
                        labelStyle: TextStyle(
                          color: isActive ? Colors.green : Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                        side: BorderSide.none,
                      ),
                    ],
                  ),

                  const SizedBox(height: 15),

                  Row(
                    children: [
                      Icon(
                        Iconsax.briefcase,
                        size: 16,
                        color: Colors.grey.shade600,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          tech['expertise'],
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade700,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Icon(
                        Iconsax.calendar,
                        size: 16,
                        color: Colors.grey.shade600,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        tech['experience'],
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade700,
                        ),
                      ),
                      const Spacer(),
                      Icon(Iconsax.star, size: 16, color: Colors.amber),
                      const SizedBox(width: 4),
                      Text(
                        tech['rating'].toString(),
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 15),

                  // Stats Card
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem(
                          'Total',
                          tech['totalOrders'].toString(),
                          Iconsax.task,
                        ),
                        _buildStatItem(
                          'Complete',
                          tech['completeOrders'].toString(),
                          Iconsax.tick_circle,
                        ),
                        _buildStatItem(
                          'Pending',
                          tech['pendingOrders'].toString(),
                          Iconsax.clock,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 15),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Iconsax.eye, size: 16),
                          label: const Text('View Details'),
                          onPressed: () {
                            _viewTechnicianDetails(tech);
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.blue,
                            side: BorderSide(color: Colors.blue.shade200),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: Icon(
                            isActive ? Iconsax.profile_delete : Iconsax.refresh,
                            size: 16,
                          ),
                          label: Text(isActive ? 'Suspend' : 'Activate'),
                          onPressed: () {
                            _toggleTechnicianStatus(tech['id'], isActive);
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: isActive
                                ? Colors.red
                                : Colors.green,
                            side: BorderSide(
                              color: isActive
                                  ? Colors.red.shade200
                                  : Colors.green.shade200,
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: Colors.grey.shade600),
            const SizedBox(width: 4),
            Text(
              value,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
        ),
      ],
    );
  }

  void _viewTechnicianDetails(Map<String, dynamic> technician) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SingleChildScrollView(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Center(
                  child: Container(
                    width: 60,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Technician Header
                Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: technician['status'] == 'active'
                          ? Colors.green
                          : Colors.red,
                      child: Text(
                        technician['name'][0],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            technician['name'],
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            technician['id'],
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 25),

                // Details Grid
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  childAspectRatio: 3,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  children: [
                    _buildDetailItem(
                      'Phone',
                      technician['phone'],
                      Iconsax.call,
                    ),
                    _buildDetailItem(
                      'Expertise',
                      technician['expertise'],
                      Iconsax.briefcase,
                    ),
                    _buildDetailItem(
                      'Experience',
                      technician['experience'],
                      Iconsax.calendar,
                    ),
                    _buildDetailItem(
                      'Rating',
                      technician['rating'].toString(),
                      Iconsax.star,
                    ),
                  ],
                ),

                const SizedBox(height: 25),

                // Performance Stats
                const Text(
                  'Performance Stats',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 15),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildPerformanceCircle(
                      'Completed',
                      technician['completeOrders'].toString(),
                      Colors.green,
                    ),
                    _buildPerformanceCircle(
                      'Pending',
                      technician['pendingOrders'].toString(),
                      Colors.orange,
                    ),
                    _buildPerformanceCircle(
                      'Total',
                      technician['totalOrders'].toString(),
                      Colors.blue,
                    ),
                  ],
                ),

                const SizedBox(height: 30),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          _callTechnician(technician['phone']);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Iconsax.call, size: 18),
                            SizedBox(width: 8),
                            Text('Call Technician'),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          _viewTechnicianOrders(technician['id']);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Iconsax.task, size: 18),
                            SizedBox(width: 8),
                            Text('View Orders'),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDetailItem(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey.shade600),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerformanceCircle(String label, String value, Color color) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color.withAlpha(25),
            border: Border.all(color: color, width: 2),
          ),
          child: Center(
            child: Text(
              value,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
        ),
      ],
    );
  }

  void _toggleTechnicianStatus(String id, bool isActive) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isActive ? 'Suspend Technician?' : 'Activate Technician?'),
        content: Text(
          isActive
              ? 'Are you sure you want to suspend this technician? They will not receive new orders.'
              : 'Are you sure you want to activate this technician? They will start receiving orders again.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                for (var tech in technicians) {
                  if (tech['id'] == id) {
                    tech['status'] = isActive ? 'suspended' : 'active';
                    break;
                  }
                }
              });
              Navigator.pop(context);

              // Show success message
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    isActive
                        ? 'Technician suspended successfully'
                        : 'Technician activated successfully',
                  ),
                  backgroundColor: isActive ? Colors.orange : Colors.green,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: isActive ? Colors.red : Colors.green,
            ),
            child: Text(isActive ? 'Suspend' : 'Activate'),
          ),
        ],
      ),
    );
  }

  void _viewTechnicianOrders(String technicianId) {
    // Navigate to orders screen for this technician
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Viewing orders for technician $technicianId')),
    );
  }

  void _callTechnician(String phoneNumber) {
    // Implement calling functionality
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Calling $phoneNumber...')));
  }

  void _addNewTechnician() {
    // Navigate to add technician screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Navigate to Add Technician Screen')),
    );
  }

  void _showFilterOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filter Technicians',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),

              // Filter options would go here
              ListTile(
                leading: const Icon(Iconsax.sort),
                title: const Text('Sort by Name'),
                onTap: () {
                  Navigator.pop(context);
                  _sortTechniciansByName();
                },
              ),

              ListTile(
                leading: const Icon(Iconsax.star),
                title: const Text('Sort by Rating'),
                onTap: () {
                  Navigator.pop(context);
                  _sortTechniciansByRating();
                },
              ),

              ListTile(
                leading: const Icon(Iconsax.task),
                title: const Text('Sort by Orders'),
                onTap: () {
                  Navigator.pop(context);
                  _sortTechniciansByOrders();
                },
              ),

              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    setState(() {
                      // Reset to original order
                      technicians.sort((a, b) => a['id'].compareTo(b['id']));
                    });
                  },
                  child: const Text('Reset Filters'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _sortTechniciansByName() {
    setState(() {
      technicians.sort((a, b) => a['name'].compareTo(b['name']));
    });
  }

  void _sortTechniciansByRating() {
    setState(() {
      technicians.sort((a, b) => b['rating'].compareTo(a['rating']));
    });
  }

  void _sortTechniciansByOrders() {
    setState(() {
      technicians.sort((a, b) => b['totalOrders'].compareTo(a['totalOrders']));
    });
  }
}
