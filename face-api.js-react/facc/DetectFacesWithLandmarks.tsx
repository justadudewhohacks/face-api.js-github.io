import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';
import { FaceDetectionOptions, FaceDetectionWithLandmarks } from 'face-api.js';

export interface DetectFacesWithLandmarksProps {
  detectionOptions: FaceDetectionOptions
  input?: MediaElement
}

export interface DetectFacesWithLandmarksState {
  faceDetectionsWithLandmarks?: FaceDetectionWithLandmarks[]
}

async function detectFacesWithLandmarks(props: DetectFacesWithLandmarksProps) {

  if (!props.input) {
    return null
  }

  return {
    faceDetectionsWithLandmarks: await faceapi.detectAllFaces(props.input.element, props.detectionOptions).withFaceLandmarks()
  }
}

export const DetectFacesWithLandmarks =
  withAsyncRendering<DetectFacesWithLandmarksProps, DetectFacesWithLandmarksState>(detectFacesWithLandmarks)
