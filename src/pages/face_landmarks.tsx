import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import { withPrefix } from 'gatsby-link';
import * as React from 'react';

import { DisplayResults } from '../components/DisplayResults';
import { ModalLoader } from '../components/ModalLoader';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES } from '../const';
import { DetectFaceLandmarks } from '../facc/DetectFaceLandmarks';
import { DetectFaces } from '../facc/DetectFaces';
import { ExtractFaces } from '../facc/ExtractFaces';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';
import { MarginTop } from '../styled/MarginTop';


interface DetectAndDrawFaceLandmarksForFaceImageProps {
  inputImgs: ImageWrap[]
  overlay: HTMLCanvasElement
  faceLandmarkNet: faceapi.FaceLandmarkNet
  drawLines: boolean
  faceDetections?: faceapi.FaceDetection[]
}

class DetectAndDrawFaceLandmarksForFaceImage extends React.Component<DetectAndDrawFaceLandmarksForFaceImageProps> {
  render() {
    return (
      <DetectFaceLandmarks
        imgs={this.props.inputImgs}
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
  inputImg: ImageWrap
  overlay: HTMLCanvasElement
  faceLandmarkNet: faceapi.FaceLandmarkNet
  drawLines: boolean
  faceDetections?: faceapi.FaceDetection[]
}

class DetectAndDrawFaceLandmarks extends React.Component<DetectAndDrawFaceLandmarksProps> {
  render() {
    if (this.props.faceDetections) {
      return (
        <ExtractFaces
          img={this.props.inputImg}
          faceDetections={this.props.faceDetections}
        >
        {
          ({ canvases, isBusy }) =>
            !isBusy &&
              <DetectAndDrawFaceLandmarksForFaceImage
                {...this.props}
                inputImgs={canvases.map((canvas) => new ImageWrap('none', canvas))}
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
  inputImg: ImageWrap
  drawLines: boolean
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceLandmarksPageState> {

  state: FaceLandmarksPageState = {
    tabIndex: 0,
    inputImg: new ImageWrap(ALIGNED_FACE_IMAGES[30].url),
    drawLines: true
  }

  toggleDrawLines = () => {
    this.setState({ drawLines: !this.state.drawLines })
  }

  onTabIndexChanged = (_: any, tabIndex: number) => {
    this.setState({ tabIndex, inputImg: new ImageWrap('none') })
  }

  isReadyForDetection = () => {
    return !!this.state.inputImg && !!this.state.inputImg.img && !!this.state.overlay
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <LoadModels
          faceDetectionModelUrl={withPrefix('/models')}
          faceLandmarkModelUrl={withPrefix('/models')}
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
                        initialImageSrc={this.state.inputImg.imageSrc}
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
                        <DetectFaces
                          faceDetectionNet={faceDetectionNet}
                          img={this.state.inputImg}
                          minConfidence={0.5}
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
                        </DetectFaces>
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