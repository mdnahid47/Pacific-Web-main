import 'package:flutter/material.dart';
import 'dart:io';

class CustomImagePicker extends StatelessWidget {
  final String label;
  final String description;
  final File? image;
  final VoidCallback onPick;
  final IconData icon;
  final bool isRequired;
  final bool isLoading;

  const CustomImagePicker({
    Key? key,
    required this.label,
    this.description = '',
    this.image,
    required this.onPick,
    this.icon = Icons.camera_alt,
    this.isRequired = false,
    this.isLoading = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF475569),
              ),
            ),
            if (isRequired)
              Padding(
                padding: const EdgeInsets.only(left: 4),
                child: Text(
                  '*',
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),

        if (description.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 2, bottom: 8),
            child: Text(
              description,
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
          ),

        SizedBox(height: 4),

        // Image Picker Container
        InkWell(
          onTap: isLoading ? null : onPick,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            height: 180,
            decoration: BoxDecoration(
              border: Border.all(
                color: image != null ? Color(0xFF10b981) : Color(0xFFd1e7ff),
                width: image != null ? 1.5 : 1,
              ),
              borderRadius: BorderRadius.circular(12),
              color: Color(0xFFf8fafc),
            ),
            child: isLoading
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Color(0xFF3c8ce7),
                          ),
                        ),
                        SizedBox(height: 12),
                        Text(
                          'Processing...',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF3c8ce7),
                          ),
                        ),
                      ],
                    ),
                  )
                : image != null
                ? Stack(
                    children: [
                      // Image Preview
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(
                          image!,
                          fit: BoxFit.cover,
                          width: double.infinity,
                          height: double.infinity,
                        ),
                      ),

                      // Retake Button
                      Positioned(
                        top: 8,
                        right: 8,
                        child: InkWell(
                          onTap: onPick,
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.6),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.camera_alt,
                                  color: Colors.white,
                                  size: 14,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  'Retake',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Captured Label
                      Positioned(
                        bottom: 8,
                        left: 8,
                        child: Container(
                          padding: EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Color(0xFF10b981),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.check_circle,
                                color: Colors.white,
                                size: 12,
                              ),
                              SizedBox(width: 4),
                              Text(
                                'Captured',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  )
                : Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: Color(0xFFebf5ff),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(icon, color: Color(0xFF3c8ce7), size: 28),
                        ),
                        SizedBox(height: 12),
                        Text(
                          'Tap to capture',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF3c8ce7),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Use camera',
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
        ),

        // Image Info
        if (image != null && !isLoading)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Row(
              children: [
                Icon(Icons.info_outline, size: 12, color: Color(0xFF10b981)),
                SizedBox(width: 4),
                Text(
                  'Image captured successfully',
                  style: TextStyle(fontSize: 11, color: Color(0xFF10b981)),
                ),
                Spacer(),
                InkWell(
                  onTap: onPick,
                  child: Row(
                    children: [
                      Text(
                        'Tap to retake',
                        style: TextStyle(
                          fontSize: 11,
                          color: Color(0xFF3c8ce7),
                        ),
                      ),
                      Icon(Icons.refresh, size: 12, color: Color(0xFF3c8ce7)),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
