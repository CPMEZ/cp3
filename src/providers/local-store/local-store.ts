import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocalStoreProvider {

  constructor(private storage: Storage) {
    console.log('LocalStoreProvider Constructor');
  }

  set(key: string, value): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set(key, value)
        .then((result) => resolve(true))
        .catch((reason) => {
          console.info(reason);
          reject(reason);
        })
    });
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then(result => resolve(result))
        .catch((reason) => {
          console.info(reason);
          reject(reason);
        });
    })
  }

  remove(key: string) {
    this.storage.remove(key);
  }

  clear() {
    this.storage.clear();
  }

}

  // setObject(key: string, object: Object) {
  //   return this.storage.set(key, JSON.stringify(object)).then(result => {
  //     console.log("set Object in storage: " + result);
  //     return true;
  //   }).catch(function (reason) {
  //     console.info(reason);
  //     return false;
  //   });
  // }


  // getObject(key: string): Promise<any> {
  //   return this.storage.get(key).then(result => {
  //     if (result != null) { return JSON.parse(result) }
  //     return null;
  //   }).catch(function (reason) {
  //     console.info(reason);
  //     return null;
  //   });
  // }
