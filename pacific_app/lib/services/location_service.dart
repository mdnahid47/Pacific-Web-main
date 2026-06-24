// location_service.dart
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
      debugPrint('Loading locations data...');

      final jsonString = await rootBundle.loadString(
        'assets/data/divisions.json',
      );
      final jsonData = jsonDecode(jsonString);

      // Load divisions, districts, stations
      _divisions = (jsonData['divisions'] as List)
          .map((division) => Division.fromJson(division))
          .toList();

      // Load service areas (যদি divisions.json-এ থাকে)
      if (jsonData['service_areas'] != null) {
        _serviceAreas = (jsonData['service_areas'] as List)
            .map((area) => ServiceArea.fromJson(area))
            .toList();
      } else {
        // Auto-generate service areas from divisions
        _generateServiceAreas();
      }

      _isLoaded = true;
      debugPrint(
        'Locations loaded successfully: ${_divisions.length} divisions, ${_serviceAreas.length} service areas',
      );
    } catch (e) {
      debugPrint('Error loading locations: $e');
      _divisions = [];
      _serviceAreas = [];
      _isLoaded = true; // Still mark as loaded to prevent infinite retries
    }
  }

  // Auto-generate service areas from divisions
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

  static List<String> searchServiceAreas(String query) {
    if (query.isEmpty) return getServiceAreaNames();

    return _serviceAreas
        .where((area) => area.matchesQuery(query))
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

  // =========== DIVISION, DISTRICT, THANA METHODS ===========

  static List<Division> get divisions => _divisions;
  static bool get isLoaded => _isLoaded;

  static List<String> getDivisionNames() {
    return _divisions.map((div) => div.name).toList();
  }

  static List<String> getDistrictNames(String divisionName) {
    final division = _divisions.firstWhere(
      (div) => div.name == divisionName,
      orElse: () => Division(name: '', districts: []),
    );
    return division.districts.map((dist) => dist.name).toList();
  }

  static List<String> getStationNames(
    String divisionName,
    String districtName,
  ) {
    final division = _divisions.firstWhere(
      (div) => div.name == divisionName,
      orElse: () => Division(name: '', districts: []),
    );

    final district = division.districts.firstWhere(
      (dist) => dist.name == districtName,
      orElse: () => District(name: '', stations: []),
    );

    return district.stations.map((station) => station.label).toList();
  }

  static List<Station> getStations(String divisionName, String districtName) {
    final division = _divisions.firstWhere(
      (div) => div.name == divisionName,
      orElse: () => Division(name: '', districts: []),
    );

    final district = division.districts.firstWhere(
      (dist) => dist.name == districtName,
      orElse: () => District(name: '', stations: []),
    );

    return district.stations;
  }

  static List<String> getAllStationNames() {
    List<String> allStations = [];
    for (final division in _divisions) {
      for (final district in division.districts) {
        allStations.addAll(district.stations.map((s) => s.label));
      }
    }
    return allStations.toSet().toList();
  }

  static List<String> getStationsByDivision(String divisionName) {
    List<String> stations = [];
    final division = _divisions.firstWhere(
      (div) => div.name == divisionName,
      orElse: () => Division(name: '', districts: []),
    );

    for (final district in division.districts) {
      stations.addAll(district.stations.map((s) => s.label));
    }

    return stations;
  }

  static List<String> searchStations(String query) {
    if (query.isEmpty) return getAllStationNames();

    final lowerQuery = query.toLowerCase();
    List<String> results = [];

    for (final division in _divisions) {
      for (final district in division.districts) {
        for (final station in district.stations) {
          if (station.label.toLowerCase().contains(lowerQuery)) {
            results.add(station.label);
          }
        }
      }
    }

    return results.toSet().toList();
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

  // ✅ ফিক্সড: List<String> রিটার্ন করবে
  static List<String> getAllThanas() {
    return _serviceAreas
        .map((area) => area.thana)
        .where((thana) => thana != null && thana.isNotEmpty)
        .cast<String>()
        .toSet()
        .toList();
  }

  // ✅ ফিক্সড: List<String> রিটার্ন করবে
  static List<String> getThanasByDivision(String divisionName) {
    return _serviceAreas
        .where((area) => area.division == divisionName)
        .map((area) => area.thana)
        .where((thana) => thana != null && thana.isNotEmpty)
        .cast<String>()
        .toSet()
        .toList();
  }

  // ✅ ফিক্সড: List<String> রিটার্ন করবে
  static List<String> getThanasByDivisionAndDistrict(
    String divisionName,
    String districtName,
  ) {
    return _serviceAreas
        .where(
          (area) =>
              area.division == divisionName && area.district == districtName,
        )
        .map((area) => area.thana)
        .where((thana) => thana != null && thana.isNotEmpty)
        .cast<String>()
        .toList();
  }

  // ✅ ফিক্সড: List<String> রিটার্ন করবে
  static List<String> searchThanas(String query) {
    if (query.isEmpty) return getAllThanas();

    final lowerQuery = query.toLowerCase();
    return _serviceAreas
        .where(
          (area) => area.thana?.toLowerCase().contains(lowerQuery) ?? false,
        )
        .map((area) => area.thana!)
        .toSet()
        .toList();
  }

  // Clear cache
  static void clearCache() {
    _divisions = [];
    _serviceAreas = [];
    _isLoaded = false;
  }

  // Check if data is available
  static bool hasData() {
    return _divisions.isNotEmpty;
  }

  // Get total count of items
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
}
