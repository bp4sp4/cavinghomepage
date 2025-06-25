"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Place } from "@/app/page";
import paths from "../../data/gyeonggi-paths";

interface GyeonggiMapProps {
  places: Place[];
  allPlaces: Place[];
  onDistrictClick: (districtId: string) => void;
  selectedDistrict?: string | null;
}

const districts: { id: string; d: string }[] = paths.map(
  (p: { id: string; d: string }) => ({ id: p.id, d: p.d })
);

// 시군구별 라벨 위치 오프셋 (겹치는 곳만 추가)
const labelOffsets: {
  [id: string]: {
    x?: number;
    y?: number;
    textOffset?: number;
    textYOffset?: number;
  };
} = {
  광명시: { x: 0, y: -30, textYOffset: -10 },
  부천시: { x: -40, y: 0, textOffset: -18 },
  "용인시 기흥구": { x: 30, y: 0, textOffset: 40 },
  "수원시 권선구": { x: -60, y: 25, textYOffset: 10, textOffset: -10 },
  "성남시 수정구": { x: 0, y: -60, textOffset: -15 },
  "수원시 팔달구": { x: -30, y: 100, textYOffset: 10 },
  "수원시 영통구": { x: 20, y: 50, textOffset: 10 },
  "수원시 장안구": { x: -210, y: -55, textOffset: -40 },
  "고양시 일산동구": { x: -35, y: 80 },
  "고양시 일산서구": { x: 0, y: -40, textYOffset: -10 },
  "성남시 중원구": { x: 30, y: 0, textOffset: 40 },
  "성남시 분당구": { x: 0, y: -10 },
  "안산시 상록구": { x: -160, y: -0, textOffset: -40 },
  "안양시 만안구": { x: 0, y: -105 },
  "안양시 동안구": { x: 0, y: -55, textOffset: 10 },
  과천시: { x: 0, y: -105 },
  // 필요시 추가
};

const GyeonggiMap: React.FC<GyeonggiMapProps> = ({
  allPlaces,
  onDistrictClick,
  selectedDistrict,
}) => {
  // 시군구별 시설 개수 계산
  const placeCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    districts.forEach((d) => (counts[d.id] = 0));
    allPlaces.forEach((place) => {
      // id(한글 시군구명)가 주소에 포함되어 있으면 카운트
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
      <div className="relative w-full h-full">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 945"
          className="object-contain w-full h-full z-10"
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
                "cursor-pointer transition-colors stroke-white stroke-1 " +
                (selectedDistrict === id
                  ? "fill-blue-400"
                  : "fill-gray-300 hover:fill-blue-400")
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
                  fontSize={14}
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
                    fontSize={14}
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
    </div>
  );
};

export default GyeonggiMap;
