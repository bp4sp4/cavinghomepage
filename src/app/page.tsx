"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import KoreaMap, {
  regionNameMapping,
  regionLabelPositions,
} from "@/components/KoreaMap";
import REGION_MAP_COMPONENTS from "@/components/Region";
import { DUMMY_PLACES } from "../data/dumy-places";
import paths from "../data/gyeonggi-paths";

export interface Place {
  id: number;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  open_hours: string;
  phone: string;
  region: string;
  city?: string;
  district?: string;
}

const districts = paths.map((p) => ({ id: p.id, d: p.d }));

const PlaceList: React.FC<{
  places: Place[];
  onSelect: (place: Place) => void;
  loading: boolean;
}> = ({ places, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!places || places.length === 0) {
    return <div className="p-6">장소 데이터가 없습니다.</div>;
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {places.length}개의 장소
      </p>
      {places.map((place) => (
        <Card
          key={place.id}
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onSelect(place)}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-foreground">{place.name}</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {place.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {place.address}
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{place.open_hours}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{place.phone}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const REGIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "경기",
  "강원",
  "충청북도",
  "충청남도",
  "전라북도",
  "전남",
  "경북",
  "경상남도",
  "제주",
  "세종",
];

const KakaoMapSearchComponent: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // 일반화된 필터 함수
  const filterPlaces = (
    places: Place[],
    {
      region,
      city,
      district,
      keyword,
    }: { region?: string; city?: string; district?: string; keyword?: string }
  ) => {
    return places.filter((p) => {
      if (region && p.region !== region) return false;
      if (city && p.city !== city) return false;
      if (district && p.district !== district) return false;
      if (keyword) {
        const lower = keyword.toLowerCase();
        if (
          !p.name.toLowerCase().includes(lower) &&
          !p.address.toLowerCase().includes(lower)
        ) {
          return false;
        }
      }
      return true;
    });
  };

  // fetchPlaces 함수 리팩토링
  const fetchPlaces = (
    keyword = "",
    region: string | null = null,
    city: string | null = null,
    district: string | null = null
  ) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = filterPlaces(DUMMY_PLACES, {
        region: region ?? undefined,
        city: city ?? undefined,
        district: district ?? undefined,
        keyword,
      });
      setPlaces(filtered);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSearch = () =>
    fetchPlaces(search, selectedRegion, selectedCity, selectedDistrict);
  const handleReset = () => {
    if (selectedDistrict) {
      setSelectedDistrict(null);
      fetchPlaces(search, selectedRegion, null, null);
    } else if (selectedCity) {
      setSelectedCity(null);
      fetchPlaces(search, selectedRegion, null, null);
    } else if (selectedRegion) {
      setSelectedRegion(null);
      fetchPlaces();
    } else {
      setSearch("");
      fetchPlaces();
    }
  };

  const handleSelect = (place: Place) => {
    if (!selectedRegion) {
      const region = REGIONS.find((r) => place.address.includes(r));
      if (region) {
        setSelectedRegion(region);
        fetchPlaces(search, region, null, null);
      }
    }
    const match = districts.find((d) => place.address.includes(d.id));
    setSelectedDistrict(match?.id ?? null);
    console.log("선택 district:", match?.id);
  };

  const handleRegionClick = (regionName: string) => {
    if (regionName === "서울") {
      setSelectedRegion(regionName);
      setSelectedDistrict(null);
      fetchPlaces(search, regionName, null, null);
    } else {
      setSelectedRegion(regionName);
    }
  };

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrict(districtId);
    fetchPlaces(search, selectedRegion, selectedCity, districtId);
  };

  const handleBackgroundClick = () => {
    setSelectedRegion(null); // Deselect region
  };

  const getTitle = () => {
    if (selectedDistrict) {
      return `${selectedRegion} ${selectedDistrict} 요양보호사 시설 검색`;
    }
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
    경기: { x: 100, y: -30 },
    인천: { x: 190, y: -20 },
    강원: { x: 170, y: -50 },
    default: { x: 180, y: -40 },
  };

  const renderMap = () => {
    if (selectedRegion && selectedRegion === "서울") {
      const RegionMapComponent = REGION_MAP_COMPONENTS[selectedRegion];
      return (
        <RegionMapComponent
          onDistrictClick={handleDistrictClick}
          places={places}
          allPlaces={DUMMY_PLACES}
          selectedDistrict={selectedDistrict ?? undefined}
        />
      );
    }

    const position = selectedRegion
      ? regionLabelPositions[selectedRegion]
      : null;

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
            className="absolute w-[93Px] h-[69px]"
            style={{
              left: `${
                position.x +
                (regionImageOffsets[selectedRegion]?.x ||
                  regionImageOffsets.default.x)
              }px`,
              top: `${
                position.y +
                (regionImageOffsets[selectedRegion]?.y ||
                  regionImageOffsets.default.y)
              }px`,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-row-reverse h-screen bg-background">
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
        {selectedRegion ? (
          <div className="p-4">
            <Button onClick={handleReset} className="w-full">
              {selectedDistrict
                ? `${selectedRegion} 전체 맵으로`
                : selectedCity
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
          <PlaceList
            places={places}
            onSelect={handleSelect}
            loading={loading}
          />
        </div>
      </div>
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden z-50">
        <div className="w-full h-full max-w-4xl max-h-4xl aspect-w-1 aspect-h-1">
          {renderMap()}
        </div>
      </main>
    </div>
  );
};

export default KakaoMapSearchComponent;
