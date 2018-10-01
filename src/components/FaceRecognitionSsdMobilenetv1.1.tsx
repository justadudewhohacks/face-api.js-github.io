import * as React from 'react';

import { AllFacesSsdMobilenetv1 } from '../facc/AllFacesSsdMobilenetv1';
import { BestMatch } from '../facc/ComputeRefDescriptors';
import { ImageWrap } from '../ImageWrap';
import { SsdMobilenetv1DetectionParams } from '../types';
import { DisplayFullFaceDescriptions } from './DisplayFullFaceDescriptions';
import { SsdMobilenetv1ParamControls } from './SsdMobilenetv1ParamControls';

type FaceRecognitionSsdMobilenetv1Props = {
  inputImg: ImageWrap
  overlay: HTMLCanvasElement
  getBestMatch: (queryDescriptor: Float32Array) => BestMatch
}

type FaceRecognitionSsdMobilenetv1State = {
  detectionParams: SsdMobilenetv1DetectionParams
}

export class FaceRecognitionSsdMobilenetv1 extends React.Component<FaceRecognitionSsdMobilenetv1Props, FaceRecognitionSsdMobilenetv1State> {

  state: FaceRecognitionSsdMobilenetv1State = {
    detectionParams: {
      minConfidence: 0.5
    }
  }

  public render() {
    return(
      <span>
        <SsdMobilenetv1ParamControls
          detectionParams={this.state.detectionParams}
          onChange={detectionParams => this.setState({ detectionParams })}
        />
        <AllFacesSsdMobilenetv1
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
        </AllFacesSsdMobilenetv1>
      </span>
    )
  }
}