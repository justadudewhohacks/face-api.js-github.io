import * as faceapi from 'face-api.js';
import * as React from 'react';

import { FaceDetection } from '../components/FaceDetection';
import { ImageSelection } from '../components/ImageSelection';
import { Root } from '../Root';

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
  isSideMenuOpen: boolean
  minDetectionScore: number
  selectedImage: string
  faceDetectionNet?: faceapi.FaceDetectionNet
}

const SELECTABLE_ITEMS = [1, 2, 3, 4, 5].map(idx => `images/bbt${idx}.jpg`)

export default class extends React.Component<IndexPageProps, IndexPageState> {
  state: IndexPageState = {
    isSideMenuOpen: false,
    minDetectionScore: 0.5,
    selectedImage: SELECTABLE_ITEMS[0]
  }

  constructor(props: IndexPageProps, context: any){
    super(props, context)
  }

  async loadModels() {
    const faceDetectionNet = new faceapi.FaceDetectionNet()
    await faceDetectionNet.load('models')
    this.setState({ faceDetectionNet })
  }

  componentWillMount() {
    if (typeof window != 'undefined' && window.document) {
      this.loadModels()
    }
  }

  toggle = () => {
    this.setState(state => ({ isSideMenuOpen: !state.isSideMenuOpen }))
  }

  public render() {
    return(
      <Root>
        <FaceDetection
          faceDetectionNet={this.state.faceDetectionNet}
          imageSrc={this.state.selectedImage}
          minDetectionScore={this.state.minDetectionScore}
          maxImageWidth={800}
        />
        <ImageSelection
          items={SELECTABLE_ITEMS}
          selectedImage={this.state.selectedImage}
          onChange={(selectedImage: string) => this.setState({ selectedImage })}
        />
      </Root>
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