import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';

export interface ComputeFaceDescriptorsProps {
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
      faceapi.nets.faceRecognitionNet.computeFaceDescriptor(input.element) as Promise<Float32Array>
    )
  )

  return {
    faceDescriptors
  }
}

export const ComputeFaceDescriptors =
  withAsyncRendering<ComputeFaceDescriptorsProps, ComputeFaceDescriptorsState>(computeFaceDescriptors)

