'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getFinanceManagerProjects,
  getDonationProjectFinance,
} from '@/lib/api/donation';
import {
  getDonationReviewTemplate,
  saveDonationReviewTemplate,
  sendDonationReviewThankYou,
  // sendDonationReviewFollowUp,
  processDonationReviewReceipt,
} from '@/lib/api/emailCampaign';
import type { DonationProject } from '@/types/DonationProjectData';
import { getUserProfile } from '@/lib/api/user';
import { StaffProfile } from '@/types/UserData';

import { classNames } from '@/lib/utils/finance-manager-email/classNames';
import {
  htmlToText,
  safeTextToHtml,
} from '@/lib/utils/finance-manager-email/text-html';

import { TemplateForm } from '@/types/EmailCampaign';
import { DonationTransaction } from '@/types/DonationProject';
import ReviewDonationsSection from '@/components/finance-manager/ReviewDonationsSection';
import TemplatesSection from '@/components/finance-manager/EmailTemplateSection';

type Tab = 'review' | 'templates';
type TemplateType = 'thankyou' | 'receipt';

const DEFAULT_TEXT_TEMPLATE: Record<
  TemplateType,
  Pick<TemplateForm, 'subject' | 'message'>
> = {
  thankyou: {
    subject:
      'Thank you {{name}} — we’ve received your donation for {{project}}',
    message:
      'Hi {{name}},\n\n' +
      'Thank you for your donation to {{project}}.\n' +
      'Donation amount: {{amount}}\n\n' +
      'We’re currently processing your payment and will update you shortly.\n' +
      'Once confirmed, we’ll send your official receipt.\n\n' +
      'Warm regards,\n' +
      'Finance Team',
  },
  receipt: {
    subject: 'Your receipt {{receiptNumber}} — {{project}}',
    message:
      'Hi {{name}},\n\n' +
      'Thank you for your donation to {{project}}.\n' +
      'Your donation was successful.\n\n' +
      'Receipt No: {{receiptNumber}}\n' +
      'Receipt Date: {{receiptDate}}\n' +
      'Amount: {{amount}}\n' +
      'Remarks: {{remarks}}\n\n' +
      'With gratitude,\n' +
      'Finance Team',
  },
};

const VARIABLES: Array<{
  label: string;
  value: string;
  showIn: TemplateType | 'both';
}> = [
  { label: 'Donor name', value: '{{name}}', showIn: 'both' },
  { label: 'Project', value: '{{project}}', showIn: 'both' },
  { label: 'Amount', value: '{{amount}}', showIn: 'both' },
  { label: 'Receipt number', value: '{{receiptNumber}}', showIn: 'receipt' },
  { label: 'Remarks', value: '{{remarks}}', showIn: 'receipt' },
  { label: 'Receipt date', value: '{{receiptDate}}', showIn: 'receipt' },
];

export default function FinanceManagerEmailPage() {
  const [tab, setTab] = useState<Tab>('review');
  const [staffEmail, setStaffEmail] = useState<string>('');

  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const [donations, setDonations] = useState<DonationTransaction[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);

  const [selectedTx, setSelectedTx] = useState<DonationTransaction | null>(
    null,
  );

  const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptDate, setReceiptDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [remarks, setRemarks] = useState('');

  const [templateType, setTemplateType] = useState<TemplateType>('thankyou');
  const [templateForm, setTemplateForm] = useState<TemplateForm>({
    senderAddress: '',
    subject: DEFAULT_TEXT_TEMPLATE.thankyou.subject,
    message: DEFAULT_TEXT_TEMPLATE.thankyou.message,
    customNote: '',
  });
  const templateMessageRef = useRef<HTMLTextAreaElement | null>(null);
  const [showTemplateWarning, setShowTemplateWarning] = useState(false);
  const [banner, setBanner] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  // Load projects
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoadingProjects(true);
        const res = await getFinanceManagerProjects(1, 100);
        const list = res?.projects ?? [];
        if (!mounted) return;
        setProjects(list);
        setSelectedProjectId(list[0]?.id ?? '');
      } catch (e) {
        if (!mounted) return;
        setBanner({
          type: 'error',
          message: e instanceof Error ? e.message : 'Failed to load projects',
        });
      } finally {
        if (mounted) {
          setIsLoadingProjects(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const p = (await getUserProfile()) as StaffProfile;

        if (!mounted) return;

        setStaffEmail(p.email);
      } catch (e) {
        if (!mounted) return;

        setBanner({
          type: 'error',
          message:
            e instanceof Error ? e.message : 'Failed to load user profile',
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!banner) return;

    const t = setTimeout(() => {
      setBanner(null);
    }, 4000);

    return () => clearTimeout(t);
  }, [banner]);

  // Load donations
  async function loadFinanceData(projectId: string) {
    setIsLoadingDonations(true);
    setBanner(null);
    setSelectedTx(null);

    try {
      const finance = await getDonationProjectFinance(projectId);
      const list = (finance.donations ?? []) as DonationTransaction[];
      setDonations(list);
    } catch (e) {
      setBanner({
        type: 'error',
        message: e instanceof Error ? e.message : 'Failed to load donations',
      });
      setDonations([]);
    } finally {
      setIsLoadingDonations(false);
    }
  }

  useEffect(() => {
    if (!selectedProjectId) return;
    loadFinanceData(selectedProjectId);
  }, [selectedProjectId]);

  //Load template
  const templateReqIdRef = useRef(0);

  // Load template
  useEffect(() => {
    if (tab !== 'templates') return;
    if (!selectedProjectId) return;

    const reqId = ++templateReqIdRef.current;

    (async () => {
      try {
        setBusy(true);

        const tpl = await getDonationReviewTemplate(
          selectedProjectId,
          templateType,
        );

        if (reqId !== templateReqIdRef.current) return;

        setTemplateForm({
          senderAddress: staffEmail ?? '',
          subject: tpl.subject ?? '',
          message: htmlToText(tpl.body ?? ''),
          customNote: tpl.previewText ?? '',
        });
      } catch (e) {
        if (reqId !== templateReqIdRef.current) return;

        setBanner({
          type: 'error',
          message:
            e instanceof Error
              ? e.message
              : 'Failed to load template. You can configure and save a new one.',
        });

        setShowTemplateWarning(true);

        setTemplateForm({
          senderAddress: staffEmail ?? '',
          subject: DEFAULT_TEXT_TEMPLATE[templateType].subject,
          message: DEFAULT_TEXT_TEMPLATE[templateType].message,
          customNote: '',
        });
      } finally {
        if (reqId === templateReqIdRef.current) setBusy(false);
      }
    })();
  }, [tab, selectedProjectId, templateType, staffEmail]);

  const pendingDonations = useMemo(
    () =>
      donations.filter(
        (d) =>
          d.receiptStatus === 'pending' && d.submissionStatus === 'submitted',
      ),
    [donations],
  );

  async function refreshDonations() {
    if (!selectedProjectId) return;
    await loadFinanceData(selectedProjectId);
  }
  function changeTemplateType(next: TemplateType) {
    setTemplateType(next);

    // show correct default instantly
    setTemplateForm((p) => ({
      ...p,
      subject: DEFAULT_TEXT_TEMPLATE[next].subject,
      message: DEFAULT_TEXT_TEMPLATE[next].message,
      customNote: '',
      senderAddress: staffEmail ?? '',
    }));
  }

  async function runAction(fn: () => Promise<void>, success: string) {
    if (!selectedTx) {
      setBanner({
        type: 'error',
        message: 'Please select a donation to review.',
      });
      return;
    }
    setBusy(true);
    setBanner(null);
    try {
      await fn();
      setBanner({ type: 'success', message: success });
      await refreshDonations();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Action failed';

      const lowerMsg = msg.toLowerCase();

      if (
        lowerMsg.includes('receipt template not configured') ||
        lowerMsg.includes('thankyou template not configured') ||
        lowerMsg.includes('template not configured')
      ) {
        setBanner({
          type: 'error',
          message:
            'Email templates are not configured. Please set up BOTH "Thank You" and "Receipt" templates before sending emails.',
        });
        setShowTemplateWarning(true);
        setTab('templates');
      } else {
        setBanner({
          type: 'error',
          message: msg,
        });
      }
    } finally {
      setBusy(false);
    }
  }

  async function saveTemplate() {
    if (!selectedProjectId) return;
    setBusy(true);
    setBanner(null);
    try {
      await saveDonationReviewTemplate(selectedProjectId, {
        type: templateType,
        senderAddress: staffEmail,
        subject: templateForm.subject,
        body: safeTextToHtml(templateForm.message),
        customNote: templateForm.customNote || null,
      });
      setBanner({ type: 'success', message: 'Template saved.' });
    } catch (e) {
      setBanner({
        type: 'error',
        message: e instanceof Error ? e.message : 'Failed to save template',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-gray-50 px-6 py-8 lg:px-10">
      <header className="mb-8 flex items-start gap-3">
        <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Finance Review</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review donations, follow up on payments, and issue receipts.
          </p>
        </div>
      </header>

      {banner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-4">
          <div
            className={classNames(
              'mx-auto w-full max-w-2xl rounded-lg border px-5 py-4 shadow-md bg-white flex items-start gap-3',
              banner.type === 'error' ? 'border-red-300' : 'border-emerald-300',
            )}
          >
            {/* Icon */}
            <div
              className={classNames(
                'mt-0.5 text-lg',
                banner.type === 'error' ? 'text-red-500' : 'text-emerald-500',
              )}
            >
              {banner.type === 'error' ? '⚠️' : '✅'}
            </div>

            {/* Message */}
            <div className="flex-1 text-sm text-gray-800">{banner.message}</div>

            {/* Close button */}
            <button
              onClick={() => setBanner(null)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Project
          </p>
          <div className="mt-2">
            {isLoadingProjects ? (
              <div className="text-sm text-gray-500">Loading projects...</div>
            ) : (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#56E0C2]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Selected:{' '}
            <span className="text-gray-700">
              {selectedProject?.title ?? '—'}
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Menu
          </p>
          <div className="mt-3 flex gap-2">
            <button
              className={classNames(
                'rounded-md px-3 py-2 text-sm font-semibold border transition',
                tab === 'review'
                  ? 'bg-[#206378] border-[#206378] text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              )}
              onClick={() => setTab('review')}
            >
              Review donations
            </button>
            <button
              className={classNames(
                'rounded-md px-3 py-2 text-sm font-semibold border transition',
                tab === 'templates'
                  ? 'bg-[#206378] border-[#206378] text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              )}
              onClick={() => setTab('templates')}
            >
              Templates
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Toggle between review and templates
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Needs attention
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoadingDonations ? '...' : pendingDonations.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Pending receipts (submitted).
          </p>
        </div>
      </section>

      {tab === 'review' ? (
        <ReviewDonationsSection
          pendingDonations={pendingDonations}
          isLoadingDonations={isLoadingDonations}
          selectedTx={selectedTx}
          setSelectedTx={setSelectedTx}
          receiptNumber={receiptNumber}
          setReceiptNumber={setReceiptNumber}
          receiptDate={receiptDate}
          setReceiptDate={setReceiptDate}
          remarks={remarks}
          setRemarks={setRemarks}
          busy={busy}
          onSendThankYou={() =>
            runAction(
              () => sendDonationReviewThankYou(selectedTx!.id),
              'Thank you email sent.',
            )
          }
          // onSendFollowUp={() =>
          //   runAction(
          //     () => sendDonationReviewFollowUp(selectedTx!.id),
          //     'Payment reminder sent.',
          //   )
          // }
          onProcessReceipt={() =>
            runAction(
              () =>
                processDonationReviewReceipt(selectedTx!.id, {
                  receiptNumber,
                  receiptDate,
                  remarks: remarks || null,
                }),
              'Receipt issued and emailed.',
            )
          }
        />
      ) : (
        <TemplatesSection
          showTemplateWarning={showTemplateWarning}
          staffEmail={staffEmail}
          templateType={templateType}
          setTemplateType={changeTemplateType}
          templateForm={templateForm}
          setTemplateForm={(updater) => setTemplateForm(updater)}
          templateMessageRef={templateMessageRef}
          busy={busy}
          onSave={saveTemplate}
          onReset={() => {
            setTemplateForm((p) => ({
              ...p,
              subject: DEFAULT_TEXT_TEMPLATE[templateType].subject,
              message: DEFAULT_TEXT_TEMPLATE[templateType].message,
            }));
            setBanner({ type: 'success', message: 'Reset to default.' });
          }}
          variables={VARIABLES}
        />
      )}
    </div>
  );
}
