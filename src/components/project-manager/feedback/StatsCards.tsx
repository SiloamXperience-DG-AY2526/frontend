interface StatsCardsProps {
    totalShown: number;
    totalResponse: number;
    responseRate: number;
  }
  
  export default function StatsCards({ totalShown, totalResponse, responseRate }: StatsCardsProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <div className="flex items-center justify-between gap-4 px-3 py-6 border border-[#207860] rounded-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-4">
            <svg
              className="w-6 h-6 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                fill="#207860"
              />
            </svg>
            <span className="text-[#207860] text-xl font-semibold">
              Total Shown
            </span>
          </div>
          <span className="text-black text-base font-medium">{totalShown}</span>
        </div>
  
        <div className="flex items-center justify-between gap-4 px-3 py-6 border border-[#207860] rounded-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-4">
            <svg
              className="w-6 h-6 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8333 17.445C12.8333 17.6071 12.7689 17.7625 12.6543 17.8771C12.5397 17.9917 12.3843 18.0561 12.2222 18.0561H3.66667C3.53222 18.0561 3.40389 18.1783 3.29389 18.2578L1.22222 19.8894V10.1117C1.22222 9.94958 1.28661 9.79414 1.40121 9.67953C1.51582 9.56493 1.67126 9.50054 1.83333 9.50054H4.19222V8.27832H1.83333C1.3471 8.27832 0.880788 8.47147 0.536971 8.81529C0.193154 9.15911 0 9.62542 0 10.1117V21.1117C0.000909517 21.2251 0.0334076 21.3361 0.0938522 21.4322C0.154297 21.5283 0.240299 21.6056 0.342222 21.6555C0.440415 21.7002 0.548678 21.7181 0.656012 21.7073C0.763347 21.6966 0.865928 21.6576 0.953333 21.5944L4.10056 19.2783H12.3139C12.5455 19.2852 12.7761 19.2444 12.9913 19.1585C13.2065 19.0726 13.4018 18.9435 13.5651 18.7791C13.7283 18.6146 13.8561 18.4185 13.9405 18.2026C14.0249 17.9868 14.064 17.756 14.0556 17.5244V16.8339H12.8333V17.445Z"
                fill="#207860"
                stroke="#207860"
              />
              <path
                d="M17.7222 4H7.33333C6.8471 4 6.38079 4.19315 6.03697 4.53697C5.69315 4.88079 5.5 5.3471 5.5 5.83333V13.1667C5.5 13.6529 5.69315 14.1192 6.03697 14.463C6.38079 14.8068 6.8471 15 7.33333 15H15.6139L18.535 17.2672C18.6218 17.3314 18.7241 17.3715 18.8315 17.3833C18.9388 17.3951 19.0474 17.3782 19.1461 17.3344C19.2501 17.2849 19.338 17.207 19.3996 17.1097C19.4612 17.0124 19.4941 16.8996 19.4944 16.7844V5.83333C19.4947 5.35751 19.31 4.90022 18.9793 4.55811C18.6485 4.21599 18.1978 4.01586 17.7222 4ZM18.3333 15.5744L16.1944 13.9061C16.0878 13.8233 15.9567 13.7782 15.8217 13.7778H7.33333C7.17126 13.7778 7.01582 13.7134 6.90121 13.5988C6.78661 13.4842 6.72222 13.3287 6.72222 13.1667V5.83333C6.72222 5.67126 6.78661 5.51582 6.90121 5.40121C7.01582 5.28661 7.17126 5.22222 7.33333 5.22222H17.7222C17.8856 5.23705 18.0379 5.31109 18.1504 5.4304C18.263 5.54971 18.328 5.70606 18.3333 5.87V15.5744Z"
                fill="#207860"
                stroke="#207860"
              />
            </svg>
            <span className="text-[#207860] text-xl font-semibold">
              Total Response
            </span>
          </div>
          <span className="text-black text-base font-medium">{totalResponse}</span>
        </div>
  
        <div className="flex items-center justify-between gap-4 px-3 py-6 border border-[#207860] rounded-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-4">
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 19 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.2793 7.80444L17.301 1.28889L18.9419 2.17778L13.9812 10.2222L7.80632 6.88889L3.28188 14.2222H18.9704V16H0V0H1.89704V12.9244L7.1139 4.44444L13.2793 7.80444Z"
                fill="#207860"
              />
            </svg>
            <span className="text-[#207860] text-xl font-semibold">
              Response Rate
            </span>
          </div>
          <span className="text-black text-base font-medium">{responseRate}%</span>
        </div>
      </div>
    );
  }