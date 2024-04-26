import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { IncrementCounter } from "./actions/increment-counter";
import { SpeedDial } from "./actions/speed-dial";
import { AltitudeDial } from "./actions/alt-dial";
import { HeadingDial } from "./actions/hdg-dial";
import { VerticalSpeedDial } from "./actions/vs-dial";
import { startXPlaneComm } from "./xplaneHandler";
import { AutothrottleToggle } from "./actions/autothrottle";
import { AutoPilotOne } from "./actions/autopilot-one";
import { AutoPilotTwo } from "./actions/autopilot-two";
import { ApprToggle } from "./actions/appr";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.DEBUG);

// Register the increment action.
streamDeck.actions.registerAction(new SpeedDial());
streamDeck.actions.registerAction(new AltitudeDial());
streamDeck.actions.registerAction(new HeadingDial());
streamDeck.actions.registerAction(new VerticalSpeedDial());

streamDeck.actions.registerAction(new AutothrottleToggle());
streamDeck.actions.registerAction(new AutoPilotOne());
streamDeck.actions.registerAction(new AutoPilotTwo());
streamDeck.actions.registerAction(new ApprToggle());

// Finally, connect to the Stream Deck.
streamDeck.connect();

startXPlaneComm();
