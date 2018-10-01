import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';
import { MtcnnDetectionParams, SsdMobilenetv1DetectionParams, TinyYolov2DetectionParams } from '../types';

export interface DetectFacesProps {
  img: ImageWrap
  faceDetectionNet: faceapi.FaceDetectionNet | faceapi.TinyYolov2 | faceapi.Mtcnn
  detectionParams: TinyYolov2DetectionParams | MtcnnDetectionParams | SsdMobilenetv1DetectionParams
}

export interface DetectFacesState {
  results?: { faceDetection: faceapi.FaceDetection, faceLandmarks?: faceapi.FaceLandmarks }[]
}

async function detectFaces(props: DetectFacesProps) {
  if (props.faceDetectionNet instanceof faceapi.Mtcnn) {
    return {
      results: await props.faceDetectionNet.forward(props.img.img, props.detectionParams as MtcnnDetectionParams)
    }
  }

  const detections = (props.faceDetectionNet instanceof faceapi.TinyYolov2)
    ? await props.faceDetectionNet.locateFaces(props.img.img, props.detectionParams as TinyYolov2DetectionParams)
    : await props.faceDetectionNet.locateFaces(props.img.img, (props.detectionParams as SsdMobilenetv1DetectionParams).minConfidence)

  return {
    results: detections.map(faceDetection => ({ faceDetection }))
  }
}

export const DetectFaces = withAsyncRendering<DetectFacesProps, DetectFacesState>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)
