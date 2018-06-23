import * as faceapi from 'face-api.js';
import { withPrefix } from 'gatsby-link';
import * as React from 'react';

type IndexPageProps = {
  data: {
    site: {
      siteMetadata: {
        siteName: string
      }
    }
  }
}

type IndexPageState = {
  minDetectionScore: number
}

export default class extends React.Component<IndexPageProps, IndexPageState> {

  overlay: HTMLCanvasElement
  inputImg: HTMLImageElement = new Image()
  faceDetectionNet: faceapi.FaceDetectionNet

  constructor(props: IndexPageProps, context: any){
    super(props, context)
    this.state = {
      minDetectionScore: 0.8,
    }
  }

  updateFaceLocations(locations: any[]) {
    const { width, height } = this.inputImg
    this.overlay.width = width
    this.overlay.height = height
    this.overlay.getContext('2d').clearRect(0, 0, width, height)
    faceapi.drawDetection(this.overlay, locations.map(loc => loc.forSize(width, height)))
  }

  async locateFaces() {
    if (!this.inputImg.width || !this.inputImg.height) {
      return
    }
    const locations = await this.faceDetectionNet.locateFaces(this.inputImg, this.state.minDetectionScore)
    this.updateFaceLocations(locations)
  }

  async loadModels() {
    this.faceDetectionNet = new faceapi.FaceDetectionNet()
    await this.faceDetectionNet.load('models')
    await this.locateFaces()
  }

  componentWillMount() {
    this.loadModels()
  }

  public render() {
    return(
      <div>
        <h1> Hello world </h1>
        <div style={{ position: 'relative' }}>
          <img
            src={withPrefix('images/bbt1.jpg')}
            style={{ maxWidth: 800 }}
            ref={inputImg => this.inputImg = inputImg}
          />
          <canvas
            ref={overlay => this.overlay = overlay}
            style={{ position: 'absolute', top: 0 }}
          />
        </div>
      </div>
    )
  }
}

export const pageQuery = graphql`
  query IndexQuery{
    site {
      siteMetadata {
        siteName
      }
    }
  }
`