import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { ImageWrap } from '../ImageWrap';

export interface ExtractFacesProps {
  img: ImageWrap
  faceDetections: faceapi.FaceDetection[]
}

export interface ExtractFacesState {
  canvases?: HTMLCanvasElement[]
}

async function extractFaces(props: ExtractFacesProps) {
  const canvases = await faceapi.extractFaces(props.img.img, props.faceDetections)

  return {
    canvases
  }
}

export const ExtractFaces = withAsyncRendering<ExtractFacesProps, ExtractFacesState>(extractFaces)
