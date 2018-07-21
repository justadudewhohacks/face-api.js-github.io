import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';

export type RefDescriptor = {
  label: string,
  descriptor: Float32Array
}

export type BestMatch = {
  label: string,
  distance: number
}

export interface ComputeRefDescriptorsProps {
  faceRecognitionNet: faceapi.FaceRecognitionNet
  refDataSources: {
    label: string,
    url: string
  }[]
  children: (
    getBestMatch: (queryDescriptor: Float32Array) => BestMatch | null,
    refDescriptors: RefDescriptor[] | null
  ) => React.Component | JSX.Element
}

export interface ComputeRefDescriptorsState {
  refDescriptors: RefDescriptor[] | null,
  isBusy: boolean
}

export class ComputeRefDescriptors extends React.Component<ComputeRefDescriptorsProps, ComputeRefDescriptorsState> {

    state: ComputeRefDescriptorsState = {
      refDescriptors: null,
      isBusy: true
    }

    async initRefDescriptors() {
      const refDescriptors = await Promise.all(
        this.props.refDataSources.map(async ({ label, url }) => {
          const img = await faceapi.bufferToImage(await (await fetch(url)).blob())
          const descriptor = await this.props.faceRecognitionNet.computeFaceDescriptor(img) as Float32Array
          return {
            label: label.replace('1.png', ''),
            descriptor
          }
        })
      )

      this.setState({
        refDescriptors,
        isBusy: false
      })
    }

    componentDidMount() {
      this.initRefDescriptors()
    }

    render() {
      if (this.state.isBusy) {
        return <ModalLoader title="Computing Reference Descriptors" />
      }

      const getBestMatch = (queryDescriptor: Float32Array) =>
        this.state.refDescriptors.map(ref => ({
          label: ref.label,
          distance: faceapi.euclideanDistance(ref.descriptor, queryDescriptor)
        }))
          .reduce((best, curr) => curr.distance < best.distance ? curr : best)

      return this.props.children(getBestMatch, this.state.refDescriptors)
    }
  }
