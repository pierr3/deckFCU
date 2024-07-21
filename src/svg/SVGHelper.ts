import { AirbusBtnSVG } from "./airbus_btn";
import { BoeingBtnSVG } from "./boeing_btn";

import Mustache from "mustache";
import { JetBrainsFontBase64 } from "./jetbrains_font";

export enum SVGTypes {
  AirbusBtn = "AirbusBtn",
  BoeingBtn = "BoeingBtn",
}

export enum ButtonColors {
  Off = "30,30,30",
  AirbusOn = "94,240,87",
  BoeingOn = "148,78,40",
}

export const GetButtonImageBase64 = (
  type: SVGTypes,
  text: string,
  fillColor: ButtonColors,
  textColor: string = "255,255,255"
): string => {
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
    font_data: JetBrainsFontBase64,
  };
  const image = Mustache.render(svg, view);
  const b = Buffer.from(image);

  return b.toString("base64");
};
