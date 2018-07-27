export class VideoWrap {
  private _video: HTMLVideoElement | undefined

  constructor(video?: HTMLVideoElement | VideoWrap) {
    if (!video) {
      return
    }

    if (video instanceof VideoWrap) {
      this._video = video.video
      return
    }

    this._video = video
  }

  public get video(): HTMLVideoElement | undefined {
    return this._video
  }

  public get element(): HTMLVideoElement | undefined {
    return this.video
  }

  public get isLoaded(): boolean {
    return this.video instanceof HTMLVideoElement
  }
}