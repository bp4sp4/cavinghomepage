"use client";

import React, { useState, useEffect } from "react";
import * as d3 from "d3-geo";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import * as topojson from "topojson-client";
import { Topology } from "topojson-specification";
import { Place } from "@/app/page";

interface RegionMapProps {
  region: string;
  onCityClick: (cityName: string) => void;
  places: Place[];
}

const RegionMap: React.FC<RegionMapProps> = ({
  region,
  onCityClick,
  places,
}) => {
  const [geoJson, setGeoJson] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  const regionNameMap: { [key: string]: string } = {
    부산: "Busan",
    충북: "Chungcheongbuk-do",
    충남: "Chungcheongnam-do",
    대구: "Daegu",
    대전: "Daejeon",
    강원: "Gangwon-do",
    광주: "Gwangju",
    경기: "Gyeonggi-do",
    경북: "Gyeongsangbuk-do",
    경남: "Gyeongsangnam-do",
    인천: "Incheon",
    제주: "Jeju",
    전북: "Jeollabuk-do",
    전남: "Jeollanam-do",
    세종: "Sejong",
    울산: "Ulsan",
  };

  useEffect(() => {
    fetch("/korea-municipalities.json")
      .then((response) => response.json())
      .then((data: Topology) => {
        const municipalities = data.objects["skorea-municipalities-2018-geo"];
        const geoJsonData = topojson.feature(
          data,
          municipalities
        ) as FeatureCollection<Geometry, { name: string; name_1: string }>;

        const englishRegionName = regionNameMap[region];
        if (englishRegionName) {
          geoJsonData.features = geoJsonData.features.filter(
            (feature) => feature.properties.name_1 === englishRegionName
          );
        }
        setGeoJson(geoJsonData);
      });
  }, [region]);

  if (!geoJson) {
    return <div>Loading map...</div>;
  }

  const projection = d3.geoMercator().fitSize([800, 800], geoJson);
  const pathGenerator = d3.geoPath().projection(projection);
  const cityNamesWithPlaces = new Set(places.map((p) => p.district));

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        {geoJson.features.map(
          (feature: Feature<Geometry, GeoJsonProperties>, index: number) => {
            const cityName = feature.properties?.name || "Unknown";
            const path = pathGenerator(feature) || "";
            const centroid = pathGenerator.centroid(feature);
            const hasPlaces = cityNamesWithPlaces.has(cityName);

            return (
              <g key={index}>
                <path
                  d={path}
                  onClick={() => onCityClick(cityName)}
                  className={`cursor-pointer ${
                    hasPlaces
                      ? "fill-blue-500 hover:fill-blue-600"
                      : "fill-gray-300 hover:fill-gray-400"
                  } stroke-white stroke-2`}
                >
                  <title>{cityName}</title>
                </path>
                <text
                  x={centroid[0]}
                  y={centroid[1]}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-xs fill-white pointer-events-none"
                  fontSize="8px"
                >
                  {cityName}
                </text>
              </g>
            );
          }
        )}
      </g>
    </svg>
  );
};

export default RegionMap;
