import { Column } from '../DataTable';
import TableHeaderCell from './TableHeaderCell';

interface TableHeaderProps<T> {
  columns: Column<T>[];
}

export default function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead>
      <tr className="bg-[#195D4B] text-white">
        {columns.map((column, index) => (
          <TableHeaderCell key={index} column={column} />
        ))}
      </tr>
    </thead>
  );
}
