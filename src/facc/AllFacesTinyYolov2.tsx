import * as faceapi from 'face-api.js';

import { withAllFaces } from '../hoc/withAllFaces';
import { TinyYolov2DetectionParams } from '../types';
import { TMediaElement } from 'face-api.js';

export const AllFacesTinyYolov2 = withAllFaces<TinyYolov2DetectionParams>(
  (input: TMediaElement, detectionParams: TinyYolov2DetectionParams) =>
    faceapi.allFacesTinyYolov2(input, detectionParams)
)
