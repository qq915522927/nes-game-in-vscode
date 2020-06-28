import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() resourceRootUrl: string;

  title = 'nes-game';

  ngOnInit() {
    console.log("app root...");
  }
}
