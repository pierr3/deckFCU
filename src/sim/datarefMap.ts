import { SupportedAircraftType } from "./aircraftSelector";

export const DatarefsType = {
  // Dials
  READ_WRITE_IAS_MACH: "READ_WRITE_IAS_MACH",
  READ_WRITE_IS_MACH: "READ_WRITE_IS_MACH",
  WRITE_ENABLE_IAS: "WRITE_ENABLE_IAS",
  READ_WRITE_HEADING: "READ_WRITE_HEADING",
  WRITE_HEADING_SELECT: "WRITE_HEADING_SELECT",
  READ_WRITE_ALTITUDE: "READ_WRITE_ALTITUDE",
  WRITE_ALTITUDE_SELECT: "WRITE_ALTITUDE_SELECT",
  READ_WRITE_VERTICAL_SPEED: "READ_WRITE_VERTICAL_SPEED",
  WRITE_VERTICAL_SPEED_SELECT: "WRITE_VERTICAL_SPEED_SELECT",

  // Buttons
  READ_AP_ONE: "READ_AP_ONE",
  WRITE_AP_ONE: "WRITE_AP_ONE",
  READ_AP_TWO: "READ_AP_TWO",
  WRITE_AP_TWO: "WRITE_AP_TWO",
  READ_ATHR: "READ_ATHR",
  WRITE_ATHR: "WRITE_ATHR",
  READ_APPR: "READ_APPR",
  WRITE_APPR: "WRITE_APPR",
  READ_LNAV: "READ_LNAV",
  WRITE_LNAV: "WRITE_LNAV",
  READ_VNAV: "READ_VNAV",
  WRITE_VNAV: "WRITE_VNAV",
  READ_LOC: "READ_LOC",
  WRITE_LOC: "WRITE_LOC",

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
  READ_ALTIMETER_INHG: "READ_ALTIMETER_INHG",
  READ_WRITE_ALTIMETER_SETTING: "READ_WRITE_ALTIMETER_SETTING",

  XPLANE_VERSION: "sim/version/xplane_internal_version"
};

type DatarefMap = {
  [aircraft in SupportedAircraftType]: {
    [dataref: string]: DatarefData;
  };
};

type DatarefData = {
  isCommand: boolean;
  value: string;
  onValue: number;
  offValue: number;
  writeValue?: string;
  displayValueMap?: { [key: number]: string };
  maxValue?: number;
  minValue?: number;
  valueMultiplier?: number;
};

export const datarefMap: DatarefMap = {
  [SupportedAircraftType.Default]: {
    [DatarefsType.READ_WRITE_IAS_MACH]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/airspeed_dial_kts_mach",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_IS_MACH]: {
      isCommand: false,
      value: "sim/cockpit/autopilot/airspeed_is_mach",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_ENABLE_IAS]: {
      isCommand: true,
      value: "sim/autopilot/autothrottle_toggle",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_HEADING]: {
      isCommand: false,
      value: "sim/cockpit/autopilot/heading_mag",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_HEADING_SELECT]: {
      isCommand: true,
      value: "sim/autopilot/heading",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_ALTITUDE]: {
      isCommand: false,
      value: "sim/cockpit/autopilot/altitude",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_ALTITUDE_SELECT]: {
      isCommand: true,
      value: "sim/autopilot/altitude_hold",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_VERTICAL_SPEED]: {
      isCommand: false,
      value: "sim/cockpit/autopilot/vertical_velocity",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_VERTICAL_SPEED_SELECT]: {
      isCommand: true,
      value: "sim/autopilot/vertical_speed_pre_sel",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_AP_ONE]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/servos_on",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_AP_ONE]: {
      isCommand: true,
      value: "sim/autopilot/servos_toggle",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_AP_TWO]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/servos2_on",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_AP_TWO]: {
      isCommand: true,
      value: "sim/autopilot/servos2_toggle",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_ATHR]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/autothrottle_enabled",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_ATHR]: {
      isCommand: true,
      value: "sim/autopilot/autothrottle_arm",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_APPR]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/approach_status",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_APPR]: {
      isCommand: true,
      value: "sim/autopilot/approach",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_LNAV]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/heading_mode",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_LNAV]: {
      isCommand: true,
      value: "sim/autopilot/hdg_nav",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_VNAV]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/fms_vnav",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_VNAV]: {
      isCommand: true,
      value: "sim/autopilot/vnav_spd",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_COM1_ACTIVE]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com1_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM1_STANDBY]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com1_standby_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM1_STANDBY]: {
      isCommand: true,
      value: "sim/radios/com1_standy_flip",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM1_MONITOR]: {
      isCommand: true,
      value: "sim/audio_panel/monitor_audio_com1",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM1_VOLUME]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/audio_volume_com1",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_COM2_ACTIVE]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com2_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM2_STANDBY]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com2_standby_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM2_STANDBY]: {
      isCommand: true,
      value: "sim/radios/com2_standy_flip",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM2_MONITOR]: {
      isCommand: true,
      value: "sim/audio_panel/monitor_audio_com2",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM2_VOLUME]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/audio_volume_com2",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_LOC]: {
      isCommand: true,
      value: "sim/cockpit2/autopilot/hnav_armed",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_LOC]: {
      isCommand: true,
      value: "sim/autopilot/NAV",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_HSI_RANGE]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_IS_QNH]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: -1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_IS_STD]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_ALTIMETER_INHG]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_ALTIMETER_SETTING]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
  },
  //
  // Zibo configuration
  //
  [SupportedAircraftType.Zibo737]: {
    [DatarefsType.READ_WRITE_IAS_MACH]: {
      isCommand: false,
      value: "laminar/B738/autopilot/mcp_speed_dial_kts_mach",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_IS_MACH]: {
      isCommand: true,
      value: "laminar/B738/autopilot/change_over_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_ENABLE_IAS]: {
      isCommand: true,
      value: "laminar/B738/autopilot/speed_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_HEADING]: {
      isCommand: false,
      value: "laminar/B738/autopilot/mcp_hdg_dial",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_HEADING_SELECT]: {
      isCommand: true,
      value: "laminar/B738/autopilot/hdg_sel_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_ALTITUDE]: {
      isCommand: false,
      value: "laminar/B738/autopilot/mcp_alt_dial",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_ALTITUDE_SELECT]: {
      isCommand: true,
      value: "laminar/B738/autopilot/lvl_chg_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_VERTICAL_SPEED]: {
      isCommand: false,
      value: "laminar/autopilot/ap_vvi_dial",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_VERTICAL_SPEED_SELECT]: {
      isCommand: true,
      value: "laminar/B738/autopilot/vs_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_AP_ONE]: {
      isCommand: false,
      value: "laminar/B738/autopilot/cmd_a_status",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_AP_ONE]: {
      isCommand: true,
      value: "laminar/B738/autopilot/cmd_a_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_AP_TWO]: {
      isCommand: false,
      value: "laminar/B738/autopilot/cmd_b_status",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_AP_TWO]: {
      isCommand: true,
      value: "laminar/B738/autopilot/cmd_b_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_ATHR]: {
      isCommand: false,
      value: "laminar/B738/autopilot/autothrottle_arm_pos",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_ATHR]: {
      isCommand: true,
      value: "laminar/B738/autopilot/autothrottle_arm_toggle",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_APPR]: {
      isCommand: false,
      value: "laminar/B738/autopilot/app_status",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_APPR]: {
      isCommand: true,
      value: "laminar/B738/autopilot/app_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_LNAV]: {
      isCommand: false,
      value: "laminar/B738/autopilot/lnav_status",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_LNAV]: {
      isCommand: true,
      value: "laminar/B738/autopilot/lnav_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_VNAV]: {
      isCommand: false,
      value: "laminar/B738/autopilot/vnav_status1",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_VNAV]: {
      isCommand: true,
      value: "laminar/B738/autopilot/vnav_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_COM1_ACTIVE]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com1_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM1_STANDBY]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com1_standby_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM1_STANDBY]: {
      isCommand: true,
      value: "sim/radios/com1_standy_flip",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM1_MONITOR]: {
      isCommand: true,
      value: "sim/audio_panel/monitor_audio_com1",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM1_VOLUME]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/audio_volume_com1",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_COM2_ACTIVE]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com2_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM2_STANDBY]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com2_standby_frequency_hz_833",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM2_STANDBY]: {
      isCommand: true,
      value: "sim/radios/com2_standy_flip",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.TOGGLE_COM2_MONITOR]: {
      isCommand: true,
      value: "sim/audio_panel/monitor_audio_com2",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_COM2_VOLUME]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/audio_volume_com2",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_LOC]: {
      isCommand: false,
      value: "laminar/B738/autopilot/vorloc_status",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_LOC]: {
      isCommand: true,
      value: "laminar/B738/autopilot/vorloc_press",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_HSI_RANGE]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_IS_QNH]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: -1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_IS_STD]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_ALTIMETER_INHG]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_ALTIMETER_SETTING]: {
      isCommand: false,
      value: "NOTIMPLEMENTED",
      onValue: 1,
      offValue: 0,
    },
  },
  //
  // FF757/767 configuration
  //
  [SupportedAircraftType.FF757]: {
    [DatarefsType.READ_WRITE_IAS_MACH]: {
      isCommand: false,
      value: "757Avionics/ap/spd_act",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_WRITE_IS_MACH]: {
      isCommand: false,
      value: "1-sim/AP/iasmach",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_ENABLE_IAS]: {
      isCommand: false,
      value: "1-sim/AP/spdButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_HEADING]: {
      isCommand: false,
      value: "757Avionics/ap/hdg_act",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.WRITE_HEADING_SELECT]: {
      isCommand: false,
      value: "1-sim/AP/hdgConfButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_ALTITUDE]: {
      isCommand: false,
      value: "757Avionics/ap/alt_act",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.WRITE_ALTITUDE_SELECT]: {
      isCommand: false,
      value: "1-sim/AP/flchButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_VERTICAL_SPEED]: {
      isCommand: false,
      value: "757Avionics/ap/vs_act",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.WRITE_VERTICAL_SPEED_SELECT]: {
      isCommand: false,
      value: "1-sim/AP/vviButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_AP_ONE]: {
      isCommand: false,
      value: "1-sim/AP/cmd_L_Button",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_AP_ONE]: {
      isCommand: false,
      value: "1-sim/AP/cmd_L_Button",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_AP_TWO]: {
      isCommand: false,
      value: "1-sim/AP/cmd_R_Button",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_AP_TWO]: {
      isCommand: false,
      value: "1-sim/AP/cmd_R_Button",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_ATHR]: {
      isCommand: false,
      value: "1-sim/AP/atSwitcher",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.WRITE_ATHR]: {
      isCommand: false,
      value: "1-sim/AP/atSwitcher",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_APPR]: {
      isCommand: false,
      value: "1-sim/AP/appButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_APPR]: {
      isCommand: false,
      value: "1-sim/AP/appButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_LNAV]: {
      isCommand: false,
      value: "1-sim/AP/lnavButton",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.WRITE_LNAV]: {
      isCommand: false,
      value: "1-sim/AP/lnavButton",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_VNAV]: {
      isCommand: false,
      value: "1-sim/AP/vnavButton",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.WRITE_VNAV]: {
      isCommand: false,
      value: "1-sim/AP/vnavButton",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_COM1_ACTIVE]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com1_frequency_hz_833",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_WRITE_COM1_STANDBY]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com1_standby_frequency_hz_833",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.TOGGLE_COM1_STANDBY]: {
      isCommand: true,
      value: "sim/radios/com1_standy_flip",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.TOGGLE_COM1_MONITOR]: {
      isCommand: true,
      value: "sim/audio_panel/monitor_audio_com1",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_WRITE_COM1_VOLUME]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/audio_volume_com1",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_COM2_ACTIVE]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com2_frequency_hz_833",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_WRITE_COM2_STANDBY]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/com2_standby_frequency_hz_833",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.TOGGLE_COM2_STANDBY]: {
      isCommand: true,
      value: "sim/radios/com2_standy_flip",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.TOGGLE_COM2_MONITOR]: {
      isCommand: true,
      value: "sim/audio_panel/monitor_audio_com2",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_WRITE_COM2_VOLUME]: {
      isCommand: false,
      value: "sim/cockpit2/radios/actuators/audio_volume_com2",
      onValue: 0,
      offValue: 1,
    },
    [DatarefsType.READ_LOC]: {
      isCommand: false,
      value: "1-sim/AP/locButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_LOC]: {
      isCommand: false,
      value: "1-sim/AP/locButton",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_HSI_RANGE]: {
      isCommand: false,
      value: "1-sim/ndpanel/1/hsiRangeRotary",
      writeValue: "1-sim/ng/rangeL/anim",
      onValue: 1,
      offValue: 0,
      valueMultiplier: 5,
      displayValueMap: {
        0: "5",
        1: "10",
        2: "20",
        3: "40",
        4: "80",
        5: "160",
        6: "320",
      },
    },
    [DatarefsType.READ_WRITE_IS_QNH]: {
      isCommand: false,
      value: "1-sim/ng/baroLargeL/anim",
      onValue: -1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_IS_STD]: {
      isCommand: false,
      value: "1-sim/ng/baro/std/L",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_ALTIMETER_INHG]: {
      isCommand: false,
      value: "sim/cockpit2/gauges/actuators/barometer_setting_in_hg_pilot",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.READ_WRITE_ALTIMETER_SETTING]: {
      isCommand: false,
      value: "1-sim/ng/baroSmallL/anim",
      onValue: 1,
      offValue: 0,
      valueMultiplier: 5,
    },
  },
};
