import { Divider, Drawer, Hidden, IconButton, List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';

import { StyledLink } from './StyledLink';

export type MenuItem = {
  itemName: string
  linkTo: string
}

type SideMenuProps = {
  items: MenuItem[]
  isOpen: boolean
  classes: any
  onToggle: () => any
}

const styles = (theme: any) => ({
  paper: {
    width: theme.sideMenuWidth
  }
})

class SideMenuComponent extends React.Component<SideMenuProps> {
  renderDrawer(isSm: boolean) {
    const menu = (
      <div>
        {
          isSm &&
            <IconButton
              aria-label="open drawer"
              onClick={this.props.onToggle}
            >
              <MenuIcon />
            </IconButton>
        }
        <span> face-api.js </span>
        <Divider />
        <List>
          {
            this.props.items.map(
              item =>
                <ListItem key={item.linkTo}>
                  <StyledLink to={item.linkTo}>
                    { item.itemName }
                  </StyledLink>
                </ListItem>
            )
          }
        </List>
      </div>
    )

    return (
      <Drawer
        anchor="left"
        variant={isSm ? 'temporary' : 'permanent'}
        open={this.props.isOpen}
        onClose={isSm ? this.props.onToggle : () => {}}
        ModalProps={{
          keepMounted: true
        }}
        classes={{
          paper: this.props.classes.paper
        }}
      >
        { menu }
      </Drawer>
    )
  }

  render() {
    return (
      <div>
        <Hidden mdUp>
          { this.renderDrawer(true) }
        </Hidden>
        <Hidden smDown>
          { this.renderDrawer(false) }
        </Hidden>
      </div>
    )
  }
}

export const SideMenu = withStyles(styles)(SideMenuComponent)