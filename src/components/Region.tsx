import SeoulMap from "./maps/SeoulMap";
import GyeonggiMap from "./maps/GyeonggiMap";
import GangwonMap from "./maps/GangwonMap";
import GyeongsangnamdoMap from "./maps/Gyeongsangnamdo";
import GyeongsangbukdoMap from "./maps/Gyeongsangbukdo";
import GwangjuMap from "./maps/GwangjuMap";
import ChungcheongbukdoMap from "./maps/ChungcheongbukdoMap";
import ChungcheongnamdoMap from "./maps/ChungcheongnamdoMap";
import DaeguMap from "./maps/DaeguMap";
import JejuIslandMap from "./maps/JejuIsland";
import JeollabukdoMap from "./maps/JeollabukdoMap";
import JeollanamdoMap from "./maps/JeollanamdoMap";
import DaejeonMap from "./maps/DaejeonMap";
import IncheonMap from "./maps/IncheonMap";
import BusanMap from "./maps/BusanMap";
import UlsanMap from "./maps/UlsanMap";
import SejongMap from "./maps/SejongMap";
import type { Place } from "../data/dumy-places";

export type RegionMapProps = {
  onDistrictClick: (districtId: string) => void;
  places: Place[];
  allPlaces: Place[];
  selectedDistrict?: string;
};

const REGION_MAP_COMPONENTS: Record<
  string,
  React.ComponentType<RegionMapProps>
> = {
  서울: SeoulMap,
  경기: GyeonggiMap,
  강원: GangwonMap,
  경상남도: GyeongsangnamdoMap,
  경상북도: GyeongsangbukdoMap,
  광주: GwangjuMap,
  충청북도: ChungcheongbukdoMap,
  충청남도: ChungcheongnamdoMap,
  대구: DaeguMap,
  제주: JejuIslandMap,
  전라북도: JeollabukdoMap,
  전라남도: JeollanamdoMap,
  대전: DaejeonMap,
  인천: IncheonMap,
  부산: BusanMap,
  울산: UlsanMap,
  세종: SejongMap,
};

export default REGION_MAP_COMPONENTS;
