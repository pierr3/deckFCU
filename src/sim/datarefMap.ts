import { SupportedAircraftType } from "./aircraftSelector";

export enum DatarefsType {
	// Dials
	READ_WRITE_IAS_MACH = 0,
	READ_WRITE_IS_MACH = 1,
	WRITE_ENABLE_IAS = 2,
	READ_WRITE_HEADING = 3,
	WRITE_HEADING_SELECT = 4,
	READ_WRITE_ALTITUDE = 5,
	WRITE_ALTITUDE_SELECT = 6,
	READ_WRITE_VERTICAL_SPEED = 7,
	WRITE_VERTICAL_SPEED_SELECT = 8,

	// Buttons
	READ_AP_ONE = 9,
	WRITE_AP_ONE = 10,
	READ_AP_TWO = 11,
	WRITE_AP_TWO = 12,
	READ_ATHR = 13,
	WRITE_ATHR = 14,
	READ_APPR = 15,
	WRITE_APPR = 16,
	READ_LNAV = 17,
	WRITE_LNAV = 18,
	READ_VNAV = 19,
	WRITE_VNAV = 20,
	READ_LOC = 21,
	WRITE_LOC = 22,

	// Comms
	READ_COM1_ACTIVE = 23,
	READ_WRITE_COM1_STANDBY = 24,
	TOGGLE_COM1_STANDBY = 25,
	TOGGLE_COM1_MONITOR = 26,
	READ_WRITE_COM1_VOLUME = 27,

	READ_COM2_ACTIVE = 28,
	READ_WRITE_COM2_STANDBY = 29,
	TOGGLE_COM2_STANDBY = 30,
	TOGGLE_COM2_MONITOR = 31,
	READ_WRITE_COM2_VOLUME = 32,
}

type DatarefMap = {
  [aircraft in SupportedAircraftType]: {
    [dataref in DatarefsType]: DatarefData;
  };
};

type DatarefData = {
  isCommand: boolean;
  value: string;
  onValue: number;
  offValue: number;
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
  },
};
