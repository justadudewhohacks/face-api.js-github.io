import * as React from 'react';

import { ImageSelection, ImageSelectionItem } from './ImageSelection';
import { ImageWithOverlay, ImageWithOverlayProps } from './ImageWithOverlay';

export type SelectableImageProps = ImageWithOverlayProps & {
  items: ImageSelectionItem[]
  onChangeSelection: (url: string) => any
}

export const SelectableImage = (props: SelectableImageProps) =>
  <div>
    <ImageWithOverlay {...props} />
    <ImageSelection
      items={props.items}
      selectedImage={props.imageSrc}
      onChange={props.onChangeSelection}
    />
  </div>
