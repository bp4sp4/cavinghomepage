import React, { useRef, useEffect, useState, useMemo } from "react";
import { Place } from "@/app/page";
import IncheonPaths from "../../data/Incheon-paths";

interface IncheonMapProps {
  places: Place[];
  allPlaces: Place[];
  onDistrictClick: (district: string) => void;
  selectedDistrict?: string;
}

// paths의 타입을 명확히 지정
const districts: { id: string; d: string }[] = IncheonPaths.map(
  (p: { id: string; d: string }) => ({ id: p.id, d: p.d })
);

// 구/군별 라벨 위치 오프셋 (경기도와 동일 구조)
const labelOffsets: {
  [id: string]: {
    x?: number;
    y?: number;
    textOffset?: number;
    textYOffset?: number;
  };
} = {
  중구: { x: -20, y: -20, textOffset: -10 },
  서구: { x: 30, y: -60, textYOffset: -10 },
  계양구: { x: 30, y: -10, textOffset: 25 },
  연수구: { x: -30, y: 10, textYOffset: 10 },
  남동구: { x: 30, y: -10, textOffset: 25 },
  미추홀구: { x: -90, y: 30, textOffset: -30 },
};

// 충청북도

const IncheonMap: React.FC<IncheonMapProps> = ({
  allPlaces,
  onDistrictClick,
}) => {
  // 시군구별 시설 개수 계산
  const placeCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    districts.forEach((d) => (counts[d.id] = 0));
    allPlaces.forEach((place) => {
      const district = districts.find((d) => place.address.includes(d.id));
      if (district) {
        counts[district.id] = (counts[district.id] || 0) + 1;
      }
    });
    return counts;
  }, [allPlaces]);

  // 각 path의 중심좌표 계산 (getBBox 활용)
  const svgRef = useRef<SVGSVGElement>(null);
  const [centroids, setCentroids] = useState<{
    [id: string]: { x: number; y: number };
  }>({});
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const newCentroids: { [id: string]: { x: number; y: number } } = {};
    districts.forEach(({ id }) => {
      const path = svg.querySelector(`path[id='${id}']`) as SVGPathElement;
      if (path) {
        const bbox = path.getBBox();
        newCentroids[id] = {
          x: bbox.x + bbox.width / 2,
          y: bbox.y + bbox.height / 2,
        };
      }
    });
    setCentroids(newCentroids);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 945"
        className="object-contain w-full h-full "
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 1. 모든 path(구역) 먼저 */}
        {districts.map(({ id, d }) => (
          <path
            key={id}
            d={d}
            id={id}
            onClick={() => onDistrictClick(id)}
            className={
              "cursor-pointer transition-colors stroke-white stroke-1 fill-gray-300 hover:fill-blue-400"
            }
          />
        ))}
        {/* 2. 모든 리더라인(line) */}
        {districts.map(({ id }) => {
          const centroid = centroids[id];
          const labelX = centroid && centroid.x + (labelOffsets[id]?.x || 0);
          const labelY = centroid && centroid.y + (labelOffsets[id]?.y || 0);
          if (!centroid || !(labelOffsets[id]?.x || labelOffsets[id]?.y))
            return null;
          return (
            <line
              key={id + "-line"}
              x1={centroid.x}
              y1={centroid.y}
              x2={labelX}
              y2={labelY}
              stroke="#222"
              strokeWidth={1.2}
              strokeDasharray="1"
            />
          );
        })}
        {/* 3. 모든 텍스트(text) */}
        {districts.map(({ id }) => {
          const count = placeCounts[id] || 0;
          const centroid = centroids[id];
          const labelX = centroid && centroid.x + (labelOffsets[id]?.x || 0);
          const labelY = centroid && centroid.y + (labelOffsets[id]?.y || 0);
          const textOffset = labelOffsets[id]?.textOffset || 0;
          const textYOffset = labelOffsets[id]?.textYOffset || 0;
          const textX = labelX + textOffset;
          const textY = labelY + textYOffset;
          if (!centroid) return null;
          return (
            <g key={id + "-text"}>
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={18}
                fontWeight={700}
                fill="#222"
                pointerEvents="none"
                style={{ userSelect: "none" }}
              >
                {id}
              </text>
              {/* 개수가 0개 이상일 때만 표시 */}
              {count > 0 && (
                <text
                  x={textX}
                  y={textY + 22}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={16}
                  fontWeight={700}
                  fill="#2563eb"
                  pointerEvents="none"
                  style={{ userSelect: "none" }}
                >
                  {`${count}개`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default IncheonMap;
