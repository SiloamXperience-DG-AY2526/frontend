import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export default function Table({ children }: TableProps) {
  return <table className="w-full">{children}</table>;
}
