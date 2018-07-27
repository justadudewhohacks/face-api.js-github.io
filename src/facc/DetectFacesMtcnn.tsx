import * as faceapi from 'face-api.js';
import * as React from 'react';

import { MtcnnForwardParams, MtcnnResult } from '../../node_modules/face-api.js/build/mtcnn/types';
import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';
import { VideoWrap } from '../VideoWrap';

export interface DetectFacesMtcnnProps {
  mtcnn: faceapi.Mtcnn
  input: ImageWrap | VideoWrap
  detectionParams: MtcnnForwardParams
}

export interface DetectFacesMtcnnState {
  mtcnnResults: MtcnnResult[] | null
}

async function detectFaces(props: DetectFacesMtcnnProps) {
  const mtcnnResults = await props.mtcnn.forward(props.input.element, props.detectionParams)

  return {
    mtcnnResults
  }
}

export const DetectFacesMtcnn = withAsyncRendering<DetectFacesMtcnnProps, DetectFacesMtcnnState>(
  detectFaces,
  () => <ModalLoader title="Detecting Faces"/>
)
