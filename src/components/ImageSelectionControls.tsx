import { FormControl, FormHelperText, Input, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

export type ImageSelectionControlsItem = {
  url: string
  label: string
}

type ImageSelectionControlsProps = {
  items: ImageSelectionControlsItem[]
  selectedImage: string
  onChange: (value: string) => void
}

export const ImageSelectionControls = ({ items, selectedImage, onChange }: ImageSelectionControlsProps) =>
  <FormControl>
    <Select
      value={selectedImage}
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
    <FormHelperText>Pick an image</FormHelperText>
  </FormControl>