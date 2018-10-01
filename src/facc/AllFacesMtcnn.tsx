import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';
import { MtcnnDetectionParams } from '../types';

export const AllFacesMtcnn = withAllFaces<MtcnnDetectionParams>(
  (img: HTMLImageElement, detectionParams: MtcnnDetectionParams) => faceapi.allFacesMtcnn(img, detectionParams)
)
