import React from "react";

export type Place = {
  id: number;
  name: string;
  address: string;
  phone: string;
  open_hours: string;
  image_url?: string;
  region: string;
};

interface HospitalCardProps {
  place: Place;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ place }) => {
  return (
    <div className="flex items-center bg-white rounded-2xl shadow-md p-5 gap-4 max-w-xl cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{place.name}</h2>
          {/* 복사 버튼 */}
          <button
            className="ml-1 text-gray-400 hover:text-gray-600"
            onClick={() => navigator.clipboard.writeText(place.address)}
            title="주소 복사"
            type="button"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <rect
                x="5"
                y="7"
                width="10"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="7"
                y="3"
                width="8"
                height="8"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <div
          className="text-gray-600 text-base truncate max-w-xs"
          title={place.address}
        >
          {place.address}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 flex items-center">
              <svg
                className="inline-block mr-1"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm0 0v16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              문의하기
            </span>
            <span className="font-bold text-lg">{place.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 flex items-center">
              <svg
                className="inline-block mr-1"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 20 20"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 5v5l3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              영업시간
            </span>
            <span className="font-bold text-lg">{place.open_hours}</span>
          </div>
        </div>
      </div>
      <img
        src={place.image_url}
        alt={place.name}
        className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
      />
    </div>
  );
};

export default HospitalCard;
