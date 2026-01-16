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

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  customColor?: string;
  className?: string;
}

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
