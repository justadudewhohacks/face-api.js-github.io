import * as faceapi from 'face-api.js';

import { MtcnnForwardParams } from '../../node_modules/face-api.js/build/mtcnn/types';
import { withAllFaces } from '../hoc/withAllFaces';

// TODO: export faceapi.MtcnnForwardParams
export type DetectionParams = MtcnnForwardParams

export const AllFacesMtcnn = withAllFaces<DetectionParams>(
  (img: HTMLImageElement, detectionParams: DetectionParams) => faceapi.allFacesMtcnn(img, detectionParams)
)
