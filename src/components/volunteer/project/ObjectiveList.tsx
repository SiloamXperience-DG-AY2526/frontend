import TargetIcon from '@/components/icons/TargetIcon';

export default function ObjectiveList({ text }: { text: string }) {
  const items = text
    .split('\n')
    .map((i) => i.replace(/^•\s*/, '').trim())
    .filter(Boolean);

  return (
    <ul className="mt-4 space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <TargetIcon className="mt-0.5 shrink-0" />
          <span className="text-sm md:text-[15px] text-gray-800 leading-6">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
