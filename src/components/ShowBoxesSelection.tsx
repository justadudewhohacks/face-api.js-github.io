import * as Mui from '@material-ui/core';
import * as React from 'react';

export enum ShowBoxesOption {
  HIDE_BOXES = 'Hide Boxes',
  SHOW_ORIGINAL_BOXES = 'Show Original Boxes',
  SHOW_ALIGNED_BOXES = 'Show Aligned Boxes',
}

export type ShowBoxesSelectionProps = {
  showBoxesOption: ShowBoxesOption
  onChange: (options: ShowBoxesOption) => any
}

export function ShowBoxesSelection({ showBoxesOption, onChange }: ShowBoxesSelectionProps) {
  function onChangeShowBoxesOption(e: any) {
    onChange(ShowBoxesOption[e.target.value] as ShowBoxesOption)
  }

  return (
    <Mui.FormControl>
      <Mui.Select
        value={showBoxesOption}
        onChange={onChangeShowBoxesOption}
        renderValue={value => value}
        name="Face Boxes"
      >
        {
          Object.keys(ShowBoxesOption).map((key: string) =>
            <Mui.MenuItem
              key={key}
              value={key}
              selected={showBoxesOption === ShowBoxesOption[key]}
            >
              { ShowBoxesOption[key] }
            </Mui.MenuItem>
          )
        }
      </Mui.Select>
    </Mui.FormControl>
  )
}