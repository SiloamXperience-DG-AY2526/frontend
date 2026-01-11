interface PageHeaderProps {
  title: string;
  subtitle?: string;
  highlightTitle?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  highlightTitle = true,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start gap-3">
      <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
      <div>
        <h1 className="text-2xl font-bold">
          {highlightTitle ? (
            <span className="bg-yellow-300 px-1">{title}</span>
          ) : (
            title
          )}
        </h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
