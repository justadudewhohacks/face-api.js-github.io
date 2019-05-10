import * as Mui from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';

import { SideBySide } from './styled/SideBySide';
import styled from 'styled-components';

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

const Container = styled.div`
  margin: 10px;
`

export type FaceClassificationOptions = {
  withFaceLandmarks: boolean
  withFaceExpressions: boolean
  withAgeAndGender: boolean
  withShowBoxes: boolean
  withShowFaceLandmarks: boolean
}

export type FaceClassificationToggleControlsProps = {
  onChange: (options: FaceClassificationOptions) => any
}

export function FaceClassificationToggleControls({ onChange }: FaceClassificationToggleControlsProps) {
  const [withFaceLandmarks, setWithFaceLandmarks] = useState(false)
  const [withFaceExpressions, setWithFaceExpressions] = useState(false)
  const [withAgeAndGender, setWithAgeAndGender] = useState(false)
  const [withShowBoxes, setWithShowBoxes] = useState(true)
  const [withShowFaceLandmarks, setWithShowFaceLandmarks] = useState(true)

  function getState(): FaceClassificationOptions {
    return {
      withFaceLandmarks,
      withFaceExpressions,
      withAgeAndGender,
      withShowBoxes,
      withShowFaceLandmarks
    }
  }

  function onChangeWithFaceLandmarks() {
    setWithFaceLandmarks(!withFaceLandmarks)
    onChange({ ...getState(), withFaceLandmarks: !withFaceLandmarks })
  }

  function onChangeWithFaceExpressions() {
    setWithFaceExpressions(!withFaceExpressions)
    onChange({ ...getState(), withFaceExpressions: !withFaceExpressions })
  }

  function onChangeWithAgeAndGender() {
    setWithAgeAndGender(!withAgeAndGender)
    onChange({ ...getState(), withAgeAndGender: !withAgeAndGender })
  }

  function onChangeWithShowBoxes() {
    setWithShowBoxes(!withShowBoxes)
    onChange({ ...getState(), withShowBoxes: !withShowBoxes })
  }

  function onChangeWithShowFaceLandmarks() {
    setWithShowFaceLandmarks(!withShowFaceLandmarks)
    onChange({ ...getState(), withShowFaceLandmarks: !withShowFaceLandmarks })
  }

  return (
    <Container>
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
      <SideBySide>
        <Checkbox
          label="Show Boxes"
          isActive={withShowBoxes}
          onChange={onChangeWithShowBoxes}
        />
        <Checkbox
          label="Show Face Landmarks"
          isActive={withShowFaceLandmarks}
          onChange={onChangeWithShowFaceLandmarks}
        />
      </SideBySide>
    </Container>
  )
}