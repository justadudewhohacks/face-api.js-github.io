import * as faceapi from 'face-api.js';
import * as React from 'react';

import { MtcnnForwardParams } from '../../node_modules/face-api.js/build/mtcnn/types';
import { MtcnnParamControls } from '../components/MtcnnParamControls';
import { WebcamVideoWithOverlay } from '../components/WebcamVideoWithOverlay';
import { MODELS_URI } from '../const';
import { DetectFacesMtcnnNoLoader } from '../facc/DetectFacesMtcnn';
import { LoadModels } from '../facc/LoadModels';
import { Root } from '../Root';
import { VideoWrap } from '../VideoWrap';

type FaceDetectionWebcamMtcnnPageState = {
  inputVideo: VideoWrap
  detectionParams: MtcnnForwardParams
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceDetectionWebcamMtcnnPageState> {
  isBusy: boolean = true
  interval: NodeJS.Timer

  constructor(props: {}) {
    super(props)

    this.state = {
      inputVideo: new VideoWrap(),
      detectionParams: {
        minFaceSize: 200,
        scaleFactor: 0.8
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
        <MtcnnParamControls
          detectionParams={this.state.detectionParams}
          onChange={detectionParams => this.setState({ detectionParams })}
        />
        <LoadModels mtcnnModelUrl={MODELS_URI}>
        {
          ({ mtcnn }) =>
            this.state.inputVideo.isLoaded
            &&
            <DetectFacesMtcnnNoLoader
              mtcnn={mtcnn}
              input={this.state.inputVideo}
              detectionParams={this.state.detectionParams}
            >
            {
              ({ mtcnnResults }) => {
                const { overlay } = this.state

                if (overlay && mtcnnResults) {
                  const { width, height } = overlay
                  overlay.getContext('2d').clearRect(0, 0, width, height)
                  faceapi.drawDetection(
                    overlay,
                    mtcnnResults.map(res => res.faceDetection.forSize(width, height))
                  )
                  faceapi.drawLandmarks(
                    overlay,
                    mtcnnResults.map(res => res.faceLandmarks.forSize(width, height))
                  )

                  this.isBusy = false
                }

                return null
              }
            }
            </DetectFacesMtcnnNoLoader>
        }
        </LoadModels>
      </Root>
    )
  }
}