export default function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={[
        "text-3xl font-bold text-gray-700 underline underline-offset-4 mb-6",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}
