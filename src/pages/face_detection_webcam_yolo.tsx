import * as faceapi from 'face-api.js';
import * as React from 'react';

import { TinyYolov2ParamControls } from '../components/TinyYolov2ParamControls';
import { WebcamVideoWithOverlay } from '../components/WebcamVideoWithOverlay';
import { MODELS_URI } from '../const';
import { DetectFacesTinyYolov2NoLoader } from '../facc/DetectFacesTinyYolov2';
import { LoadModels } from '../facc/LoadModels';
import { Root } from '../Root';
import { TinyYolov2DetectionParams } from '../types';
import { VideoWrap } from '../VideoWrap';

type FaceDetectionWebcamYoloPageState = {
  inputVideo: VideoWrap
  detectionParams: TinyYolov2DetectionParams
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceDetectionWebcamYoloPageState> {
  isBusy: boolean = true
  interval: NodeJS.Timer

  constructor(props: {}) {
    super(props)

    this.state = {
      inputVideo: new VideoWrap(),
      detectionParams: {
        inputSize: 416,
        scoreThreshold: 0.5
      }
    }

    this.interval = setInterval(() => {
      if (this.isBusy) {
        return
      }
      this.isBusy = true
      this.setState({ inputVideo: new VideoWrap(this.state.inputVideo) })
    }, 16)
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <WebcamVideoWithOverlay
          onLoaded={({ video: inputVideo, overlay }) => this.setState({ inputVideo, overlay })}
          maxVideoWidth={800}
        />
        <LoadModels tinyYolov2ModelUrl={MODELS_URI}>
        {
          ({ tinyYolov2 }) =>
            this.state.inputVideo.isLoaded
            &&
            <DetectFacesTinyYolov2NoLoader
              tinyYolov2={tinyYolov2}
              input={this.state.inputVideo}
              detectionParams={this.state.detectionParams}
            >
            {
              ({ faceDetections }) => {
                const { overlay } = this.state

                if (overlay) {
                  const { width, height } = overlay
                  overlay.getContext('2d').clearRect(0, 0, width, height)
                  faceapi.drawDetection(
                    overlay,
                    faceDetections.map(det => det.forSize(width, height))
                  )

                  this.isBusy = false
                }

                return null
              }
            }
            </DetectFacesTinyYolov2NoLoader>
        }
        </LoadModels>
      </Root>
    )
  }
}