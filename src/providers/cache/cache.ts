import { AuthenticationProvider } from '../authentication/authentication';
import { Injectable } from '@angular/core';
import { LocalStoreProvider } from '../local-store/local-store';

import CryptoJS from 'crypto-js';

@Injectable()
export class CacheProvider {
  secret: string;
  storeKey: string;

  constructor(
    private LSP: LocalStoreProvider,
    private auth: AuthenticationProvider) {
    console.log('Constructor Cache Provider');
    this.secret = auth.userKey;
    this.storeKey = auth.encryptKey;
  }
 
  checkRecent(): boolean {
    // if cached more than ? ago, refresh
    return true;
  }

  remove(type) {
    console.log('removing from cache', type);
    this.LSP.remove(type);
  }

  write(type: string, input: string) {
    console.log('caching ' + type);
    let p = this.encrypt(this.package(type, input), this.auth.userKey);
    this.LSP.set(type, p)
    .then(result => console.log("saved to cache"))
    .catch(e => console.log("error: " + e));
  }

  package(type: string, input: string): string {
    // { type: { cached: '1/1/1', contents: { input } } }
    let p: object = {};
    p[type] = { 
      cached: Date.now().valueOf(), 
      contents: input 
    }
    return JSON.stringify(p); 
  }
  
  read(type: string, filter?: string): Promise<string> {
    console.log('reading cache for ' + type);
    return new Promise((resolve, reject) => {
      this.LSP.get(type)
      .then((data) => {
        if (data) {
          console.log('got cache');
          // checkRecent--refresh
          // filter
          const r = this.unPackage(type, this.decrypt(data, this.auth.userKey));
          // console.log(r);
          resolve(r);
        } else { 
          console.log('not in cache');
          reject();
        }
      });
      // .catch(e => reject => console.log("error: " + e));
    })
  }
  
  unPackage(type: string, input: string): string {
    // strip off container and date
    // { type: { cached: '1/1/1', contents: { input } } }
    const p = JSON.parse(input);
    return p[type].contents;
  }

  encrypt(data: string, key: string): string {
    console.log("encrypting");
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  decrypt(data: string, key: string): string {
    console.log('decrypting');
    const bytes = CryptoJS.AES.decrypt(data, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}
