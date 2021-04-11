import React from "react";
import {Select} from 'antd';
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

  const nodeClassName = formatClassName(["mp-color", className]);

  const {Option} = Select;

  return (
    <div {...rest} className={nodeClassName}>
      <div className='mp-color__color-type'>
      <Select defaultValue="solid" style={{width: 110}} bordered={false}>
        <Option value="solid">Solid color</Option>
        <Option value="gradient">Gradient</Option>
      </Select>
      </div>
      <Saturation hsva={hsva} onChange={updateHsva} />
      <div className='mp-color__controls'>
        <div className='mp-color__eyedropper'>
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
          <Alpha hsva={hsva} onChange={updateHsva} className="mp-color__last-control" />
        </div>
      </div>
    </div>
  );
};
