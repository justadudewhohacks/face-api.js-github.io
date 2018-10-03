import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';
import { SsdMobilenetv1DetectionParams } from '../types';
import { TMediaElement } from 'face-api.js';

export const AllFacesSsdMobilenetv1 = withAllFaces<SsdMobilenetv1DetectionParams>(
  (input: TMediaElement, detectionParams: SsdMobilenetv1DetectionParams) =>
    faceapi.allFacesSsdMobilenetv1(input, detectionParams.minConfidence)
)
