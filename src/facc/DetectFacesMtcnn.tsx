import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';
import { MtcnnDetectionParams } from '../types';

export interface DetectFacesMtcnnProps {
  mtcnn: faceapi.Mtcnn
  detectionParams: MtcnnDetectionParams
  input?: MediaElement
}

export interface DetectFacesMtcnnState {
  mtcnnResults?: { faceDetection: faceapi.FaceDetection, faceLandmarks: faceapi.FaceLandmarks }[]
}

async function detectFaces(props: DetectFacesMtcnnProps) {
  return props.input
    ? { mtcnnResults: await props.mtcnn.forward(props.input.element, props.detectionParams) }
    : null
}

export const DetectFacesMtcnn = withAsyncRendering<DetectFacesMtcnnProps, DetectFacesMtcnnState>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)

export const DetectFacesMtcnnNoLoader = withAsyncRendering<DetectFacesMtcnnProps, DetectFacesMtcnnState>(
  detectFaces
)

