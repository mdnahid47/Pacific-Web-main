// file_model.dart
import 'dart:io' if (dart.library.html) 'dart:html' as html;
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:image_picker/image_picker.dart';

class AppFile {
  final String name;
  final int size;
  final String? path;
  final dynamic platformFile; // Can be PlatformFile, File, or web File
  final List<int>? bytes;
  final FileType? fileType; // Add this to differentiate file types

  AppFile({
    required this.name,
    required this.size,
    this.path,
    this.platformFile,
    this.bytes,
    this.fileType,
  });

  factory AppFile.fromPlatformFile(PlatformFile platformFile) {
    return AppFile(
      name: platformFile.name,
      size: platformFile.size,
      path: platformFile.path,
      platformFile: platformFile,
      bytes: platformFile.bytes,
      fileType: _getFileTypeFromExtension(platformFile.name),
    );
  }

  factory AppFile.fromFile(File file) {
    return AppFile(
      name: file.path.split('/').last,
      size: file.lengthSync(),
      path: file.path,
      platformFile: file,
      fileType: _getFileTypeFromExtension(file.path),
    );
  }

  static Future<AppFile> fromXFile(XFile xfile) async {
    if (kIsWeb) {
      // For web, we need to convert XFile to bytes
      final bytes = await xfile.readAsBytes();
      return AppFile(
        name: xfile.name,
        size: bytes.length,
        path: null,
        platformFile: xfile,
        bytes: bytes,
        fileType: FileType.image,
      );
    } else {
      // For mobile/desktop
      final file = File(xfile.path);
      return AppFile(
        name: xfile.name,
        size: (await file.length()),
        path: xfile.path,
        platformFile: file,
        fileType: FileType.image,
      );
    }
  }

  static FileType _getFileTypeFromExtension(String filename) {
    final extension = filename.toLowerCase().split('.').last;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].contains(extension)) {
      return FileType.image;
    } else if (['pdf'].contains(extension)) {
      return FileType.any;
    } else if (['doc', 'docx'].contains(extension)) {
      return FileType.any;
    }
    return FileType.any;
  }

  bool get isWebFile => bytes != null;
  bool get hasPath => path != null && path!.isNotEmpty;
  bool get isImage => fileType == FileType.image;
}
