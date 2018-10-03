import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';

export interface ComputeFaceDescriptorsProps {
  faceRecognitionNet: faceapi.FaceRecognitionNet
  inputs: Array<MediaElement | undefined>
}

export interface ComputeFaceDescriptorsState {
  faceDescriptors?: Float32Array[]
}

async function computeFaceDescriptors(props: ComputeFaceDescriptorsProps) {
  if (!props.inputs.every(input => !!input)) {
    return
  }

  const faceDescriptors = await Promise.all(
    props.inputs.map(input =>
      props.faceRecognitionNet.computeFaceDescriptor(input.element) as Promise<Float32Array>
    )
  )

  return {
    faceDescriptors
  }
}

export const ComputeFaceDescriptors = withAsyncRendering<ComputeFaceDescriptorsProps, ComputeFaceDescriptorsState>(
  computeFaceDescriptors,
  () => <ModalLoader title="Computing Face Descriptors"/>
)

