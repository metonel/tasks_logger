import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Log } from '../models/Log';
import { of } from 'rxjs/observable/of';

@Injectable()
export class LogService {
  logs: Log[];

  private logSource = new BehaviorSubject<Log>({id: null, text: null, date: null}); //primeste ca si parametru un Log
  selectedLog = this.logSource.asObservable(); //supravegheaza cand se selecteaza un log pt editare

  private stateSource = new BehaviorSubject<boolean>(true);
  stateClear = this.stateSource.asObservable(); //supravegheaza cand se selecteaza un log pentru a-l highlight-ui

  constructor() {
    // this.logs = [{
    //   id: '1',
    //   text: 'componenta generata',
    //   date: new Date('2/7/2018 12:54:23')
    // },
    // {
    //   id: '2',
    //   text: 'adaugat bootstrap',
    //   date: new Date('2/7/2018 13:05:23')
    // },
    // {
    //   id: '3',
    //   text: 'adaugat logs',
    //   date: new Date('2/7/2018 13:33:23')
    // }]
    this.logs = [];
   }

   getLogs(): Observable<Log[]> {
      //scoatem log-urile din local storage
      if(localStorage.getItem('logs') == null ) {
        this.logs = [];  //setam ca si goala pentru ca in logs.component.html cand se verifica ca ii inauntru sa se afiseze nu sunt log-uri
      } else {
        this.logs = JSON.parse(localStorage.getItem('logs'));
      }

     return of(this.logs.sort((a, b) => { //folositm .sort sa sortam log-urile scoase din local storage in functie de data
       return b.date = a.date;
     }));
     
   }

   setFormLog(log: Log) {   //aici se trimite log-ul selectat in form pt editare
     this.logSource.next(log); 
   }

   addLog(log: Log) {
     this.logs.unshift(log); //unshift pune obiectul la inceput, pusg l-ar pune la sf
     //aici implementam local storage. se poate salva doar ca sir de caractere, nu si array, si fol stringify
     localStorage.setItem('logs', JSON.stringify(this.logs));
   }

   updateLog(log: Log) {
     this.logs.forEach((cur, index) => {
        if(log.id == cur.id) {
          this.logs.splice(index, 1); //sterge log-ul vechi
        }
     });
     this.logs.unshift(log);
     localStorage.setItem('logs', JSON.stringify(this.logs));
   }

   deleteLog(log: Log) {
    this.logs.forEach((cur, index) => {
      if(log.id == cur.id) {
        this.logs.splice(index, 1);
      }
   });
   localStorage.setItem('logs', JSON.stringify(this.logs));
   }

   clearState() {
      this.stateSource.next(true);
   }
}
