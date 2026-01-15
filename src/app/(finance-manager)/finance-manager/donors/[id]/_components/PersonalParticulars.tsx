import { DonorDetail } from '@/types/DonorData';
import DataTable, { Column } from '@/components/table/DataTable';
import { formatDate } from '@/lib/formatDate';

interface PersonalParticularsProps {
  donor: DonorDetail;
}

interface PersonalField {
  label: string;
  value: string;
}

export default function PersonalParticulars({
  donor,
}: PersonalParticularsProps) {
  const personalFields: PersonalField[] = [
    { label: 'Full Name', value: donor.fullName },
    { label: 'Prefix Title', value: donor.prefixTitle },
    { label: 'Birthday', value: formatDate(donor.birthday) },
    { label: 'Gender', value: donor.gender },
    { label: 'Occupation', value: donor.occupation },
    { label: 'Nationality', value: donor.nationality },
    { label: 'Phone Number', value: donor.phoneNumber },
    {
      label: 'Preferred Communication Method',
      value: donor.preferredCommunicationMethod,
    },
  ];

  const columns: Column<PersonalField>[] = [
    {
      header: '',
      accessor: (field) => (
        <span className="font-bold text-gray-700">{field.label}</span>
      ),
      className: 'w-1/3',
    },
    {
      header: '',
      accessor: (field) => <span className="text-gray-900">{field.value}</span>,
      className: 'w-2/3',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      <DataTable
        tableTitle="Personal Particulars"
        tableTitleBgColor="#2C89A5"
        hideColumnHeaders={true}
        columns={columns}
        data={personalFields}
        emptyMessage="No personal information available"
        getRowKey={(field) => field.label}
      />
    </div>
  );
}
