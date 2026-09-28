import 'package:flutter/material.dart';
import '../form_card.dart';
import '../../screens/registration/widgets/custom_textfield.dart';
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
    super.key,
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
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      child: Column(
        children: [
          FormCard(
            icon: Icons.person_outline_rounded,
            title: 'Personal Information',
            description: 'Tell us who you are',
            children: [
              CustomTextField(
                label: 'Full Name',
                value: name,
                onChanged: onNameChanged,
                hintText: 'e.g. Rahim Uddin',
                textInputAction: TextInputAction.next,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please enter full name';
                  if (v.length < 3) return 'Name must be at least 3 characters';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Email',
                value: email,
                onChanged: onEmailChanged,
                hintText: 'you@example.com',
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please enter email';
                  if (!v.contains('@') || !v.contains('.')) {
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
                hintText: '01XXXXXXXXX',
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please enter phone number';
                  if (v.length < 11) return 'Please enter valid phone number';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'NID Number',
                value: nidNumber,
                onChanged: onNidNumberChanged,
                hintText: '10–17 digits',
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.next,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please enter NID number';
                  if (v.length < 10 || v.length > 17) {
                    return 'NID number must be 10–17 digits';
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
            icon: Icons.business_outlined,
            title: 'Business Information',
            description: 'About your business',
            children: [
              CustomTextField(
                label: 'Business Name',
                value: businessName,
                onChanged: onBusinessNameChanged,
                hintText: 'e.g. Pacific Home Services',
                textInputAction: TextInputAction.next,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please enter business name';
                  if (v.length < 3) {
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
                hintText: 'What services do you offer?',
                maxLines: 4,
              ),
            ],
          ),
        ],
      ),
    );
  }
}