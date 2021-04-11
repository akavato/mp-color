import React from "react";

import { Hue } from "./Hue";
import { Saturation } from "./Saturation";
import { Alpha } from "./Alpha";
import ColorizeIcon from './ColorizeIcon';
import Eyedropper from './Eyedropper';

import { ColorModel, ColorPickerBaseProps, AnyColor } from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { useStyleSheet } from "../../hooks/useStyleSheet";
import { formatClassName } from "../../utils/format";

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

export const AlphaColorPicker = <T extends AnyColor>({
  className,
  colorModel,
  color = colorModel.defaultColor,
  onChange,
  rootElement,
  useScreenCaptureAPI,
  ...rest
}: Props<T>): JSX.Element => {
  useStyleSheet();

  const [hsva, updateHsva] = useColorManipulation<T>(colorModel, color, onChange);

  const nodeClassName = formatClassName(["react-colorful", className]);

  return (
    <div {...rest} className={nodeClassName}>
      <div className='react-colorful__color-type'></div>
      <Saturation hsva={hsva} onChange={updateHsva} />
      <div className='react-colorful__controls'>
        <div className='react-colorful__eyedropper'>
          <ColorizeIcon
             style={{
              width: '18px',
              height: '18px',
              fill: '#364364'
            }}
          />
          <Eyedropper rootElement={rootElement} useScreenCaptureAPI={!!useScreenCaptureAPI} onChange={updateHsva} />
        </div>
        <div style={{width: '100%'}}>
          <Hue hue={hsva.h} onChange={updateHsva} />
          <Alpha hsva={hsva} onChange={updateHsva} className="react-colorful__last-control" />
        </div>
      </div>
    </div>
  );
};
