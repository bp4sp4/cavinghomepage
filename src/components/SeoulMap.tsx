"use client";

import React, { useMemo, useEffect, useState } from "react";
import * as d3 from "d3-geo";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Place } from "@/app/page";

interface SeoulMapProps {
  onDistrictClick: (districtName: string) => void;
  places: Place[];
}

const seoulDistricts = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
];

const SeoulMap: React.FC<SeoulMapProps> = ({ onDistrictClick, places }) => {
  const [geoJson, setGeoJson] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  useEffect(() => {
    fetch("/seoul-map.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.type === "FeatureCollection" && Array.isArray(data.features)) {
          setGeoJson(data);
        } else {
          console.error("Invalid GeoJSON data:", data);
        }
      })
      .catch((error) => console.error("Failed to load map data:", error));
  }, []);

  const placeCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    if (geoJson) {
      geoJson.features.forEach((feature) => {
        if (feature.properties) {
          const districtName = feature.properties.SIG_KOR_NM;
          if (districtName) {
            counts[districtName] = 0;
          }
        }
      });
    }
    places.forEach((place) => {
      const district = seoulDistricts.find((d) => place.address.includes(d));
      if (district) {
        counts[district] = (counts[district] || 0) + 1;
      }
    });
    return counts;
  }, [places, geoJson]);

  const projection = useMemo(() => {
    if (!geoJson) return null;
    return d3.geoMercator().fitSize([800, 800], geoJson);
  }, [geoJson]);

  if (!geoJson || !projection) {
    return <div>Loading map...</div>;
  }

  const pathGenerator = d3.geoPath().projection(projection);

  return (
    <svg
      className="w-full h-full object-contain"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        {geoJson.features.map((feature, index) => {
          if (!feature.properties || !feature.geometry) return null;
          const districtName = feature.properties.SIG_KOR_NM;
          if (!districtName) return null;

          const path = pathGenerator(feature);
          if (!path) return null;

          const count = placeCounts[districtName] || 0;
          const centroid = pathGenerator.centroid(feature);

          return (
            <g
              key={index}
              className="cursor-pointer group"
              onClick={() => onDistrictClick(districtName)}
            >
              <path
                d={path}
                className="stroke-white fill-gray-200 group-hover:fill-blue-400 transition-colors"
                strokeWidth="2"
              />
              <text
                x={centroid[0]}
                y={centroid[1]}
                textAnchor="middle"
                alignmentBaseline="middle"
                className="fill-gray-700 text-sm font-semibold pointer-events-none"
              >
                {districtName}
              </text>
              <text
                x={centroid[0]}
                y={centroid[1] + 20}
                textAnchor="middle"
                alignmentBaseline="middle"
                className="fill-blue-500 text-bold text-xl pointer-events-none"
              >
                ({count})
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default SeoulMap;
