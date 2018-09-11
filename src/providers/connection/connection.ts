import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { CPAPI } from '../cpapi/cpapi';

@Injectable()
export class ConnectionProvider {

  connected = false;
  internet = false;

  constructor(public http: HttpClient,
  private network: Network,
  private cpapi: CPAPI) {
    console.log('ConnectionProvider Provider');
  }

  checkConnection() {
    // now see if there's internet access
    console.log('checkConnection');
    var route: string = this.cpapi.apiURL + "master/";
    console.log('calling http options');
    this.http.options(route)
      .subscribe((data) => {
        console.log('internet on');
        this.internet = true;
        // therefore, connected must be true
        this.connected = true;
      }),
      (err) => {
        console.log('internet off');
        this.internet = false;
      };
  }

  // watch network for a connection
  connectionSubscribe() {
    console.log('in connectionSubscribe');
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // need to wait briefly before checking the connection type. 
      // assume need to wait prior to doing any api requests as well.
      setTimeout(() => {
        console.log('in timeout, setting connected=true');
        this.connected= true;
          console.log(this.network.type + ' connected');
          // now see if there's internet access
        var route: string = this.cpapi.apiURL + "master/";
        console.log('calling http options');
        this.http.options(route)
          .subscribe((data) => { 
            console.log('internet on');
            this.internet = true; }), 
            (err) => { 
              console.log('internet off');
                this.internet = false; };
        }, 3000);
      });
  }
    // stop connect watch
    // connectSubscription.unsubscribe();
    
    // watch network for a disconnect
  disConnectionSubscribe() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.connected= false;
      this.internet = false;
      console.log('network was disconnected');
    });
    
  // stop disconnect watch
  // disconnectSubscription.unsubscribe();

  }
}
