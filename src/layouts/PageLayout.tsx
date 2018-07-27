import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import styled from 'styled-components';

import { CenterContent } from '../styled/CenterContent';
import { SideMenu } from '../components/SideMenu';

const PageHeader = styled.h3`
  text-align: center;
`

const MENU_ITEMS = [
  { label: 'Face Detection', linkTo: 'face_detection' },
  { label: 'Face Detection Webcam - MTCNN', linkTo: 'face_detection_webcam_mtcnn' },
  { label: 'Face Landmarks', linkTo: 'face_landmarks' },
  { label: 'Face Similarity', linkTo: 'face_similarity' },
  { label: 'Face Recognition - SSD Face Detector', linkTo: 'face_recognition' },
  { label: 'Face Recognition - MTCNN Face Detector', linkTo: 'face_recognition_mtcnn' }
]

const styles = (theme: any) => ({
  pageContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    maxWidth: '800px',
    padding: '10px',
    marginLeft: '0px',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.sideMenuWidth
    }
  }
})

type PageLayoutProps = {
  classes: any
}

type PageLayoutState = {
  isSideMenuOpen: boolean
}

class PageLayoutComponent extends React.Component<PageLayoutProps, PageLayoutState> {
  state: PageLayoutState = {
    isSideMenuOpen: false
  }

  toggleMenu = () => {
    this.setState(state => ({ isSideMenuOpen: !state.isSideMenuOpen }))
  }

  public render() {
    return (
      <div>
        <IconButton
          aria-label="open drawer"
          onClick={this.toggleMenu}
        >
          <MenuIcon />
        </IconButton>
        <SideMenu
          items={MENU_ITEMS}
          isOpen={this.state.isSideMenuOpen}
          onToggle={this.toggleMenu}
        />
        <div className={this.props.classes.pageContent}>
          <CenterContent>
            <div>
              <PageHeader>
                face-api.js playground
              </PageHeader>
              { this.props.children }
              </div>
          </CenterContent>
        </div>
      </div>
    )
  }

}

export const PageLayout = withStyles(styles as any)(PageLayoutComponent)