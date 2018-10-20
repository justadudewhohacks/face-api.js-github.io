import { BoxWithText, FaceDetection, FaceDetectionWithLandmarks, FaceLandmarks68, ObjectDetection } from 'face-api.js';
import * as faceapi from 'face-api.js';

export type DisplayResultsOptions = {
  withBoxes?: boolean
  withScore?: boolean
  drawLines?: boolean
}

export function displayResults(
  overlay: HTMLCanvasElement,
  results: Array<FaceDetection | FaceLandmarks68 | FaceDetectionWithLandmarks | BoxWithText>,
  options: DisplayResultsOptions
) {
  overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height)

  const { withBoxes, withScore = true, drawLines = true } = options

  if (!results || !results.length) {
    return
  }

  const resizedResults = results
    .map(res =>
      res instanceof BoxWithText
        ? res
        : (
          res instanceof FaceLandmarks68
            ? res.forSize(overlay.width, overlay.height)
            : res.forSize(overlay.width, overlay.height)
        )
    )

  const detections = resizedResults
    .filter(res => res instanceof ObjectDetection || res instanceof FaceDetectionWithLandmarks || res instanceof BoxWithText)
    .map((res: ObjectDetection | FaceDetectionWithLandmarks | BoxWithText) =>
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
    .filter(res => res instanceof FaceLandmarks68 || res instanceof FaceDetectionWithLandmarks)
    .map((res: FaceLandmarks68 | FaceDetectionWithLandmarks) =>
      res instanceof FaceLandmarks68
        ? res
        : res.landmarks
    )


  const drawLandmarksOptions = {
    drawLines,
    color: 'green',
    lineWidth: 2
  }

  if (withBoxes || !faceLandmarks.length) {
    faceapi.drawDetection(overlay, detections, drawDetectionsOptions)
  }
  faceapi.drawLandmarks(overlay, faceLandmarks, drawLandmarksOptions)
}