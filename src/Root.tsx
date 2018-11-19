import { MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';

import { PageLayout } from './layouts/PageLayout';

const getPageContext = require('./getPageContext').default

export class Root extends React.Component {

  pageContext: any = {}

  constructor(props: any, context: any){
    super(props, context)
    this.pageContext = getPageContext()
  }

  public render() {
    return(
      <MuiThemeProvider
        theme={this.pageContext.theme}
        sheetsManager={this.pageContext.sheetsManager}
      >
        <PageLayout>
          { this.props.children }
        </PageLayout>
      </MuiThemeProvider>
    )
  }
}