import { ReactNode } from 'react';
import LoadingState from './LoadingTableState';
import TableContainer from './_components/TableContainer';
import Table from './_components/Table';
import TableHeader from './_components/TableHeader';
import TableBody from './_components/TableBody';

export interface Column<T> {
  header: string;
  accessor: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  getRowKey: (item: T) => string;
  getRowClassName?: (item: T, index: number) => string;
  tableTitle?: string;
  tableTitleBgColor?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  hideColumnHeaders?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  getRowKey,
  getRowClassName,
  tableTitle,
  tableTitleBgColor = '#4A8B9B',
  headerBgColor,
  headerTextColor,
  hideColumnHeaders = false,
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingState />;
  }

  return (
    <TableContainer>
      <Table>
        {tableTitle && (
          <thead>
            <tr>
              <th
                colSpan={columns.length}
                className="text-white px-6 py-3 text-left"
                style={{ backgroundColor: tableTitleBgColor }}
              >
                <h2 className="text-2xl font-bold">{tableTitle}</h2>
              </th>
            </tr>
          </thead>
        )}
        <TableHeader
          columns={columns}
          headerBgColor={headerBgColor}
          headerTextColor={headerTextColor}
          hideColumnHeaders={hideColumnHeaders}
        />
        <TableBody
          columns={columns}
          data={data}
          emptyMessage={emptyMessage}
          getRowKey={getRowKey}
          getRowClassName={getRowClassName}
        />
      </Table>
    </TableContainer>
  );
}
