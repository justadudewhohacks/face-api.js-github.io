import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';
import styled from 'styled-components';

import { FaceDetectorSelection } from '../components/FaceDetectorSelection';
import { getFaceDetectionNetFromName, getFaceDetectorNameFromOptions } from '../components/FaceDetectorSelection/const';
import { InputComponent } from '../components/InputComponent';
import { InputType, InputTypeTabs } from '../components/InputTypeTabs';
import { ModalLoader } from '../components/ModalLoader';
import { CenterContent } from '../components/styled/CenterContent';
import { SideBySide } from '../components/styled/SideBySide';
import { MODELS_URI } from '../const';
import { MediaElement } from '../MediaElement';
import { Root } from '../Root';
import { ReactElement } from '../types';

const AppBarContainer = styled(CenterContent)`
  width: 100%;
  margin-bottom: 20px;
`

const ControlsContainer = styled.div`
  width: 100%;
`

export type BasePageProps = {
  loadAdditionalModels: () => Promise<any>
  processInputs: (state: BasePageState) => Promise<any>
  renderControls: (state: BasePageState) => ReactElement
  renderChildren?: (state: BasePageState) => ReactElement
}

export type BasePageState = {
  faceDetectionOptions: faceapi.FaceDetectionOptions
  isFaceDetectorLoaded: boolean
  areModelsLoaded: boolean
  inputType: InputType
  mediaElement?: MediaElement
  overlay?: HTMLCanvasElement
}

export class BasePage extends React.Component<BasePageProps, BasePageState> {
  state = {
    faceDetectionOptions: new faceapi.TinyFaceDetectorOptions(),
    isFaceDetectorLoaded: false,
    areModelsLoaded: false,
    inputType: InputType.IMAGE
  }
  processId: number

  async loadFaceDetector(detectorName: string) {
    await getFaceDetectionNetFromName(detectorName).loadFromUri(MODELS_URI)
    this.setState({ isFaceDetectorLoaded: true })
  }

  async loadModels() {
    await Promise.all([
      this.loadFaceDetector(getFaceDetectorNameFromOptions(this.state.faceDetectionOptions)),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URI),
      this.props.loadAdditionalModels()
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
    await this.props.processInputs(this.state)
    if (this.processId === processId) {
      setTimeout(this.processFrames.bind(this, processId), 16)
    }
  }

  componentDidUpdate() {
    if (this.state.inputType === InputType.IMAGE) {
      this.processId = null
      this.props.processInputs(this.state)
      return
    }

    this.processId = Date.now()
    this.processFrames(this.processId)
  }

  componentDidMount() {
    this.loadModels()
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document)) {
      return null
    }

    return(
      <Root>
        { !this.state.areModelsLoaded || !this.state.isFaceDetectorLoaded ? <ModalLoader title="Loading Models" /> : null }
        <AppBarContainer>
          <div>
            <InputTypeTabs
              inputType={this.state.inputType}
              onChange={inputType => this.setState({ inputType })}
            />
          </div>
        </AppBarContainer>
        <ControlsContainer>
          <SideBySide alignItems="baseline">
            <Mui.FormControl>
              <FaceDetectorSelection
                initialFaceDetectionOptions={this.state.faceDetectionOptions}
                onFaceDetectionOptionsChanged={this.onFaceDetectionOptionsChanged}
              />
            </Mui.FormControl>
            { this.props.renderControls(this.state) }
          </SideBySide>
        </ControlsContainer>
        { this.props.renderChildren ? this.props.renderChildren(this.state) : null }
        <InputComponent
          inputType={this.state.inputType}
          onLoaded={refs => this.setState(refs)}
        />
      </Root>
    )
  }
}