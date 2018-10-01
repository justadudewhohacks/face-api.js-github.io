import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';
import { MtcnnDetectionParams } from '../types';
import { VideoWrap } from '../VideoWrap';

export interface DetectFacesMtcnnProps {
  mtcnn: faceapi.Mtcnn
  input: ImageWrap | VideoWrap
  detectionParams: MtcnnDetectionParams
}

export interface DetectFacesMtcnnState {
  mtcnnResults?: { faceDetection: faceapi.FaceDetection, faceLandmarks: faceapi.FaceLandmarks }[]
}

async function detectFaces(props: DetectFacesMtcnnProps) {
  const mtcnnResults = await props.mtcnn.forward(props.input.element, props.detectionParams)

  return {
    mtcnnResults
  }
}

export const DetectFacesMtcnn = withAsyncRendering<DetectFacesMtcnnProps, DetectFacesMtcnnState>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)

export const DetectFacesMtcnnNoLoader = withAsyncRendering<DetectFacesMtcnnProps, DetectFacesMtcnnState>(
  detectFaces
)

