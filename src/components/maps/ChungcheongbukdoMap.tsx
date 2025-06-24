import React, { useRef, useEffect, useState, useMemo } from "react";
import { Place } from "@/app/page";
import ChungcheongbukdoPaths from "../../data/Chungcheongbukdo-paths";

interface ChungcheongbukdoMapProps {
  places: Place[];
  allPlaces: Place[];
  onDistrictClick: (district: string) => void;
}

// paths의 타입을 명확히 지정
const districts: { id: string; d: string }[] = ChungcheongbukdoPaths.map(
  (p: { id: string; d: string }) => ({ id: p.id, d: p.d })
);

const ChungcheongbukdoMap: React.FC<ChungcheongbukdoMapProps> = ({
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
        className="object-contain w-full h-full"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {districts.map(({ id, d }) => {
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
                    x={centroid.x}
                    y={centroid.y}
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
                  <text
                    x={centroid.x}
                    y={centroid.y + 22}
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
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChungcheongbukdoMap;
