import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';

export interface ExtractFacesProps {
  faceDetections: faceapi.FaceDetection[]
  input?: MediaElement
}

export interface ExtractFacesState {
  canvases?: HTMLCanvasElement[]
}

async function extractFaces(props: ExtractFacesProps) {
  return props.input
    ? { canvases: await faceapi.extractFaces(props.input.element, props.faceDetections) }
    : null
}

export const ExtractFaces = withAsyncRendering<ExtractFacesProps, ExtractFacesState>(extractFaces)
