"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";

interface Place {
  id: number;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  open_hours: string;
  phone: string;
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
  },
];

const KakaoMapSearchComponent: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<KakaoMap | null>(null);

  // supabase fetchPlaces 함수 제거, 더미 데이터 기반으로 변경
  const fetchPlaces = (keyword = "") => {
    setLoading(true);
    setTimeout(() => {
      let filtered = DUMMY_PLACES;
      if (keyword) {
        const lower = keyword.toLowerCase();
        filtered = DUMMY_PLACES.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.address.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower)
        );
      }
      setPlaces(filtered);
      setLoading(false);
    }, 300); // 로딩 효과를 위해 약간의 딜레이
  };

  useEffect(() => {
    fetchPlaces();
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = () => fetchPlaces(search);
  const handleReset = () => {
    setSearch("");
    fetchPlaces("");
  };

  const handleSelect = (place: Place) => {
    setSelectedLocation(place);
  };

  console.log("KAKAO KEY:", process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
      />
      <div className="flex h-screen w-screen flex-col md:flex-row">
        <div className="flex-1 min-w-0 h-[350px] md:h-full">
          <div className="w-full h-full">
            {places.length > 0 ? (
              <KakaoMap
                locations={places}
                selectedLocation={selectedLocation}
                mapRef={mapRef}
              />
            ) : (
              <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-yellow-800" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-[400px] max-w-full md:max-w-[400px] h-full bg-white shadow-lg border-l border-border flex flex-col rounded-none md:rounded-l-2xl overflow-y-auto">
          <div className="p-6 border-b border-border flex gap-2">
            <Input
              placeholder="장소명, 주소, 카테고리 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch}>검색</Button>
            <Button variant="outline" onClick={handleReset}>
              리셋
            </Button>
          </div>
          <PlaceList
            places={places}
            onSelect={handleSelect}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default KakaoMapSearchComponent;
