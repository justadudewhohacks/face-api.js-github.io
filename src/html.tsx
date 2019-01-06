import * as React from 'react';

let styles: string = ''
/*
if (process.env.NODE_ENV === `production`) {
  try {
    styles = require("!raw-loader!../public/styles.css")
  } catch (err) {
    console.log(err)
  }
}
*/

interface HtmlProps {
  body: any
  postBodyComponents: any
  headComponents: any
}

export default class extends React.Component<HtmlProps, void> {
  render() {
    const css = (process.env.NODE_ENV === `production`) ?
      <style
        id="gatsby-inlined-css"
        dangerouslySetInnerHTML={{ __html: styles }}
      />
      : null

    return (
      <html lang="en">
        <head>
          {this.props.headComponents}
          <title>face-api.js</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <meta
            property="og:image"
            content="https://user-images.githubusercontent.com/31125521/41526995-1a90e4e6-72e6-11e8-96d4-8b2ccdee5f79.gif"
          />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          {css}
          <style dangerouslySetInnerHTML={{
            __html: 'html { font-family: \'Open Sans\', sans-serif; } body { margin: 0; padding: 0; }'
          }} />
        </head>
        <body>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}