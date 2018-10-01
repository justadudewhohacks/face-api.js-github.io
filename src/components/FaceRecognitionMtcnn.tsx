import * as React from 'react';

import { AllFacesMtcnn } from '../facc/AllFacesMtcnn';
import { BestMatch } from '../facc/ComputeRefDescriptors';
import { ImageWrap } from '../ImageWrap';
import { MtcnnDetectionParams } from '../types';
import { DisplayFullFaceDescriptions } from './DisplayFullFaceDescriptions';

type FaceRecognitionMtcnnProps = {
  inputImg: ImageWrap
  overlay: HTMLCanvasElement
  getBestMatch: (queryDescriptor: Float32Array) => BestMatch
}

type FaceRecognitionMtcnnState = {
  detectionParams: MtcnnDetectionParams
}

export class FaceRecognitionMtcnn extends React.Component<FaceRecognitionMtcnnProps, FaceRecognitionMtcnnState> {

  state: FaceRecognitionMtcnnState = {
    detectionParams: {
      minFaceSize: 20,
      scaleFactor: 0.8
    }
  }

  public render() {
    return(
      <AllFacesMtcnn
        img={this.props.inputImg}
        detectionParams={this.state.detectionParams}
      >
      {
        ({ fullFaceDescriptions }) =>
          <DisplayFullFaceDescriptions
            fullFaceDescriptions={fullFaceDescriptions}
            overlay={this.props.overlay}
            getBestMatch={this.props.getBestMatch}
            withScore
          />
      }
      </AllFacesMtcnn>
    )
  }
}