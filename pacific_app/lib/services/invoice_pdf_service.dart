import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

class InvoicePdfService {
  /// ✅ Generate Invoice PDF
  static Future<Uint8List> generateInvoice(Map<String, dynamic> invoice) async {
    final pdf = pw.Document();

    final invoiceNumber = invoice['invoice_number'] ?? 'N/A';
    final orderId = (invoice['order_id'] ?? 'N/A').toString().replaceAll('#', '');
    final customerName = invoice['customer_name'] ?? 'Customer';
    final customerPhone = invoice['customer_phone'] ?? '';
    final vendorName = invoice['vendor_name'] ?? 'Vendor';
    final generatedAt = invoice['generated_at'] ?? DateTime.now().toString();

    final orderAmount = double.tryParse(invoice['order_amount'].toString()) ?? 0;
    final serviceAmount = double.tryParse(invoice['service_amount'].toString()) ?? 0;
    final tax = double.tryParse(invoice['tax'].toString()) ?? 0;
    final discount = double.tryParse(invoice['discount'].toString()) ?? 0;
    final total = double.tryParse(invoice['total_amount'].toString()) ?? 0;

    final cartItems = invoice['cart_items'] as List? ?? [];
    final services = invoice['services'] as List? ?? [];

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (context) => [
          // Header
          pw.Container(
            padding: const pw.EdgeInsets.all(20),
            decoration: pw.BoxDecoration(
              color: PdfColors.green700,
              borderRadius: pw.BorderRadius.circular(8),
            ),
            child: pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text('INVOICE',
                      style: pw.TextStyle(
                        fontSize: 28,
                        fontWeight: pw.FontWeight.bold,
                        color: PdfColors.white,
                        letterSpacing: 2,
                      ),
                    ),
                    pw.SizedBox(height: 4),
                    pw.Text(invoiceNumber,
                      style: const pw.TextStyle(
                        fontSize: 14,
                        color: PdfColors.white,
                      ),
                    ),
                  ],
                ),
                pw.Container(
                  padding: const pw.EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: pw.BoxDecoration(
                    color: PdfColors.white,
                    borderRadius: pw.BorderRadius.circular(20),
                  ),
                  child: pw.Text('PAID',
                    style: pw.TextStyle(
                      color: PdfColors.green700,
                      fontWeight: pw.FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),

          pw.SizedBox(height: 20),

          // Bill To + Order Info
          pw.Row(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Expanded(
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text('BILL TO',
                      style: pw.TextStyle(
                        fontSize: 10,
                        fontWeight: pw.FontWeight.bold,
                        color: PdfColors.grey700,
                        letterSpacing: 1,
                      ),
                    ),
                    pw.SizedBox(height: 4),
                    pw.Text(customerName,
                      style: pw.TextStyle(
                        fontSize: 14,
                        fontWeight: pw.FontWeight.bold,
                      ),
                    ),
                    if (customerPhone.isNotEmpty)
                      pw.Text(customerPhone,
                        style: const pw.TextStyle(fontSize: 11, color: PdfColors.grey700),
                      ),
                  ],
                ),
              ),
              pw.Expanded(
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.end,
                  children: [
                    pw.Text('ORDER',
                      style: pw.TextStyle(
                        fontSize: 10,
                        fontWeight: pw.FontWeight.bold,
                        color: PdfColors.grey700,
                        letterSpacing: 1,
                      ),
                    ),
                    pw.SizedBox(height: 4),
                    pw.Text('#$orderId',
                      style: pw.TextStyle(
                        fontSize: 14,
                        fontWeight: pw.FontWeight.bold,
                      ),
                    ),
                    pw.Text(_formatDate(generatedAt),
                      style: const pw.TextStyle(fontSize: 11, color: PdfColors.grey700),
                    ),
                  ],
                ),
              ),
            ],
          ),

          pw.SizedBox(height: 20),
          pw.Divider(),
          pw.SizedBox(height: 10),

          // Vendor Info
          pw.Text('VENDOR: $vendorName',
            style: const pw.TextStyle(fontSize: 11, color: PdfColors.grey700),
          ),

          pw.SizedBox(height: 20),

          // Order Items Table
          if (cartItems.isNotEmpty) ...[
            pw.Text('Order Items',
              style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold),
            ),
            pw.SizedBox(height: 8),
            _buildItemsTable(
              cartItems.map((item) => {
                'name': item['name'] ?? 'Item',
                'qty': int.tryParse(item['quantity'].toString()) ?? 1,
                'price': double.tryParse(item['price'].toString()) ?? 0,
                'badge': null,
              }).toList(),
            ),
            pw.SizedBox(height: 16),
          ],

          // Additional Services
          if (services.isNotEmpty) ...[
            pw.Text('Additional Services',
              style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold),
            ),
            pw.SizedBox(height: 8),
            _buildItemsTable(
              services.map((service) => {
                'name': service['service_name'] ?? 'Service',
                'qty': int.tryParse(service['quantity'].toString()) ?? 1,
                'price': double.tryParse(service['price'].toString()) ?? 0,
                'badge': (service['source'] ?? '') == 'custom' ? 'Custom' : 'Master',
              }).toList(),
            ),
            pw.SizedBox(height: 16),
          ],

          // Summary Table
          pw.Container(
            padding: const pw.EdgeInsets.all(16),
            decoration: pw.BoxDecoration(
              color: PdfColors.grey100,
              borderRadius: pw.BorderRadius.circular(8),
            ),
            child: pw.Column(
              children: [
                _buildSummaryRow('Order Amount', orderAmount),
                pw.SizedBox(height: 6),
                _buildSummaryRow('Service Amount', serviceAmount),
                pw.Divider(),
                _buildSummaryRow('Subtotal', orderAmount + serviceAmount),
                pw.SizedBox(height: 6),
                if (discount > 0) ...[
                  _buildSummaryRow('Discount', -discount, isRed: true),
                  pw.SizedBox(height: 6),
                ],
                _buildSummaryRow('Tax (5%)', tax),
                pw.Divider(thickness: 2),
                pw.SizedBox(height: 4),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('TOTAL',
                      style: pw.TextStyle(
                        fontSize: 16,
                        fontWeight: pw.FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                    pw.Text('৳${total.toStringAsFixed(2)}',
                      style: pw.TextStyle(
                        fontSize: 20,
                        fontWeight: pw.FontWeight.bold,
                        color: PdfColors.green700,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          pw.SizedBox(height: 30),

          // Footer
          pw.Center(
            child: pw.Column(
              children: [
                pw.Text('Thank you for your business!',
                  style: pw.TextStyle(
                    fontSize: 12,
                    fontStyle: pw.FontStyle.italic,
                    color: PdfColors.grey700,
                  ),
                ),
                pw.SizedBox(height: 4),
                pw.Text('Pacific Support',
                  style: pw.TextStyle(
                    fontSize: 10,
                    color: PdfColors.grey500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );

    return pdf.save();
  }

  static pw.Widget _buildItemsTable(List<Map<String, dynamic>> items) {
    return pw.Table(
      border: pw.TableBorder.all(color: PdfColors.grey300, width: 0.5),
      children: [
        // Header
        pw.TableRow(
          decoration: const pw.BoxDecoration(color: PdfColors.grey200),
          children: [
            _buildCell('Item', isHeader: true),
            _buildCell('Qty', isHeader: true, align: pw.TextAlign.center),
            _buildCell('Price', isHeader: true, align: pw.TextAlign.right),
            _buildCell('Total', isHeader: true, align: pw.TextAlign.right),
          ],
        ),
        // Items
        ...items.map((item) {
          final name = item['name'] ?? '';
          final qty = item['qty'] ?? 1;
          final price = (item['price'] as num).toDouble();
          final badge = item['badge'];

          return pw.TableRow(
            children: [
              pw.Padding(
                padding: const pw.EdgeInsets.all(8),
                child: pw.Row(
                  children: [
                    pw.Expanded(child: pw.Text(name, style: const pw.TextStyle(fontSize: 11))),
                    if (badge != null)
                      pw.Container(
                        padding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: pw.BoxDecoration(
                          color: badge == 'Custom' ? PdfColors.orange100 : PdfColors.blue100,
                          borderRadius: pw.BorderRadius.circular(4),
                        ),
                        child: pw.Text(badge,
                          style: pw.TextStyle(
                            fontSize: 8,
                            color: badge == 'Custom' ? PdfColors.orange800 : PdfColors.blue800,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              pw.Padding(
                padding: const pw.EdgeInsets.all(8),
                child: pw.Text('$qty',
                  textAlign: pw.TextAlign.center,
                  style: const pw.TextStyle(fontSize: 11),
                ),
              ),
              pw.Padding(
                padding: const pw.EdgeInsets.all(8),
                child: pw.Text('৳${price.toStringAsFixed(2)}',
                  textAlign: pw.TextAlign.right,
                  style: const pw.TextStyle(fontSize: 11),
                ),
              ),
              pw.Padding(
                padding: const pw.EdgeInsets.all(8),
                child: pw.Text('৳${(price * qty).toStringAsFixed(2)}',
                  textAlign: pw.TextAlign.right,
                  style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold),
                ),
              ),
            ],
          );
        }),
      ],
    );
  }

  static pw.Widget _buildCell(String text, {bool isHeader = false, pw.TextAlign align = pw.TextAlign.left}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.all(8),
      child: pw.Text(
        text,
        textAlign: align,
        style: pw.TextStyle(
          fontSize: 11,
          fontWeight: isHeader ? pw.FontWeight.bold : pw.FontWeight.normal,
        ),
      ),
    );
  }

  static pw.Widget _buildSummaryRow(String label, double amount, {bool isRed = false}) {
    return pw.Row(
      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
      children: [
        pw.Text(label,
          style: pw.TextStyle(
            fontSize: 11,
            color: isRed ? PdfColors.red700 : PdfColors.grey800,
          ),
        ),
        pw.Text(
          '${amount < 0 ? '-' : ''}৳${amount.abs().toStringAsFixed(2)}',
          style: pw.TextStyle(
            fontSize: 11,
            fontWeight: pw.FontWeight.bold,
            color: isRed ? PdfColors.red700 : PdfColors.black,
          ),
        ),
      ],
    );
  }

  static String _formatDate(dynamic date) {
    if (date == null) return '';
    try {
      final d = DateTime.parse(date.toString());
      return '${d.day}/${d.month}/${d.year}';
    } catch (e) {
      return date.toString();
    }
  }
}