import * as faceapi from 'face-api.js';
import * as React from 'react';

import { FaceClassificationOptions, FaceClassificationToggleControls } from '../components/FaceClassificationToggleControls';
import { MODELS_URI } from '../const';
import { BasePage, BasePageState } from '../container/BasePage';

export type PageState = FaceClassificationOptions

export async function processFaceClassificationInputs(pageState: PageState & BasePageState) {
  const {
    mediaElement,
    overlay,
    isFaceDetectorLoaded,
    areModelsLoaded,
    faceDetectionOptions,
    withFaceLandmarks,
    withFaceExpressions,
    withAgeAndGender,
    withShowBoxes,
    withShowFaceLandmarks
  } = pageState

  if (!mediaElement || !overlay || !isFaceDetectorLoaded || !areModelsLoaded) {
    return
  }

  const { element } = mediaElement

  const faceDetectionTask = faceapi.detectAllFaces(element, faceDetectionOptions)
  const composedTask = withFaceLandmarks ? faceDetectionTask.withFaceLandmarks() : faceDetectionTask
  const classificationTask = (withFaceExpressions && withAgeAndGender)
    ? composedTask.withFaceExpressions().withAgeAndGender()
    : (withFaceExpressions
      ? composedTask.withFaceExpressions().withAgeAndGender()
      : (withAgeAndGender
        ? composedTask.withAgeAndGender()
        : null
      )
    )

  const detectionsAndLandmarks = await composedTask
  const classificationResults = classificationTask ? await classificationTask : null

  const dimensions = faceapi.matchDimensions(overlay, overlay, element instanceof HTMLVideoElement)

  faceapi.resizeResults(detectionsAndLandmarks, dimensions).forEach((res: any) => {
    if (faceapi.isWithFaceLandmarks(res) && withShowFaceLandmarks) {
      faceapi.draw.drawFaceLandmarks(overlay, res.landmarks)
    }

    if (withShowBoxes) {
      if (faceapi.isWithFaceLandmarks(res)) {
        faceapi.draw.drawDetections(overlay, res.alignedRect)
      } else {
        faceapi.draw.drawDetections(overlay, res)
      }

    }
  })

  if (classificationResults) {
    faceapi.resizeResults(classificationResults, dimensions).forEach(res => {
      const text: string[] = []

      // TODO faceapi.isWithAgeAndGender(res)
      if (withAgeAndGender) {
        const { gender, genderProbability } = res
        text.push(`${faceapi.round(res.age, 0)} years`)
        text.push(`${gender} (${faceapi.round(genderProbability)})`)
      }
      if (faceapi.isWithFaceExpressions(res)) {
        const { expression, probability: expressionProbability } = res.expressions.asSortedArray()[0]
        text.push(`${expression} (${faceapi.round(expressionProbability)})`)
      }

      if (text.length) {
        const { box } = faceapi.isWithFaceLandmarks(res) ? res.alignedRect : res.detection
        new faceapi.draw.DrawTextField(text, box.bottomLeft).draw(overlay)
      }
    })
  }
}

export default class extends React.Component<{}, PageState> {
  state = {
    withFaceLandmarks: false,
    withFaceExpressions: false,
    withAgeAndGender: false,
    withShowBoxes: true,
    withShowFaceLandmarks: true
  }

  loadModels = async() => {
    await Promise.all([
      faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URI),
      faceapi.nets.ageGenderNet.loadFromUri(MODELS_URI)
    ])
  }

  processInputs = async(state: BasePageState) => {
    await processFaceClassificationInputs({ ...state, ...this.state })
  }

  public render() {
    return(
      <BasePage
        loadAdditionalModels={this.loadModels}
        processInputs={this.processInputs}
        renderControls={() =>
          <FaceClassificationToggleControls
            onChange={options => this.setState(options)}
          />
        }
      />
    )
  }
}