// services/image_picker_service.dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../models/file_model.dart';

class ImagePickerService {
  static final ImagePicker _imagePicker = ImagePicker();

  // Pick image from camera
  static Future<AppFile?> pickImageFromCamera() async {
    try {
      final XFile? pickedFile = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
        maxWidth: 1080,
        maxHeight: 1080,
      );

      if (pickedFile != null) {
        return await AppFile.fromXFile(pickedFile);
      }
    } catch (e) {
      debugPrint('Error picking image from camera: $e');
    }
    return null;
  }

  // Pick image from gallery
  static Future<AppFile?> pickImageFromGallery() async {
    try {
      final XFile? pickedFile = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
        maxWidth: 1080,
        maxHeight: 1080,
      );

      if (pickedFile != null) {
        return await AppFile.fromXFile(pickedFile);
      }
    } catch (e) {
      debugPrint('Error picking image from gallery: $e');
    }
    return null;
  }

  // Pick any file (PDF, DOC, images, etc.)
  static Future<AppFile?> pickFile({
    List<String>? allowedExtensions,
    FileType fileType = FileType.any,
  }) async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: fileType,
        allowedExtensions: allowedExtensions,
        allowMultiple: false,
        withData: true,
      );

      if (result != null && result.files.isNotEmpty) {
        return AppFile.fromPlatformFile(result.files.first);
      }
    } catch (e) {
      debugPrint('Error picking file: $e');
    }
    return null;
  }

  // Show image source dialog (camera or gallery)
  static Future<AppFile?> showImageSourceDialog(BuildContext context) async {
    final source = await showDialog<ImageSource>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Image Source'),
        content: const Text('Choose how you want to capture the image'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, ImageSource.camera),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.camera_alt),
                SizedBox(width: 8),
                Text('Camera'),
              ],
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, ImageSource.gallery),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.photo_library),
                SizedBox(width: 8),
                Text('Gallery'),
              ],
            ),
          ),
        ],
      ),
    );

    if (source == ImageSource.camera) {
      return await pickImageFromCamera();
    } else if (source == ImageSource.gallery) {
      return await pickImageFromGallery();
    }

    return null;
  }
}
