export default function SectionTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={[
        'text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4',
        className,
      ].join(' ')}
    >
      {children}
    </h2>
  );
}
