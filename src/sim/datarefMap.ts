import { SupportedAircraftType } from "./aircraftSelector";
import ff757Config from "../configs/ff757.json";
import defaultConfig from "../configs/default.json";
// import zibo737Config from "../configs/zibo737.json";
import tolissConfig from "../configs/tolissa321.json";
import rotateConfig from "../configs/rotate_md80.json";

export const DatarefsType = {
  // Dials
  READ_WRITE_IAS: "READ_WRITE_IAS",
  READ_WRITE_MACH: "READ_WRITE_MACH",
  READ_WRITE_IS_MACH: "READ_WRITE_IS_MACH",
  WRITE_ENABLE_IAS: "WRITE_ENABLE_IAS",
  READ_WRITE_HEADING: "READ_WRITE_HEADING",
  WRITE_HEADING_SELECT: "WRITE_HEADING_SELECT",
  READ_WRITE_ALTITUDE: "READ_WRITE_ALTITUDE",
  WRITE_ALTITUDE_SELECT: "WRITE_ALTITUDE_SELECT",
  READ_WRITE_VERTICAL_SPEED: "READ_WRITE_VERTICAL_SPEED",
  WRITE_VERTICAL_SPEED_SELECT: "WRITE_VERTICAL_SPEED_SELECT",

  // Buttons
  READ_WRITE_AP_ONE: "READ_WRITE_AP_ONE",
  READ_WRITE_AP_TWO: "READ_WRITE_AP_TWO",
  READ_WRITE_AP_THREE: "READ_WRITE_AP_THREE",
  READ_WRITE_ATHR: "READ_WRITE_ATHR",

  READ_WRITE_APPR: "READ_WRITE_APPR",

  READ_WRITE_LNAV: "READ_WRITE_LNAV",
  READ_WRITE_VNAV: "READ_WRITE_VNAV",
  READ_WRITE_LOC: "READ_WRITE_LOC",

  READ_WRITE_FLCH: "READ_WRITE_FLCH",

  // Comms
  READ_COM1_ACTIVE: "READ_COM1_ACTIVE",
  READ_WRITE_COM1_STANDBY: "READ_WRITE_COM1_STANDBY",
  TOGGLE_COM1_STANDBY: "TOGGLE_COM1_STANDBY",
  TOGGLE_COM1_MONITOR: "TOGGLE_COM1_MONITOR",
  READ_WRITE_COM1_VOLUME: "READ_WRITE_COM1_VOLUME",

  READ_COM2_ACTIVE: "READ_COM2_ACTIVE",
  READ_WRITE_COM2_STANDBY: "READ_WRITE_COM2_STANDBY",
  TOGGLE_COM2_STANDBY: "TOGGLE_COM2_STANDBY",
  TOGGLE_COM2_MONITOR: "TOGGLE_COM2_MONITOR",
  READ_WRITE_COM2_VOLUME: "READ_WRITE_COM2_VOLUME",

  READ_WRITE_HSI_RANGE: "READ_WRITE_HSI_RANGE",

  READ_WRITE_IS_QNH: "READ_WRITE_IS_QNH",
  READ_WRITE_IS_STD: "READ_WRITE_IS_STD",
  READ_WRITE_ALTIMETER_SETTING: "READ_WRITE_ALTIMETER_SETTING",

  MD80_PCW_READOUT: "MD80_PCW_READOUT",
  MD80_VNAV_MODE: "MD80_VNAV_MODE",
  MD80_PCW_SPD_BUG: "MD80_PCW_SPD_BUG",

  XPLANE_VERSION: "sim/version/xplane_internal_version",
  XPLANE_AIRCRAFT_AUTHOR: "sim/aircraft/view/acf_author[6]",
};

type DatarefMap = {
  [aircraft in SupportedAircraftType]: {
    [dataref: string]: DatarefData;
  };
};

type DatarefData = {
  isCommand: boolean;
  value: string;
  onValue?: number;
  offValue?: number;
  writeValue?: string;
  displayValueMap?: { [key: number]: string };
  maxValue?: number;
  minValue?: number;
  valueMultiplier?: number;
  simulateClickDecrease?: string;
  simulateClickIncrease?: string;
};

export let datarefMap: DatarefMap = {
  [SupportedAircraftType.Default]:
    defaultConfig as DatarefMap[SupportedAircraftType],
  // [SupportedAircraftType.Zibo737]:
  // zibo737Config as DatarefMap[SupportedAircraftType],
  [SupportedAircraftType.FF757]:
    ff757Config as DatarefMap[SupportedAircraftType],
  [SupportedAircraftType.TOLISS]:
    tolissConfig as DatarefMap[SupportedAircraftType],
  [SupportedAircraftType.ROTATE_MD80]:
    rotateConfig as DatarefMap[SupportedAircraftType],
};
