"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import HospitalCard from "@/components/HospitalCard";
// import KoreaMap, {
//   regionNameMapping,
//   regionLabelPositions,
// } from "@/components/KoreaMap";

import { supabase } from "@/lib/supabaseClient";
import FloatingQuickMenu from "@/components/FloatingQuickMenu";

export interface Place {
  id: number;
  name: string;
  address: string;
  open_hours: string;
  phone: string;
  region: string;
  image_url?: string;
  city?: string;
  district?: string;
}

const KakaoMapSearchComponent: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  // const [allFetchedPlaces, setAllFetchedPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // const [mapRenderedWidth, setMapRenderedWidth] = useState(0);
  // const [mapRenderedHeight, setMapRenderedHeight] = useState(0);

  useEffect(() => {
    const updateMapDimensions = () => {
      if (mapContainerRef.current) {
        // setMapRenderedWidth(mapContainerRef.current.clientWidth);
        // setMapRenderedHeight(mapContainerRef.current.clientHeight);
      }
    };

    updateMapDimensions();
    window.addEventListener("resize", updateMapDimensions);
    return () => window.removeEventListener("resize", updateMapDimensions);
  }, []);

  const fetchPlaces = async (
    keyword = "",
    region: string | null = null,
    category: string | null = null
  ) => {
    setLoading(true);
    try {
      let query = supabase.from("places").select("*");

      if (region) {
        query = query.eq("region", region);
      }
      if (category) {
        query = query.eq("category", category); // Assuming 'category' is the column name
      }

      if (keyword) {
        query = query.or(`name.ilike.%${keyword}%,address.ilike.%${keyword}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      console.log("Fetched data:", data);
      setPlaces(data || []);
      // if (!region && !category) {
      //   setAllFetchedPlaces(data || []);
      // }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(search, selectedRegion, selectedCategory);
  }, [search, selectedRegion, selectedCategory]);

  const handleSearch = () =>
    fetchPlaces(search, selectedRegion, selectedCategory);

  const handleReset = () => {
    setSelectedRegion(null);
    setSelectedCategory(null);
    setSearch("");
    fetchPlaces("", null, null);
  };

  const handleSelect = (place: Place) => {
    setSelectedRegion(place.region);
    fetchPlaces(search, place.region, selectedCategory);
    console.log("선택된 장소의 지역: ", place.region);
  };

  // const handleRegionClick = (regionName: string) => {
  //   setSelectedRegion(regionName);
  //   fetchPlaces(search, regionName, selectedCategory);
  // };

  // const regionImageOffsets: { [key: string]: { x: number; y: number } } = {
  //   전라북도: { x: 180, y: -40 },
  //   대전: { x: 95, y: -150 },
  //   충청남도: { x: 100, y: -150 },
  //   세종: { x: 100, y: -180 },
  //   울산: { x: 25, y: -215 },
  //   전라남도: { x: 110, y: -235 },
  //   경상남도: { x: 55, y: -205 },
  //   부산: { x: 40, y: -230 },
  //   경기: { x: 100, y: -120 },
  //   인천: { x: 190, y: -20 },
  //   강원: { x: 100, y: -120 },
  //   충청북도: { x: 80, y: -150 },
  //   경상북도: { x: 70, y: -170 },
  //   대구: { x: 47, y: -195 },
  //   제주: { x: 130, y: -280 },
  //   광주: { x: 100, y: -150 }, // 광주 지역 이미지 오프셋 추가
  //   default: { x: 0, y: 0 }, // 기본 오프셋 추가 (정의되지 않은 지역에 대비)
  // };

  // const renderMap = () => {
  //   const position = selectedRegion
  //     ? regionLabelPositions[selectedRegion]
  //     : null;

  //   // Calculate actual rendered SVG dimensions and offsets
  //   const svgAspectRatio = 800 / 800; // KoreaMap SVG viewBox is 800x800
  //   let renderedSvgWidth = mapRenderedWidth;
  //   let renderedSvgHeight = mapRenderedHeight;
  //   let offsetX = 0;
  //   let offsetY = 0;

  //   const containerAspectRatio = mapRenderedWidth / mapRenderedHeight;

  //   if (containerAspectRatio > svgAspectRatio) {
  //     // Container is wider, SVG height is constrained
  //     renderedSvgWidth = mapRenderedHeight * svgAspectRatio;
  //     offsetX = (mapRenderedWidth - renderedSvgWidth) / 2;
  //   } else {
  //     // Container is taller, SVG width is constrained
  //     renderedSvgHeight = mapRenderedWidth / svgAspectRatio;
  //     offsetY = (mapRenderedHeight - renderedSvgHeight) / 2;
  //   }

  //   return (
  //     <div className="relative w-full h-full">
  //       <KoreaMap
  //         onRegionClick={handleRegionClick}
  //         selectedRegion={selectedRegion}
  //         allPlaces={allFetchedPlaces}
  //       />
  //       {selectedRegion && position && (
  //         <img
  //           src={`/images/${regionNameMapping[selectedRegion]}.png`}
  //           alt={selectedRegion}
  //           className="absolute"
  //           style={{
  //             left: `${
  //               offsetX +
  //               (position.x +
  //                 (regionImageOffsets[selectedRegion]?.x ||
  //                   regionImageOffsets.default.x)) *
  //                 (renderedSvgWidth / 800)
  //             }px`,
  //             top: `${
  //               offsetY + // Offset of SVG within container
  //               (position.y +
  //                 (regionImageOffsets[selectedRegion]?.y ||
  //                   regionImageOffsets.default.y)) *
  //                 (renderedSvgHeight / 800)
  //             }px`,
  //             width: `${93 * (renderedSvgWidth / 800)}px`,
  //             height: `${69 * (renderedSvgHeight / 800)}px`,
  //           }}
  //         />
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex w-[1280px] mx-auto flex-row-reverse flex-1 overflow-hidden">
        <div className="w-[600px] flex flex-col z-50 border-1 border-[#e5e5e5] rounded-lg p-2 ">
          <div className="p-4 flex flex-wrap items-center gap-2">
            <Input
              placeholder="시설명 또는 지역 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 max-w-[235px]"
            />
            <select
              value={selectedRegion || ""}
              onChange={(e) => {
                const region = e.target.value || null;
                setSelectedRegion(region);
                fetchPlaces(search, region, selectedCategory);
              }}
              className="block w-auto min-w-[235px] px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
            >
              <option value="">모든 지역</option>
              {[
                "서울",
                "경기",
                "인천",
                "강원",
                "충청북도",
                "충청남도",
                "대전",
                "세종",
                "전라북도",
                "전라남도",
                "광주",
                "경상북도",
                "경상남도",
                "부산",
                "울산",
                "제주",
              ].map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <Button onClick={handleReset} variant="outline">
              초기화
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : places && places.length > 0 ? (
              <div className="p-4 space-y-3">
                <hr />
                <p className="text-sm text-muted-foreground mb-4">
                  {places.length}개의 장소
                </p>
                {places.map((place) => (
                  <div key={place.id} onClick={() => handleSelect(place)}>
                    <HospitalCard place={place} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">장소 데이터가 없습니다.</div>
            )}
          </div>
        </div>
        {/* <main
          ref={mapContainerRef}
          className="flex-1 flex items-center justify-center p-4 overflow-hidden relative mr-10 bg-[#d6d6d62b] rounded-sm"
        >
          {renderMap()}
        </main> */}
        <div className="flex-1 flex justify-center items-start pt-25">
          <main className="w-[600px] h-[650px] bg-[#e5e5e5]"></main>
        </div>
      </div>
      <FloatingQuickMenu />
    </div>
  );
};

export default KakaoMapSearchComponent;
