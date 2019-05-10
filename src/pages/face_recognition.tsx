import * as faceapi from 'face-api.js';
import * as React from 'react';

import { EXAMPLE_IMAGES, MODELS_URI } from '../../tmp/src/const';
import { FacePreview } from '../components/FacePreview';
import { BasePage, BasePageState } from '../container/BasePage';
import styled from 'styled-components';

const FacesContainer = styled.div`
  margin: 8px 0;
  padding: 8px 0;
  display: flex;
  overflow-x: scroll;
  max-width: 100%;
  width: 100%;
`

export type PageProps = BasePageState

export type PageState = {
  facesWithDescriptors: {
    face: HTMLCanvasElement
    name: string
    descriptor: Float32Array
  }[]
}

class Page extends React.Component<PageProps, PageState> {
  state = {
    facesWithDescriptors: []
  }

  loadModels = async() => {
    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URI)
    ])
  }

  processInputs = async(state: BasePageState) => {
    return
  }

  componentDidMount() {
    setTimeout(async () => {
      const img = await faceapi.fetchImage(EXAMPLE_IMAGES[0].url)
      const results = await faceapi.detectAllFaces(img, this.props.faceDetectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptors()
      const faces = await faceapi.extractFaces(img, results.map(res => res.alignedRect))

      let facesWithDescriptors = faces.map((face, i) => ({ face, name: 'unknown', descriptor: results[i].descriptor }))
      facesWithDescriptors = [...facesWithDescriptors, ...facesWithDescriptors, ...facesWithDescriptors, ...facesWithDescriptors]
      this.setState({ facesWithDescriptors })
    }, 1000)
  }

  public render() {
    return(
      <FacesContainer>
        { this.state.facesWithDescriptors.map(({ face, name }) => <FacePreview canvas={face} label={name} />) }
      </FacesContainer>
    )
  }
}

export default class extends React.Component {
  loadModels = async() => {
    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URI)
    ])
  }

  processInputs = async(state: BasePageState) => {
    return
  }

  public render() {
    return(
      <BasePage
        loadAdditionalModels={this.loadModels}
        processInputs={this.processInputs}
        renderControls={() => <span>TBD</span>}
        renderChildren={state => <Page {...state} />}
      />
    )
  }
}