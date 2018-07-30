import * as faceapi from 'face-api.js';
import * as React from 'react';

import { BestMatch } from '../facc/ComputeRefDescriptors';
import { DisplayResults } from './DisplayResults';


export interface DisplayFullFaceDescriptionsProps {
  fullFaceDescriptions: faceapi.FullFaceDescription[]
  overlay: HTMLCanvasElement
  getBestMatch: (queryDescriptor: Float32Array) => BestMatch
  withScore?: boolean
  drawLandmarks?: boolean
}

export const DisplayFullFaceDescriptions = (props: DisplayFullFaceDescriptionsProps): any => {

  const { fullFaceDescriptions, overlay, withScore, drawLandmarks, getBestMatch } = props

  const faceDetections = fullFaceDescriptions.map(fd => fd.detection)
  const faceLandmarks = drawLandmarks
    ? fullFaceDescriptions.map(fd => fd.landmarks)
    : []
  const bestMatches = fullFaceDescriptions.map(fd => getBestMatch(fd.descriptor))

  const displayResultsProps = {
    overlay,
    withScore,
    faceDetections,
    faceLandmarks,
    bestMatches
  }

  return <DisplayResults {...displayResultsProps} />
}