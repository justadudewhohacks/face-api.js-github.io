import * as React from 'react';

import { EXAMPLE_IMAGES, EXAMPLE_IMAGES_FACE_EXPRESSIONS, EXAMPLE_VIDEOS } from '../const';
import { ImageWithOverlayRefs } from './ImageWithOverlay';
import { InputType } from './InputTypeTabs';
import { SelectableImage } from './SelectableImage';
import { SelectionTypes } from './SelectableInputElement';
import { SelectableVideo } from './SelectableVideo';
import { VideoWithOverlayRefs } from './VideoWithOverlay';
import { WebcamVideoWithOverlay } from './WebcamVideoWithOverlay';

export type InputComponentProps = {
  inputType: InputType
  onLoaded: (refs: ImageWithOverlayRefs | VideoWithOverlayRefs) => any
  getFps: () => number
}

export const InputComponent = ({ inputType, onLoaded, getFps }: InputComponentProps) => {
  if (inputType === InputType.IMAGE) {
    return (
      <SelectableImage
        items={[...EXAMPLE_IMAGES, ...EXAMPLE_IMAGES_FACE_EXPRESSIONS]}
        initialSrc={EXAMPLE_IMAGES[0].url}
        onLoaded={onLoaded}
        selectionType={SelectionTypes.BOTH}
        mediaElementStyle={{ maxWidth: 800, maxHeight: 500 }}
        mediaElementId="img"
      />
    )
  }
  if (inputType === InputType.VIDEO) {
    return (
      <SelectableVideo
        items={EXAMPLE_VIDEOS}
        initialSrc={EXAMPLE_VIDEOS[0].url}
        onLoaded={onLoaded}
        selectionType={SelectionTypes.BOTH}
        mediaElementStyle={{ maxWidth: 800, maxHeight: 500 }}
        mediaElementId="video"
        getFps={getFps}
      />
    )
  }
  if (inputType === InputType.WEBCAM) {
    return (
      <WebcamVideoWithOverlay
        onLoaded={onLoaded}
        maxVideoWidth={800}
      />
    )
  }
  return null
}