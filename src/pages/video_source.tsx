import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { EXAMPLE_VIDEO, MODELS_URI } from '../../tmp/src/const';
import { FaceClassificationToggleControls } from '../components/FaceClassificationToggleControls';
import { FaceDetectorSelection } from '../components/FaceDetectorSelection';
import { getFaceDetectionNetFromName, getFaceDetectorNameFromOptions } from '../components/FaceDetectorSelection/const';
import { ShowBoxesSelection } from '../components/ShowBoxesSelection';
import { SideBySide } from '../components/styled/SideBySide';
import { VideoWithOverlay } from '../components/VideoWithOverlay';
import { FaceClassificationPageState, getDefaultFaceClassificationPageState } from '../FaceClassificationPageState';
import { processFaceClassificationInputs } from '../processFaceClassificationInputs';
import { Root } from '../Root';

export default class extends React.Component<{}, FaceClassificationPageState<HTMLVideoElement>> {
  state = getDefaultFaceClassificationPageState<HTMLVideoElement>()

  async loadFaceDetector(detectorName: string) {
    await getFaceDetectionNetFromName(detectorName).loadFromUri(MODELS_URI)
    this.setState({ isFaceDetectorLoaded: true })
  }

  async loadModels() {
    await Promise.all([
      this.loadFaceDetector(getFaceDetectorNameFromOptions(this.state.faceDetectionOptions)),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URI),
      faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URI),
      faceapi.nets.ageGenderNet.loadFromUri(MODELS_URI)
    ])
    this.setState({ areModelsLoaded: true })
  }

  onFaceDetectionOptionsChanged = async (faceDetectionOptions: faceapi.FaceDetectionOptions) => {
    const detectorName = getFaceDetectorNameFromOptions(faceDetectionOptions)
    const prevDetectorName = getFaceDetectorNameFromOptions(this.state.faceDetectionOptions)
    if (detectorName !== prevDetectorName) {
      await this.loadFaceDetector(detectorName)
      getFaceDetectionNetFromName(prevDetectorName).dispose()
    }
    this.setState({ faceDetectionOptions })
  }

  processNextFrame = async () => {
    await processFaceClassificationInputs(this.state)
    setTimeout(this.processNextFrame, 16)
  }

  componentDidMount() {
    this.loadModels()
    this.processNextFrame()
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document)) {
      return null
    }

    return(
      <Root>
        <SideBySide>
          <Mui.FormControl>
            <FaceDetectorSelection
              initialFaceDetectionOptions={this.state.faceDetectionOptions}
              onFaceDetectionOptionsChanged={this.onFaceDetectionOptionsChanged}
            />
            <ShowBoxesSelection
              showBoxesOption={this.state.showBoxesOption}
              onChange={showBoxesOption => this.setState({ showBoxesOption })}
            />
          </Mui.FormControl>
          <FaceClassificationToggleControls
            onChange={options => this.setState(options)}
          />
        </SideBySide>
        <VideoWithOverlay
          onLoaded={refs => this.setState(refs)}
          maxVideoWidth={800}
          src={EXAMPLE_VIDEO}
        />
      </Root>
    )
  }
}