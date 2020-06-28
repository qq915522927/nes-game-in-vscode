import { Component, OnInit } from '@angular/core';
// import { nes_load_url } from '../lib/nes-embed';
import { NesService } from '../services/nes.service';
import { environment } from 'src/environments/environment';

declare var nes_load_url;
@Component({
  selector: 'app-nes-game-machine',
  templateUrl: './nes-game-machine.component.html',
  styleUrls: ['./nes-game-machine.component.scss']
})
export class NesGameMachineComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    nes_load_url("nes-canvas", environment.resurceRootUrl + "assets/nes/Super Mario Bros. (W) [!].nes");
  }
}
