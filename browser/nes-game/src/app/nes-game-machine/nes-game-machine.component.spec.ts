import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NesGameMachineComponent } from './nes-game-machine.component';

describe('NesGameMachineComponent', () => {
  let component: NesGameMachineComponent;
  let fixture: ComponentFixture<NesGameMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NesGameMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NesGameMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
