export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-teal-700 tracking-tight">
        {title}
      </h2>
      <div className="mt-2 text-sm md:text-[15px] text-gray-700 leading-6">
        {children}
      </div>
    </section>
  );
}