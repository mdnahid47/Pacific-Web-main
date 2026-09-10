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
  });

  @override
  State<SearchableDropdown> createState() => _SearchableDropdownState();
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
    _selectedMultiItems = List.from(widget.selectedValues);
    _controller.text = widget.value ?? '';
    _filteredItems = List.from(widget.items); // ✅ Copy the list

    print('🔍 SearchableDropdown init: ${widget.hintText}');
    print('   Items count: ${widget.items.length}');
    print('   Items: ${widget.items.take(3).toList()}...');

    _focusNode.addListener(() {
      if (_focusNode.hasFocus && widget.enabled) {
        _showOverlay();
      } else {
        Future.delayed(const Duration(milliseconds: 200), () {
          if (!_focusNode.hasFocus) {
            _removeOverlay();
          }
        });
      }
    });

    _controller.addListener(_filterItems);
  }

  @override
  void didUpdateWidget(SearchableDropdown oldWidget) {
    super.didUpdateWidget(oldWidget);
    
    // ✅ CRITICAL FIX: Update items when they change
    if (widget.items != oldWidget.items) {
      print('🔄 SearchableDropdown items updated: ${widget.hintText}');
      print('   New items count: ${widget.items.length}');
      print('   New items: ${widget.items.take(3).toList()}...');
      
      _filteredItems = List.from(widget.items);
      if (_controller.text.isNotEmpty) {
        final query = _controller.text.toLowerCase();
        _filteredItems = widget.items
            .where((item) => item.toLowerCase().contains(query))
            .toList();
      }
      setState(() {});
    }
    
    if (widget.value != oldWidget.value && !widget.isMultiSelect) {
      _controller.text = widget.value ?? '';
    }
    
    if (widget.selectedValues != oldWidget.selectedValues && widget.isMultiSelect) {
      _selectedMultiItems = List.from(widget.selectedValues);
      _updateMultiControllerText();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _removeOverlay();
    super.dispose();
  }

  void _filterItems() {
    final query = _controller.text.toLowerCase();
    setState(() {
      _filteredItems = widget.items
          .where((item) => item.toLowerCase().contains(query))
          .toList();
    });
  }

  void _updateMultiControllerText() {
    if (_selectedMultiItems.isEmpty) {
      _controller.text = '';
    } else if (_selectedMultiItems.length == 1) {
      _controller.text = _selectedMultiItems.first;
    } else {
      _controller.text = '${_selectedMultiItems.length} selected';
    }
  }

  void _showOverlay() {
    if (_overlayEntry != null) return;

    print('📂 Opening dropdown: ${widget.hintText}');
    print('   Filtered items count: ${_filteredItems.length}');

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
            elevation: 8,
            child: Container(
              constraints: const BoxConstraints(maxHeight: 300),
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

    Overlay.of(context).insert(_overlayEntry!);
    setState(() => _isDropdownOpen = true);
  }

  void _removeOverlay() {
    if (_overlayEntry != null) {
      _overlayEntry?.remove();
      _overlayEntry = null;
    }
    setState(() => _isDropdownOpen = false);
  }

  Widget _buildDropdownList() {
    if (_filteredItems.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        child: Center(
          child: Text(
            'No results found',
            style: TextStyle(color: Colors.grey[600]),
          ),
        ),
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
        onChanged: (value) => _toggleMultiItem(item),
      ),
      title: Text(item),
      selected: isSelected,
      onTap: () => _toggleMultiItem(item),
    );
  }

  Widget _buildSingleSelectItem(String item, bool isSelected) {
    return ListTile(
      title: Text(item),
      tileColor: isSelected ? Colors.blue.shade50 : null,
      selected: isSelected,
      onTap: () {
        _controller.text = item;
        if (widget.onChanged != null) {
          widget.onChanged!(item);
        }
        _focusNode.unfocus();
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
      _updateMultiControllerText();
    });
    
    if (widget.onMultiChanged != null) {
      widget.onMultiChanged!(List.from(_selectedMultiItems));
    }
  }

  void _clearSelection() {
    if (widget.isMultiSelect) {
      setState(() {
        _selectedMultiItems.clear();
        _controller.clear();
      });
      if (widget.onMultiChanged != null) {
        widget.onMultiChanged!([]);
      }
    } else {
      _controller.clear();
      if (widget.onChanged != null) {
        widget.onChanged!(null);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.isMultiSelect && _selectedMultiItems.isNotEmpty && widget.showSelectedChips)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _selectedMultiItems.map((item) {
                return Chip(
                  label: Text(item),
                  deleteIcon: const Icon(Icons.close, size: 16),
                  onDeleted: () => _toggleMultiItem(item),
                );
              }).toList(),
            ),
          ),

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
                    padding: widget.contentPadding ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: TextField(
                      controller: _controller,
                      focusNode: _focusNode,
                      enabled: widget.enabled,
                      decoration: InputDecoration(
                        hintText: widget.hintText,
                        border: InputBorder.none,
                        hintStyle: TextStyle(
                          color: widget.enabled ? Colors.grey : Colors.grey.shade400,
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
                     (!widget.isMultiSelect && widget.value != null && widget.value!.isNotEmpty)) &&
                    widget.enabled)
                  IconButton(
                    icon: const Icon(Icons.clear, size: 18),
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