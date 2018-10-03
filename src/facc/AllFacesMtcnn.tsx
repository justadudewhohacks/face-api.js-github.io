import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';
import { MtcnnDetectionParams } from '../types';
import { TMediaElement } from 'face-api.js';

export const AllFacesMtcnn = withAllFaces<MtcnnDetectionParams>(
  (input: TMediaElement, detectionParams: MtcnnDetectionParams) =>
    faceapi.allFacesMtcnn(input, detectionParams)
)
