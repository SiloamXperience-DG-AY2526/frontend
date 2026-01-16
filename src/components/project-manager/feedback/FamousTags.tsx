interface FamousTagsProps {
    tags: string[];
  }
  
  export default function FamousTags({ tags }: FamousTagsProps) {
    return (
      <div className="border border-[#207860] rounded-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-4 overflow-hidden">
        <h2 className="text-[#207860] text-xl font-semibold mb-4">
          Famous Tag
        </h2>
  
        {tags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tags available yet
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 text-center">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="px-6 py-3.5 border border-[#36A7C9] rounded-2xl"
              >
                <span className="text-[#206378] text-sm font-small whitespace-nowrap">
                  # {tag}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }