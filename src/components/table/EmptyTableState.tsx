interface EmptyTableStateProps {
  message?: string;
  colSpan?: number;
}

function EmptyTableState({
  message = 'No data found',
  colSpan = 7,
}: EmptyTableStateProps) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="px-6 py-8 text-center text-gray-500">
          {message}
        </td>
      </tr>
    </tbody>
  );
}

export default EmptyTableState;
