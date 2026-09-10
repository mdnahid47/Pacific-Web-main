import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../services/api_service.dart';

class ActiveTechsScreen extends StatefulWidget {
  const ActiveTechsScreen({super.key});

  @override
  State<ActiveTechsScreen> createState() => _ActiveTechsScreenState();
}

class _ActiveTechsScreenState extends State<ActiveTechsScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _technicians = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadTechnicians();
  }

  Future<void> _loadTechnicians() async {
    setState(() => _loading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) throw Exception('No token');

      final response = await _apiService.getVendorTechnicians(token);
      setState(() {
        _technicians = response['technicians'] ?? [];
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Active Technicians'),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.refresh),
            onPressed: _loadTechnicians,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : _technicians.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Iconsax.people, size: 60, color: Colors.grey),
                          SizedBox(height: 16),
                          Text('No technicians added yet'),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadTechnicians,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _technicians.length,
                        itemBuilder: (context, index) {
                          final tech = _technicians[index];
                          final name = tech['name'] ?? 'Unknown';
                          final email = tech['email'] ?? '';
                          final phone = tech['phone_number'] ?? '';
                          final photo = tech['photo'];
                          final status = tech['status'] ?? 'active';
                          final skills = tech['skills'] as List? ?? [];

                          return Card(
                            margin: const EdgeInsets.only(bottom: 10),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundImage: photo != null
                                    ? NetworkImage(photo)
                                    : null,
                                child: photo == null
                                    ? const Icon(Icons.person)
                                    : null,
                              ),
                              title: Text(name),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(email),
                                  if (skills.isNotEmpty)
                                    Text(
                                      skills.join(', '),
                                      style: const TextStyle(fontSize: 11),
                                    ),
                                ],
                              ),
                              trailing: Chip(
                                label: Text(status),
                                backgroundColor: status == 'active'
                                    ? Colors.green[100]
                                    : Colors.grey[200],
                                labelStyle: TextStyle(
                                  color: status == 'active'
                                      ? Colors.green
                                      : Colors.grey,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}