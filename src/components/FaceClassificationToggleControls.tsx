import * as Mui from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';

import { SideBySide } from './styled/SideBySide';

export type CheckboxProps = {
  label: string
  isActive: boolean
  onChange: () => any
}

const Checkbox = ({ label, isActive, onChange }: CheckboxProps) =>
  <Mui.FormControlLabel
    control={
      <Mui.Checkbox
        checked={isActive}
        onChange={onChange}
        color="primary"
      />
    }
    label={ label }
  />

export type FaceClassificationOptions = {
  withFaceLandmarks: boolean
  withFaceExpressions: boolean
  withAgeAndGender: boolean
}

export type FaceClassificationToggleControlsProps = {
  onChange: (options: FaceClassificationOptions) => any
}

export function FaceClassificationToggleControls({ onChange }: FaceClassificationToggleControlsProps) {
  const [withFaceLandmarks, setWithFaceLandmarks] = useState(false)
  const [withFaceExpressions, setWithFaceExpressions] = useState(false)
  const [withAgeAndGender, setWithAgeAndGender] = useState(false)

  function onChangeWithFaceLandmarks() {
    setWithFaceLandmarks(!withFaceLandmarks)
    onChange({ withAgeAndGender, withFaceExpressions, withFaceLandmarks: !withFaceLandmarks })
  }

  function onChangeWithFaceExpressions() {
    setWithFaceExpressions(!withFaceExpressions)
    onChange({ withAgeAndGender, withFaceLandmarks, withFaceExpressions: !withFaceExpressions })
  }

  function onChangeWithAgeAndGender() {
    setWithAgeAndGender(!withAgeAndGender)
    onChange({ withFaceExpressions, withFaceLandmarks, withAgeAndGender: !withAgeAndGender })
  }

  return (
    <SideBySide>
      <Checkbox
        label="Face Landmarks"
        isActive={withFaceLandmarks}
        onChange={onChangeWithFaceLandmarks}
      />
      <Checkbox
        label="Face Expressions"
        isActive={withFaceExpressions}
        onChange={onChangeWithFaceExpressions}
      />
      <Checkbox
        label="Age and Gender"
        isActive={withAgeAndGender}
        onChange={onChangeWithAgeAndGender}
      />
    </SideBySide>
  )
}