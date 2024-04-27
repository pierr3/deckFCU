import { SupportedAircraftType } from "./aircraftSelector";

export enum DatarefsType {
  READ_WRITE_IAS_MACH,
  READ_WRITE_IS_MACH,
  WRITE_ENABLE_IAS,
  READ_WRITE_HEADING,
  WRITE_HEADING_SELECT,
  READ_WRITE_ALTITUDE,
  WRITE_ALTITUDE_SELECT,
  READ_WRITE_VERTICAL_SPEED,
  WRITE_VERTICAL_SPEED_SELECT,
  READ_AP_ONE,
  WRITE_AP_ONE,
  READ_AP_TWO,
  WRITE_AP_TWO,
  READ_ATHR,
  WRITE_ATHR,
  READ_APPR,
  WRITE_APPR,
  READ_LNAV,
  WRITE_LNAV,
  READ_VNAV,
  WRITE_VNAV,
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
      value: "sim/cockpit/autopilot/vertical_velocity",
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
      value: "laminar/B738/buttons/autopilot/cmd_a",
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
      value: "laminar/B738/buttons/autopilot/cmd_b",
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
      value: "laminar/B738/buttons/autopilot/app",
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
      value: "laminar/B738/buttons/autopilot/lnav",
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
      value: "laminar/B738/buttons/autopilot/vnav",
      onValue: 1,
      offValue: 0,
    },
    [DatarefsType.WRITE_VNAV]: {
      isCommand: true,
      value: "laminar/B738/autopilot/vnav_press",
      onValue: 1,
      offValue: 0,
    },
  },
};

// ZIBO 737 datarefs
// AUTOPILOT BUTTONS (read/write)
// ------------------------------
// pressed, if state change 0 -> 1 only
// N1					laminar/B738/buttons/autopilot/n1
// SPEED				laminar/B738/buttons/autopilot/speed
// LVL CHG				laminar/B738/buttons/autopilot/lvl_chg
// VNAV				laminar/B738/buttons/autopilot/vnav
// LNAV				laminar/B738/buttons/autopilot/lnav
// VOR LOC				laminar/B738/buttons/autopilot/vor_loc
// APP					laminar/B738/buttons/autopilot/app
// HDG SEL				laminar/B738/buttons/autopilot/hdg_sel
// ALT HLD				laminar/B738/buttons/autopilot/alt_hld
// VS					laminar/B738/buttons/autopilot/vs
// CMD a				laminar/B738/buttons/autopilot/cmd_a
// CMD b				laminar/B738/buttons/autopilot/cmd_b
// CWS a				laminar/B738/buttons/autopilot/cws_a
// CWS b				laminar/B738/buttons/autopilot/cws_b
// C/O (crossover)		laminar/B738/buttons/autopilot/co

// AUTOPILOT SWITCHES (read/write)
// ------------------------------
// F/D captain			0-off, 1-on		laminar/B738/switches/autopilot/fd_ca
// F/D first officer	0-off, 1-on		laminar/B738/switches/autopilot/fd_fo
// A/T arm				0-off, 1-on		laminar/B738/switches/autopilot/at_arm

// AUTOPILOT ROTARY (read/write)
// -----------------------------
// BANK ANGLE		0-10deg, 1-15deg, 2-20deg, 3-25deg, 4-30deg		laminar/B738/rotary/autopilot/bank_angle
// MCP IAS															sim/cockpit2/autopilot/airspeed_dial_kts_mach
// MCP HDG															laminar/B738/autopilot/mcp_hdg_dial
// MCP ALT															laminar/B738/autopilot/mcp_alt_dial
// MCP VVI															sim/cockpit2/autopilot/vvi_dial_fpm
// CRS captain														laminar/B738/autopilot/course_pilot
// CRS first officer												laminar/B738/autopilot/course_copilot

// AUTOPILOT DISPLAY (read)
// ------------------------
// MCP SPD					sim/cockpit2/autopilot/airspeed_dial_kts_mach
// MCP SPD DIGIT 8			laminar/B738/mcp/digit_8
// MCP SPD DIGIT A			laminar/B738/mcp/digit_A
// MCP HDG					laminar/B738/autopilot/mcp_hdg_dial
// MCP ALT					laminar/B738/autopilot/mcp_alt_dial
// MCP VVI					sim/cockpit2/autopilot/vvi_dial_fpm
// MCP CRS captain			laminar/B738/autopilot/course_pilot
// MCP CRS first officer	laminar/B738/autopilot/course_copilot
