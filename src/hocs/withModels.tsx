import * as faceapi from 'face-api.js';
import * as React from 'react';

import { Dialog, DialogContent, DialogTitle, LinearProgress } from '../../node_modules/@material-ui/core';

export interface WithModelsProps {
  faceDetectionModelUrl?: string
  faceLandmarkModelUrl?: string
  faceRecognitionModelUrl?: string
}

export interface WithModelsInjectedProps {
  faceDetectionNet?: faceapi.FaceDetectionNet
  faceLandmarkNet?: faceapi.FaceLandmarkNet
  faceRecognitionNet?: faceapi.FaceRecognitionNet
}

export interface WithModelsState extends WithModelsInjectedProps {
  isLoading: boolean
}

export const withModels = <InputProps extends {}>(
  Component: React.ComponentType<InputProps & WithModelsInjectedProps>
) =>
  class WithModels extends React.Component<InputProps & WithModelsProps, WithModelsState> {

    state: WithModelsState = {
      isLoading: false
    }

    async loadModels() {
      const {
        faceDetectionModelUrl,
        faceLandmarkModelUrl,
        faceRecognitionModelUrl
      } = this.props

      this.setState({
        isLoading: true
      })

      const loadOrUndefined = async (net: any, url?: string) => {
        if (!url) {
          return undefined
        }
        await net.load(url)
        return net
      }

      const promises = [
        loadOrUndefined(new faceapi.FaceDetectionNet(), faceDetectionModelUrl),
        loadOrUndefined(new faceapi.FaceLandmarkNet(), faceLandmarkModelUrl),
        loadOrUndefined(new faceapi.FaceRecognitionNet(), faceRecognitionModelUrl)
      ]

      const [faceDetectionNet, faceLandmarkNet, faceRecognitionNet] = await Promise.all(promises)

      this.setState({
        isLoading: false,
        faceDetectionNet,
        faceLandmarkNet,
        faceRecognitionNet
      })
    }

    componentDidUpdate(prevProps: WithModelsProps) {
      if (
        this.props === prevProps
          && this.props.faceDetectionModelUrl === prevProps.faceDetectionModelUrl
          && this.props.faceLandmarkModelUrl === prevProps.faceLandmarkModelUrl
          && this.props.faceRecognitionModelUrl === prevProps.faceRecognitionModelUrl
      ) {
        return
      }

      this.loadModels()
    }

    componentDidMount() {
      this.loadModels()
    }

    render() {
      if (this.state.isLoading) {
        return (
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={true}
          >
            <DialogTitle>
              Loading Models
            </DialogTitle>
            <DialogContent>
              <LinearProgress />
            </DialogContent>
          </Dialog>
        )
      }

      return (
        <Component
          {...this.props}
          {...this.state}
        />
      );
    }
  };
