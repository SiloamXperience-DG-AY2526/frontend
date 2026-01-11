import { ReactNode } from 'react';
import LoadingState from './LoadingTableState';
import TableContainer from './_components/TableContainer';
import Table from './_components/Table';
import TableHeader from './_components/TableHeader';
import TableBody from './_components/TableBody';

/**
 * Column configuration for the DataTable
 * @template T - The type of data being displayed in the table
 */
export interface Column<T> {
  /** The header text to display for this column */
  header: string;
  /** Function that returns the content to render for this column given a data item */
  accessor: (item: T) => ReactNode;
  /** Optional CSS class name to apply to cells in this column */
  className?: string;
}

/**
 * Props for the DataTable component
 * @template T - The type of data being displayed in the table
 */
interface DataTableProps<T> {
  /** Array of column configurations defining the table structure */
  columns: Column<T>[];
  /** Array of data items to display in the table */
  data: T[];
  /** Whether the table is in a loading state (shows loading spinner) */
  loading?: boolean;
  /** Message to display when the data array is empty */
  emptyMessage?: string;
  /** Function that returns a unique key for each row (required for React rendering) */
  getRowKey: (item: T) => string;
  /** Optional function that returns CSS class name(s) for a row based on the item and index */
  getRowClassName?: (item: T, index: number) => string;
}

/**
 * A reusable, generic data table component that displays data in a structured table format.
 * Supports loading states, empty states, custom row styling, and flexible column configuration.
 *
 * @template T - The type of data items being displayed
 * @param props - DataTableProps configuration object
 * @returns A rendered table with the specified columns and data
 *
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   status: 'active' | 'inactive';
 * }
 *
 * const columns: Column<User>[] = [
 *   { header: 'Name', accessor: (user) => user.name },
 *   { header: 'Email', accessor: (user) => user.email },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   loading={isLoading}
 *   // Required: Returns unique identifier for React's key prop
 *   getRowKey={(user) => user.id}
 *   // Optional: Conditionally applies CSS classes to rows
 *   getRowClassName={(user, index) =>
 *     user.status === 'active' ? 'bg-green-50' : 'bg-gray-50'
 *   }
 * />
 * ```
 */
export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  getRowKey,
  getRowClassName,
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingState />;
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader columns={columns} />
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
