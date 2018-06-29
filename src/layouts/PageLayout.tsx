import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import styled from 'styled-components';

import { SideMenu } from '../components/SideMenu';

const PageHeader = styled.h3`
  text-align: center;
`

const MENU_ITEMS = [
  { label: 'Face Detection', linkTo: 'face_detection' },
  { label: 'Face Landmarks', linkTo: 'face_landmarks' },
  { label: 'Face Similarity', linkTo: 'face_similarity' },
  { label: 'Face Recognition', linkTo: 'face_recognition' },
  { label: 'Face Detection and Recognition', linkTo: 'face_detection_and_recognition' }
]

const styles = (theme: any) => ({
  pageContent: {
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
        <PageHeader>
          face-api.js playground
        </PageHeader>
        <SideMenu
          items={MENU_ITEMS}
          isOpen={this.state.isSideMenuOpen}
          onToggle={this.toggleMenu}
        />
        <div className={this.props.classes.pageContent}>
          { this.props.children }
        </div>
      </div>
    )
  }

}

export const PageLayout = withStyles(styles)(PageLayoutComponent)