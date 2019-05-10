import * as Mui from '@material-ui/core';
import * as MuiIcons from '@material-ui/icons';
import * as React from 'react';
import styled from 'styled-components';

const TabComponent = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-left: 8px;
  }
`

export enum InputType {
  IMAGE = 0,
  WEBCAM = 1,
  VIDEO = 2
}

export type InputTypeTabsProps = {
  inputType: InputType
  onChange: (inputType: InputType) => any
}

export const InputTypeTabs = ({ inputType, onChange }: InputTypeTabsProps) =>
  <Mui.AppBar position="static">
    <Mui.Tabs value={inputType} onChange={(_: any, inputType: InputType) => onChange(inputType)}>
      <Mui.Tab icon={<TabComponent><span>Image</span> <MuiIcons.Image /></TabComponent>} />
      <Mui.Tab icon={<TabComponent><span>Webcam</span><MuiIcons.Videocam /></TabComponent>} />
      <Mui.Tab icon={<TabComponent><span>Video</span><MuiIcons.VideoLibrary /></TabComponent>} />
    </Mui.Tabs>
  </Mui.AppBar>