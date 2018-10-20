import { Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import { FaceDetectionOptions, TinyFaceDetectorOptions } from 'face-api.js';
import * as React from 'react';

import { ReactElement } from '../../face-api.js-react/types';
import { FACE_DETECTORS, isMtcnn, isSsdMobilenetv1, isTinyFaceDetector } from '../const';
import { MtcnnControls } from './MtcnnControls';
import { SsdMobilenetv1Controls } from './SsdMobilenetv1Controls';
import { TinyFaceDetectorControls } from './TinyFaceDetectorControls';

export interface SelectFaceDetectorProps {
  children: (
    detectorName: string,
    faceDetectionOptions: FaceDetectionOptions,
    renderSelection: () => ReactElement,
    renderFaceDetectionControls: () => ReactElement
  ) => ReactElement,
  initialFaceDetector: string,
  initialTinyFaceDetectorOptions?: TinyFaceDetectorOptions
}

export interface SelectFaceDetectorState {
  detector: string
}

export class SelectFaceDetector extends React.Component<SelectFaceDetectorProps, SelectFaceDetectorState> {
  constructor(props: SelectFaceDetectorProps) {
    super(props)
    this.state = {
      detector: props.initialFaceDetector
    }
  }

  renderSelection = () =>
    <div style={{ marginRight: 10 }}>
      <InputLabel htmlFor="selectFaceDetector">
        Choose face detector:
      </InputLabel>
      <Select
        value={this.state.detector}
        onChange={e => this.setState({ detector: e.target.value })}
        input={<Input />}
        id="selectFaceDetector"
      >
      {
        FACE_DETECTORS.map(item =>
          <MenuItem
            key={item}
            value={item}
          >
            { item }
          </MenuItem>
        )
      }
      </Select>
    </div>

  render() {
    const renderChildren = (options: FaceDetectionOptions, renderControls: () => ReactElement) =>
      this.props.children(this.state.detector, options, this.renderSelection, renderControls)

    if (isSsdMobilenetv1(this.state.detector)) {
      return (
        <SsdMobilenetv1Controls>
          { renderChildren }
        </SsdMobilenetv1Controls>
      )
    } else if (isTinyFaceDetector(this.state.detector)) {
      return (
        <TinyFaceDetectorControls
          inputSizes={[128, 160, 224, 320, 416, 512, 608]}
          initialDetectionParams={this.props.initialTinyFaceDetectorOptions}
        >
          { renderChildren }
        </TinyFaceDetectorControls>
      )
    } else if (isMtcnn(this.state.detector)) {
      return (
        <MtcnnControls>
          { renderChildren }
        </MtcnnControls>
      )
    }
  }
}
