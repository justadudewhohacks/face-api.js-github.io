import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';
import { TMediaElement } from 'face-api.js';

export type DetectionParams = {
  minConfidence: number
}

export const AllFaces = withAllFaces<DetectionParams>(
  (input: TMediaElement, detectionParams: DetectionParams) =>
    faceapi.allFaces(input, detectionParams.minConfidence)
)
