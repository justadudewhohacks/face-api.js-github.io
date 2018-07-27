import * as faceapi from 'face-api.js';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';
import * as React from 'react';

export interface DetectFaceLandmarksProps {
  faceLandmarkNet: faceapi.FaceLandmarkNet
  imgs: ImageWrap[]
}

export interface DetectFaceLandmarksState {
  faceLandmarks?: faceapi.FaceLandmarks68[]
}

async function detectFaceLandmarks(props: DetectFaceLandmarksProps) {
  const faceLandmarks = await Promise.all(
    props.imgs.map(({ img }) => {
      return props.faceLandmarkNet.detectLandmarks(img) as Promise<faceapi.FaceLandmarks68>
    })
  )

  return {
    faceLandmarks
  }
}

export const DetectFaceLandmarks = withAsyncRendering<DetectFaceLandmarksProps, DetectFaceLandmarksState>(
  detectFaceLandmarks,
  () => <ModalLoader title="Detecting Landmarks"/>
)
