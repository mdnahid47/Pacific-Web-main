import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../services/api_service.dart';

class DuePayScreen extends StatefulWidget {
  const DuePayScreen({super.key});

  @override
  State<DuePayScreen> createState() => _DuePayScreenState();
}

class _DuePayScreenState extends State<DuePayScreen> {
  final ApiService _apiService = ApiService();
  final _amountController = TextEditingController();
  final _numberController = TextEditingController();
  final _txnController = TextEditingController();
  final _bankNameController = TextEditingController();
  final _accHolderController = TextEditingController();

  Map<String, dynamic> _dueData = {};
  List<dynamic> _paymentMethods = [];
  List<dynamic> _paymentHistory = [];
  String? _selectedMethod;
  Map<String, dynamic>? _selectedMethodData;
  bool _loading = true;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _numberController.dispose();
    _txnController.dispose();
    _bankNameController.dispose();
    _accHolderController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return;

      final dueRes = await _apiService.getDueAmount(token);
      final methodsRes = await _apiService.getPaymentMethods(token);
      final historyRes = await _apiService.getVendorPayments(token);

      if (mounted) {
        setState(() {
          _dueData = dueRes;
          _paymentMethods = methodsRes['methods'] ?? [];
          _paymentHistory = historyRes['payments'] ?? [];

          // Auto-fill remaining due
          final remaining = dueRes['remainingDue'] ?? '0';
          _amountController.text = remaining;

          _loading = false;
        });
      }
    } catch (e) {
      debugPrint('Load error: $e');
      if (mounted) setState(() => _loading = false);
    }
  }

  void _selectMethod(dynamic method) {
    setState(() {
      _selectedMethod = method['method'];
      _selectedMethodData = method;
    });
  }

  Future<void> _submit() async {
    if (_selectedMethod == null) {
      _showSnack('Please select payment method', isError: true);
      return;
    }

    final amount = double.tryParse(_amountController.text) ?? 0;
    if (amount <= 0) {
      _showSnack('Enter valid amount', isError: true);
      return;
    }

    if (_numberController.text.isEmpty) {
      _showSnack('Enter sender number', isError: true);
      return;
    }

    if (_txnController.text.isEmpty) {
      _showSnack('Enter transaction ID', isError: true);
      return;
    }

    if (_selectedMethod == 'bank') {
      if (_bankNameController.text.isEmpty) {
        _showSnack('Enter bank name', isError: true);
        return;
      }
      if (_accHolderController.text.isEmpty) {
        _showSnack('Enter account holder name', isError: true);
        return;
      }
    }

    setState(() => _submitting = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return;

      final response = await _apiService.submitPayment(
        token: token,
        amount: amount,
        paymentMethod: _selectedMethod!,
        senderNumber: _numberController.text.trim(),
        transactionId: _txnController.text.trim(),
        bankName: _selectedMethod == 'bank' ? _bankNameController.text.trim() : null,
        accountHolder: _selectedMethod == 'bank' ? _accHolderController.text.trim() : null,
      );

      if (mounted) {
        _showSnack(response['message'] ?? 'Payment submitted');
        _amountController.clear();
        _numberController.clear();
        _txnController.clear();
        _bankNameController.clear();
        _accHolderController.clear();
        setState(() => _selectedMethod = null);

        await _loadData();
      }
    } catch (e) {
      _showSnack('Failed: $e', isError: true);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _showSnack(String msg, {bool isError = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: const Text('Due & Payments'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Iconsax.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Due Card
                    _buildDueCard(),
                    const SizedBox(height: 20),

                    // Payment Methods
                    const Text('Select Payment Method',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    _buildPaymentMethods(),
                    const SizedBox(height: 20),

                    // Selected Method Info + Form
                    if (_selectedMethodData != null) ...[
                      _buildPaymentForm(),
                      const SizedBox(height: 20),
                    ],

                    // Submit Button
                    if (_selectedMethod != null)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _submitting ? null : _submit,
                          icon: _submitting
                              ? const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Icon(Iconsax.tick_circle),
                          label: Text(_submitting ? 'Submitting...' : 'Submit Payment'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade700,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),

                    // Payment History
                    if (_paymentHistory.isNotEmpty) ...[
                      const SizedBox(height: 30),
                      const Text('Payment History',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      ..._paymentHistory.map((p) => _buildHistoryCard(p)),
                    ],
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildDueCard() {
    final totalEarnings = _dueData['totalEarnings'] ?? '0';
    final platformDue = _dueData['platformDue'] ?? '0';
    final totalPaid = _dueData['totalPaid'] ?? '0';
    final totalPending = _dueData['totalPending'] ?? '0';
    final remainingDue = _dueData['remainingDue'] ?? '0';

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.red.shade600, Colors.red.shade400],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.red.withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Iconsax.wallet_2, color: Colors.white, size: 22),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text('Platform Due (30%)',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text('৳$remainingDue',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          const Text('Remaining due to pay',
            style: TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                _buildDueRow('Total Earnings', '৳$totalEarnings'),
                const SizedBox(height: 6),
                _buildDueRow('Platform Due (30%)', '৳$platformDue'),
                const SizedBox(height: 6),
                _buildDueRow('Total Paid', '৳$totalPaid', isGreen: true),
                if (double.tryParse(totalPending) != 0) ...[
                  const SizedBox(height: 6),
                  _buildDueRow('Pending Approval', '৳$totalPending', isYellow: true),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDueRow(String label, String value, {bool isGreen = false, bool isYellow = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
        Text(value,
          style: TextStyle(
            color: isGreen
                ? Colors.green.shade200
                : isYellow
                    ? Colors.yellow.shade200
                    : Colors.white,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentMethods() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      childAspectRatio: 2.5,
      children: _paymentMethods.map((method) {
        final isSelected = _selectedMethod == method['method'];
        final methodName = method['method'] ?? '';
        final displayName = method['display_name'] ?? methodName;

        return GestureDetector(
          onTap: () => _selectMethod(method),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isSelected ? _getMethodColor(methodName).withValues(alpha: 0.1) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? _getMethodColor(methodName) : Colors.grey.shade200,
                width: isSelected ? 2 : 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: _getMethodColor(methodName).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    _getMethodIcon(methodName),
                    size: 18,
                    color: _getMethodColor(methodName),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(displayName,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                      color: isSelected ? _getMethodColor(methodName) : Colors.black87,
                    ),
                  ),
                ),
                if (isSelected)
                  Icon(Icons.check_circle, size: 16, color: _getMethodColor(methodName)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  IconData _getMethodIcon(String method) {
    switch (method) {
      case 'bkash': return Iconsax.mobile;
      case 'nagad': return Iconsax.mobile;
      case 'rocket': return Iconsax.mobile;
      case 'bank': return Iconsax.bank;
      default: return Iconsax.money;
    }
  }

  Color _getMethodColor(String method) {
    switch (method) {
      case 'bkash': return const Color(0xFFE2136E);
      case 'nagad': return const Color(0xFFF6921E);
      case 'rocket': return const Color(0xFF8C3494);
      case 'bank': return const Color(0xFF1E88E5);
      default: return Colors.grey;
    }
  }

  Widget _buildPaymentForm() {
    final method = _selectedMethodData!;
    final methodName = method['method'] ?? '';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Payment Number Info
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: _getMethodColor(methodName).withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _getMethodColor(methodName).withValues(alpha: 0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Send Money To:',
                  style: TextStyle(
                    fontSize: 11,
                    color: _getMethodColor(methodName),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(method['account_number'] ?? '',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
                if ((method['account_name'] ?? '').toString().isNotEmpty)
                  Text('Name: ${method['account_name']}',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                  ),
                if (methodName == 'bank') ...[
                  if ((method['bank_name'] ?? '').toString().isNotEmpty)
                    Text('Bank: ${method['bank_name']}',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                    ),
                  if ((method['branch'] ?? '').toString().isNotEmpty)
                    Text('Branch: ${method['branch']}',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                    ),
                ],
                if ((method['instructions'] ?? '').toString().isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text('⚠️ ${method['instructions']}',
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.orange.shade800,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Amount
          _buildInputField(
            controller: _amountController,
            label: 'Amount *',
            hint: 'Enter amount',
            icon: Iconsax.money,
            prefix: '৳ ',
            keyboardType: TextInputType.number,
          ),

          const SizedBox(height: 12),

          // Sender Number
          _buildInputField(
            controller: _numberController,
            label: methodName == 'bank' ? 'Your Account Number *' : 'Your ${method['display_name']} Number *',
            hint: 'e.g., 01XXXXXXXXX',
            icon: Iconsax.call,
            keyboardType: TextInputType.phone,
          ),

          const SizedBox(height: 12),

          // Transaction ID
          _buildInputField(
            controller: _txnController,
            label: 'Transaction ID *',
            hint: 'e.g., TX123456789',
            icon: Iconsax.receipt,
          ),

          // Bank extra fields
          if (methodName == 'bank') ...[
            const SizedBox(height: 12),
            _buildInputField(
              controller: _bankNameController,
              label: 'Bank Name *',
              hint: 'Your bank name',
              icon: Iconsax.bank,
            ),
            const SizedBox(height: 12),
            _buildInputField(
              controller: _accHolderController,
              label: 'Account Holder Name *',
              hint: 'Your name',
              icon: Iconsax.user,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    String? prefix,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixText: prefix,
        prefixIcon: Icon(icon, size: 20),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      ),
    );
  }

  Widget _buildHistoryCard(dynamic payment) {
    final status = payment['status'] ?? 'pending';
    final method = payment['payment_method'] ?? '';
    final amount = payment['amount'] ?? '0';
    final txn = payment['transaction_id'] ?? '';
    final reason = payment['rejection_reason'];
    final createdAt = payment['created_at'];

    Color statusColor;
    IconData statusIcon;
    String statusText;

    switch (status) {
      case 'approved':
        statusColor = Colors.green;
        statusIcon = Iconsax.tick_circle;
        statusText = 'Approved';
        break;
      case 'rejected':
        statusColor = Colors.red;
        statusIcon = Iconsax.close_circle;
        statusText = 'Rejected';
        break;
      default:
        statusColor = Colors.orange;
        statusIcon = Iconsax.clock;
        statusText = 'Pending';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: statusColor.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _getMethodColor(method).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(_getMethodIcon(method), size: 16, color: _getMethodColor(method)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(method.toUpperCase(),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    Text('TXN: $txn',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Icon(statusIcon, size: 12, color: statusColor),
                    const SizedBox(width: 4),
                    Text(statusText,
                      style: TextStyle(
                        fontSize: 10,
                        color: statusColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Divider(height: 1),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Amount',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              ),
              Text('৳$amount',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              ),
            ],
          ),
          if (reason != null && reason.toString().isNotEmpty) ...[
            const SizedBox(height: 6),
            Text('Reason: $reason',
              style: TextStyle(fontSize: 11, color: Colors.red.shade700),
            ),
          ],
          if (createdAt != null) ...[
            const SizedBox(height: 6),
            Text(_formatDate(createdAt),
              style: TextStyle(fontSize: 10, color: Colors.grey.shade500),
            ),
          ],
        ],
      ),
    );
  }

  String _formatDate(dynamic date) {
    if (date == null) return '';
    try {
      final d = DateTime.parse(date.toString());
      return '${d.day}/${d.month}/${d.year} ${d.hour}:${d.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return date.toString();
    }
  }
}