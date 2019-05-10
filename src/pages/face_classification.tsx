import * as faceapi from 'face-api.js';
import * as React from 'react';

import { MODELS_URI } from '../../tmp/src/const';
import { FaceClassificationOptions, FaceClassificationToggleControls } from '../components/FaceClassificationToggleControls';
import { BasePage, BasePageState } from '../container/BasePage';
import { processFaceClassificationInputs } from '../processFaceClassificationInputs';

export type PageState = FaceClassificationOptions

export default class extends React.Component<{}, PageState> {
  state = {
    withFaceLandmarks: false,
    withFaceExpressions: false,
    withAgeAndGender: false,
    withShowBoxes: true,
    withShowFaceLandmarks: true
  }

  loadModels = async() => {
    await Promise.all([
      faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URI),
      faceapi.nets.ageGenderNet.loadFromUri(MODELS_URI)
    ])
  }

  processInputs = async(state: BasePageState) => {
    await processFaceClassificationInputs({ ...state, ...this.state })
  }

  public render() {
    return(
      <BasePage
        loadAdditionalModels={this.loadModels}
        processInputs={this.processInputs}
        renderControls={() =>
          <FaceClassificationToggleControls
            onChange={options => this.setState(options)}
          />
        }
      />
    )
  }
}