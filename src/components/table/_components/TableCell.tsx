import { ReactNode } from 'react';

interface TableCellProps {
  content: ReactNode;
}

export default function TableCell({ content }: TableCellProps) {
  return <td className="px-6 py-4 text-sm">{content}</td>;
}
