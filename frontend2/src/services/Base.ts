import { getUrlConfig } from '../config/url';

class Base {
  private _proxyPrefix: string;

  constructor() {
    this._proxyPrefix = getUrlConfig().proxyUrl;
  }

  public getProxyUrl(url: string): string {
    return this._proxyPrefix + url;
  }
}

export default Base;
