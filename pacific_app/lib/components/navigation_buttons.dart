import 'package:flutter/material.dart';

class NavigationButtons extends StatelessWidget {
  final int currentStep;
  final int totalSteps;
  final bool isLoading;
  final VoidCallback onPrevious;
  final VoidCallback onNext;
  final VoidCallback? onSubmit;

  const NavigationButtons({
    Key? key,
    required this.currentStep,
    this.totalSteps = 5,
    required this.isLoading,
    required this.onPrevious,
    required this.onNext,
    this.onSubmit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade300)),
      ),
      child: Row(
        children: [
          // Back Button
          if (currentStep > 0)
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onPrevious,
                icon: Icon(Icons.arrow_back, size: 20),
                label: Text(
                  'Back',
                  style: TextStyle(color: Theme.of(context).primaryColor),
                ),
                style: OutlinedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  side: BorderSide(color: Theme.of(context).primaryColor),
                ),
              ),
            ),

          if (currentStep > 0) SizedBox(width: 12),

          // Next/Submit Button
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () {
                if (isLoading) return;

                if (currentStep == totalSteps - 1) {
                  // Submit button
                  if (onSubmit != null) {
                    onSubmit!(); // Call if not null
                  }
                } else {
                  // Next button
                  onNext();
                }
              },
              icon: currentStep == totalSteps - 1
                  ? (isLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.white,
                              ),
                            ),
                          )
                        : Icon(Icons.check_circle, size: 20))
                  : Icon(Icons.arrow_forward, size: 20),
              label: Text(
                currentStep == totalSteps - 1
                    ? (isLoading ? 'Submitting...' : 'Submit')
                    : 'Next',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: currentStep == totalSteps - 1
                    ? Color(0xFF10b981) // Green
                    : Theme.of(context).primaryColor, // Blue
                padding: EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
