import 'package:flutter/material.dart';

class CompleteOrdersScreen extends StatelessWidget {
  const CompleteOrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Complete Orders')),
      body: const Center(child: Text('Complete Orders Screen')),
    );
  }
}
