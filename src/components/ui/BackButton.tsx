import { useRouter } from 'next/navigation';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

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
      className="group mb-4 px-4 py-2.5 bg-white border-2 border-[#195D4B] text-[#195D4B] hover:bg-[#195D4B] hover:text-[#195D4B] rounded-lg shadow-sm hover:shadow-md inline-flex items-center gap-2 transition-all duration-200 ease-in-out active:scale-95 transform focus:outline-none focus:ring-2 focus:ring-[#56E0C2] focus:ring-offset-2"
    >
      <ArrowLeftStartOnRectangleIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="font-semibold">{label}</span>
    </button>
  );
}
