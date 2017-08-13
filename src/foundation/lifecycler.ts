import { LoadStatus } from './load-status';

export abstract class Lifecycler {
  protected status: number =  LoadStatus.IDLE;

  public get isLoading(): boolean {
    return this.status === LoadStatus.LOADING;
  }

  public set isLoading(isLoading) {
    if (isLoading) {
      this.status = LoadStatus.LOADING;
    } else {
      this.status = LoadStatus.LOADED;
    }
  }

  public get isFailed(): boolean {
    return this.status === LoadStatus.FAILED;
  }

  public set isFailed(val) {
    if (val) {
      this.status = LoadStatus.FAILED;
    } else {
      this.status = LoadStatus.LOADED;
    }
  }

  public get isLoaded(): boolean {
    return this.status === LoadStatus.LOADED;
  }

  public set isLoaded(val) {
    if (val) {
      this.status = LoadStatus.LOADED;
    } else {
      this.status = LoadStatus.FAILED;
    }
  }

  public get isIdle(): boolean {
    return this.status === LoadStatus.FAILED;
  }

  public set isIdle(val) {
    if (val) {
      this.status = LoadStatus.IDLE;
    } else {
      this.status = LoadStatus.LOADING;
    }
  }

}
