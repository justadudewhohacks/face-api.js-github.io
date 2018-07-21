export class ImageWrap {
  private _imageSrc: string
  private _img: HTMLImageElement | undefined

  constructor(imageSrc: string, img?: HTMLImageElement) {
    this._imageSrc = imageSrc
    this._img = img
  }

  public get imageSrc(): string {
    return this._imageSrc
  }

  public get img(): HTMLImageElement | undefined {
    return this._img
  }

  public get isLoaded(): boolean {
    return this.img instanceof HTMLImageElement
  }

  public withImage(img: HTMLImageElement): ImageWrap {
    return new ImageWrap(this.imageSrc, img)
  }
}