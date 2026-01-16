interface LoadingTableStateProps {
  message?: string;
}

function LoadingTableState({ message = 'Loading...' }: LoadingTableStateProps) {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="p-8 text-center text-gray-500">{message}</div>
    </div>
  );
}

export default LoadingTableState;
