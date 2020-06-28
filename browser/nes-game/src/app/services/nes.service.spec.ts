import { TestBed } from '@angular/core/testing';

import { NesService } from './nes.service';

describe('NesService', () => {
  let service: NesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
