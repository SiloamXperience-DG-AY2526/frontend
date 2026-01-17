'use client';

import Input from '@/components/ui/Input';
import RadioGroup from '@/components/ui/RadioGroup';
import { useState } from 'react';
type Prefix = 'Mr.' | 'Ms.' | 'Mrs.' | 'Mx.' | 'Dr.' | 'Rev.' | 'Prefer not to say' ;

export default function AddManagerDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess:  () => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');  
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const consolidatedErrors = fieldErrors
  ? Object.values(fieldErrors).flat()
  : [];
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPrefix('');
    setEmail('');
    setPassword('');
    setRole('');
    setError(null);
  };

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/managers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          title: prefix || undefined,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors?.fieldErrors) {
          setFieldErrors(data.errors.fieldErrors);
          setError(data.message || 'Invalid input');
        } else {
          setError(data.error || 'Failed to create manager');
        }
        return;
      }

      onSuccess();
      resetForm();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="w-[820px] max-h-[85vh] rounded-lg bg-white p-8 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Add a manager</h2>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-5">
            <Input label="First Name *" value={firstName} onChange={setFirstName} type="text" />
            <Input label="Last Name *" value={lastName} onChange={setLastName} type="text" />
            <RadioGroup
              label="Prefix *"
              value={prefix}
              onChange={(v) => setPrefix(v as Prefix)}
              options={[
                { value: 'Mr', label: 'Mr.' },
                { value: 'Ms', label: 'Ms.' },
                { value: 'Mrs', label: 'Mrs.' },
                { value: 'Mx', label: 'Mx.' },
                { value: 'Dr', label: 'Dr.' },
                { value: 'Rev', label: 'Rev.' },
                { value: '', label: 'Prefer not to say' },
              ]}
            />
            <Input label="Email *" value={email} onChange={setEmail} type="email" />
            <Input label="Password *" value={password} onChange={setPassword} type="password" />
            <label className="block text-sm font-medium">
              Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Select a role</option>
              <option value="generalManager">General Manager</option>
              <option value="financeManager">Finance Manager</option>
            </select>
          </div>

          {(error || consolidatedErrors.length > 0) && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
              <p className="mb-2 text-sm font-medium text-red-700">
                Please fix the following:
              </p>

              <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
                {consolidatedErrors.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>

              {error && consolidatedErrors.length === 0 && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 border rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-[#0E5A4A] text-white" disabled={loading}>
            {loading ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
