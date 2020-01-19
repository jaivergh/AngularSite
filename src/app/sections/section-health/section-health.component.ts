import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from '../../services/server.service'
import { Server } from '../../shared/server'
import { Subscription, timer } from 'rxjs'
import { switchMap } from 'rxjs/operators';
import { ServerMessage } from 'src/app/shared/server-message';

// const SAMPLE_SERVERS = [
//   {id: 1, name: 'dev-web', isOnline: true},
//   {id: 2, name: 'dev-mail', isOnline: false},
//   {id: 3, name: 'prod-web', isOnline: true},
//   {id: 4, name: 'prod-mail', isOnline: true}
// ];

@Component({
  selector: 'app-section-health',
  templateUrl: './section-health.component.html',
  styleUrls: ['./section-health.component.css']
})
export class SectionHealthComponent implements OnInit, OnDestroy {

  constructor(private _serverService: ServerService) { }

  servers: Server[];
  timerSubscription: Subscription;

  ngOnInit() {
    this.refreshData();
  }
  refreshData() {
    this.timerSubscription = timer(0,5000).pipe(
      switchMap(() => this._serverService.getServers())
    ).subscribe(res => {
      this.servers = res;
    });
  }

  sendMessage(msg: ServerMessage){
    this._serverService.handleServerMessage(msg)
    .subscribe(res => console.log('Message sent to server: ' + msg), err => console.log('Error: ' + err));
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
}

}
