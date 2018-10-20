import * as faceapi from 'face-api.js';
import { FaceLandmarks68 } from 'face-api.js';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';

export interface DetectFaceLandmarksProps {
  input?: MediaElement
}

export interface DetectFaceLandmarksState {
  faceLandmarks?: FaceLandmarks68
}

async function detectFaceLandmarks(props: DetectFaceLandmarksProps) {
  if (!props.input) {
    return
  }

  const faceLandmarks = (await faceapi.nets.faceLandmark68Net.detectLandmarks(props.input.element)) as FaceLandmarks68

  return {
    faceLandmarks
  }
}

export const DetectFaceLandmarks =
  withAsyncRendering<DetectFaceLandmarksProps, DetectFaceLandmarksState>(detectFaceLandmarks)
