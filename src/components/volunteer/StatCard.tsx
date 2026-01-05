import React from "react";

type StatCardProps = {
  value: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function StatCard({ value, label, Icon }: StatCardProps) {
  return (
    <div
      className="
        relative w-[350px] h-[211px]
        rounded-xl border border-gray-300
        bg-white overflow-hidden
        flex items-center
      "
    >
      {/* Background icon */}
      <Icon
        className="
          absolute left-[-48px] top-1/2 -translate-y-1/2
          w-[150px] h-[150px]
          opacity-80
          text-[#206378]
     
        "
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6 text-center">
        <div className="text-[32px] font-bold text-teal-800 leading-tight">
          {value}
        </div>
        <div className="mt-2 text-sm font-semibold text-gray-800">{label}</div>
      </div>
    </div>
  );
}
