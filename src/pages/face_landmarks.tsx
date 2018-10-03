import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { DisplayResults } from '../components/DisplayResults';
import { ModalLoader } from '../components/ModalLoader';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES, MODELS_URI } from '../const';
import { DetectFaceLandmarks } from '../facc/DetectFaceLandmarks';
import { DetectFacesSsdMobilenetv1 } from '../facc/DetectFacesSsdMobilenetv1';
import { ExtractFaces } from '../facc/ExtractFaces';
import { LoadModels } from '../facc/LoadModels';
import { MediaElement } from '../MediaElement';
import { Root } from '../Root';
import { MarginTop } from '../styled/MarginTop';


interface DetectAndDrawFaceLandmarksForFaceImageProps {
  inputImgs: MediaElement[]
  overlay: HTMLCanvasElement
  faceLandmarkNet: faceapi.FaceLandmarkNet
  drawLines: boolean
  faceDetections?: faceapi.FaceDetection[]
}

class DetectAndDrawFaceLandmarksForFaceImage extends React.Component<DetectAndDrawFaceLandmarksForFaceImageProps> {
  render() {
    return (
      <DetectFaceLandmarks
        inputs={this.props.inputImgs}
        faceLandmarkNet={this.props.faceLandmarkNet}
      >
      {
        ({ faceLandmarks, isBusy }) => {
          if (isBusy) {
            return <ModalLoader title="Detecting Face Landmarks"/>
          }

          return (
            <DisplayResults
              {...this.props}
              faceLandmarks={faceLandmarks}
            />
          )
        }
      }
      </DetectFaceLandmarks>
    )
  }
}

interface DetectAndDrawFaceLandmarksProps {
  overlay: HTMLCanvasElement
  faceLandmarkNet: faceapi.FaceLandmarkNet
  drawLines: boolean
  inputImg?: MediaElement
  faceDetections?: faceapi.FaceDetection[]
}

class DetectAndDrawFaceLandmarks extends React.Component<DetectAndDrawFaceLandmarksProps> {
  render() {
    if (this.props.faceDetections) {
      return (
        <ExtractFaces
          input={this.props.inputImg}
          faceDetections={this.props.faceDetections}
        >
        {
          ({ canvases, isBusy }) =>
            !isBusy &&
              <DetectAndDrawFaceLandmarksForFaceImage
                {...this.props}
                inputImgs={canvases.map((canvas) => new MediaElement(canvas))}
              />
        }
        </ExtractFaces>
      )
    }

    return (
      <DetectAndDrawFaceLandmarksForFaceImage
        {...this.props}
        inputImgs={[this.props.inputImg]}
      />
    )
  }
}

type FaceLandmarksPageState = {
  tabIndex: number
  drawLines: boolean
  inputImg?: MediaElement
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceLandmarksPageState> {

  state: FaceLandmarksPageState = {
    tabIndex: 0,
    drawLines: true
  }

  toggleDrawLines = () => {
    this.setState({ drawLines: !this.state.drawLines })
  }

  onTabIndexChanged = (_: any, tabIndex: number) => {
    this.setState({ tabIndex, inputImg: undefined })
  }

  isReadyForDetection = () => {
    return !!this.state.inputImg && !!this.state.overlay
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <LoadModels
          ssdMobilenetv1ModelUrl={MODELS_URI}
          faceLandmarkModelUrl={MODELS_URI}
        >
        {
          ({ faceDetectionNet, faceLandmarkNet }) =>
            <div>
              <Mui.Tabs
                value={this.state.tabIndex}
                onChange={this.onTabIndexChanged}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Mui.Tab label="Preview" value={0}/>
                <Mui.Tab label="Use Own Images" value={1}/>
              </Mui.Tabs>
              {
                this.state.tabIndex === 0
                  ?
                    <div>
                      <SelectableImage
                        items={ALIGNED_FACE_IMAGES}
                        initialImageSrc={ALIGNED_FACE_IMAGES[30].url}
                        onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
                        maxImageWidth={150}
                        selectionType={SelectionTypes.SELECT}
                      />
                      {
                        this.isReadyForDetection()
                        &&
                        <DetectAndDrawFaceLandmarks
                          {...this.state}
                          overlay={this.state.overlay}
                          faceLandmarkNet={faceLandmarkNet}
                        />
                      }
                    </div>
                  :
                    <div>
                      <SelectableImage
                        onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
                        selectionType={SelectionTypes.FILE}
                      />
                      {
                        this.isReadyForDetection()
                        &&
                        <DetectFacesSsdMobilenetv1
                          faceDetectionNet={faceDetectionNet as faceapi.FaceDetectionNet}
                          input={this.state.inputImg}
                          detectionParams={{ minConfidence: 0.5 }}
                        >
                        {
                          ({ faceDetections }) =>
                              <DetectAndDrawFaceLandmarks
                                {...this.state}
                                overlay={this.state.overlay}
                                faceDetections={faceDetections}
                                faceLandmarkNet={faceLandmarkNet}
                              />
                        }
                        </DetectFacesSsdMobilenetv1>
                      }
                    </div>
              }
          </div>
        }
        </LoadModels>
        <MarginTop>
          <Mui.FormControlLabel
            control={
              <Mui.Checkbox
                checked={this.state.drawLines}
                onChange={this.toggleDrawLines}
                color="primary"
              />
            }
            label="Draw Lines"
          />
        </MarginTop>

      </Root>
    )
  }
}