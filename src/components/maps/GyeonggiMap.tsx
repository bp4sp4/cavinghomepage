"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Place } from "@/app/page";
import paths from "../../data/gyeonggi-paths";

interface GyeonggiMapProps {
  places: Place[];
  allPlaces: Place[];
  onDistrictClick: (districtName: string) => void;
}

const districts: { id: string; d: string }[] = paths.map(
  (p: { id: string; d: string }) => ({ id: p.id, d: p.d })
);

// 시군구별 라벨 위치 오프셋 (겹치는 곳만 추가)
const labelOffsets: { [id: string]: { x?: number; y?: number } } = {
  "수원시 장안구": { x: 0, y: -15 },
  "수원시 권선구": { x: 0, y: 15 },
  "수원시 팔달구": { x: 20, y: 0 },
  "수원시 영통구": { x: -20, y: 0 },
  "고양시 덕양구": { x: 0, y: -15 },
  "고양시 일산동구": { x: 15, y: 10 },
  "고양시 일산서구": { x: -15, y: 10 },
  "성남시 수정구": { x: 0, y: -15 },
  "성남시 중원구": { x: 15, y: 10 },
  "성남시 분당구": { x: -15, y: 10 },
  "안산시 단원구": { x: 0, y: -15 },
  "안산시 상록구": { x: 0, y: 15 },
  "안양시 만안구": { x: 0, y: -15 },
  "안양시 동안구": { x: 0, y: 15 },
  부천시: { x: 0, y: -25 },
  // 필요시 추가
};

const GyeonggiMap: React.FC<GyeonggiMapProps> = ({
  allPlaces,
  onDistrictClick,
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
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 945"
        className="object-contain w-full h-full"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {districts.map(({ id, d }) => {
          // 항상 allPlaces 기준으로만 개수 표시 (클릭해도 변하지 않음)
          const count = placeCounts[id] || 0;
          const centroid = centroids[id];
          return (
            <g key={id}>
              <path
                d={d}
                id={id}
                onClick={() => onDistrictClick(id)}
                className={
                  "cursor-pointer transition-colors stroke-white stroke-1 fill-gray-300 hover:fill-blue-400"
                }
              />
              {centroid && (
                <>
                  <text
                    x={centroid.x + (labelOffsets[id]?.x || 0)}
                    y={centroid.y + (labelOffsets[id]?.y || 0)}
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
                  <text
                    x={centroid.x + (labelOffsets[id]?.x || 0)}
                    y={centroid.y + 22 + (labelOffsets[id]?.y || 0)}
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
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GyeonggiMap;
