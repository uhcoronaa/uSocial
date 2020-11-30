import { TestBed } from '@angular/core/testing';

import { UpdateInfoService } from './update-info.service';

describe('UpdateInfoService', () => {
  let service: UpdateInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
