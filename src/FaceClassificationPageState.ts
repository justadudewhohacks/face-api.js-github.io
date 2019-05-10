import * as faceapi from 'face-api.js';

import { FaceClassificationOptions } from './components/FaceClassificationToggleControls';
import { InputType } from './components/InputTypeTabs';
import { MediaElement } from './MediaElement';

export function getDefaultFaceClassificationPageState(): FaceClassificationPageState {
  return {
    withFaceLandmarks: false,
    withFaceExpressions: false,
    withAgeAndGender: false,
    withShowBoxes: true,
    withShowFaceLandmarks: true,
    faceDetectionOptions: new faceapi.TinyFaceDetectorOptions(),
    isFaceDetectorLoaded: false,
    areModelsLoaded: false,
    inputType: InputType.IMAGE
  }
}

export type FaceClassificationPageState = FaceClassificationOptions & {
  faceDetectionOptions: faceapi.FaceDetectionOptions
  isFaceDetectorLoaded: boolean
  areModelsLoaded: boolean
  inputType: InputType
  mediaElement?: MediaElement
  overlay?: HTMLCanvasElement
}