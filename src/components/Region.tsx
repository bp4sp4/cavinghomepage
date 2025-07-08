import SeoulMap from "./maps/SeoulMap";

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
};

export default REGION_MAP_COMPONENTS;
