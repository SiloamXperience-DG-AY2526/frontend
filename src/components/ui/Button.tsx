interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({
  label,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 rounded-xl font-bold text-sm transition cursor-pointer shadow-sm
        ${
    variant === 'primary'
      ? 'bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] text-white hover:from-[#1A6A59] hover:to-[#22997F]'
      : 'text-black hover:underline'
    }
      `}
    >
      {label}
    </button>
  );
}
