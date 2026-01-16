import { Column } from '../DataTable';
import TableCell from './TableCell';

interface TableRowProps<T> {
  item: T;
  index: number;
  columns: Column<T>[];
  getRowClassName?: (item: T, index: number) => string;
}

export default function TableRow<T>({
  item,
  index,
  columns,
  getRowClassName,
}: TableRowProps<T>) {
  const className = getRowClassName
    ? getRowClassName(item, index)
    : getDefaultRowClassName(index);

  return (
    <tr className={className}>
      {columns.map((column, colIndex) => (
        <TableCell key={colIndex} content={column.accessor(item)} />
      ))}
    </tr>
  );
}

function getDefaultRowClassName(index: number): string {
  const isEvenRow = index % 2 === 0;
  const bgColor = isEvenRow ? 'bg-white' : 'bg-gray-50';
  return `${bgColor} hover:bg-gray-100 transition`;
}
