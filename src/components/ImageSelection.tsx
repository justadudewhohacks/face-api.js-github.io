import { FormControl, FormHelperText, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

export type ImageSelectionItem = {
  url: string
  label: string
}

type ImageSelectionProps = {
  items: ImageSelectionItem[]
  selectedImage: string
  onChange: (value: string) => void
}

export const ImageSelection = ({ items, selectedImage, onChange }: ImageSelectionProps) =>
  <FormControl>
    <InputLabel htmlFor="age-helper">Age</InputLabel>
    <Select
      value={selectedImage}
      onChange={e => onChange(e.target.value)}
      input={<Input name="age" id="age-helper" />}
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