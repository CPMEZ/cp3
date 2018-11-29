import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Network } from '@ionic-native/network';
import { CPAPI } from '../cpapi/cpapi';

@Injectable()
export class ConnectionProvider {

  // connected = false;
  internet = false;


  connectSubscription: any;
  disconnectSubscription: any;

  constructor(public http: HttpClient,
  // private network: Network,
  private cpapi: CPAPI) {
    console.log('Constructor ConnectionProvider Provider');
    // periodically check network connection?
    // 30 seconds
    // setInterval(() => {
    //   this.checkConnection();
    // }, 30000);
  }

  checkConnection() {
    // now see if there's api access
    var route: string = this.cpapi.apiURL + "master/";
    this.http.options(route)
      .subscribe((data) => {
        console.log('internet on');
        this.internet = true;
      }),
      (err) => {
        console.log('internet off');
        this.internet = false;
      };
  }

  // // watch network for a connection
  // connectionSubscribe() {
  //   console.log('in connectionSubscribe');
  //   this.connectSubscription = this.network.onConnect().subscribe(() => {
  //     console.log('network connected!');
  //     // need to wait briefly before checking the connection type. 
  //     // assume need to wait prior to doing any api requests as well.
  //     setTimeout(() => {
  //       console.log('in timeout, setting connected=true');
  //       this.connected= true;
  //         console.log(this.network.type + ' connected');
  //         // now see if there's internet access
  //       var route: string = this.cpapi.apiURL + "master/";
  //       console.log('calling http options');
  //       this.http.options(route)
  //         .subscribe((data) => { 
  //           console.log('internet on');
  //           this.internet = true; }), 
  //           (err) => { 
  //             console.log('internet off');
  //               this.internet = false; };
  //       }, 3000);
  //     });
  // }
  //   // stop connect watch
  //   // connectSubscription.unsubscribe();
    
  //   // watch network for a disconnect
  // disConnectionSubscribe() {
  //   this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
  //     this.connected= false;
  //     this.internet = false;
  //     console.log('network was disconnected');
  //   });
  // }
    
  // // stop disconnect watch, not called, just making ts happy
  // unSubscribe() {
  //   this.connectSubscription.unsubscribe();
  //   this.disconnectSubscription.unsubscribe();
  // }

}
