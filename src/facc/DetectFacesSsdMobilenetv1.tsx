import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';
import { SsdMobilenetv1DetectionParams } from '../types';

export interface DetectFacesSsdMobilenetv1Props {
  faceDetectionNet: faceapi.FaceDetectionNet
  detectionParams: SsdMobilenetv1DetectionParams
  input?: MediaElement
}

export interface DetectFacesSsdMobilenetv1State {
  faceDetections?: faceapi.FaceDetection[]
}

async function detectFaces(props: DetectFacesSsdMobilenetv1Props) {
  return props.input
    ? { faceDetections: await props.faceDetectionNet.locateFaces(props.input.element, props.detectionParams.minConfidence) }
    : null
}

export const DetectFacesSsdMobilenetv1 = withAsyncRendering<DetectFacesSsdMobilenetv1Props, DetectFacesSsdMobilenetv1State>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)
