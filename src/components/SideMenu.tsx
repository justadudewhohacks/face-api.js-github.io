import { AppBar, Divider, Drawer, Hidden, IconButton, List, ListItem, Toolbar } from '@material-ui/core';
import * as React from 'react';
import MenuIcon from '@material-ui/icons/Menu';

type SideMenuProps = {
  items: string[]
}

type SideMenuState = {
  isOpen: boolean
}

export class SideMenu extends React.Component<SideMenuProps, SideMenuState> {
  state = {
    isOpen: false,
  }

  toggle = () => {
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  render() {
    const menu = (
      <div>
        <div />
        <span> this is going to be a header </span>
        <Divider />
        <List>{this.props.items.map(item => <ListItem key={item}> { item } </ListItem>)} </List>
      </div>
    )

    return (
      <div>
        <AppBar>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.toggle}
            >
              <MenuIcon />
            </IconButton>
              Responsive drawer
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={this.state.isOpen}
            onClose={this.toggle}
            ModalProps={{
              keepMounted: true
            }}
          >
            { menu }
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
          >
            { menu }
          </Drawer>
        </Hidden>
      </div>
    )
  }
}
