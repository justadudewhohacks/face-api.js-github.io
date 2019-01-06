import {
  BoxWithText,
  FaceDetection,
  FaceLandmarks68,
  ObjectDetection,
  resizeResults,
  WithFaceDetection,
  WithFaceExpressions,
  WithFaceLandmarks,
} from 'face-api.js';
import * as faceapi from 'face-api.js';

import { MediaElement } from './MediaElement';

export type DisplayResultsOptions = {
  withBoxes?: boolean
  withScore?: boolean
  drawLines?: boolean
}

export function displayResults(
  input: MediaElement,
  overlay: HTMLCanvasElement,
  results: Array<FaceDetection | FaceLandmarks68 | BoxWithText | WithFaceLandmarks<WithFaceDetection<{}>> | WithFaceExpressions<WithFaceDetection<{}>>>,
  options: DisplayResultsOptions
) {
  if (!input || !overlay) {
    return
  }

  overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height)

  const { width, height } = input.element.getBoundingClientRect()
  overlay.width = width
  overlay.height = height

  const { withBoxes = true, withScore = true, drawLines = true } = options

  if (!results || !results.length) {
    return
  }

  const resizedResults = results
    .map(res =>
      res instanceof BoxWithText
        ? res
        : resizeResults(res, overlay)
    )

  const detections = resizedResults
    .filter(res => res instanceof ObjectDetection || res instanceof BoxWithText || (res as any).detection)
    .map((res: ObjectDetection | WithFaceLandmarks<WithFaceDetection<{}>> | BoxWithText) =>
      (res instanceof BoxWithText || res instanceof ObjectDetection)
        ? res
        : res.detection
    )

  const drawDetectionsOptions = {
    withScore,
    textColor: 'red',
    fontSize: 16
  }

  const faceLandmarks = resizedResults
    .filter(res => res instanceof FaceLandmarks68 || (res as any).landmarks)
    .map((res: FaceLandmarks68 | WithFaceLandmarks<WithFaceDetection<{}>>) =>
      res instanceof FaceLandmarks68
        ? res
        : res.landmarks
    )

  const faceExpressions = resizedResults
    .filter(res => (res as any).detection && (res as any).expressions)
    .map(
      ({ detection, expressions }: WithFaceExpressions<WithFaceDetection<{}>>) =>
        ({ position: detection.box, expressions })
    )


  const drawLandmarksOptions = {
    drawLines,
    color: 'green',
    lineWidth: 2
  }

  if (withBoxes) {
    faceapi.drawDetection(overlay, detections, drawDetectionsOptions)
  }
  faceapi.drawLandmarks(overlay, faceLandmarks, drawLandmarksOptions)
  faceapi.drawFaceExpressions(overlay, faceExpressions)
}