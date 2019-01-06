import { NeuralNetwork } from 'face-api.js';
import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';

export interface LoadModelsProps {
  ssdMobilenetv1ModelUrl?: string
  tinyFaceDetectorModelUrl?: string
  mtcnnModelUrl?: string
  faceLandmarkModelUrl?: string
  faceRecognitionModelUrl?: string
  faceExpessionModelUrl?: string
}

export interface LoadModelsState {}

async function loadModels(props: LoadModelsProps) {
  const {
    ssdMobilenetv1ModelUrl,
    mtcnnModelUrl,
    tinyFaceDetectorModelUrl,
    faceLandmarkModelUrl,
    faceRecognitionModelUrl,
    faceExpessionModelUrl
  } = props

  const load = async (net: NeuralNetwork<any>, url?: string) => {
    if (url && !net.isLoaded) {
      await net.load(url)
    }
  }

  await Promise.all([
    load(faceapi.nets.tinyFaceDetector, tinyFaceDetectorModelUrl),
    load(faceapi.nets.ssdMobilenetv1, ssdMobilenetv1ModelUrl),
    load(faceapi.nets.mtcnn, mtcnnModelUrl),
    load(faceapi.nets.faceLandmark68Net, faceLandmarkModelUrl),
    load(faceapi.nets.faceRecognitionNet, faceRecognitionModelUrl),
    load(faceapi.nets.faceExpressionNet, faceExpessionModelUrl)
  ])

  return {}
}

export const LoadModels = withAsyncRendering<LoadModelsProps, LoadModelsState>(loadModels)