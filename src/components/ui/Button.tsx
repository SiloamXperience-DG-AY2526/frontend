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
        px-8 py-3 rounded-md font-medium transition cursor-pointer
        ${
          variant === "primary"
            ? "bg-[#195D4B] text-white hover:bg-green-800"
            : "text-black hover:underline"
        }
      `}
    >
      {label}
    </button>
  );
}
