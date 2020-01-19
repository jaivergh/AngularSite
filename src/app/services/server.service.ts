import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ServerMessage } from '../shared/server-message';
import { Server } from '../shared/server';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private _http: HttpClient) {
    this.header = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Accept' : 'q=0.8;application/json;q=0.9'
    })

    this.options = {
      headers: this.header
    }
   }

   options: any;
   header: HttpHeaders;

  getServers(): Observable<Server[]>{
    return this._http.get<Server[]>('http://localhost:5000/api/server').pipe(
      catchError(this.handleError));
    
  }

  handleError(error: HttpErrorResponse)
  {
    const errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return throwError(errMsg);
  }

  handleServerMessage(msg: ServerMessage): Observable<ArrayBuffer> {
    const url = 'http://localhost:5000/api/server/' + msg.id;
    return this._http.put(url, msg, this.options).pipe(
      catchError(this.handleError));
  }
}
