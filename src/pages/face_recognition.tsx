import * as Mui from '@material-ui/core';
import * as MuiIcons from '@material-ui/icons';
import * as faceapi from 'face-api.js';
import * as React from 'react';
import styled from 'styled-components';

import { FacePreview } from '../components/FacePreview';
import { InputType } from '../components/InputTypeTabs';
import { MODELS_URI } from '../const';
import { BasePage, BasePageState } from '../container/BasePage';

const Container = styled.div`
  max-width: 100%;
  width: 100%;
  margin: 12px 0;
`

const FacesContainer = styled.div`
  height: 160px;
  max-width: 100%;
  width: 100%;
  padding: 8px 0;
  display: flex;
  overflow-x: scroll;
`

export class FaceWithDescriptors {
  constructor(
    public face: HTMLCanvasElement,
    public descriptor: Float32Array,
    public id: string,
    public name: string = '',
  ) {
  }

  copyWithName(name: string) {
    return new FaceWithDescriptors(this.face, this.descriptor, this.id, name)
  }
}

export type ChildPageProps = BasePageState & {
  facesWithDescriptors: FaceWithDescriptors[]
  onChangeFaceWithDescriptorName: (id: string, name: string) => any
  onRemoveFaceWithDescriptor: (id: string) => any
}

class ChildPage extends React.Component<ChildPageProps> {

  public render() {
    return(
      <Container>
        <FacesContainer>
          {
            this.props.facesWithDescriptors
              .sort((f0, f1) => f0.name.localeCompare(f1.name))
              .map(({ face, name, id }) =>
                <FacePreview
                  key={id}
                  face={face}
                  name={name}
                  onNameChanged={newName => this.props.onChangeFaceWithDescriptorName(id, newName)}
                  onRemove={() => this.props.onRemoveFaceWithDescriptor(id)}
                />
              )
          }
        </FacesContainer>
      </Container>
    )
  }
}

export type PageState = {
  facesWithDescriptors: FaceWithDescriptors[]
}

export default class extends React.Component<{}, PageState> {
  state: PageState = {
    facesWithDescriptors: []
  }
  cachedResults: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>[] = []

  displayResults = (
    element: faceapi.TMediaElement,
    overlay: HTMLCanvasElement,
    facesWithDescriptors: FaceWithDescriptors[]
  ) => {
    const labeledFacesWithDescriptors = facesWithDescriptors.filter(f => !!f.name)
    const labeledDescriptors = labeledFacesWithDescriptors.map(
      f0 => new faceapi.LabeledFaceDescriptors(
        f0.name,
        labeledFacesWithDescriptors
          .filter(f1 => f0.name === f1.name)
          .map(f1 => f1.descriptor)
      )
    )

    const dimensions = faceapi.matchDimensions(overlay, overlay, element instanceof HTMLVideoElement)
    const resizedResults = faceapi.resizeResults(this.cachedResults, dimensions)

    if (!labeledDescriptors.length) {
      faceapi.draw.drawDetections(overlay, resizedResults)
      return
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
    resizedResults.forEach(res =>
      new faceapi.draw.DrawBox(res.alignedRect.box, { label: faceMatcher.findBestMatch(res.descriptor).toString() })
        .draw(overlay)
    )
  }

  runFaceRecognition = async(state: BasePageState, facesWithDescriptors: FaceWithDescriptors[]) => {
    const { mediaElement, overlay, isFaceDetectorLoaded, areModelsLoaded, faceDetectionOptions } = state

    if (!mediaElement || !overlay || !isFaceDetectorLoaded || !areModelsLoaded) {
      return
    }

    const { element } = mediaElement

    this.cachedResults = await faceapi.detectAllFaces(element, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors()

    this.displayResults(element, overlay, facesWithDescriptors)
  }

  onFaceWithDescriptorsChanged = (state: BasePageState, facesWithDescriptors: FaceWithDescriptors[]) => {
    this.setState({ facesWithDescriptors })
    if (state.inputType === InputType.IMAGE) {
      this.runFaceRecognition(state, facesWithDescriptors)
    }
  }

  onChangeFaceWithDescriptorName = (state: BasePageState, id: string, newName: string) => {
    const { facesWithDescriptors } = this.state
    const idx = facesWithDescriptors.findIndex(f => f.id === id)
    const newFaceWithDescriptors = [
      ...facesWithDescriptors.slice(0, idx),
      facesWithDescriptors[idx].copyWithName(newName),
      ...facesWithDescriptors.slice(idx + 1)
    ]
    this.onFaceWithDescriptorsChanged(state, newFaceWithDescriptors)
  }

  onRemoveFaceWithDescriptor = (state: BasePageState, id: string) => {
    const { facesWithDescriptors } = this.state
    const idx = facesWithDescriptors.findIndex(f => f.id === id)
    const newFaceWithDescriptors = [
      ...facesWithDescriptors.slice(0, idx),
      ...facesWithDescriptors.slice(idx + 1)
    ]
    this.onFaceWithDescriptorsChanged(state, newFaceWithDescriptors)
  }

  onUploadReferenceImage = async (state: BasePageState, { target } : any) => {
    const file = target.files[0]
    const img = await faceapi.bufferToImage(file)
    const results = await faceapi.detectAllFaces(img, state.faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors()
    const faces = await faceapi.extractFaces(img, results.map(res => res.alignedRect))
    const newFaceWithDescriptors = faces.map((face, i) =>
      new FaceWithDescriptors(face, results[i].descriptor, `${Date.now()}_${i}`)
    )

    this.onFaceWithDescriptorsChanged(state, [...this.state.facesWithDescriptors, ...newFaceWithDescriptors])
  }

  loadModels = async() => {
    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URI)
    ])
  }

  processInputs = async(state: BasePageState) => {
    this.runFaceRecognition(state, this.state.facesWithDescriptors)
  }

  public render() {
    return(
      <BasePage
        loadAdditionalModels={this.loadModels}
        processInputs={this.processInputs}
        renderControls={state =>
          <Mui.Button variant="contained" color="primary" component="label" style={{ marginLeft: 10 }}>
            <input type="file" hidden onChange={e => this.onUploadReferenceImage(state, e)} />
            Upload Reference Image
            <MuiIcons.Add/>
          </Mui.Button>
        }
        renderChildren={state =>
          <ChildPage
            {...state}
            {...this.state}
            onChangeFaceWithDescriptorName={(id, name) => this.onChangeFaceWithDescriptorName(state, id, name)}
            onRemoveFaceWithDescriptor={id => this.onRemoveFaceWithDescriptor(state, id)}
          />
        }
      />
    )
  }
}