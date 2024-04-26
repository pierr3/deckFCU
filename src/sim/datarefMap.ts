import { SupportedAircraftType } from "./aircraftSelector";

export enum DatarefsType {
  READ_WRITE_IAS_MACH,
  READ_WRITE_IS_MACH,
  WRITE_ENABLE_IAS,
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
  },
  [SupportedAircraftType.Zibo737]: {
    [DatarefsType.READ_WRITE_IAS_MACH]: {
      isCommand: false,
      value: "sim/cockpit2/autopilot/airspeed_dial_kts_mach",
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
