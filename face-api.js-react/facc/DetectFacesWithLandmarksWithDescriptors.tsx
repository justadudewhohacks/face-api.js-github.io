import * as faceapi from 'face-api.js';

import { withAsyncRendering } from '../hoc/withAsyncRendering';
import { MediaElement } from '../MediaElement';
import { FullFaceDescription, FaceDetectionOptions } from 'face-api.js';

export interface DetectFacesWithLandmarksWithDescriptorsProps {
  detectionOptions: FaceDetectionOptions
  input?: MediaElement
}

export interface DetectFacesWithLandmarksWithDescriptorsState {
  fullFaceDescriptions?: FullFaceDescription[]
}

async function detectFacesWithLandmarksWithDescriptors(props: DetectFacesWithLandmarksWithDescriptorsProps) {

  if (!props.input) {
    return null
  }

  return {
    fullFaceDescriptions: await faceapi.detectAllFaces(props.input.element, props.detectionOptions).withFaceLandmarks().withFaceDescriptors()
  }
}

export const DetectFacesWithLandmarksWithDescriptors =
  withAsyncRendering<DetectFacesWithLandmarksWithDescriptorsProps, DetectFacesWithLandmarksWithDescriptorsState>(detectFacesWithLandmarksWithDescriptors)
