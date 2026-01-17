import { Manager } from '@/types/Managers';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import EditButton from '@/components/ui/EditButton';
import { useState } from 'react';
import ManagerStatusDialog from './ManagerStatusDialog';


interface ManagersDataTableProps {
  managers: Manager[];
  loading: boolean;
  onRefresh: () => void;
}

export default function ManagersDataTable({
  managers,
  loading,
  onRefresh,
}: ManagersDataTableProps) {
  const [selected, setSelected] = useState<Manager | null>(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStatusChange = async (manager: Manager, activate: boolean) => {
    if (!manager.id) return;

    setUpdating(true);
    try {
      const url = activate
        ? `/api/managers/activate/${manager.id}`
        : `/api/managers/deactivate/${manager.id}`;

      const res = await fetch(url, { method: 'PUT' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      setSuccessMessage(data.message || 'Status updated successfully');
      onRefresh();
      setSelected(null); 
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update manager status:', err);
      alert('Failed to update manager status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const columns: Column<Manager>[] = [
    {
      header: 'Manager Name',
      accessor: (manager) => manager.name,
    },
    {
      header: 'Projects',
      accessor: (manager) => manager.projects.join(', '),
    },
    {
      header: 'Role',
      accessor: (manager) => manager.role,
    },
    {
      header: 'Email',
      accessor: (manager) => manager.email,
    },
    {
      header: 'Status',
      accessor: (manager) => (
        <StatusBadge
          label={manager.status}
          variant={manager.status ? 'success' : 'neutral'}
        />
      ),
    },
    {
      header: '',
      accessor: (manager) => (
        <EditButton
          onClick={() => setSelected(manager)}
          ariaLabel="Edit manager"
        />
      ),
    },
  ];

  return (
    <>
      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-800 border border-green-200">
          {successMessage}
        </div>
      )}

      <DataTable
        columns={columns}
        data={managers}
        loading={loading}
        emptyMessage="No managers found"
        getRowKey={(m) => m.id}
      />

      {selected && (
        <ManagerStatusDialog
          manager={selected}
          updating={updating}
          onClose={() => setSelected(null)}
          onActivate={() => handleStatusChange(selected, true)}
          onDeactivate={() => handleStatusChange(selected, false)}
        />
      )}
    </>
  );
}
