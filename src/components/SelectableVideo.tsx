import * as React from 'react';

import { SelectableInputElement, SelectableInputElementBaseProps } from './SelectableInputElement';
import { VideoWithOverlay } from './VideoWithOverlay';

export class SelectableVideo extends React.Component<SelectableInputElementBaseProps> {
  render() {
    return (
      <SelectableInputElement
        {...this.props}
        accept="video/*"
        renderMediaElement={props =>
          <VideoWithOverlay
            src={props.src}
            onLoaded={props.onLoaded}
            videoStyle={props.mediaElementStyle}
          />
        }
      />
    )
  }
}