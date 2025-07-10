"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import HospitalCard from "@/components/HospitalCard";
import KoreaMap, {
  regionNameMapping,
  regionLabelPositions,
} from "@/components/KoreaMap";
import REGION_MAP_COMPONENTS from "@/components/Region";
import { supabase } from "@/lib/supabaseClient";

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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapRenderedWidth, setMapRenderedWidth] = useState(0);
  const [mapRenderedHeight, setMapRenderedHeight] = useState(0);

  useEffect(() => {
    const updateMapDimensions = () => {
      if (mapContainerRef.current) {
        setMapRenderedWidth(mapContainerRef.current.clientWidth);
        setMapRenderedHeight(mapContainerRef.current.clientHeight);
      }
    };

    updateMapDimensions();
    window.addEventListener("resize", updateMapDimensions);
    return () => window.removeEventListener("resize", updateMapDimensions);
  }, []);

  const fetchPlaces = async (
    keyword = "",
    region: string | null = null,
    city: string | null = null
  ) => {
    setLoading(true);
    try {
      let query = supabase.from("places").select("*");

      if (region) {
        query = query.eq("region", region);
      }
      if (city) {
        query = query.eq("city", city);
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
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSearch = () => fetchPlaces(search, selectedRegion, selectedCity);
  const handleReset = () => {
    if (selectedCity) {
      setSelectedCity(null);
      fetchPlaces(search, selectedRegion, null);
    } else if (selectedRegion) {
      setSelectedRegion(null);
      fetchPlaces();
    } else {
      setSearch("");
      fetchPlaces();
    }
  };

  const handleSelect = (place: Place) => {
    setSelectedRegion(place.region);
    setSelectedCity(null); // 시/구 초기화
    fetchPlaces(search, place.region, null);
    console.log("선택된 장소의 지역: ", place.region);
  };

  const handleRegionClick = (regionName: string) => {
    if (regionName === "서울") {
      setSelectedRegion(regionName);
      fetchPlaces(search, regionName, null);
    } else {
      setSelectedRegion(regionName);
    }
  };

  const getTitle = () => {
    if (selectedCity) {
      return `${selectedRegion} ${selectedCity} 요양보호사 시설 검색`;
    }
    if (selectedRegion) {
      return `${selectedRegion} 요양보호사 시설 검색`;
    }
    return "전국 요양원 시설 검색";
  };

  const regionImageOffsets: { [key: string]: { x: number; y: number } } = {
    전라북도: { x: 180, y: -40 },
    대전: { x: 140, y: -40 },
    충청남도: { x: 190, y: -50 },
    세종: { x: 160, y: -20 },
    울산: { x: 175, y: -45 },
    전라남도: { x: 185, y: -35 },
    제주: { x: 195, y: -55 },
    경상남도: { x: 165, y: -25 },
    부산: { x: 170, y: -40 },
    경기: { x: 100, y: -120 },
    인천: { x: 190, y: -20 },
    강원: { x: 100, y: -120 },
    default: { x: 180, y: -40 },
  };

  const renderMap = () => {
    if (selectedRegion && selectedRegion === "서울") {
      const RegionMapComponent = REGION_MAP_COMPONENTS[selectedRegion];
      return (
        <RegionMapComponent
          places={places}
          allPlaces={places}
          onDistrictClick={() => {}}
        />
      );
    }

    const position = selectedRegion
      ? regionLabelPositions[selectedRegion]
      : null;

    // Calculate actual rendered SVG dimensions and offsets
    const svgAspectRatio = 800 / 800; // KoreaMap SVG viewBox is 800x800
    let renderedSvgWidth = mapRenderedWidth;
    let renderedSvgHeight = mapRenderedHeight;
    let offsetX = 0;
    let offsetY = 0;

    const containerAspectRatio = mapRenderedWidth / mapRenderedHeight;

    if (containerAspectRatio > svgAspectRatio) {
      // Container is wider, SVG height is constrained
      renderedSvgWidth = mapRenderedHeight * svgAspectRatio;
      offsetX = (mapRenderedWidth - renderedSvgWidth) / 2;
    } else {
      // Container is taller, SVG width is constrained
      renderedSvgHeight = mapRenderedWidth / svgAspectRatio;
      offsetY = (mapRenderedHeight - renderedSvgHeight) / 2;
    }

    return (
      <div className="relative w-full h-full">
        <KoreaMap
          onRegionClick={handleRegionClick}
          selectedRegion={selectedRegion}
          places={places}
        />
        {selectedRegion && selectedRegion !== "서울" && position && (
          <img
            src={`/images/${regionNameMapping[selectedRegion]}.png`}
            alt={selectedRegion}
            className="absolute"
            style={{
              left: `${
                offsetX + // Offset of SVG within container
                (position.x +
                  (regionImageOffsets[selectedRegion]?.x ||
                    regionImageOffsets.default.x)) *
                  (renderedSvgWidth / 800)
              }px`,
              top: `${
                offsetY + // Offset of SVG within container
                (position.y +
                  (regionImageOffsets[selectedRegion]?.y ||
                    regionImageOffsets.default.y)) *
                  (renderedSvgHeight / 800)
              }px`,
              width: `${93 * (renderedSvgWidth / 800)}px`,
              height: `${69 * (renderedSvgHeight / 800)}px`,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="w-full P-4 flex justify-center items-center">
        <img
          src="/images/mainBanner.png"
          alt="Banner"
          className="h-16 object-cover w-full"
        />
      </header>
      <div className="flex flex-row-reverse flex-1 overflow-hidden">
        <div className="w-[543px] border-l border-border flex flex-col z-50">
          <div className="p-4 border-b flex items-left gap-2 flex-col">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>
                <img src="/logo2.png" alt="logo" className="w-7 h-7" />
              </span>
              한평생 돌봄지도
            </h1>
            <p className="text-sm text-muted-foreground">{getTitle()}</p>
          </div>
          {selectedRegion && selectedRegion === "서울" ? (
            <div className="p-4">
              <Button onClick={handleReset} className="w-full">
                {selectedCity
                  ? `${selectedRegion} 전체 맵으로`
                  : "전체 맵으로 돌아가기"}
              </Button>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="시설명 또는 지역 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch}>검색</Button>
                <Button onClick={handleReset} variant="outline">
                  리셋
                </Button>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : places && places.length > 0 ? (
              <div className="p-4 space-y-3">
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
        <main
          ref={mapContainerRef}
          className="flex-1 flex items-center justify-center p-4 overflow-hidden relative"
        >
          {renderMap()}
        </main>
      </div>
    </div>
  );
};

export default KakaoMapSearchComponent;
