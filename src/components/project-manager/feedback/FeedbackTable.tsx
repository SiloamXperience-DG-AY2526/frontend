import { User, FeedbackTag, FeedbackData } from '@/types/FeedbackData';
interface FeedbackTableProps {
    feedbackData: FeedbackData[];
}

export default function FeedbackTable({ feedbackData }: FeedbackTableProps) {
    const getFullName = (user: User) => {
        return `${user.firstName} ${user.lastName}`;
    };

    const formatTags = (tags: FeedbackTag[]) => {
        return tags.map(tag => tag.name).join(', ');
    };

    const convertScore = (score: number) => {
        return score * 20;
    };

    return (
        <div className="border border-[#207860] rounded-2xl p-4">
            <h2 className="text-[#207860] text-xl font-semibold mb-4">
                Specific Feedback
            </h2>

            {feedbackData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No feedback available yet
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#206378] text-white">
                                <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-xl">
                                    Reviewer
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Reviewee
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Strengths
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Area of Improvements
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Score
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold rounded-tr-xl">
                                    Tags
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbackData.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-neutral-40 last:border-b-0"
                                >
                                    <td className="px-4 py-4 text-sm text-slate-900">
                                        {getFullName(row.reviewer)}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-900">
                                        {getFullName(row.reviewee)}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-900">
                                        {row.strengths || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-900">
                                        {row.improvements || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-900">
                                        <span className="font-semibold">{convertScore(row.score)}</span>
                                        <span className="text-neutral-40"> /100</span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-900">
                                        {formatTags(row.tags) || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}