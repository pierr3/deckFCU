import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { SpeedDial } from "./actions/speed-dial";
import { AltitudeDial } from "./actions/alt-dial";
import { HeadingDial } from "./actions/hdg-dial";
import { VerticalSpeedDial } from "./actions/vs-dial";
import { startXPlaneComm } from "./xplane/XPlaneComm";
import { AutothrottleToggle } from "./actions/autothrottle";
import { AutoPilotOne } from "./actions/autopilot-one";
import { AutoPilotTwo } from "./actions/autopilot-two";
import { ApprToggle } from "./actions/appr";
import { VNAVToggle } from "./actions/vnav";
import { LNAVToggle } from "./actions/lnav";
import { AircraftSelectorAction } from "./actions/aircraftSelector";
import { Com1ActiveDial } from "./actions/com/com1Active";
import { Com1StandbyDial } from "./actions/com/com1Standby";
import { Com2StandbyDial } from "./actions/com/com2Standby";
import { Com2ActiveDial } from "./actions/com/com2Active";
import { VorLocToggle } from "./actions/vorloc";
import { HsiRange } from "./actions/hsiRange";
import { QnhSetting } from "./actions/qnh";
import { simDataProvider } from "./sim/simDataProvider";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.DEBUG);

startXPlaneComm();
simDataProvider.start();

// Register the increment action.
streamDeck.actions.registerAction(new SpeedDial());
streamDeck.actions.registerAction(new AltitudeDial());
streamDeck.actions.registerAction(new HeadingDial());
streamDeck.actions.registerAction(new VerticalSpeedDial());
streamDeck.actions.registerAction(new HsiRange());
streamDeck.actions.registerAction(new QnhSetting());

streamDeck.actions.registerAction(new AutothrottleToggle());
streamDeck.actions.registerAction(new AutoPilotOne());
streamDeck.actions.registerAction(new AutoPilotTwo());
streamDeck.actions.registerAction(new ApprToggle());
streamDeck.actions.registerAction(new VNAVToggle());
streamDeck.actions.registerAction(new LNAVToggle());
streamDeck.actions.registerAction(new VorLocToggle());
streamDeck.actions.registerAction(new AircraftSelectorAction());

streamDeck.actions.registerAction(new Com1ActiveDial());
streamDeck.actions.registerAction(new Com1StandbyDial());

streamDeck.actions.registerAction(new Com2ActiveDial());
streamDeck.actions.registerAction(new Com2StandbyDial());

// Finally, connect to the Stream Deck.
streamDeck.connect();

