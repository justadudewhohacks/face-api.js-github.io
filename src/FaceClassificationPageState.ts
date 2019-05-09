import * as faceapi from 'face-api.js';

import { FaceClassificationOptions } from './components/FaceClassificationToggleControls';
import { MediaElement } from './MediaElement';

export function getDefaultFaceClassificationPageState<T extends faceapi.TMediaElement>(): FaceClassificationPageState<T> {
  return {
    withFaceLandmarks: false,
    withFaceExpressions: false,
    withAgeAndGender: false,
    withShowBoxes: true,
    withShowFaceLandmarks: true,
    faceDetectionOptions: new faceapi.TinyFaceDetectorOptions(),
    isFaceDetectorLoaded: false,
    areModelsLoaded: false
  }
}

export type FaceClassificationPageState<T extends faceapi.TMediaElement = faceapi.TMediaElement> = FaceClassificationOptions & {
  faceDetectionOptions: faceapi.FaceDetectionOptions
  mediaElement?: MediaElement<T>
  overlay?: HTMLCanvasElement
  isFaceDetectorLoaded: boolean
  areModelsLoaded: boolean
}