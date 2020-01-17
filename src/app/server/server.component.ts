import { Component, OnInit, Input } from '@angular/core';
import { Server } from '../shared/server';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  constructor() { }

  color: string;
  buttonText: string;

  @Input() serverInput: Server;


  ngOnInit() {
    this.setServerStatus(this.serverInput.isOnline);
  }

  setServerStatus(isOnline: boolean){
    this.serverInput.isOnline = isOnline;
    if (isOnline) {
      this.color = '#66BB6a';
      this.buttonText = 'Shut Down';
    } else {
      this.color = '#FF6B6B';
      this.buttonText = 'Start';      
    }
  }

  toggleStatus(onlineStatus: boolean) {
    console.log(this.serverInput.name, ': ', onlineStatus );
    this.setServerStatus(!onlineStatus);
  }

}
