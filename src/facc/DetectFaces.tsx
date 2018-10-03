import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';
import { MtcnnDetectionParams, SsdMobilenetv1DetectionParams, TinyYolov2DetectionParams } from '../types';

export interface DetectFacesProps {
  faceDetectionNet: faceapi.FaceDetectionNet | faceapi.TinyYolov2 | faceapi.Mtcnn
  detectionParams: TinyYolov2DetectionParams | MtcnnDetectionParams | SsdMobilenetv1DetectionParams
  input: MediaElement
}

export interface DetectFacesState {
  results?: { faceDetection: faceapi.FaceDetection, faceLandmarks?: faceapi.FaceLandmarks }[]
}

async function detectFaces(props: DetectFacesProps) {

  if (!this.props.input) {
    return null
  }

  if (props.faceDetectionNet instanceof faceapi.Mtcnn) {
    return {
      results: await props.faceDetectionNet.forward(props.input.element, props.detectionParams as MtcnnDetectionParams)
    }
  }

  const detections = (props.faceDetectionNet instanceof faceapi.TinyYolov2)
    ? await props.faceDetectionNet.locateFaces(props.input.element, props.detectionParams as TinyYolov2DetectionParams)
    : await props.faceDetectionNet.locateFaces(props.input.element, (props.detectionParams as SsdMobilenetv1DetectionParams).minConfidence)

  return {
    results: detections.map(faceDetection => ({ faceDetection }))
  }
}

export const DetectFaces = withAsyncRendering<DetectFacesProps, DetectFacesState>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)
