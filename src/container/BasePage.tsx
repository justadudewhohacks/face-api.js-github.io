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
  currentFps: number
  mediaElement?: MediaElement
  overlay?: HTMLCanvasElement
}

export class BasePage extends React.Component<BasePageProps, BasePageState> {
  state = {
    faceDetectionOptions: new faceapi.SsdMobilenetv1Options(),
    isFaceDetectorLoaded: false,
    areModelsLoaded: false,
    inputType: InputType.IMAGE,
    currentFps: 0
  }
  processId: number
  fpsMeter: number[] = []

  async loadFaceDetector(detectorName: string) {
    const faceDetector = getFaceDetectionNetFromName(detectorName)
    faceDetector.isLoaded || faceDetector.loadFromUri(MODELS_URI)
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

  changeFaceDetector = async (faceDetectionOptions: faceapi.FaceDetectionOptions) => {
    const detectorName = getFaceDetectorNameFromOptions(faceDetectionOptions)
    const prevDetectorName = getFaceDetectorNameFromOptions(this.state.faceDetectionOptions)
    if (detectorName !== prevDetectorName) {
      await this.loadFaceDetector(detectorName)
      //getFaceDetectionNetFromName(prevDetectorName).dispose()
    }
  }

  onFaceDetectionOptionsChanged = async (faceDetectionOptions: faceapi.FaceDetectionOptions) => {
    await this.changeFaceDetector(faceDetectionOptions)
    this.setState({ faceDetectionOptions })
  }

  onInputTypeChanged = async (inputType: InputType) => {
    this.setState({ inputType })
    const faceDetectionOptions = inputType === InputType.IMAGE
      ? new faceapi.SsdMobilenetv1Options()
      : (
        inputType === InputType.WEBCAM
          ? new faceapi.TinyFaceDetectorOptions({ inputSize: 160 })
          : new faceapi.TinyFaceDetectorOptions()
      )

    await this.changeFaceDetector(faceDetectionOptions)
    this.setState({ faceDetectionOptions })
  }

  updateFpsMeter = (ts: number) => {
    this.fpsMeter = [ts, ...this.fpsMeter].slice(0, 30)
  }

  getFps = () => {
    const avgTimeInMs = this.fpsMeter.reduce((total, t) => total + t) / this.fpsMeter.length
    return (1000 / avgTimeInMs) || null
  }

  processInputs = async () => {
    const detector = getFaceDetectionNetFromName(getFaceDetectorNameFromOptions(this.state.faceDetectionOptions))
    if (!detector.isLoaded) {
      setTimeout(this.processInputs, 100)
      return
    }
    await this.props.processInputs(this.state)
  }

  processFrames = async (processId: number) => {
    const ts = Date.now()
    await this.processInputs()
    this.updateFpsMeter(Date.now() - ts)
    if (this.processId !== null && this.processId === processId) {
      setTimeout(this.processFrames.bind(this, processId), 0)
    }
  }

  startProcessingFrames = () => {
    this.processId = Date.now()
    this.processFrames(this.processId)
  }

  componentDidUpdate() {
    if (this.state.inputType === InputType.IMAGE) {
      this.processId = null
      this.processInputs()
      return
    }

    this.startProcessingFrames()
  }

  componentDidMount() {
    this.loadModels()
  }

  componentWillUnmount() {
    this.processId = null
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
              onChange={this.onInputTypeChanged}
            />
          </div>
        </AppBarContainer>
        <ControlsContainer>
          <SideBySide alignItems="baseline">
            <Mui.FormControl>
              <FaceDetectorSelection
                faceDetectionOptions={this.state.faceDetectionOptions}
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
          getFps={this.getFps}
        />
      </Root>
    )
  }
}