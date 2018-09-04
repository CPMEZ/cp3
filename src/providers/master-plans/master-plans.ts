import { Injectable } from '@angular/core';
// import { resolveDefinition } from '@angular/core/src/view/util';
import { AuthenticationProvider } from '../authentication/authentication';
import { CPAPI } from '../cpapi/cpapi';

@Injectable()
export class MasterPlansProvider {

  // used to pass selections from lookup pages
  private _listSelection: any = "";
  
  // always clears immediately after retrieving
  public get listSelection() : string {
    const ls = this._listSelection;
    this._listSelection = '';
    return ls;
  }
  public set listSelection(v : string) {
    this._listSelection = v;
  }
  
  constructor(private cpapi: CPAPI, private auth: AuthenticationProvider) {
    console.log('Constructor MasterPlansProvider Provider');
  }

  getMaster(type: string, filter?: string): Promise<string> {
    //TODO pass a filter to limit result list
    if (this.auth.userLoggedIn) {
      var path = this.cpapi.apiURL + "master/" + type;
      if (filter) {path = path + "?f=" + filter;}
      return new Promise(resolve => {
        this.cpapi.getData(path)
          .then(data => resolve(data));
      });
    }
  }


}
