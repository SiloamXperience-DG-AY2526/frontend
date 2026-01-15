export default function InfoRow({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#195D4B]">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span>{text}</span>
    </div>
  );
}
