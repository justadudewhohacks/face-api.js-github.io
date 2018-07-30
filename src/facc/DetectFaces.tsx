import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';
import { ModalLoader } from '../components/ModalLoader';
import * as React from 'react';

export interface DetectFacesProps {
  faceDetectionNet: faceapi.FaceDetectionNet
  img: ImageWrap
  minConfidence: number
}

export interface DetectFacesState {
  faceDetections?: faceapi.FaceDetection[]
}

async function detectFaces(props: DetectFacesProps) {
  const faceDetections = await props.faceDetectionNet.locateFaces(props.img.img, props.minConfidence)

  return {
    faceDetections
  }
}

export const DetectFaces = withAsyncRendering<DetectFacesProps, DetectFacesState>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)
