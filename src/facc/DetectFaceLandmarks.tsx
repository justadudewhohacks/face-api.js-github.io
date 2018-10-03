import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';

export interface DetectFaceLandmarksProps {
  faceLandmarkNet: faceapi.FaceLandmarkNet
  inputs: Array<MediaElement | undefined>
}

export interface DetectFaceLandmarksState {
  faceLandmarks?: faceapi.FaceLandmarks68[]
}

async function detectFaceLandmarks(props: DetectFaceLandmarksProps) {
  if (!props.inputs.every(input => !!input)) {
    return
  }

  const faceLandmarks = await Promise.all(
    props.inputs.map(input =>
      props.faceLandmarkNet.detectLandmarks(input.element) as Promise<faceapi.FaceLandmarks68>
    )
  )

  return {
    faceLandmarks
  }
}

export const DetectFaceLandmarks = withAsyncRendering<DetectFaceLandmarksProps, DetectFaceLandmarksState>(
  detectFaceLandmarks,
  () => <ModalLoader title="Detecting Landmarks"/>
)
