import * as faceapi from 'face-api.js';
import * as React from 'react';

import { DisplayFullFaceDescriptions } from '../components/DisplayFullFaceDescriptions';
import { SelectableImage } from '../components/SelectableImage';
import { WithMtcnnControls } from '../components/WithMtcnnControls';
import { WithSsdMobilenetv1Controls } from '../components/WithSsdMobilenetv1Controls';
import { WithTinyYolov2Controls } from '../components/WithTinyYolov2Controls';
import { ALIGNED_FACE_IMAGES_BY_CLASS, EXAMPLE_IMAGES, getLoadModelsUriFromFaceDetector, MODELS_URI } from '../const';
import { AllFacesMtcnn } from '../facc/AllFacesMtcnn';
import { AllFacesSsdMobilenetv1 } from '../facc/AllFacesSsdMobilenetv1';
import { AllFacesTinyYolov2 } from '../facc/AllFacesTinyYolov2';
import { ChooseFaceDetector } from '../facc/ChooseFaceDetector';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { LoadFaceDetectionModel, LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceRecognitionPageState = {
  inputImg: ImageWrap
  minDetectionScore: number
  overlay?: HTMLCanvasElement
}

const REF_DATA_SOURCES = ALIGNED_FACE_IMAGES_BY_CLASS.map(srcsByClass => srcsByClass[0])

export default class extends React.Component<{}, FaceRecognitionPageState> {

  state: FaceRecognitionPageState = {
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
              />
              <LoadModels
                faceLandmarkModelUrl={MODELS_URI}
                faceRecognitionModelUrl={MODELS_URI}
              >
              {
                ({ faceRecognitionNet }) =>
                  <ComputeRefDescriptors
                    faceRecognitionNet={faceRecognitionNet}
                    refDataSources={REF_DATA_SOURCES}
                  >
                  {
                    ({ getBestMatch }) =>
                      <LoadFaceDetectionModel
                        {...getLoadModelsUriFromFaceDetector(faceDetector, MODELS_URI)}
                      >
                      {
                        ({ faceDetectionNet }) => {
                          if (faceDetectionNet instanceof faceapi.TinyYolov2) {
                            return (
                              <WithTinyYolov2Controls>
                              {
                                ({ detectionParams }) =>
                                  <AllFacesTinyYolov2
                                    img={this.state.inputImg}
                                    detectionParams={detectionParams}
                                  >
                                  {
                                    ({ fullFaceDescriptions }) =>
                                      <DisplayFullFaceDescriptions
                                        fullFaceDescriptions={fullFaceDescriptions}
                                        overlay={this.state.overlay}
                                        getBestMatch={getBestMatch}
                                        withScore
                                      />
                                  }
                                  </AllFacesTinyYolov2>
                              }
                              </WithTinyYolov2Controls>
                            )
                          } else if (faceDetectionNet instanceof faceapi.FaceDetectionNet) {
                            return (
                              <WithSsdMobilenetv1Controls>
                              {
                                ({ detectionParams }) =>
                                  <AllFacesSsdMobilenetv1
                                    img={this.state.inputImg}
                                    detectionParams={detectionParams}
                                  >
                                  {
                                    ({ fullFaceDescriptions }) =>
                                      <DisplayFullFaceDescriptions
                                        fullFaceDescriptions={fullFaceDescriptions}
                                        overlay={this.state.overlay}
                                        getBestMatch={getBestMatch}
                                        withScore
                                      />
                                  }
                                  </AllFacesSsdMobilenetv1>
                              }
                              </WithSsdMobilenetv1Controls>
                            )
                          } else if (faceDetectionNet instanceof faceapi.Mtcnn) {
                            return (
                              <WithMtcnnControls>
                              {
                                ({ detectionParams }) =>
                                  <AllFacesMtcnn
                                    img={this.state.inputImg}
                                    detectionParams={detectionParams}
                                  >
                                  {
                                    ({ fullFaceDescriptions }) =>
                                      <DisplayFullFaceDescriptions
                                        fullFaceDescriptions={fullFaceDescriptions}
                                        overlay={this.state.overlay}
                                        getBestMatch={getBestMatch}
                                        withScore
                                      />
                                  }
                                  </AllFacesMtcnn>
                              }
                              </WithMtcnnControls>
                            )
                          }
                          console.log(faceDetectionNet)
                          return <h1> Unknown Face Detector </h1>
                        }
                      }
                      </LoadFaceDetectionModel>
                }
                </ComputeRefDescriptors>
              }
              </LoadModels>
            </span>
        }
        </ChooseFaceDetector>
      </Root>
    )
  }
}