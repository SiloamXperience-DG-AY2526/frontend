import { Column } from '../DataTable';
import TableHeaderCell from './TableHeaderCell';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  headerBgColor?: string;
  headerTextColor?: string;
  hideColumnHeaders?: boolean;
}

export default function TableHeader<T>({
  columns,
  headerBgColor = '#195D4B',
  headerTextColor = 'white',
  hideColumnHeaders = false,
}: TableHeaderProps<T>) {
  if (hideColumnHeaders) {
    return null;
  }

  return (
    <thead>
      <tr style={{ backgroundColor: headerBgColor, color: headerTextColor }}>
        {columns.map((column, index) => (
          <TableHeaderCell key={index} column={column} />
        ))}
      </tr>
    </thead>
  );
}
