import { FormControl, FormHelperText, Input, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

export type FileSelectionControlsItem = {
  url: string
  label: string
}

type FileSelectionControlsProps = {
  items: FileSelectionControlsItem[]
  selectedFile: string
  onChange: (value: string) => void
}

export const FileSelectionControls = ({ items, selectedFile, onChange }: FileSelectionControlsProps) =>
  <FormControl>
    <Select
      value={selectedFile}
      onChange={e => onChange(e.target.value)}
      input={<Input />}
    >
      {
        items.map(item =>
          <MenuItem
            key={item.url}
            value={item.url}
          >
            { item.label }
          </MenuItem>
        )
      }
    </Select>
    <FormHelperText>Pick a file</FormHelperText>
  </FormControl>