import React from 'react';
import { RgbaStringColorPicker } from './RgbaStringColorPicker';
import 'antd/dist/antd.css';

export default {
  title: 'RgbaStringColorPicker',
  component: RgbaStringColorPicker,
}

const Template = (args) => {
  return (
    <RgbaStringColorPicker {...args} />
  );
};

export const Common = Template.bind({});
Common.args = {color: '#fac', useScreenCaptureAPI: true};
