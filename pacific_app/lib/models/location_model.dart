class Division {
  final String name;
  final List<District> districts;

  Division({required this.name, required this.districts});

  factory Division.fromJson(Map<String, dynamic> json) {
    return Division(
      name: json['division'],
      districts: (json['districts'] as List)
          .map((district) => District.fromJson(district))
          .toList(),
    );
  }
}

class District {
  final String name;
  final List<Station> stations;

  District({required this.name, required this.stations});

  factory District.fromJson(Map<String, dynamic> json) {
    return District(
      name: json['district'],
      stations: (json['stations'] as List)
          .map((station) => Station.fromJson(station))
          .toList(),
    );
  }
}

class Station {
  final String value;
  final String label;

  Station({required this.value, required this.label});

  factory Station.fromJson(Map<String, dynamic> json) {
    return Station(value: json['value'], label: json['label']);
  }

  @override
  String toString() => label;
}

class ServiceArea {
  final String id;
  final String name;
  final String division;
  final String district;
  final String thana;

  ServiceArea({
    required this.id,
    required this.name,
    required this.division,
    required this.district,
    required this.thana,
  });

  factory ServiceArea.fromJson(Map<String, dynamic> json) {
    return ServiceArea(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      division: json['division']?.toString() ?? '',
      district: json['district']?.toString() ?? '',
      thana: json['thana']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'division': division,
      'district': district,
      'thana': thana,
    };
  }

  @override
  String toString() => name;

  bool matchesQuery(String query) {
    final lowerQuery = query.toLowerCase();
    return name.toLowerCase().contains(lowerQuery) ||
        division.toLowerCase().contains(lowerQuery) ||
        district.toLowerCase().contains(lowerQuery) ||
        thana.toLowerCase().contains(lowerQuery);
  }
}
