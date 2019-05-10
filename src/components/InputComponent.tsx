import * as React from 'react';

import { EXAMPLE_IMAGES, EXAMPLE_IMAGES_FACE_EXPRESSIONS, EXAMPLE_VIDEO } from '../../tmp/src/const';
import { ImageWithOverlayRefs } from './ImageWithOverlay';
import { InputType } from './InputTypeTabs';
import { SelectableImage, SelectionTypes } from './SelectableImage';
import { VideoWithOverlay, VideoWithOverlayRefs } from './VideoWithOverlay';
import { WebcamVideoWithOverlay } from './WebcamVideoWithOverlay';

export type InputComponentProps = {
  inputType: InputType
  onLoaded: (refs: ImageWithOverlayRefs | VideoWithOverlayRefs) => any
}

export const InputComponent = ({ inputType, onLoaded }: InputComponentProps) => {
  if (inputType === InputType.IMAGE) {
    return (
      <SelectableImage
        items={[...EXAMPLE_IMAGES, ...EXAMPLE_IMAGES_FACE_EXPRESSIONS]}
        initialImageSrc={EXAMPLE_IMAGES[0].url}
        onLoaded={onLoaded}
        selectionType={SelectionTypes.BOTH}
        imageStyle={{ maxWidth: 800 }}
        imgId="img"
      />
    )
  }
  if (inputType === InputType.VIDEO) {
    return (
      <VideoWithOverlay
        onLoaded={onLoaded}
        maxVideoWidth={800}
        src={EXAMPLE_VIDEO}
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