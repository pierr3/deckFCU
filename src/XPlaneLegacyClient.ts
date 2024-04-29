/*
Copyright (c) 2020 Lianna Eeftinck <liannaee@gmail.com>

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Modified by Pierre Ferran to conver to typescript, and improve compatibility with X-Plane 12
*/

import * as dgram from "dgram";
import streamDeck from "@elgato/streamdeck";

const BIG_ENDIAN = false;

interface XPlaneClientSettings {
  host?: string;
  port?: number;
  debug?: boolean;
}

interface DataRef {
  dataRef: string;
  timesPerSecond: number;
  callback?: (dataRef: string, value: number) => void;
  value: number | null;
}

export default class XPlaneClient {
  private host: string;
  private port: number;
  private debug: boolean;
  private dataRefs: DataRef[];
  private index: number;
  private initialized: boolean;
  private client: dgram.Socket | null;

  constructor(settings: XPlaneClientSettings) {
    this.host = settings.host || "127.0.0.1";
    this.port = settings.port || 49000;
    this.debug = settings.debug || false;
    this.dataRefs = [];
    this.index = 0;
    this.initialized = false;
    this.client = null;
  }

  isConnected(): boolean {
    return this.client !== null;
  }

  checkConnection(): void {
    if (!this.client) {
      this.initConnection();
    }
  }

  connectionInfo(): dgram.Socket | null {
    return this.client;
  }

  private _sendBuffer(data: Buffer): void {
    this.initConnection();

    if (this.client) {
      this.client.send(data, this.port, this.host, (error) => {
        if (error) {
          if (this.client) {
            this.client.close();
          }
          this.client = null;
          streamDeck.logger.error(
            `XPlaneClient failed to send data X-Plane: ${error}`
          );
        }
      });
    }
  }

  requestDataRef(
    dataRef: string,
    timesPerSecond: number,
    callback?: (dataRef: string, value: number) => void
  ): void {
    let index = this.dataRefs.length;

    for (let i = 0; i < this.dataRefs.length; i += 1) {
      if (this.dataRefs[i].dataRef === dataRef) {
        index = i;
        if (this.debug) {
          streamDeck.logger.debug(
            `found and using existing dataref ${dataRef} on index ${index}`
          );
        }
      }
    }

    this.dataRefs[index] = {
      dataRef,
      timesPerSecond,
      callback,
      value: null,
    };
    const buffer = Buffer.alloc(413);
    buffer.write("RREF", 0);

    if (BIG_ENDIAN) {
      buffer.writeInt32BE(timesPerSecond, 5);
      buffer.writeInt32BE(index, 9);
    } else {
      buffer.writeInt32LE(timesPerSecond, 5);
      buffer.writeInt32LE(index, 9);
    }
    buffer.write(dataRef, 13, 400, "utf-8");

    this._sendBuffer(buffer);
  }

  setDataRef(dataRef: string, value: number): void {
    const buffer = Buffer.alloc(509, 0x20);
    buffer.write("DREF", 0, 4);
    buffer.writeInt8(0x00, 4);
    if (BIG_ENDIAN) {
      buffer.writeFloatBE(value, 5);
    } else {
      buffer.writeFloatLE(value, 5);
    }
    buffer.write(dataRef, 9);
    buffer.writeInt8(0x00, 9 + dataRef.length);
    streamDeck.logger.trace(`Setting dataref ${dataRef} to ${value}`);
    this._sendBuffer(buffer);
  }

  sendCommand(command: string): void {
    const buffer = Buffer.alloc(5 + command.length + 1);
    buffer.write("CMND", 0, 4);
    buffer.write(command, 5, command.length);
    this._sendBuffer(buffer);
  }

  private initConnection(): void {
    if (this.client === null) {
      try {
        this.client = dgram.createSocket("udp4");
        streamDeck.logger.debug("XPlaneClient initializing");
      } catch (e) {
        streamDeck.logger.error("XPlaneClient failed to initialize: " + e);
        return;
      }
    } else {
      streamDeck.logger.trace("XPlaneClient already initialized");
      return;
    }

    if (!this.client) {
      return;
    }

    // this.client.on("listening", () => {
    //   const address = this.client?.address();
    //   if (this.debug && address) {
    //     streamDeck.logger.debug(
    //       `XPlaneClient listening on ${address.address}:${address.port}`
    //     );
    //   }
    // });

    this.client.on("error", (err) => {
      streamDeck.logger.error(`XPlaneClient error:\n${err.stack}`);
      if (this.client) {
        this.client.close();
      }
      this.client = null;
    });

    this.client.on("message", (msg: Buffer) => {
      const command = msg.toString("utf8", 0, 4);

      if (command === "RPOS") {
        // Handle RPOS command
      } else if (command === "RREF") {
        const values = msg.toString("utf-8").slice(5); // Skipping over 'RREFx' header, get all values
        const numValues = Math.floor(values.length / 8); // Each dataref is 8 bytes long (index + value)

        for (let i = 0; i < numValues; i++) {
          const start = 5 + 8 * i;
          const end = 5 + 8 * (i + 1);
          const drefInfo = msg.subarray(start, end); // Extract the 8 byte segment

          const index = drefInfo.readInt32LE(0);
          const value = drefInfo.readFloatLE(4);

          const dataRef = this.dataRefs[index];
          if (this.debug) {
            streamDeck.logger.debug(
              `[${i + 1}/${index}] new value for dataRef ${index} is ${value}`
            );
          }

          if (dataRef.callback !== undefined) {
            dataRef.callback(dataRef.dataRef, value);
          }
        }
      }
    });
  }
}
