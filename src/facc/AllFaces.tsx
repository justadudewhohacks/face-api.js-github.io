import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';

export type DetectionParams = {
  minConfidence: number
}

export const AllFaces = withAllFaces<DetectionParams>(
  (img: HTMLImageElement, detectionParams: DetectionParams) => faceapi.allFaces(img, detectionParams.minConfidence)
)
