import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart' show debugPrint;
import '../models/location_model.dart';

class LocationService {
  static List<Division> _divisions = [];
  static List<ServiceArea> _serviceAreas = [];
  static bool _isLoaded = false;

  static Future<void> loadLocations() async {
    if (_isLoaded) return;

    try {
      debugPrint('🔄 Loading locations data...');

      final jsonString = await rootBundle.loadString(
        'assets/Data/divisions.json',
      );
      debugPrint('✅ JSON loaded, length: ${jsonString.length}');

      final jsonData = jsonDecode(jsonString);
      debugPrint('✅ JSON parsed, keys: ${jsonData.keys}');

      if (jsonData['divisions'] == null) {
        debugPrint('❌ ERROR: "divisions" key not found');
        _divisions = [];
        _serviceAreas = [];
        _isLoaded = true;
        return;
      }

      final divisionsList = jsonData['divisions'] as List;
      debugPrint('📋 Divisions list length: ${divisionsList.length}');

      _divisions = [];
      for (var divisionData in divisionsList) {
        try {
          final division = Division.fromJson(divisionData);
          _divisions.add(division);
          debugPrint('✅ Added division: "${division.name}" with ${division.districts.length} districts');
        } catch (e) {
          debugPrint('❌ Error parsing division: $e');
        }
      }

      debugPrint('✅ Total divisions loaded: ${_divisions.length}');

      // Generate service areas
      _generateServiceAreas();

      _isLoaded = true;
      _debugPrintData();

    } catch (e) {
      debugPrint('❌ Error loading locations: $e');
      _divisions = [];
      _serviceAreas = [];
      _isLoaded = true;
    }
  }

  static void _debugPrintData() {
    debugPrint('=== 📊 LOCATION DATA DEBUG ===');
    debugPrint('Divisions count: ${_divisions.length}');
    debugPrint('Service areas count: ${_serviceAreas.length}');
    
    if (_divisions.isNotEmpty) {
      final firstDiv = _divisions.first;
      debugPrint('First division: "${firstDiv.name}"');
      debugPrint('Districts in first division: ${firstDiv.districts.length}');
      
      if (firstDiv.districts.isNotEmpty) {
        final firstDist = firstDiv.districts.first;
        debugPrint('First district: "${firstDist.name}"');
        debugPrint('Stations in first district: ${firstDist.stations.length}');
      }
    }
    debugPrint('================================');
  }

  static void _generateServiceAreas() {
    _serviceAreas = [];
    for (final division in _divisions) {
      for (final district in division.districts) {
        for (final station in district.stations) {
          _serviceAreas.add(
            ServiceArea(
              id: '${division.name}_${district.name}_${station.value}',
              name: station.label,
              division: division.name,
              district: district.name,
              thana: station.label,
            ),
          );
        }
      }
    }
  }

  // =========== DIVISION METHODS ===========

  static List<Division> get divisions => _divisions;
  static bool get isLoaded => _isLoaded;

  static List<String> getDivisionNames() {
    if (!_isLoaded || _divisions.isEmpty) {
      debugPrint('⚠️ getDivisionNames: No data loaded');
      return [];
    }
    return _divisions.map((div) => div.name).toList();
  }

  // =========== DISTRICT METHODS ===========

  static List<String> getDistrictNames(String divisionName) {
    if (!_isLoaded || _divisions.isEmpty) {
      debugPrint('⚠️ getDistrictNames: No data loaded');
      return [];
    }
    
    debugPrint('🔍 getDistrictNames: Looking for districts in "$divisionName"');
    
    try {
      final division = _divisions.firstWhere(
        (div) => div.name == divisionName,
        orElse: () {
          debugPrint('⚠️ Division not found: "$divisionName"');
          return Division(name: '', districts: []);
        },
      );
      
      if (division.name.isEmpty) {
        return [];
      }
      
      final districtNames = division.districts.map((dist) => dist.name).toList();
      debugPrint('✅ Found ${districtNames.length} districts: $districtNames');
      return districtNames;
      
    } catch (e) {
      debugPrint('❌ Error getting districts: $e');
      return [];
    }
  }

  // =========== STATION/THANA METHODS ===========

  static List<String> getStationNames(
    String divisionName,
    String districtName,
  ) {
    if (!_isLoaded || _divisions.isEmpty) {
      debugPrint('⚠️ getStationNames: No data loaded');
      return [];
    }
    
    debugPrint('🔍 getStationNames: Looking in "$divisionName" -> "$districtName"');
    
    try {
      final division = _divisions.firstWhere(
        (div) => div.name == divisionName,
        orElse: () {
          debugPrint('⚠️ Division not found: "$divisionName"');
          return Division(name: '', districts: []);
        },
      );
      
      if (division.name.isEmpty) {
        return [];
      }

      final district = division.districts.firstWhere(
        (dist) => dist.name == districtName,
        orElse: () {
          debugPrint('⚠️ District not found: "$districtName"');
          return District(name: '', stations: []);
        },
      );
      
      if (district.name.isEmpty) {
        return [];
      }

      final stationLabels = district.stations.map((station) => station.label).toList();
      debugPrint('✅ Found ${stationLabels.length} stations: $stationLabels');
      return stationLabels;
      
    } catch (e) {
      debugPrint('❌ Error getting stations: $e');
      return [];
    }
  }

  // =========== THANA METHODS (using Service Areas) ===========

  static List<String> getAllThanas() {
    if (!_isLoaded || _serviceAreas.isEmpty) {
      debugPrint('⚠️ getAllThanas: No data loaded');
      return [];
    }
    
    final thanas = _serviceAreas
        .map((area) => area.thana)
        .where((thana) => thana.isNotEmpty)
        .toSet()
        .toList();
    
    debugPrint('✅ getAllThanas: Found ${thanas.length} thanas');
    return thanas;
  }

  static List<String> getThanasByDivision(String divisionName) {
    if (!_isLoaded || _serviceAreas.isEmpty) {
      debugPrint('⚠️ getThanasByDivision: No data loaded');
      return [];
    }
    
    debugPrint('🔍 getThanasByDivision: Looking for thanas in "$divisionName"');
    
    final thanas = _serviceAreas
        .where((area) => area.division == divisionName)
        .map((area) => area.thana)
        .where((thana) => thana.isNotEmpty)
        .toSet()
        .toList();
    
    debugPrint('✅ Found ${thanas.length} thanas in "$divisionName"');
    return thanas;
  }

  static List<String> getThanasByDivisionAndDistrict(
    String divisionName,
    String districtName,
  ) {
    if (!_isLoaded || _serviceAreas.isEmpty) {
      debugPrint('⚠️ getThanasByDivisionAndDistrict: No data loaded');
      return [];
    }
    
    debugPrint('🔍 getThanasByDivisionAndDistrict: Looking for thanas in "$divisionName" -> "$districtName"');
    
    final thanas = _serviceAreas
        .where(
          (area) =>
              area.division == divisionName && 
              area.district == districtName,
        )
        .map((area) => area.thana)
        .where((thana) => thana.isNotEmpty)
        .toList();
    
    debugPrint('✅ Found ${thanas.length} thanas in "$divisionName" -> "$districtName"');
    return thanas;
  }

  static List<String> searchThanas(String query) {
    if (query.isEmpty) return getAllThanas();

    final lowerQuery = query.toLowerCase();
    return _serviceAreas
        .where(
          (area) => area.thana.toLowerCase().contains(lowerQuery),
        )
        .map((area) => area.thana)
        .toSet()
        .toList();
  }

  // =========== SERVICE AREA METHODS ===========

  static List<ServiceArea> get serviceAreas => _serviceAreas;

  static List<String> getServiceAreaNames() {
    return _serviceAreas.map((area) => area.name).toList();
  }

  static List<String> getServiceAreasByDivision(String divisionName) {
    return _serviceAreas
        .where((area) => area.division == divisionName)
        .map((area) => area.name)
        .toList();
  }

  static List<String> getServiceAreasByDivisionAndDistrict(
    String divisionName,
    String districtName,
  ) {
    return _serviceAreas
        .where(
          (area) =>
              area.division == divisionName && area.district == districtName,
        )
        .map((area) => area.name)
        .toList();
  }

  static List<ServiceArea> searchServiceAreasDetailed(String query) {
    if (query.isEmpty) return List.from(_serviceAreas);

    final lowerQuery = query.toLowerCase();
    return _serviceAreas
        .where((area) => area.matchesQuery(lowerQuery))
        .toList();
  }

  // =========== HELPER METHODS ===========

  static Division? getDivisionByName(String name) {
    try {
      return _divisions.firstWhere((div) => div.name == name);
    } catch (e) {
      return null;
    }
  }

  static District? getDistrictByName(String divisionName, String districtName) {
    final division = getDivisionByName(divisionName);
    if (division == null) return null;

    try {
      return division.districts.firstWhere((dist) => dist.name == districtName);
    } catch (e) {
      return null;
    }
  }

  static Station? getStationByName(
    String divisionName,
    String districtName,
    String stationLabel,
  ) {
    final district = getDistrictByName(divisionName, districtName);
    if (district == null) return null;

    try {
      return district.stations.firstWhere(
        (station) => station.label == stationLabel,
      );
    } catch (e) {
      return null;
    }
  }

  static ServiceArea? getServiceAreaByName(String name) {
    try {
      return _serviceAreas.firstWhere((area) => area.name == name);
    } catch (e) {
      return null;
    }
  }

  static bool hasData() {
    return _divisions.isNotEmpty;
  }

  static Map<String, int> getCounts() {
    int totalDivisions = _divisions.length;
    int totalDistricts = 0;
    int totalStations = 0;
    int totalServiceAreas = _serviceAreas.length;

    for (final division in _divisions) {
      totalDistricts += division.districts.length;
      for (final district in division.districts) {
        totalStations += district.stations.length;
      }
    }

    return {
      'divisions': totalDivisions,
      'districts': totalDistricts,
      'stations': totalStations,
      'service_areas': totalServiceAreas,
    };
  }

  static void clearCache() {
    _divisions = [];
    _serviceAreas = [];
    _isLoaded = false;
  }
}