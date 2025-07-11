import React from "react";
import { useToast } from "../components/ToastProvider";

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
  const { addToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(place.address);
    addToast("주소가 복사되었습니다!", "success");
  };

  return (
    <div className="flex items-center bg-white rounded-2xl shadow-md p-5 gap-4 max-w-xl cursor-pointer relative">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{place.name}</h2>
          {/* 복사 버튼 */}
          <button
            className="ml-1 text-gray-400 hover:text-gray-600"
            onClick={handleCopy}
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
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 5.75C3 4.78 3.78 4 4.75 4H6.25C6.66 4 7.04 4.21 7.25 4.55L9.2 7.7C9.49 8.17 9.37 8.79 8.92 9.09L7.28 10.21C8.48 12.61 10.89 15.02 13.29 16.22L14.41 14.58C14.71 14.13 15.33 14.01 15.8 14.3L18.95 16.25C19.29 16.46 19.5 16.84 19.5 17.25V18.75C19.5 19.72 18.72 20.5 17.75 20.5H17C10.87 20.5 3.5 13.13 3.5 7V5.75C3.5 5.34 3.71 4.96 4.05 4.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
