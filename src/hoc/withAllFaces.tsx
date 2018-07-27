import * as faceapi from 'face-api.js';

import { ImageWrap } from '../ImageWrap';
import { withAsyncRendering } from './withAsyncRendering';
import { ModalLoader } from '../components/ModalLoader';
import * as React from 'react';

export interface WithAllFacesProps {
  img: ImageWrap
}

export interface WithAllFacesState {
  fullFaceDescriptions?: faceapi.FullFaceDescription[]
}

type Props<DetectionParams> = WithAllFacesProps & {
  detectionParams: DetectionParams
}

export const withAllFaces = <DetectionParams extends {}> (
  allFacesFunction: (img: HTMLImageElement, params: DetectionParams) => Promise<faceapi.FullFaceDescription[]>
) => {
  async function allFaces(props: Props<DetectionParams>) {
    const fullFaceDescriptions = await allFacesFunction(props.img.img, props.detectionParams)

    return {
      fullFaceDescriptions
    }
  }

  return withAsyncRendering<Props<DetectionParams>, WithAllFacesState>(
    allFaces,
    () => <ModalLoader title="Detecting Faces"/>
  )
}
