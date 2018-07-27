import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';

export interface LoadModelsProps {
  faceDetectionModelUrl?: string
  faceLandmarkModelUrl?: string
  faceRecognitionModelUrl?: string
  mtcnnModelUrl?: string
}

export interface LoadModelsState {
  faceDetectionNet?: faceapi.FaceDetectionNet
  faceLandmarkNet?: faceapi.FaceLandmarkNet
  faceRecognitionNet?: faceapi.FaceRecognitionNet
  mtcnn?: faceapi.Mtcnn
}

async function loadModels(props: LoadModelsProps) {
  const {
    faceDetectionModelUrl,
    faceLandmarkModelUrl,
    faceRecognitionModelUrl,
    mtcnnModelUrl
  } = props

  const loadOrUndefined = async (net: any, url?: string) => {
    if (!url) {
      return undefined
    }
    await net.load(url)
    return net
  }

  const promises = [
    loadOrUndefined(faceapi.nets.ssdMobilenet, faceDetectionModelUrl),
    loadOrUndefined(faceapi.nets.faceLandmark68Net, faceLandmarkModelUrl),
    loadOrUndefined(faceapi.nets.faceRecognitionNet, faceRecognitionModelUrl),
    loadOrUndefined(faceapi.nets.mtcnn, mtcnnModelUrl)
  ]

  const [faceDetectionNet, faceLandmarkNet, faceRecognitionNet, mtcnn] = await Promise.all(promises)

  return {
    faceDetectionNet,
    faceLandmarkNet,
    faceRecognitionNet,
    mtcnn
  }
}

export const LoadModels = withAsyncRendering<LoadModelsProps, LoadModelsState>(
  loadModels,
  () => <ModalLoader title="Loading Models"/>
)