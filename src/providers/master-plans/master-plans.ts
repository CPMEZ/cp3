import { Injectable } from '@angular/core';
import { AuthenticationProvider } from '../authentication/authentication';
import { CPAPI } from '../cpapi/cpapi';
import { CacheProvider } from '../cache/cache';

const MASTER_KEY = 'my first thought was he lied in every word';  // from childe rowland to the dark tower came, browning, 1855
// master-plans uses this key for encryption in common for any/all users


@Injectable()
export class MasterPlansProvider {

  // used to pass selections from lookup pages
  private _listSelection: any = "";

  public get listSelection(): string {
    // const ls = this._listSelection;
    // this._listSelection = "";
    return this._listSelection;
  }
  public set listSelection(v: string) {
    this._listSelection = v;
  }

  constructor(private cpapi: CPAPI,
    public auth: AuthenticationProvider,
    private cache: CacheProvider) {
    console.log('Constructor MasterPlansProvider Provider');
  }

  getMaster(type: string, filter?: string): Promise<string> {

    // **************** for debugging
    // this.cache.remove(type);
    // **************** for debugging


    // TODO check for current subscription too
    if (this.auth.userLoggedIn) {
      return new Promise(resolve => {
        // check cache first
        this.cache.read(type, MASTER_KEY, filter)
          .then((data) => resolve(data))
          .catch(() => {
            // not in cache, read from cpi
            var path = this.cpapi.apiURL + "master/" + type;
            if (filter) { path = path + "?f=" + filter; }
            this.cpapi.getData(path)
              .then((data) => {
                this.cache.write(type, MASTER_KEY, data);
                resolve(data)
              });
          });
      })
    }
  }

}
