import { FormControl, FormHelperText, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

type ImageSelectionProps = {
  defaultValue: string
  items: string[]
  onChange: (value: string) => void
}

export const ImageSelection = ({ defaultValue, items, onChange }: ImageSelectionProps) =>
  <FormControl>
    <InputLabel htmlFor="age-helper">Age</InputLabel>
    <Select
      value={defaultValue}
      onChange={e => onChange(e.target.value)}
      input={<Input name="age" id="age-helper" />}
    >
      {
        items.map(item =>
          <MenuItem
            key={item}
            value={item}
          >
            {item}
          </MenuItem>
        )
      }
    </Select>
    <FormHelperText>Pick an image</FormHelperText>
  </FormControl>