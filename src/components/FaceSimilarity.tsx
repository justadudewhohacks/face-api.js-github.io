import { FormControl, Input, InputLabel } from '@material-ui/core';
import * as React from 'react';

export type FaceSimilarityProps = {
  text: string
  isMatch: boolean
}

export const FaceSimilarity = (props: FaceSimilarityProps) =>
  <FormControl>
    <InputLabel htmlFor="distance">
      Distance:
    </InputLabel>
    <Input
      id="distance"
      value={props.text}
      style={{ backgroundColor: props.isMatch ? '#b2ff59' : '#ea605d' }}
    />
  </FormControl>
