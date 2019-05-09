import * as faceapi from 'face-api.js';

import { FaceClassificationPageState } from './FaceClassificationPageState';

export async function processFaceClassificationInputs(
  pageState: FaceClassificationPageState,
  targetDimensions?: faceapi.IDimensions
) {
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

  faceapi.resizeResults(detectionsAndLandmarks, dimensions).forEach(res => {
    if (faceapi.isWithFaceLandmarks(res) && withShowFaceLandmarks) {
      faceapi.draw.drawFaceLandmarks(overlay, res)
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