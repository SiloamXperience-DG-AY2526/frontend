import { Column } from '../DataTable';

interface TableHeaderCellProps<T> {
  column: Column<T>;
}

export default function TableHeaderCell<T>({
  column,
}: TableHeaderCellProps<T>) {
  return (
    <th
      className={
        column.className || 'px-6 py-3 text-left text-sm font-semibold'
      }
    >
      {column.header}
    </th>
  );
}
