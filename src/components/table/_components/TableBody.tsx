import { Column } from '../DataTable';
import EmptyTableState from '../EmptyTableState';
import TableRow from './TableRow';

interface TableBodyProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage: string;
  getRowKey: (item: T) => string;
  getRowClassName?: (item: T, index: number) => string;
}

export default function TableBody<T>({
  columns,
  data,
  emptyMessage,
  getRowKey,
  getRowClassName,
}: TableBodyProps<T>) {
  if (data.length === 0) {
    return <EmptyTableState message={emptyMessage} colSpan={columns.length} />;
  }

  return (
    <tbody>
      {data.map((item, index) => (
        <TableRow
          key={getRowKey(item)}
          item={item}
          index={index}
          columns={columns}
          getRowClassName={getRowClassName}
        />
      ))}
    </tbody>
  );
}
