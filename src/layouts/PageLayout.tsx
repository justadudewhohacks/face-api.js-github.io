import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';

import { SideMenu } from '../components/SideMenu';

const EXAMPLES = [
  'Face Detection',
  'Face Landmarks',
  'Face Recognition',
  'Face Similarity',
  'Face Detection and Recognition'
]

const styles = (theme: any) => ({
  pageContent: {
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

  toggle = () => {
    this.setState(state => ({ isSideMenuOpen: !state.isSideMenuOpen }))
  }

  public render() {
    return (
      <div>
        <IconButton
          aria-label="open drawer"
          onClick={this.toggle}
        >
          <MenuIcon />
        </IconButton>
        <h3 style={{ textAlign: 'center' }}>
          face-api.js playground
        </h3>
        <SideMenu
          items={EXAMPLES}
          isOpen={this.state.isSideMenuOpen}
          onToggle={this.toggle}
        />
        <div className={this.props.classes.pageContent}>
          { this.props.children }
        </div>
      </div>
    )
  }

}

export const PageLayout = withStyles(styles)(PageLayoutComponent)