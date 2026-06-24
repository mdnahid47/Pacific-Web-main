// import 'package:flutter/material.dart';
// import 'dart:io';

// class CustomFilePicker extends StatelessWidget {
//   final String label;
//   final File? file;
//   final VoidCallback onPick;
//   final VoidCallback? onRemove;
//   final IconData icon;
//   final bool isRequired;
//   final String? errorText;
//   final bool isLoading;
//   final String fileType;

//   const CustomFilePicker({
//     Key? key,
//     required this.label,
//     this.file,
//     required this.onPick,
//     this.onRemove,
//     this.icon = Icons.attach_file,
//     this.isRequired = false,
//     this.errorText,
//     this.isLoading = false,
//     this.fileType = 'PDF',
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     final bool hasError = errorText != null && errorText!.isNotEmpty;
//     final bool isUploaded = file != null;

//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Row(
//           children: [
//             Text(
//               label,
//               style: TextStyle(
//                 fontSize: 14,
//                 fontWeight: FontWeight.w500,
//                 color: Color(0xFF475569),
//               ),
//             ),
//             if (isRequired)
//               Padding(
//                 padding: const EdgeInsets.only(left: 4),
//                 child: Text(
//                   '*',
//                   style: TextStyle(
//                     color: Colors.red,
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ),
//           ],
//         ),
//         SizedBox(height: 6),

//         // File Picker Button
//         InkWell(
//           onTap: isLoading
//               ? null
//               : isUploaded
//               ? null
//               : onPick,
//           borderRadius: BorderRadius.circular(12),
//           child: Container(
//             padding: EdgeInsets.all(16),
//             decoration: BoxDecoration(
//               border: Border.all(
//                 color: hasError
//                     ? Color(0xFFef4444)
//                     : isUploaded
//                     ? Color(0xFF10b981)
//                     : Color(0xFFd1e7ff),
//                 width: hasError || isUploaded ? 1.5 : 1,
//               ),
//               borderRadius: BorderRadius.circular(12),
//               color: Colors.white,
//             ),
//             child: isLoading
//                 ? Center(
//                     child: Column(
//                       mainAxisAlignment: MainAxisAlignment.center,
//                       children: [
//                         CircularProgressIndicator(
//                           strokeWidth: 2,
//                           valueColor: AlwaysStoppedAnimation<Color>(
//                             Color(0xFF3c8ce7),
//                           ),
//                         ),
//                         SizedBox(height: 8),
//                         Text(
//                           'Uploading...',
//                           style: TextStyle(
//                             fontSize: 12,
//                             color: Color(0xFF3c8ce7),
//                           ),
//                         ),
//                       ],
//                     ),
//                   )
//                 : Row(
//                     children: [
//                       Container(
//                         width: 40,
//                         height: 40,
//                         decoration: BoxDecoration(
//                           color: isUploaded
//                               ? Color(0xFFd1fae5)
//                               : Color(0xFFebf5ff),
//                           borderRadius: BorderRadius.circular(8),
//                         ),
//                         child: Icon(
//                           icon,
//                           color: isUploaded
//                               ? Color(0xFF10b981)
//                               : Color(0xFF3c8ce7),
//                           size: 20,
//                         ),
//                       ),
//                       SizedBox(width: 12),
//                       Expanded(
//                         child: Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               isUploaded
//                                   ? _getFileName(file!.path)
//                                   : 'Tap to upload $label',
//                               style: TextStyle(
//                                 fontSize: 14,
//                                 color: isUploaded
//                                     ? Color(0xFF1e293b)
//                                     : Colors.grey[600],
//                                 fontWeight: isUploaded
//                                     ? FontWeight.w500
//                                     : FontWeight.normal,
//                               ),
//                               overflow: TextOverflow.ellipsis,
//                             ),
//                             if (isUploaded)
//                               Padding(
//                                 padding: const EdgeInsets.only(top: 4),
//                                 child: Text(
//                                   '${_getFileSize(file!.lengthSync())} • $fileType',
//                                   style: TextStyle(
//                                     fontSize: 12,
//                                     color: Color(0xFF10b981),
//                                   ),
//                                 ),
//                               ),
//                           ],
//                         ),
//                       ),
//                       if (isUploaded && onRemove != null)
//                         InkWell(
//                           onTap: onRemove,
//                           borderRadius: BorderRadius.circular(20),
//                           child: Container(
//                             width: 36,
//                             height: 36,
//                             decoration: BoxDecoration(
//                               color: Color(0xFFfee2e2),
//                               shape: BoxShape.circle,
//                             ),
//                             child: Icon(
//                               Icons.close,
//                               color: Color(0xFFef4444),
//                               size: 18,
//                             ),
//                           ),
//                         )
//                       else if (!isUploaded)
//                         Container(
//                           width: 36,
//                           height: 36,
//                           decoration: BoxDecoration(
//                             color: Color(0xFF3c8ce7).withOpacity(0.1),
//                             shape: BoxShape.circle,
//                           ),
//                           child: Icon(
//                             Icons.cloud_upload,
//                             color: Color(0xFF3c8ce7),
//                             size: 18,
//                           ),
//                         ),
//                     ],
//                   ),
//           ),
//         ),

//         // Error Text
//         if (hasError)
//           Padding(
//             padding: const EdgeInsets.only(top: 4),
//             child: Row(
//               children: [
//                 Icon(Icons.error_outline, size: 12, color: Color(0xFFef4444)),
//                 SizedBox(width: 4),
//                 Text(
//                   errorText!,
//                   style: TextStyle(fontSize: 12, color: Color(0xFFef4444)),
//                 ),
//               ],
//             ),
//           ),

//         // File Status
//         if (isUploaded)
//           Padding(
//             padding: const EdgeInsets.only(top: 8),
//             child: Row(
//               children: [
//                 Icon(Icons.check_circle, size: 14, color: Color(0xFF10b981)),
//                 SizedBox(width: 4),
//                 Text(
//                   'File uploaded successfully',
//                   style: TextStyle(fontSize: 12, color: Color(0xFF10b981)),
//                 ),
//                 Spacer(),
//                 if (!isLoading)
//                   InkWell(
//                     onTap: onPick,
//                     child: Row(
//                       children: [
//                         Text(
//                           'Change file',
//                           style: TextStyle(
//                             fontSize: 11,
//                             color: Color(0xFF3c8ce7),
//                           ),
//                         ),
//                         Icon(Icons.edit, size: 12, color: Color(0xFF3c8ce7)),
//                       ],
//                     ),
//                   ),
//               ],
//             ),
//           ),

//         // File Requirements
//         if (!isUploaded && !isLoading)
//           Padding(
//             padding: const EdgeInsets.only(top: 8),
//             child: Row(
//               children: [
//                 Icon(Icons.info_outline, size: 12, color: Color(0xFF6b7280)),
//                 SizedBox(width: 4),
//                 Text(
//                   'Supported: $fileType • Max: 10MB',
//                   style: TextStyle(fontSize: 11, color: Color(0xFF6b7280)),
//                 ),
//               ],
//             ),
//           ),
//       ],
//     );
//   }

//   String _getFileName(String path) {
//     List<String> parts = path.split('/');
//     String fileName = parts.last;

//     // Truncate long file names
//     if (fileName.length > 25) {
//       return '${fileName.substring(0, 22)}...';
//     }
//     return fileName;
//   }

//   String _getFileSize(int bytes) {
//     if (bytes < 1024) {
//       return '$bytes B';
//     } else if (bytes < 1024 * 1024) {
//       double kb = bytes / 1024;
//       return '${kb.toStringAsFixed(1)} KB';
//     } else {
//       double mb = bytes / (1024 * 1024);
//       return '${mb.toStringAsFixed(1)} MB';
//     }
//   }
// }

// custom_filepicker.dart
// custom_filepicker.dart
import 'package:flutter/material.dart';
import '../models/file_model.dart';

class CustomFilePicker extends StatelessWidget {
  final String label;
  final AppFile? file;
  final VoidCallback onPick;
  final VoidCallback? onRemove;

  const CustomFilePicker({
    super.key,
    required this.label,
    this.file,
    required this.onPick,
    this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.grey[700],
          ),
        ),
        const SizedBox(height: 8),

        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey[300]!),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: file != null
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              file!.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.w500,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${(file!.size / 1024).toStringAsFixed(2)} KB',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        )
                      : Text(
                          'No file selected',
                          style: TextStyle(color: Colors.grey[500]),
                        ),
                ),
                const SizedBox(width: 12),
                if (file != null && onRemove != null)
                  IconButton(
                    onPressed: onRemove,
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                    tooltip: 'Remove file',
                  ),
                ElevatedButton.icon(
                  onPressed: onPick,
                  icon: const Icon(Icons.attach_file),
                  label: Text(file == null ? 'Browse' : 'Change'),
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
