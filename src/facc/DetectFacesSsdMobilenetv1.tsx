import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';
import { SsdMobilenetv1DetectionParams } from '../types';

export interface DetectFacesSsdMobilenetv1Props {
  faceDetectionNet: faceapi.FaceDetectionNet
  input: ImageWrap
  detectionParams: SsdMobilenetv1DetectionParams
}

export interface DetectFacesSsdMobilenetv1State {
  faceDetections?: faceapi.FaceDetection[]
}

async function detectFaces(props: DetectFacesSsdMobilenetv1Props) {
  const faceDetections = await props.faceDetectionNet.locateFaces(props.input.img, props.detectionParams.minConfidence)

  return {
    faceDetections
  }
}

export const DetectFacesSsdMobilenetv1 = withAsyncRendering<DetectFacesSsdMobilenetv1Props, DetectFacesSsdMobilenetv1State>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)
