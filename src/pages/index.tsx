import { MuiThemeProvider } from '@material-ui/core';
import * as faceapi from 'face-api.js';
import { withPrefix } from 'gatsby-link';
import * as React from 'react';

import { ImageSelection } from '../components/ImageSelection';

const getPageContext = require('./getPageContext')

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

  overlay: HTMLCanvasElement | undefined
  inputImg: HTMLImageElement | undefined
  faceDetectionNet: faceapi.FaceDetectionNet
  pageContext: any = {}

  constructor(props: IndexPageProps, context: any){
    super(props, context)
    this.state = {
      minDetectionScore: 0.8,
    }
    this.pageContext = getPageContext()
  }

  updateFaceLocations(locations: any[]) {
    const { width, height } = this.inputImg
    this.overlay.width = width
    this.overlay.height = height
    this.overlay.getContext('2d').clearRect(0, 0, width, height)
    faceapi.drawDetection(this.overlay, locations.map(loc => loc.forSize(width, height)))
  }

  async locateFaces() {
    if (!this.inputImg) {
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
    if (typeof window != 'undefined' && window.document) {
      this.loadModels()
    }
  }

  public render() {
    return(
      <MuiThemeProvider
        theme={this.pageContext.theme}
        sheetsManager={this.pageContext.sheetsManager}
      >
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
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </div>
          <ImageSelection
            defaultValue="images/bbt1.jpg"
            items={[1, 2, 3, 4, 5].map(idx => `images/bbt${idx}.jpg`)}
            onChange={(val: string) => console.log(val)}
          />
        </div>
      </MuiThemeProvider>
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