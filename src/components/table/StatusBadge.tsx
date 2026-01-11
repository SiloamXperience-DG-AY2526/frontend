/**
 * Predefined color variants for the StatusBadge component
 */
type BadgeVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'neutral'
  | 'primary';

/**
 * Props for the StatusBadge component
 */
interface StatusBadgeProps {
  /** The text content to display in the badge */
  label: string;
  /** Predefined color variant (e.g., 'success', 'error'). Overridden by customColor if provided. */
  variant?: BadgeVariant;
  /** Custom Tailwind background color class (e.g., 'bg-purple-500'). Takes precedence over variant. */
  customColor?: string;
  /** Additional CSS classes to apply to the badge */
  className?: string;
}

/**
 * A flexible badge component for displaying status, labels, or tags with various color schemes.
 * Supports predefined color variants or custom colors via Tailwind classes.
 *
 * @example
 * ```tsx
 * // Using predefined variants
 * <StatusBadge label="Active" variant="success" />
 * <StatusBadge label="Pending" variant="warning" />
 * <StatusBadge label="Error" variant="error" />
 *
 * // Using custom colors
 * <StatusBadge label="Custom" customColor="bg-purple-500" />
 *
 * // With additional classes
 * <StatusBadge label="Large" variant="info" className="text-sm px-4 py-2" />
 * ```
 */
function StatusBadge({
  label,
  variant = 'neutral',
  customColor,
  className = '',
}: StatusBadgeProps) {
  const colorClass = customColor || getVariantColor(variant);
  const badgeClassName =
    `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass} text-white ${className}`.trim();

  return <span className={badgeClassName}>{label}</span>;
}

/**
 * Maps badge variants to their corresponding Tailwind background color classes
 */
function getVariantColor(variant: BadgeVariant): string {
  const variantColors: Record<BadgeVariant, string> = {
    success: 'bg-[#56E0C2]',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-400',
    primary: 'bg-indigo-600',
  };

  return variantColors[variant];
}

export default StatusBadge;
export type { StatusBadgeProps, BadgeVariant };
