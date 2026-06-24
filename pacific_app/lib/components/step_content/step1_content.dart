import 'package:flutter/material.dart';
import '../form_card.dart';
import '../custom_textfield.dart';
import '../custom_datepicker.dart';

class Step1Content extends StatelessWidget {
  final String name;
  final String email;
  final String phone;
  final DateTime dob;
  final String nidNumber;
  final String businessName;
  final String businessDescription;
  final ValueChanged<String> onNameChanged;
  final ValueChanged<String> onEmailChanged;
  final ValueChanged<String> onPhoneChanged;
  final ValueChanged<DateTime> onDobChanged;
  final ValueChanged<String> onNidNumberChanged;
  final ValueChanged<String> onBusinessNameChanged;
  final ValueChanged<String> onBusinessDescriptionChanged;

  const Step1Content({
    Key? key,
    required this.name,
    required this.email,
    required this.phone,
    required this.dob,
    required this.nidNumber,
    required this.businessName,
    required this.businessDescription,
    required this.onNameChanged,
    required this.onEmailChanged,
    required this.onPhoneChanged,
    required this.onDobChanged,
    required this.onNidNumberChanged,
    required this.onBusinessNameChanged,
    required this.onBusinessDescriptionChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          FormCard(
            icon: Icons.person,
            title: 'Personal Information',
            children: [
              CustomTextField(
                label: 'Full Name',
                value: name,
                onChanged: onNameChanged,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter full name';
                  }
                  if (value.length < 3) {
                    return 'Name must be at least 3 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Email',
                value: email,
                onChanged: onEmailChanged,
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter email';
                  }
                  if (!value.contains('@') || !value.contains('.')) {
                    return 'Please enter valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Phone Number',
                value: phone,
                onChanged: onPhoneChanged,
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter phone number';
                  }
                  if (value.length < 11) {
                    return 'Please enter valid phone number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'NID Number',
                value: nidNumber,
                onChanged: onNidNumberChanged,
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter NID number';
                  }
                  if (value.length < 10 || value.length > 17) {
                    return 'NID number must be 10-17 digits';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomDatePicker(
                label: 'Date of Birth',
                value: dob,
                onChanged: onDobChanged,
              ),
            ],
          ),

          const SizedBox(height: 16),

          FormCard(
            icon: Icons.business,
            title: 'Business Information',
            children: [
              CustomTextField(
                label: 'Business Name',
                value: businessName,
                onChanged: onBusinessNameChanged,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter business name';
                  }
                  if (value.length < 3) {
                    return 'Business name must be at least 3 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Business Description',
                value: businessDescription,
                onChanged: onBusinessDescriptionChanged,
                maxLines: 4,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
