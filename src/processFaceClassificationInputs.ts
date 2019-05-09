import * as faceapi from 'face-api.js';

import { ShowBoxesOption } from './components/ShowBoxesSelection';
import { FaceClassificationPageState } from './FaceClassificationPageState';

export async function processFaceClassificationInputs(pageState: FaceClassificationPageState) {
  const {
    mediaElement,
    overlay,
    isFaceDetectorLoaded,
    areModelsLoaded,
    faceDetectionOptions,
    showBoxesOption,
    withFaceLandmarks,
    withFaceExpressions,
    withAgeAndGender
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

  const dimensions = faceapi.matchDimensions(overlay, element, element instanceof HTMLVideoElement)

  faceapi.resizeResults(detectionsAndLandmarks, dimensions).forEach(res => {
    if (faceapi.isWithFaceLandmarks(res)) {
      faceapi.draw.drawFaceLandmarks(overlay, res)
    }

    if (showBoxesOption !== ShowBoxesOption.HIDE_BOXES) {
      if (faceapi.isWithFaceLandmarks(res) && showBoxesOption === ShowBoxesOption.SHOW_ALIGNED_BOXES) {
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
        new faceapi.draw.DrawTextField(text, res.detection.box.bottomLeft).draw(overlay)
      }
    })
  }
}