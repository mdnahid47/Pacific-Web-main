import 'package:flutter/material.dart';

class SearchableDropdown extends StatefulWidget {
  final String? value;
  final List<String> selectedValues;
  final List<String> items;
  final String hintText;
  final ValueChanged<String?>? onChanged;
  final ValueChanged<List<String>>? onMultiChanged;
  final bool enabled;
  final bool showClearButton;
  final bool isMultiSelect;
  final EdgeInsets? contentPadding;
  final bool showSelectedChips;

  const SearchableDropdown({
    super.key,
    this.value,
    this.selectedValues = const [],
    required this.items,
    required this.hintText,
    this.onChanged,
    this.onMultiChanged,
    this.enabled = true,
    this.showClearButton = true,
    this.isMultiSelect = false,
    this.contentPadding,
    this.showSelectedChips = true,
  }) : assert(
         !isMultiSelect || onMultiChanged != null,
         'onMultiChanged is required for multi-select mode',
       ),
       // Remove or modify the assertion for single-select mode to be more flexible
       // We'll handle the case where onChanged might be null gracefully
       super();

  @override
  _SearchableDropdownState createState() => _SearchableDropdownState();
}

class _SearchableDropdownState extends State<SearchableDropdown> {
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  OverlayEntry? _overlayEntry;
  List<String> _filteredItems = [];
  List<String> _selectedMultiItems = [];
  bool _isDropdownOpen = false;
  final LayerLink _layerLink = LayerLink();

  @override
  void initState() {
    super.initState();

    if (widget.isMultiSelect) {
      _selectedMultiItems = List.from(widget.selectedValues);
      _controller.text = _selectedMultiItems.isNotEmpty
          ? '${_selectedMultiItems.length} selected'
          : '';
    } else {
      _controller.text = widget.value ?? '';
    }

    _filteredItems = widget.items;

    _focusNode.addListener(() {
      if (_focusNode.hasFocus) {
        _showOverlay();
      } else {
        Future.delayed(Duration(milliseconds: 150), _removeOverlay);
      }
    });

    _controller.addListener(_onSearchChanged);
  }

  @override
  void didUpdateWidget(SearchableDropdown oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (widget.isMultiSelect) {
      if (widget.selectedValues != oldWidget.selectedValues) {
        _selectedMultiItems = List.from(widget.selectedValues);
        _updateControllerText();
      }
    } else {
      if (widget.value != oldWidget.value) {
        _controller.text = widget.value ?? '';
      }
    }
  }

  void _updateControllerText() {
    if (_selectedMultiItems.isEmpty) {
      _controller.text = '';
    } else if (_selectedMultiItems.length == 1) {
      _controller.text = _selectedMultiItems.first;
    } else {
      _controller.text = '${_selectedMultiItems.length} selected';
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _removeOverlay();
    super.dispose();
  }

  void _onSearchChanged() {
    if (_focusNode.hasFocus) {
      final query = _controller.text.toLowerCase();
      setState(() {
        _filteredItems = widget.items
            .where((item) => item.toLowerCase().contains(query))
            .toList();
      });
    }
  }

  void _showOverlay() {
    if (_overlayEntry != null || !widget.enabled) return;

    final renderBox = context.findRenderObject() as RenderBox;
    final size = renderBox.size;

    _overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        width: size.width,
        child: CompositedTransformFollower(
          link: _layerLink,
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
              child: _buildDropdownList(),
            ),
          ),
        ),
      ),
    );

    Overlay.of(context)?.insert(_overlayEntry!);
    setState(() => _isDropdownOpen = true);
  }

  void _removeOverlay() {
    if (_overlayEntry != null) {
      _overlayEntry?.remove();
      _overlayEntry = null;
    }
    setState(() => _isDropdownOpen = false);
    if (widget.isMultiSelect) {
      _updateControllerText();
    }
  }

  Widget _buildDropdownList() {
    if (_filteredItems.isEmpty) {
      return Container(
        padding: EdgeInsets.all(16),
        child: Text('No results found', style: TextStyle(color: Colors.grey)),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      itemCount: _filteredItems.length,
      itemBuilder: (context, index) {
        final item = _filteredItems[index];

        if (widget.isMultiSelect) {
          final isSelected = _selectedMultiItems.contains(item);
          return _buildMultiSelectItem(item, isSelected);
        } else {
          final isSelected = item == widget.value;
          return _buildSingleSelectItem(item, isSelected);
        }
      },
    );
  }

  Widget _buildMultiSelectItem(String item, bool isSelected) {
    return ListTile(
      leading: Checkbox(
        value: isSelected,
        onChanged: (value) {
          _toggleMultiItem(item);
        },
      ),
      title: Text(item),
      onTap: () {
        _toggleMultiItem(item);
      },
    );
  }

  Widget _buildSingleSelectItem(String item, bool isSelected) {
    return ListTile(
      title: Text(item),
      tileColor: isSelected ? Colors.blue.shade50 : null,
      selected: isSelected,
      onTap: () {
        _selectSingleItem(item);
      },
    );
  }

  void _toggleMultiItem(String item) {
    setState(() {
      if (_selectedMultiItems.contains(item)) {
        _selectedMultiItems.remove(item);
      } else {
        _selectedMultiItems.add(item);
      }
    });

    // Only call onMultiChanged if it's provided
    if (widget.onMultiChanged != null) {
      widget.onMultiChanged!(List.from(_selectedMultiItems));
    }
  }

  void _selectSingleItem(String item) {
    _controller.text = item;

    // Only call onChanged if it's provided
    if (widget.onChanged != null) {
      widget.onChanged!(item);
    }

    _focusNode.unfocus();
  }

  void _clearSelection() {
    if (widget.isMultiSelect) {
      setState(() {
        _selectedMultiItems.clear();
      });

      // Only call onMultiChanged if it's provided
      if (widget.onMultiChanged != null) {
        widget.onMultiChanged!([]);
      }

      _controller.clear();
    } else {
      _controller.clear();

      // Only call onChanged if it's provided
      if (widget.onChanged != null) {
        widget.onChanged!(null);
      }
    }
    _focusNode.unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Selected Chips for Multi-Select
        if (widget.isMultiSelect &&
            _selectedMultiItems.isNotEmpty &&
            widget.showSelectedChips)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _selectedMultiItems.map((item) {
                return Chip(
                  label: Text(item),
                  deleteIcon: Icon(Icons.close, size: 16),
                  onDeleted: () {
                    _toggleMultiItem(item);
                  },
                );
              }).toList(),
            ),
          ),

        // Search Input with Dropdown
        CompositedTransformTarget(
          link: _layerLink,
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: _isDropdownOpen
                    ? Theme.of(context).primaryColor
                    : Colors.grey.shade300,
                width: _isDropdownOpen ? 2 : 1,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Padding(
                    padding:
                        widget.contentPadding ??
                        EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    child: TextField(
                      controller: _controller,
                      focusNode: _focusNode,
                      enabled: widget.enabled,
                      readOnly:
                          !widget.enabled ||
                          (widget.isMultiSelect &&
                              widget.onMultiChanged == null) ||
                          (!widget.isMultiSelect && widget.onChanged == null),
                      decoration: InputDecoration(
                        hintText: widget.hintText,
                        border: InputBorder.none,
                        hintStyle: TextStyle(
                          color: widget.enabled
                              ? Colors.grey
                              : Colors.grey.shade400,
                        ),
                      ),
                      style: TextStyle(
                        color: widget.enabled ? Colors.black : Colors.grey,
                      ),
                    ),
                  ),
                ),
                if (widget.showClearButton &&
                    ((widget.isMultiSelect && _selectedMultiItems.isNotEmpty) ||
                        (!widget.isMultiSelect && widget.value != null)) &&
                    widget.enabled)
                  IconButton(
                    icon: Icon(Icons.clear, size: 18),
                    onPressed: _clearSelection,
                    splashRadius: 20,
                  ),
                IconButton(
                  icon: Icon(
                    _isDropdownOpen ? Icons.expand_less : Icons.expand_more,
                    color: widget.enabled ? Colors.grey : Colors.grey.shade400,
                  ),
                  onPressed: widget.enabled
                      ? () {
                          if (_isDropdownOpen) {
                            _focusNode.unfocus();
                          } else {
                            _focusNode.requestFocus();
                          }
                        }
                      : null,
                  splashRadius: 20,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
