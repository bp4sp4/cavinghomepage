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
                viewBox="0 0 20 20"
              >
                <path
                  d="M17.4 15.6c-1.1 1.1-2.5 1.9-4.1 2.2-1.6.3-3.3.2-4.9-.3-1.6-.5-3.1-1.4-4.3-2.6-1.2-1.2-2.1-2.7-2.6-4.3-.5-1.6-.6-3.3-.3-4.9.3-1.6 1.1-3 2.2-4.1 1.1-1.1 2.5-1.9 4.1-2.2 1.6-.3 3.3-.2 4.9.3 1.6.5 3.1 1.4 4.3 2.6 1.2 1.2 2.1 2.7 2.6 4.3.5 1.6.6 3.3.3 4.9-.3 1.6-1.1 3-2.2 4.1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 10.5c-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8c-.5.5-.8 1.2-.8 2s.3 1.5.8 2c.5.5 1.2.8 2 .8s1.5-.3 2-.8c.5-.5.8-1.2.8-2s-.3-1.5-.8-2z"
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
