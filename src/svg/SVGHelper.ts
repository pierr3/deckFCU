import { AirbusBtnSVG } from "./airbus_btn";
import { BoeingBtnSVG } from "./boeing_btn";

import Mustache from "mustache";
import path from "path";

import { createRequire } from "module";
import streamDeck from "@elgato/streamdeck";
import { AirbusAltDial, AirbusGenericSvgDial, AirbusVsDial } from "./airbus_dials";
export const nodeRequire = createRequire(import.meta.url);
const { Resvg } = nodeRequire("@resvg/resvg-js");

export enum SVGTypes {
  AirbusBtn = "AirbusBtn",
  BoeingBtn = "BoeingBtn",
  AirbusGenericDial = "AirbusSpdDial",
  AirbusAltDial = "AirbusAltDial",
  AirbusVSDial = "AirbusVSDial",
}

export enum ButtonColors {
  Off = "30,30,30",
  AirbusOn = "94,240,87",
  BoeingOn = "148,78,40",
}

class SVGHelper {
  SVGHelper() {}

  private getFontFilePaths(): string[] {
    return [
      path.resolve("bin", "B612Mono-Regular.ttf"),
      path.resolve("bin", "B612Mono-Bold.ttf"),
      path.resolve("bin", "digital-7_mono.ttf"),
    ];
  }

  private getSvgOptions(dial: boolean = false): any {
    return {
      fitTo: {
        mode: "width",
        value: dial ? 200 : 576,
      },
      font: {
        fontFiles: this.getFontFilePaths(), // Load custom fonts.
        loadSystemFonts: false,
      },
      dpi: 96,
    };
  }

  public getButtonImageBase64(
    type: SVGTypes,
    text: string,
    fillColor: ButtonColors,
    textColor: string = "255,255,255"
  ): string {
    let svg = "";
    switch (type) {
      case SVGTypes.AirbusBtn:
        svg = AirbusBtnSVG;
        break;
      case SVGTypes.BoeingBtn:
        svg = BoeingBtnSVG;
        break;
    }

    const view = {
      btn_text: text,
      btn_fill: fillColor,
      btn_text_color: textColor,
    };
    const templateImage = Mustache.render(svg, view).replace(
      /(\r\n|\n|\r)/gm,
      ""
    );
    // const t = performance.now();
    const resvg = new Resvg(templateImage, this.getSvgOptions());
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    const b64 = pngBuffer.toString("base64");
    // streamDeck.logger.debug(
    //   "PNG Image size: " +
    //     new Blob([b64]).size * 0.001 +
    //     "kb rendered in " +
    //     (performance.now() - t) +
    //     "ms; "
    // );
    return b64;
  }

  public getDialImageBase64(
    dialType: SVGTypes,
    replacementMap: Record<string, string>
  ) {
    let svg = "";
    switch (dialType) {
      case SVGTypes.AirbusGenericDial:
        svg = AirbusGenericSvgDial;
        break;
      case SVGTypes.AirbusAltDial:
        svg = AirbusAltDial;
        break;
      case SVGTypes.AirbusVSDial:
        svg = AirbusVsDial;
        break;
    }

    const templateImage = Mustache.render(svg, replacementMap).replace(
      /(\r\n|\n|\r)/gm,
      ""
    );

    // const t = performance.now();
    const resvg = new Resvg(templateImage, this.getSvgOptions(true));
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    const b64 = pngBuffer.toString("base64");
    // streamDeck.logger.debug(
    //   "Dial PNG Image size: " +
    //     new Blob([b64]).size * 0.001 +
    //     "kb rendered in " +
    //     (performance.now() - t) +
    //     "ms; "
    // );
    return b64;
  }
}

export default new SVGHelper();
