import * as faceapi from 'face-api.js';
import { withPrefix } from 'gatsby-link';
import * as React from 'react';

import { MtcnnForwardParams } from '../../node_modules/face-api.js/build/mtcnn/types';
import { AdjustableInput } from '../components/AdjustableInput';
import { WebcamVideoWithOverlay } from '../components/WebcamVideoWithOverlay';
import { DetectFacesMtcnn } from '../facc/DetectFacesMtcnn';
import { LoadModels } from '../facc/LoadModels';
import { Root } from '../Root';
import { VideoWrap } from '../VideoWrap';
import { CenterContent } from '../styled/CenterContent';

type FaceDetectionWebcamMtcnnPageState = {
  inputVideo: VideoWrap
  detectionParams: MtcnnForwardParams
  isPlaying: boolean
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceDetectionWebcamMtcnnPageState> {
  isBusy: boolean = true
  interval: NodeJS.Timer

  constructor(props: {}) {
    super(props)

    this.state = {
      inputVideo: new VideoWrap(),
      isPlaying: false,
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
        <CenterContent flexDirection="column">
          <AdjustableInput
            inputId="scaleFactor"
            label="scaleFactor:"
            value={this.state.detectionParams.scaleFactor}
            minValue={0.1}
            maxValue={0.9}
            step={0.05}
            onChange={
              (scaleFactor: number) => this.setState({
                detectionParams: { ...this.state.detectionParams, scaleFactor }
              })
            }
          />
          <AdjustableInput
            inputId="minFaceSize"
            label="minFaceSize:"
            value={this.state.detectionParams.minFaceSize}
            minValue={40}
            maxValue={400}
            step={40}
            onChange={
              (minFaceSize: number) => this.setState({
                detectionParams: { ...this.state.detectionParams, minFaceSize }
              })
            }
          />
        </CenterContent>
        <LoadModels mtcnnModelUrl={withPrefix('/models')}>
        {
          ({ mtcnn }) =>
            <DetectFacesMtcnn
              mtcnn={mtcnn}
              input={this.state.inputVideo}
              detectionParams={this.state.detectionParams}
            >
            {
              (mtcnnResults) => {
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
            </DetectFacesMtcnn>
        }
        </LoadModels>
      </Root>
    )
  }
}