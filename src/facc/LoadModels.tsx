import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';

export interface LoadModelsProps {
  ssdMobilenetv1ModelUrl?: string
  faceLandmarkModelUrl?: string
  faceRecognitionModelUrl?: string
  mtcnnModelUrl?: string
  tinyYolov2ModelUrl?: string
}

export interface LoadModelsState {
  tinyYolov2?: faceapi.TinyYolov2
  ssdMobilenetv1: faceapi.FaceDetectionNet
  mtcnn?: faceapi.Mtcnn
  faceDetectionNet?: faceapi.FaceDetectionNet | faceapi.TinyYolov2 | faceapi.Mtcnn
  faceLandmarkNet?: faceapi.FaceLandmarkNet
  faceRecognitionNet?: faceapi.FaceRecognitionNet
}

async function loadModels(props: LoadModelsProps) {
  const {
    ssdMobilenetv1ModelUrl,
    mtcnnModelUrl,
    tinyYolov2ModelUrl,
    faceLandmarkModelUrl,
    faceRecognitionModelUrl
  } = props

  const loadOrUndefined = async (net: any, url?: string) => {
    if (!url) {
      return undefined
    }
    if (!net.params) {
      await net.load(url)
    }
    return net
  }

  const promises = [
    loadOrUndefined(faceapi.nets.tinyYolov2, tinyYolov2ModelUrl),
    loadOrUndefined(faceapi.nets.ssdMobilenetv1, ssdMobilenetv1ModelUrl),
    loadOrUndefined(faceapi.nets.mtcnn, mtcnnModelUrl),
    loadOrUndefined(faceapi.nets.faceLandmark68Net, faceLandmarkModelUrl),
    loadOrUndefined(faceapi.nets.faceRecognitionNet, faceRecognitionModelUrl)
  ]

  const [tinyYolov2, ssdMobilenetv1, mtcnn, faceLandmarkNet, faceRecognitionNet
  ] = await Promise.all(promises)

  const faceDetectionNet = tinyYolov2 || ssdMobilenetv1 || mtcnn
  return {
    faceDetectionNet,
    ssdMobilenetv1,
    mtcnn,
    tinyYolov2,
    faceLandmarkNet,
    faceRecognitionNet
  }
}

export const LoadModels = withAsyncRendering<LoadModelsProps, LoadModelsState>(
  loadModels,
  () => <ModalLoader title="Loading Models"/>
)

export const LoadFaceDetectionModel = withAsyncRendering<LoadModelsProps, LoadModelsState>(
  loadModels,
  () => <ModalLoader title="Loading Face Detection Model"/>
)