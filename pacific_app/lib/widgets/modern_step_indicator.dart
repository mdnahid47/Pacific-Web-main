import 'package:flutter/material.dart';
import '../config/app_colors.dart';

class ModernStepIndicator extends StatelessWidget {
  final int currentStep;
  final List<String> steps;
  final ValueChanged<int>? onStepTap;

  const ModernStepIndicator({
    super.key,
    required this.currentStep,
    required this.steps,
    this.onStepTap,
  });

  @override
  Widget build(BuildContext context) {
    final total = steps.length;
    final progress = (currentStep + 1) / total;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border(
          bottom: BorderSide(color: AppColors.border.withValues(alpha: 0.6)),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Row: Step x of y  +  percentage ─────────────────
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Step ${currentStep + 1} of $total',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.text,
                  letterSpacing: -0.1,
                ),
              ),
              Text(
                '${(progress * 100).round()}%',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.olympic,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // ── Progress bar ────────────────────────────────────
          ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: Stack(
              children: [
                Container(height: 6, color: AppColors.border),
                AnimatedFractionallySizedBox(
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeOutCubic,
                  widthFactor: progress,
                  alignment: Alignment.centerLeft,
                  child: Container(
                    height: 6,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppColors.olympic,
                          AppColors.primaryLight,
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // ── Steps row ───────────────────────────────────────
          Row(
            children: List.generate(total, (index) {
              final isCompleted = index < currentStep;
              final isActive = index == currentStep;
              final canTap = onStepTap != null && index < currentStep;

              return Expanded(
                child: GestureDetector(
                  onTap: canTap ? () => onStepTap!(index) : null,
                  behavior: HitTestBehavior.opaque,
                  child: Column(
                    children: [
                      // Circle with number / check
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeOutCubic,
                        width: isActive ? 40 : 34,
                        height: isActive ? 40 : 34,
                        decoration: BoxDecoration(
                          color: isCompleted
                              ? AppColors.success
                              : isActive
                                  ? AppColors.olympic
                                  : AppColors.white,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isCompleted
                                ? AppColors.success
                                : isActive
                                    ? AppColors.olympic
                                    : AppColors.border,
                            width: 1.6,
                          ),
                          boxShadow: isActive
                              ? [
                                  BoxShadow(
                                    color: AppColors.olympic
                                        .withValues(alpha: 0.35),
                                    blurRadius: 14,
                                    offset: const Offset(0, 6),
                                  ),
                                ]
                              : null,
                        ),
                        child: Center(
                          child: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 250),
                            transitionBuilder: (child, anim) =>
                                ScaleTransition(scale: anim, child: child),
                            child: isCompleted
                                ? const Icon(
                                    Icons.check_rounded,
                                    key: ValueKey('check'),
                                    color: Colors.white,
                                    size: 18,
                                  )
                                : Text(
                                    '${index + 1}',
                                    key: ValueKey('num$index'),
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: isActive
                                          ? Colors.white
                                          : AppColors.muted,
                                    ),
                                  ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Label
                      Text(
                        steps[index],
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight:
                              isActive ? FontWeight.w700 : FontWeight.w500,
                          color: isActive
                              ? AppColors.olympic
                              : isCompleted
                                  ? AppColors.text
                                  : AppColors.muted,
                        ),
                      ),
                    ],
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