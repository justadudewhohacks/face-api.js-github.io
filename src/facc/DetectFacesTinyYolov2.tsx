import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';
import { FaceDetection } from 'face-api.js';
import { TinyYolov2Types } from 'tfjs-tiny-yolov2';

export interface DetectFacesTinyYolov2Props {
  tinyYolov2: faceapi.TinyYolov2
  detectionParams: TinyYolov2Types.TinyYolov2ForwardParams
  input?: MediaElement
}

export interface DetectFacesTinyYolov2State {
  faceDetections: FaceDetection[]
}

async function detectFaces(props: DetectFacesTinyYolov2Props) {
  return props.input
    ? { faceDetections: await props.tinyYolov2.locateFaces(props.input.element, props.detectionParams)}
    : null
}

export const DetectFacesTinyYolov2 = withAsyncRendering<DetectFacesTinyYolov2Props, DetectFacesTinyYolov2State>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)

export const DetectFacesTinyYolov2NoLoader = withAsyncRendering<DetectFacesTinyYolov2Props, DetectFacesTinyYolov2State>(
  detectFaces
)

