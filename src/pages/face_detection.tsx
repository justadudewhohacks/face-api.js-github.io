import * as faceapi from 'face-api.js';
import * as React from 'react';

import { DisplayResults } from '../components/DisplayResults';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { WithMtcnnControls } from '../components/WithMtcnnControls';
import { WithSsdMobilenetv1Controls } from '../components/WithSsdMobilenetv1Controls';
import { WithTinyYolov2Controls } from '../components/WithTinyYolov2Controls';
import { EXAMPLE_IMAGES, getLoadModelsUriFromFaceDetector, MODELS_URI } from '../const';
import { ChooseFaceDetector } from '../facc/ChooseFaceDetector';
import { DetectFacesMtcnn } from '../facc/DetectFacesMtcnn';
import { DetectFacesSsdMobilenetv1 } from '../facc/DetectFacesSsdMobilenetv1';
import { DetectFacesTinyYolov2 } from '../facc/DetectFacesTinyYolov2';
import { LoadFaceDetectionModel } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceDetectionPageState = {
  inputImg: ImageWrap
  minDetectionScore: number
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceDetectionPageState> {

  state: FaceDetectionPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    minDetectionScore: 0.5
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <ChooseFaceDetector>
        {
          (faceDetector: string) =>
            <span>
              <SelectableImage
                items={EXAMPLE_IMAGES}
                initialImageSrc={this.state.inputImg.imageSrc}
                onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
                maxImageWidth={800}
                selectionType={SelectionTypes.BOTH}
              />
              <LoadFaceDetectionModel {...getLoadModelsUriFromFaceDetector(faceDetector, MODELS_URI)}>
              {
                ({ faceDetectionNet }) => {
                  if (faceDetectionNet instanceof faceapi.TinyYolov2) {
                    return (
                      <WithTinyYolov2Controls>
                      {
                        ({ detectionParams }) =>
                          <DetectFacesTinyYolov2
                            tinyYolov2={faceDetectionNet as faceapi.TinyYolov2}
                            input={this.state.inputImg}
                            detectionParams={detectionParams}
                          >
                          {
                            ({ faceDetections }) =>
                              <DisplayResults
                                overlay={this.state. overlay}
                                faceDetections={faceDetections}
                              />
                          }
                          </DetectFacesTinyYolov2>
                      }
                      </WithTinyYolov2Controls>
                    )
                  } else if (faceDetectionNet instanceof faceapi.FaceDetectionNet) {
                    return (
                      <WithSsdMobilenetv1Controls>
                      {
                        ({ detectionParams }) =>
                          <DetectFacesSsdMobilenetv1
                            faceDetectionNet={faceDetectionNet as faceapi.FaceDetectionNet}
                            input={this.state.inputImg}
                            detectionParams={detectionParams}
                          >
                          {
                            ({ faceDetections }) =>
                              <DisplayResults
                                overlay={this.state. overlay}
                                faceDetections={faceDetections}
                              />
                          }
                          </DetectFacesSsdMobilenetv1>
                      }
                      </WithSsdMobilenetv1Controls>
                    )
                  } else if (faceDetectionNet instanceof faceapi.Mtcnn) {
                    return (
                      <WithMtcnnControls>
                      {
                        ({ detectionParams }) =>
                          <DetectFacesMtcnn
                            mtcnn={faceDetectionNet as faceapi.Mtcnn}
                            input={this.state.inputImg}
                            detectionParams={detectionParams}
                          >
                          {
                            ({ mtcnnResults }) =>
                              <DisplayResults
                                overlay={this.state.overlay}
                                faceDetections={mtcnnResults.map(res => res.faceDetection)}
                                faceLandmarks={mtcnnResults.map(res => res.faceLandmarks)}
                              />
                          }
                          </DetectFacesMtcnn>
                      }
                      </WithMtcnnControls>
                    )
                  } else  {
                    console.log(faceDetectionNet)
                    return <h1> Unknown Face Detector </h1>
                  }
              }
            }
            </LoadFaceDetectionModel>
          </span>
        }
        </ChooseFaceDetector>
      </Root>
    )
  }
}