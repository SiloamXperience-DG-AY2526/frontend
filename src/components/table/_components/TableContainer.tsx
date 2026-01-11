import { ReactNode } from 'react';

interface TableContainerProps {
  children: ReactNode;
}

export default function TableContainer({ children }: TableContainerProps) {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
