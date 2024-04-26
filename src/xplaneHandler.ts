import XPlaneClient from "./XPlaneLegacyClient";
import streamDeck from "@elgato/streamdeck";

export const xclient = new XPlaneClient({});

let intervalId: NodeJS.Timeout;

export function startXPlaneComm() {
  streamDeck.logger.info("Starting XPlaneComm");
  xclient.checkConnection();
  intervalId = setInterval(() => {
    if (!xclient.isConnected()) {
      streamDeck.logger.info(
        "XPlaneClient is not connected, attempting to reconnect."
      );
      xclient.checkConnection();
    }
  }, 5000);
}
