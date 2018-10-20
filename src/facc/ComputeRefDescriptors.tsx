import * as faceapi from 'face-api.js';
import { withAsyncRendering } from 'face-api.js-react';

export type RefDescriptor = {
  label: string,
  descriptor: Float32Array
}

export type BestMatch = {
  label: string,
  distance: number
}

export interface ComputeRefDescriptorsProps {
  refDataSources: {
    label: string,
    url: string
  }[]
}

export interface ComputeRefDescriptorsState {
  refDescriptors?: RefDescriptor[]
  getBestMatch?: (queryDescriptor: Float32Array) => BestMatch
}

async function initRefDescriptors(props: ComputeRefDescriptorsProps) {
  const refDescriptors = await Promise.all(
    props.refDataSources.map(async ({ label, url }) => {
      const img = await faceapi.bufferToImage(await (await fetch(url)).blob())
      const descriptor = await faceapi.nets.faceRecognitionNet.computeFaceDescriptor(img) as Float32Array
      return {
        label: label.replace('1.png', ''),
        descriptor
      }
    })
  )

  const getBestMatch = (queryDescriptor: Float32Array) =>
    refDescriptors.map(ref => ({
      label: ref.label,
      distance: faceapi.euclideanDistance(ref.descriptor, queryDescriptor)
    }))
      .reduce((best, curr) => curr.distance < best.distance ? curr : best)

  return {
    refDescriptors,
    getBestMatch
  }
}

export const ComputeRefDescriptors = 
  withAsyncRendering<ComputeRefDescriptorsProps, ComputeRefDescriptorsState>(initRefDescriptors)
