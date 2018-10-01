import * as React from 'react';

import { AllFacesTinyYolov2 } from '../facc/AllFacesTinyYolov2';
import { BestMatch } from '../facc/ComputeRefDescriptors';
import { ImageWrap } from '../ImageWrap';
import { DisplayFullFaceDescriptions } from './DisplayFullFaceDescriptions';
import { TinyYolov2ParamControls } from './TinyYolov2ParamControls';

type FaceRecognitionTinyYolov2Props = {
  inputImg: ImageWrap
  overlay: HTMLCanvasElement
  getBestMatch: (queryDescriptor: Float32Array) => BestMatch
}

type FaceRecognitionTinyYolov2State = {
  detectionParams: { inputSize: number, scoreThreshold: number }
}

export class FaceRecognitionTinyYolov2 extends React.Component<FaceRecognitionTinyYolov2Props, FaceRecognitionTinyYolov2State> {

  state: FaceRecognitionTinyYolov2State = {
    detectionParams: {
      scoreThreshold: 0.5,
      inputSize: 416
    }
  }

  public render() {
    return(
      <span>
        <TinyYolov2ParamControls
          inputSizes={[224, 320, 416, 618]}
          detectionParams={this.state.detectionParams}
          onChange={detectionParams => this.setState({ detectionParams })}
        />
        <AllFacesTinyYolov2
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
        </AllFacesTinyYolov2>
      </span>
    )
  }
}