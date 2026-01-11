import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
}

export default function BackButton({
  label = 'Back',
  href,
  onClick,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mb-4 text-[#195D4B] hover:text-[#56E0C2] inline-flex items-center gap-2 transition-colors duration-200 active:scale-95 transform"
    >
      <span className="text-lg leading-none">←</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
