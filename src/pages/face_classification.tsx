import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { EXAMPLE_VIDEO, MODELS_URI } from '../../tmp/src/const';
import { FaceClassificationToggleControls } from '../components/FaceClassificationToggleControls';
import { FaceDetectorSelection } from '../components/FaceDetectorSelection';
import { getFaceDetectionNetFromName, getFaceDetectorNameFromOptions } from '../components/FaceDetectorSelection/const';
import { InputType, InputTypeTabs } from '../components/InputTypeTabs';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { SideBySide } from '../components/styled/SideBySide';
import { VideoWithOverlay } from '../components/VideoWithOverlay';
import { WebcamVideoWithOverlay } from '../components/WebcamVideoWithOverlay';
import { EXAMPLE_IMAGES, EXAMPLE_IMAGES_FACE_EXPRESSIONS } from '../const';
import { FaceClassificationPageState, getDefaultFaceClassificationPageState } from '../FaceClassificationPageState';
import { processFaceClassificationInputs } from '../processFaceClassificationInputs';
import { Root } from '../Root';

export default class extends React.Component<{}, FaceClassificationPageState> {
  state = getDefaultFaceClassificationPageState()
  processId: number = null

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

  processFrames = async (processId: number) => {
    await processFaceClassificationInputs(this.state)
    if (this.processId === processId) {
      setTimeout(this.processFrames.bind(this, processId), 16)
    }
  }

  componentDidUpdate() {
    if (this.state.inputType === InputType.IMAGE) {
      this.processId = null
      processFaceClassificationInputs(this.state)
      return
    }

    this.processId = Date.now()
    this.processFrames(this.processId)
  }

  componentDidMount() {
    this.loadModels()
  }

  renderInputComponent = () => {
    if (this.state.inputType === InputType.IMAGE) {
      return (
        <SelectableImage
          items={[...EXAMPLE_IMAGES, ...EXAMPLE_IMAGES_FACE_EXPRESSIONS]}
          initialImageSrc={EXAMPLE_IMAGES[0].url}
          onLoaded={refs => this.setState(refs)}
          selectionType={SelectionTypes.BOTH}
          imageStyle={{ maxWidth: 800 }}
          imgId="img"
        />
      )
    }
    if (this.state.inputType === InputType.VIDEO) {
      return (
        <VideoWithOverlay
          onLoaded={refs => this.setState(refs)}
          maxVideoWidth={800}
          src={EXAMPLE_VIDEO}
        />
      )
    }
    if (this.state.inputType === InputType.WEBCAM) {
      return (
        <WebcamVideoWithOverlay
          onLoaded={refs => this.setState(refs)}
          maxVideoWidth={800}
        />
      )
    }
    return null
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document)) {
      return null
    }

    return(
      <Root>
        <InputTypeTabs
          inputType={this.state.inputType}
          onChange={inputType => this.setState({ inputType })}
        />
        <SideBySide alignItems="baseline">
          <Mui.FormControl>
            <FaceDetectorSelection
              initialFaceDetectionOptions={this.state.faceDetectionOptions}
              onFaceDetectionOptionsChanged={this.onFaceDetectionOptionsChanged}
            />
          </Mui.FormControl>
          <FaceClassificationToggleControls
            onChange={options => this.setState(options)}
          />
        </SideBySide>
        {
          this.renderInputComponent()
        }
      </Root>
    )
  }
}