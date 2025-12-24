interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}

export default function Button({
  label,
  onClick,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-8 py-3 rounded-md font-semibold transition
        ${
          variant === "primary"
            ? "bg-gray-100 text-black hover:bg-gray-200"
            : "text-black hover:underline"
        }
      `}
    >
      {label}
    </button>
  );
}
