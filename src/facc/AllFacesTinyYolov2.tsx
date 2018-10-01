import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';
import { TinyYolov2DetectionParams } from '../types';

export const AllFacesTinyYolov2 = withAllFaces<TinyYolov2DetectionParams>(
  (img: HTMLImageElement, detectionParams: TinyYolov2DetectionParams) => faceapi.allFacesTinyYolov2(img, detectionParams)
)
