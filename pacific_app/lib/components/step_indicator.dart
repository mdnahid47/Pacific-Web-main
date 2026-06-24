import 'package:flutter/material.dart';

class StepIndicator extends StatelessWidget {
  final int currentStep;
  final List<String> steps;
  final ValueChanged<int>? onStepTap;
  final Color activeColor;
  final Color inactiveColor;
  final Color completedColor;
  final Color textColor;
  final double stepSize;
  final double lineHeight;

  const StepIndicator({
    Key? key,
    required this.currentStep,
    required this.steps,
    this.onStepTap,
    this.activeColor = const Color(0xFF3c8ce7),
    this.inactiveColor = const Color(0xFFe5e7eb),
    this.completedColor = const Color(0xFF10b981),
    this.textColor = const Color(0xFF6b7280),
    this.stepSize = 36.0,
    this.lineHeight = 2.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(steps.length, (index) {
          final bool isCompleted = index < currentStep;
          final bool isActive = index == currentStep;
          final bool isInactive = index > currentStep;

          return Expanded(
            child: GestureDetector(
              onTap: onStepTap != null && index < currentStep
                  ? () => onStepTap!(index)
                  : null,
              child: Column(
                children: [
                  // Step Line and Circle
                  Row(
                    children: [
                      // Left Line
                      Expanded(
                        child: Container(
                          height: lineHeight,
                          color: _getLeftLineColor(index),
                        ),
                      ),

                      // Step Circle
                      Container(
                        width: stepSize,
                        height: stepSize,
                        decoration: BoxDecoration(
                          color: _getStepColor(index),
                          shape: BoxShape.circle,
                          border: isActive
                              ? Border.all(color: activeColor, width: 2)
                              : null,
                          boxShadow: isActive
                              ? [
                                  BoxShadow(
                                    color: activeColor.withOpacity(0.3),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ]
                              : isCompleted
                              ? [
                                  BoxShadow(
                                    color: completedColor.withOpacity(0.2),
                                    blurRadius: 4,
                                  ),
                                ]
                              : null,
                        ),
                        child: Center(child: _getStepIcon(index)),
                      ),

                      // Right Line
                      Expanded(
                        child: Container(
                          height: lineHeight,
                          color: _getRightLineColor(index),
                        ),
                      ),
                    ],
                  ),

                  // Step Label
                  SizedBox(height: 10),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: isActive
                          ? activeColor.withOpacity(0.1)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Step ${index + 1}',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: _getTextColor(index),
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          steps[index],
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: isActive
                                ? FontWeight.w600
                                : FontWeight.normal,
                            color: _getTextColor(index),
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 2,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  Color _getStepColor(int index) {
    if (index < currentStep) {
      return completedColor;
    } else if (index == currentStep) {
      return Colors.white;
    } else {
      return inactiveColor;
    }
  }

  Color _getLeftLineColor(int index) {
    if (index == 0) return Colors.transparent;
    return index <= currentStep ? completedColor : inactiveColor;
  }

  Color _getRightLineColor(int index) {
    if (index == steps.length - 1) return Colors.transparent;
    return index < currentStep ? completedColor : inactiveColor;
  }

  Color _getTextColor(int index) {
    if (index < currentStep) {
      return completedColor;
    } else if (index == currentStep) {
      return activeColor;
    } else {
      return textColor;
    }
  }

  Widget _getStepIcon(int index) {
    if (index < currentStep) {
      return Icon(Icons.check, color: Colors.white, size: stepSize * 0.4);
    } else if (index == currentStep) {
      return Text(
        '${index + 1}',
        style: TextStyle(
          color: activeColor,
          fontWeight: FontWeight.bold,
          fontSize: stepSize * 0.4,
        ),
      );
    } else {
      return Text(
        '${index + 1}',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: stepSize * 0.4,
        ),
      );
    }
  }
}

// Optional: Anim ated Version
class AnimatedStepIndicator extends StatefulWidget {
  final int currentStep;
  final List<String> steps;
  final ValueChanged<int>? onStepTap;

  const AnimatedStepIndicator({
    Key? key,
    required this.currentStep,
    required this.steps,
    this.onStepTap,
  }) : super(key: key);

  @override
  _AnimatedStepIndicatorState createState() => _AnimatedStepIndicatorState();
}

class _AnimatedStepIndicatorState extends State<AnimatedStepIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
    _controller.forward();
  }

  @override
  void didUpdateWidget(AnimatedStepIndicator oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentStep != widget.currentStep) {
      _controller.reset();
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return StepIndicator(
          currentStep: widget.currentStep,
          steps: widget.steps,
          onStepTap: widget.onStepTap,
        );
      },
    );
  }
}

// Compact Version
class CompactStepIndicator extends StatelessWidget {
  final int currentStep;
  final int totalSteps;

  const CompactStepIndicator({
    Key? key,
    required this.currentStep,
    required this.totalSteps,
    required List<String> steps,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Progress Text
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Step ${currentStep + 1} of $totalSteps',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF3c8ce7),
                ),
              ),
              Text(
                '${((currentStep + 1) / totalSteps * 100).toInt()}%',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF3c8ce7),
                ),
              ),
            ],
          ),

          SizedBox(height: 12),

          // Progress Bar
          Container(
            height: 6,
            decoration: BoxDecoration(
              color: Color(0xFFe5e7eb),
              borderRadius: BorderRadius.circular(3),
            ),
            child: Stack(
              children: [
                // Background
                Container(
                  height: 6,
                  decoration: BoxDecoration(
                    color: Color(0xFFe5e7eb),
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),

                // Progress
                LayoutBuilder(
                  builder: (context, constraints) {
                    double progress = (currentStep + 1) / totalSteps;
                    return AnimatedContainer(
                      duration: Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                      width: constraints.maxWidth * progress,
                      height: 6,
                      decoration: BoxDecoration(
                        color: Color(0xFF3c8ce7),
                        borderRadius: BorderRadius.circular(3),
                        gradient: LinearGradient(
                          colors: [
                            Color(0xFF3c8ce7),
                            Color(0xFF3c8ce7).withOpacity(0.8),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          // Step Dots
          SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(totalSteps, (index) {
              final bool isCompleted = index <= currentStep;
              return Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isCompleted ? Color(0xFF3c8ce7) : Color(0xFFe5e7eb),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: isCompleted
                      ? Icon(Icons.check, color: Colors.white, size: 14)
                      : Text(
                          '${index + 1}',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
