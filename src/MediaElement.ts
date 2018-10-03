import { TMediaElement } from 'face-api.js';

export class MediaElement {
  private _element: TMediaElement

  constructor(element: TMediaElement) {
    this._element = element
  }

  public get element(): TMediaElement {
    return this._element
  }
}