import { TMediaElement } from 'face-api.js';

export class MediaElement<T extends TMediaElement = TMediaElement> {
  private _element: T

  constructor(element: T) {
    this._element = element
  }

  public get element(): T {
    return this._element
  }
}