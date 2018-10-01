import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';
import { SsdMobilenetv1DetectionParams } from '../types';

export const AllFacesSsdMobilenetv1 = withAllFaces<SsdMobilenetv1DetectionParams>(
  (img: HTMLImageElement, detectionParams: SsdMobilenetv1DetectionParams) => faceapi.allFacesSsdMobilenetv1(img, detectionParams.minConfidence)
)
