import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ModalLoader } from '../components/ModalLoader';
import { MediaElement } from '../MediaElement';
import { withAsyncRendering } from './withAsyncRendering';
import { TMediaElement } from 'face-api.js';

export interface WithAllFacesProps {
  input?: MediaElement
}

export interface WithAllFacesState {
  fullFaceDescriptions?: faceapi.FullFaceDescription[]
}

type Props<DetectionParams> = WithAllFacesProps & {
  detectionParams: DetectionParams
}

export const withAllFaces = <DetectionParams extends {}> (
  allFacesFunction: (img: TMediaElement, params: DetectionParams) => Promise<faceapi.FullFaceDescription[]>
) => {
  async function allFaces(props: Props<DetectionParams>) {
    return props.input
      ? { fullFaceDescriptions: await allFacesFunction(props.input.element, props.detectionParams) }
      : null
  }

  return withAsyncRendering<Props<DetectionParams>, WithAllFacesState>(
    allFaces,
    () => <ModalLoader title="Detecting Faces"/>
  )
}
