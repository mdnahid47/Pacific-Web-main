import 'package:flutter/material.dart';
import '../services/location_service.dart';

class SearchableLocationDropdown extends StatefulWidget {
  // Single select এর জন্য
  final String? selectedDivision;
  final String? selectedDistrict;
  final String? selectedThana;

  // Multi select service areas এর জন্য
  final List<String> selectedServiceAreas;

  final ValueChanged<String?> onDivisionChanged;
  final ValueChanged<String?> onDistrictChanged;
  final ValueChanged<String?> onThanaChanged;
  final ValueChanged<List<String>>
  onServiceAreasChanged; // Multi-select callback

  final bool showLabels;
  final bool showServiceAreas; // Service areas section show করবে কিনা

  const SearchableLocationDropdown({
    Key? key,
    this.selectedDivision,
    this.selectedDistrict,
    this.selectedThana,
    this.selectedServiceAreas = const [],
    required this.onDivisionChanged,
    required this.onDistrictChanged,
    required this.onThanaChanged,
    required this.onServiceAreasChanged,
    this.showLabels = true,
    this.showServiceAreas = true,
  }) : super(key: key);

  @override
  _SearchableLocationDropdownState createState() =>
      _SearchableLocationDropdownState();
}

class _SearchableLocationDropdownState
    extends State<SearchableLocationDropdown> {
  // Service areas এর জন্য state variables
  final TextEditingController _areaController = TextEditingController();
  final FocusNode _areaFocusNode = FocusNode();
  OverlayEntry? _areaOverlayEntry;
  List<String> _filteredAreas = [];
  List<String> _selectedAreas = [];
  bool _isAreaDropdownOpen = false;
  final LayerLink _areaLayerLink = LayerLink();

  @override
  void initState() {
    super.initState();
    _selectedAreas = List.from(widget.selectedServiceAreas);

    _areaFocusNode.addListener(_onAreaFocusChange);
    _areaController.addListener(_onAreaSearchChanged);
    _updateAreaControllerText();
  }

  @override
  void didUpdateWidget(SearchableLocationDropdown oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selectedServiceAreas != oldWidget.selectedServiceAreas) {
      _selectedAreas = List.from(widget.selectedServiceAreas);
      _updateAreaControllerText();
    }
  }

  @override
  void dispose() {
    _areaController.dispose();
    _areaFocusNode.dispose();
    _removeAreaOverlay();
    super.dispose();
  }

  void _updateAreaControllerText() {
    if (_selectedAreas.isEmpty) {
      _areaController.text = '';
    } else if (_selectedAreas.length == 1) {
      _areaController.text = _selectedAreas.first;
    } else {
      _areaController.text = '${_selectedAreas.length} areas selected';
    }
  }

  void _onAreaFocusChange() {
    if (_areaFocusNode.hasFocus) {
      _showAreaOverlay();
    } else {
      Future.delayed(Duration(milliseconds: 150), _removeAreaOverlay);
    }
  }

  void _onAreaSearchChanged() {
    if (_areaFocusNode.hasFocus) {
      final query = _areaController.text.toLowerCase();
      setState(() {
        _filteredAreas = _getAvailableServiceAreas()
            .where((area) => area.toLowerCase().contains(query))
            .toList();
      });
    }
  }

  List<String> _getAvailableServiceAreas() {
    if (widget.selectedDivision == null) {
      return LocationService.getServiceAreaNames();
    }

    if (widget.selectedDistrict == null) {
      return LocationService.getServiceAreasByDivision(
        widget.selectedDivision!,
      );
    }

    return LocationService.getServiceAreasByDivisionAndDistrict(
      widget.selectedDivision!,
      widget.selectedDistrict!,
    );
  }

  void _showAreaOverlay() {
    if (_areaOverlayEntry != null ||
        !widget.showServiceAreas ||
        widget.selectedDivision == null)
      return;

    _filteredAreas = _getAvailableServiceAreas();

    final renderBox = context.findRenderObject() as RenderBox;
    final size = renderBox.size;

    _areaOverlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        width: size.width,
        child: CompositedTransformFollower(
          link: _areaLayerLink,
          showWhenUnlinked: false,
          offset: Offset(0, size.height + 4),
          child: Material(
            elevation: 4,
            child: Container(
              constraints: BoxConstraints(maxHeight: 300),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: _buildAreaDropdownList(),
            ),
          ),
        ),
      ),
    );

    Overlay.of(context)?.insert(_areaOverlayEntry!);
    setState(() => _isAreaDropdownOpen = true);
  }

  void _removeAreaOverlay() {
    if (_areaOverlayEntry != null) {
      _areaOverlayEntry?.remove();
      _areaOverlayEntry = null;
    }
    setState(() => _isAreaDropdownOpen = false);
    _updateAreaControllerText();
  }

  Widget _buildAreaDropdownList() {
    if (_filteredAreas.isEmpty) {
      return Container(
        padding: EdgeInsets.all(16),
        child: Text(
          'No service areas found',
          style: TextStyle(color: Colors.grey),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      itemCount: _filteredAreas.length,
      itemBuilder: (context, index) {
        final area = _filteredAreas[index];
        final isSelected = _selectedAreas.contains(area);

        return ListTile(
          leading: Checkbox(
            value: isSelected,
            onChanged: (value) {
              _toggleAreaSelection(area);
            },
          ),
          title: Text(area),
          onTap: () {
            _toggleAreaSelection(area);
          },
        );
      },
    );
  }

  void _toggleAreaSelection(String area) {
    setState(() {
      if (_selectedAreas.contains(area)) {
        _selectedAreas.remove(area);
      } else {
        _selectedAreas.add(area);
      }
    });
    widget.onServiceAreasChanged(List.from(_selectedAreas));
  }

  void _removeArea(String area) {
    setState(() {
      _selectedAreas.remove(area);
    });
    widget.onServiceAreasChanged(List.from(_selectedAreas));
    _updateAreaControllerText();
  }

  void _clearAllAreas() {
    setState(() {
      _selectedAreas.clear();
    });
    widget.onServiceAreasChanged([]);
    _areaController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Selected Service Areas Chips
        if (widget.showServiceAreas && _selectedAreas.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _selectedAreas.map((area) {
                return Chip(
                  label: Text(area),
                  deleteIcon: Icon(Icons.close, size: 16),
                  onDeleted: () => _removeArea(area),
                );
              }).toList(),
            ),
          ),

        // Service Areas Multi-Select Dropdown
        if (widget.showServiceAreas) _buildServiceAreaDropdown(),

        SizedBox(height: 20),

        // Division Dropdown
        if (widget.showLabels)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              'Division',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
          ),
        _buildSingleSelectDropdown(
          value: widget.selectedDivision,
          items: LocationService.getDivisionNames(),
          hintText: 'Search division...',
          onChanged: (value) {
            widget.onDivisionChanged(value);
            widget.onDistrictChanged(null);
            widget.onThanaChanged(null);
            widget.onServiceAreasChanged([]); // Clear service areas
          },
          enabled: true,
        ),
        SizedBox(height: 20),

        // District Dropdown
        if (widget.showLabels)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              'District',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
          ),
        _buildSingleSelectDropdown(
          value: widget.selectedDistrict,
          items: widget.selectedDivision != null
              ? LocationService.getDistrictNames(widget.selectedDivision!)
              : [],
          hintText: widget.selectedDivision != null
              ? 'Search district...'
              : 'Select division first',
          onChanged: widget.selectedDivision != null
              ? (value) {
                  widget.onDistrictChanged(value);
                  widget.onThanaChanged(null);
                  widget.onServiceAreasChanged([]); // Clear service areas
                }
              : (_) {},
          enabled: widget.selectedDivision != null,
        ),
        SizedBox(height: 20),

        // Thana Dropdown
        if (widget.showLabels)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              'Thana/Police Station',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
          ),
        _buildSingleSelectDropdown(
          value: widget.selectedThana,
          items:
              widget.selectedDivision != null && widget.selectedDistrict != null
              ? LocationService.getStationNames(
                  widget.selectedDivision!,
                  widget.selectedDistrict!,
                )
              : [],
          hintText:
              widget.selectedDivision != null && widget.selectedDistrict != null
              ? 'Search thana...'
              : 'Select district first',
          onChanged:
              widget.selectedDivision != null && widget.selectedDistrict != null
              ? widget.onThanaChanged
              : (_) {},
          enabled:
              widget.selectedDivision != null &&
              widget.selectedDistrict != null,
        ),
      ],
    );
  }

  Widget _buildServiceAreaDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.showLabels)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              'Service Areas',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
          ),

        CompositedTransformTarget(
          link: _areaLayerLink,
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: _isAreaDropdownOpen
                    ? Theme.of(context).primaryColor
                    : Colors.grey.shade300,
                width: _isAreaDropdownOpen ? 2 : 1,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: TextField(
                      controller: _areaController,
                      focusNode: _areaFocusNode,
                      enabled: widget.selectedDivision != null,
                      decoration: InputDecoration(
                        hintText: widget.selectedDivision != null
                            ? 'Search and select service areas...'
                            : 'Select division first',
                        border: InputBorder.none,
                        hintStyle: TextStyle(
                          color: widget.selectedDivision != null
                              ? Colors.grey
                              : Colors.grey.shade400,
                        ),
                      ),
                      style: TextStyle(
                        color: widget.selectedDivision != null
                            ? Colors.black
                            : Colors.grey,
                      ),
                    ),
                  ),
                ),
                if (_selectedAreas.isNotEmpty)
                  IconButton(
                    icon: Icon(Icons.clear_all, size: 18),
                    onPressed: _clearAllAreas,
                    splashRadius: 20,
                  ),
                IconButton(
                  icon: Icon(
                    _isAreaDropdownOpen ? Icons.expand_less : Icons.expand_more,
                    color: widget.selectedDivision != null
                        ? Colors.grey
                        : Colors.grey.shade400,
                  ),
                  onPressed: widget.selectedDivision != null
                      ? () {
                          if (_isAreaDropdownOpen) {
                            _areaFocusNode.unfocus();
                          } else {
                            _areaFocusNode.requestFocus();
                          }
                        }
                      : null,
                  splashRadius: 20,
                ),
              ],
            ),
          ),
        ),

        if (_selectedAreas.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 4.0),
            child: Text(
              'Selected: ${_selectedAreas.length} area(s)',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ),
      ],
    );
  }

  Widget _buildSingleSelectDropdown({
    required String? value,
    required List<String> items,
    required String hintText,
    required ValueChanged<String?> onChanged,
    required bool enabled,
  }) {
    final controller = TextEditingController(text: value ?? '');
    final focusNode = FocusNode();
    OverlayEntry? overlayEntry;
    bool isDropdownOpen = false;
    final layerLink = LayerLink();

    return StatefulBuilder(
      builder: (context, setState) {
        return CompositedTransformTarget(
          link: layerLink,
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: isDropdownOpen
                    ? Theme.of(context).primaryColor
                    : Colors.grey.shade300,
                width: isDropdownOpen ? 2 : 1,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: TextField(
                      controller: controller,
                      focusNode: focusNode,
                      enabled: enabled,
                      decoration: InputDecoration(
                        hintText: hintText,
                        border: InputBorder.none,
                        hintStyle: TextStyle(
                          color: enabled ? Colors.grey : Colors.grey.shade400,
                        ),
                      ),
                      style: TextStyle(
                        color: enabled ? Colors.black : Colors.grey,
                      ),
                      onTap: () {
                        if (enabled && !isDropdownOpen) {
                          // Show dropdown
                        }
                      },
                    ),
                  ),
                ),
                if (value != null && enabled)
                  IconButton(
                    icon: Icon(Icons.clear, size: 18),
                    onPressed: () {
                      controller.clear();
                      onChanged(null);
                    },
                    splashRadius: 20,
                  ),
                IconButton(
                  icon: Icon(
                    Icons.expand_more,
                    color: enabled ? Colors.grey : Colors.grey.shade400,
                  ),
                  onPressed: null,
                  splashRadius: 20,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
