import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';
import { FaceDetectionOptions, FaceDetection } from 'face-api.js';

export interface DetectFacesProps {
  detectionOptions: FaceDetectionOptions
  input?: MediaElement
}

export interface DetectFacesState {
  faceDetections?: FaceDetection[]
}

async function detectFaces(props: DetectFacesProps) {

  if (!props.input) {
    return null
  }

  return {
    faceDetections: await faceapi.detectAllFaces(props.input.element, props.detectionOptions)
  }
}

export const DetectFaces =
  withAsyncRendering<DetectFacesProps, DetectFacesState>(detectFaces)
