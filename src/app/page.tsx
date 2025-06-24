"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import KoreaMap from "@/components/KoreaMap";
import SeoulMap from "@/components/SeoulMap";
import GyeonggiMap from "@/components/GyeonggiMap";
import GangwonMap from "@/components/GangwonMap";

export interface Place {
  id: number;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  open_hours: string;
  phone: string;
  region: string; // ex: "경기"
  city?: string; // ex: "성남시"
  district?: string; // ex: "분당구"
}

interface KakaoMap {
  setLevel: (level: number) => void;
  panTo: (latlng: { getLat: () => number; getLng: () => number }) => void;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: unknown) => KakaoMap;
        LatLng: new (lat: number, lng: number) => {
          getLat: () => number;
          getLng: () => number;
        };
        Marker: new (options: unknown) => unknown;
        InfoWindow: new (options: { content: string }) => {
          open: (map: KakaoMap, marker: unknown) => void;
        };
        load: (callback: () => void) => void;
      };
    };
  }
}

const KakaoMap: React.FC<{
  locations: Place[];
  selectedLocation: Place | null;
  mapRef: React.MutableRefObject<KakaoMap | null>;
}> = ({ locations, selectedLocation, mapRef }) => {
  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || locations.length === 0) return;

    // kakao.maps가 로드될 때까지 대기
    const waitForKakao = () => {
      if (
        window.kakao &&
        window.kakao.maps &&
        typeof window.kakao.maps.load === "function"
      ) {
        window.kakao.maps.load(() => {
          const container = mapDivRef.current;
          if (!container) return;

          const center = new window.kakao.maps.LatLng(
            locations[0].lat,
            locations[0].lng
          );
          const options = {
            center,
            level: 12,
          };
          const map = new window.kakao.maps.Map(container, options);
          mapRef.current = map;

          locations.forEach((loc) => {
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(loc.lat, loc.lng),
              map,
              title: loc.name,
            });

            const iw = new window.kakao.maps.InfoWindow({
              content: `<div style='padding:8px 12px;font-size:14px;'>${loc.name}</div>`,
            });

            if (selectedLocation && loc.id === selectedLocation.id) {
              iw.open(map, marker);
            }
          });

          if (
            selectedLocation &&
            mapRef.current &&
            typeof mapRef.current.setLevel === "function" &&
            typeof mapRef.current.panTo === "function"
          ) {
            mapRef.current.setLevel(3);
            mapRef.current.panTo(
              new window.kakao.maps.LatLng(
                selectedLocation.lat,
                selectedLocation.lng
              )
            );
          }
        });
      } else {
        // 아직 로드 안 됐으면 100ms 후 재시도
        setTimeout(waitForKakao, 100);
      }
    };

    waitForKakao();
  }, [locations, selectedLocation, mapRef]);

  return <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />;
};

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

// 더미 데이터 추가
const DUMMY_PLACES: Place[] = [
  {
    id: 1,
    name: "서울대학교병원",
    address: "서울특별시 종로구 대학로 101",
    category: "병원",
    lat: 37.579617,
    lng: 126.997819,
    open_hours: "09:00~18:00",
    phone: "02-2072-2114",
    region: "서울",
    city: "서울",
    district: "종로구",
  },
  {
    id: 2,
    name: "강남세브란스병원",
    address: "서울특별시 강남구 언주로 211",
    category: "병원",
    lat: 37.494539,
    lng: 127.049555,
    open_hours: "08:30~17:30",
    phone: "02-2019-2114",
    region: "서울",
    city: "서울",
    district: "강남구",
  },
  {
    id: 3,
    name: "서울아산병원",
    address: "서울특별시 송파구 올림픽로 43길 88",
    category: "병원",
    lat: 37.526017,
    lng: 127.107664,
    open_hours: "08:30~17:00",
    phone: "1688-7575",
    region: "서울",
    city: "서울",
    district: "송파구",
  },
  {
    id: 4,
    name: "신촌세브란스병원",
    address: "서울특별시 서대문구 연세로 50",
    category: "병원",
    lat: 37.563617,
    lng: 126.936889,
    open_hours: "08:00~17:00",
    phone: "1599-1004",
    region: "서울",
    city: "서울",
    district: "서대문구",
  },
  {
    id: 5,
    name: "삼성서울병원",
    address: "서울특별시 강남구 일원로 81",
    category: "병원",
    lat: 37.488981,
    lng: 127.085752,
    open_hours: "08:00~17:00",
    phone: "02-3410-2114",
    region: "서울",
    city: "서울",
    district: "강남구",
  },
  {
    id: 6,
    name: "분당서울대학교병원",
    address: "경기 성남시 분당구 구미로173번길 82",
    category: "병원",
    lat: 37.3595704,
    lng: 127.105399,
    open_hours: "08:30~17:30",
    phone: "1588-3369",
    region: "경기",
    city: "성남시",
    district: "분당구",
  },
  {
    id: 7,
    name: "아주대학교병원",
    address: "경기 수원시 영통구 월드컵로 164",
    category: "병원",
    lat: 37.2793,
    lng: 127.0453,
    open_hours: "08:00~17:00",
    phone: "1688-6114",
    region: "경기",
    city: "수원시",
    district: "영통구",
  },
  {
    id: 8,
    name: "아주대학교병원",
    address: "경기 연천군 연천읍 중앙로 100",
    category: "병원",
    lat: 37.2793,
    lng: 127.0453,
    open_hours: "08:00~17:00",
    phone: "1688-6114",
    region: "경기",
    city: "연천군",
    district: "연천읍",
  },
  {
    id: 9,
    name: "양구군 요양보호사 시설",
    address: "강원 양구군 연천읍 중앙로 100",
    category: "병원",
    lat: 37.2793,
    lng: 127.0453,
    open_hours: "08:00~17:00",
    phone: "1688-6114",
    region: "강원",
    city: "양구군",
    district: "양구읍",
  },
  {
    id: 10,
    name: "춘천시 요양보호사 시설",
    address: "강원 춘천시 중앙로 100",
    category: "병원",
    lat: 37.2793,
    lng: 127.0453,
    open_hours: "08:00~17:00",
    phone: "1688-6114",
    region: "강원",
    city: "양구군",
    district: "양구읍",
  },
];

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
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
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
      fetchPlaces(search, "서울", null, null);
    } else if (selectedCity) {
      setSelectedCity(null);
      fetchPlaces(search, "경기", null, null);
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
  };

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setSelectedDistrict(null);
    fetchPlaces(search, regionName, null, null);
  };

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrict(districtId);
    const filtered = DUMMY_PLACES.filter(
      (p) =>
        (!selectedRegion || p.region === selectedRegion) &&
        p.address.includes(districtId)
    );
    setPlaces(filtered);
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

  const renderMap = () => {
    if (selectedRegion === "서울") {
      return (
        <SeoulMap
          onDistrictClick={handleDistrictClick}
          places={places}
          allPlaces={DUMMY_PLACES}
        />
      );
    }
    if (selectedRegion === "경기") {
      return (
        <GyeonggiMap
          onDistrictClick={handleDistrictClick}
          places={places}
          allPlaces={DUMMY_PLACES}
        />
      );
    }
    if (selectedRegion === "강원") {
      return (
        <GangwonMap
          onDistrictClick={handleDistrictClick}
          places={places}
          allPlaces={DUMMY_PLACES}
        />
      );
    }

    return <KoreaMap onRegionClick={handleRegionClick} places={places} />;
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">요양원 찾기</h1>
          <p className="text-sm text-muted-foreground">{getTitle()}</p>
        </div>
        {selectedRegion ? (
          <div className="p-4">
            <Button onClick={handleReset} className="w-full">
              {selectedDistrict
                ? selectedRegion === "경기"
                  ? "경기 전체 맵으로"
                  : "서울 전체 맵으로"
                : selectedCity
                ? "경기 전체 맵으로"
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
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full max-w-4xl max-h-4xl aspect-w-1 aspect-h-1">
          {renderMap()}
        </div>
      </main>
    </div>
  );
};

export default KakaoMapSearchComponent;
