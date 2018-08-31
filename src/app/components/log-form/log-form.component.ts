import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';

import { Log } from '../../models/Log';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css']
})
export class LogFormComponent implements OnInit {
  id: string;
  text: string;
  date: any;
  isNew: boolean = true;

  constructor(private logService: LogService) { }

  ngOnInit() {
    //subscribe la observable-ul selectedLog
    this.logService.selectedLog.subscribe(log => {
      if(log.id !== null){
        this.isNew = false;
        this.id = log.id;
        this.text = log.text;
        this.date = log.date;
      }
    });
  }

  onSubmit() {
    // verifica daca e log nou sau editat, daca e nou il creeaza
    if(this.isNew) {
      const newLog = {
        id: this.generateId(),title: '',
        text: this.text,    //asta va fi orice o sa fie scris in form
        date: new Date()
      } 
      //adaugarea log-ului
      this.logService.addLog(newLog);
    } else {
      // creeaza log-ul pentru a fi editat
      const updLog = {
        id: this.id,
        text: this.text,
        date: new Date()
      }
       this.logService.updateLog(updLog);

    }

    //se curata textul din form
    this.clearState();
  }

  clearState() {
    this.isNew = true;
    this.id = '';
    this.text = '';
    this.date = null;
    this.logService.clearState();

  }

  generateId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

}
