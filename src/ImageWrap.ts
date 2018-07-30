export class ImageWrap {
  private _imageSrc: string
  private _img: HTMLImageElement | HTMLCanvasElement | undefined

  constructor(imageSrc: string, img?: HTMLImageElement | HTMLCanvasElement) {
    this._imageSrc = imageSrc
    this._img = img
  }

  public get imageSrc(): string {
    return this._imageSrc
  }

  public get img(): HTMLImageElement | HTMLCanvasElement | undefined {
    return this._img
  }

  public get element(): HTMLImageElement | HTMLCanvasElement | undefined {
    return this.img
  }

  public get isLoaded(): boolean {
    return this.img instanceof HTMLImageElement
  }

  public withImage(img: HTMLImageElement): ImageWrap {
    return new ImageWrap(this.imageSrc, img)
  }
}