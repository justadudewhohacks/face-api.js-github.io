import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';
import { ModalLoader } from '../components/ModalLoader';
import * as React from 'react';

export interface ComputeFaceDescriptorsProps {
  faceRecognitionNet: faceapi.FaceRecognitionNet
  imgs: ImageWrap[]
}

export interface ComputeFaceDescriptorsState {
  faceDescriptors?: Float32Array[]
}

async function computeFaceDescriptors(props: ComputeFaceDescriptorsProps) {
  const faceDescriptors = await Promise.all(
    props.imgs.map((imgWrap) => {
      return props.faceRecognitionNet.computeFaceDescriptor(imgWrap.img) as Promise<Float32Array>
    })
  )

  return {
    faceDescriptors
  }
}

export const ComputeFaceDescriptors = withAsyncRendering<ComputeFaceDescriptorsProps, ComputeFaceDescriptorsState>(
  computeFaceDescriptors,
  () => <ModalLoader title="Computing Face Descriptors"/>
)

