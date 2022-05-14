import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('should return sessionStorage access token on getAccessToken', () => {
    sessionStorage.setItem('auth.accessToken', 'test-access-token');
    expect(service.getAccessToken()).toEqual(sessionStorage.getItem('auth.accessToken'));
  });

  it('should return sessionStorage clientId on getClientID', () => {
    sessionStorage.setItem('auth.defaultClientId', 'test-client-id');
    expect(service.getClientID()).toEqual(sessionStorage.getItem('client.defaultClientId'));
  });

  it('should return sessionStorage accountId on getAccountID', () => {
    sessionStorage.setItem('auth.selectedAccountId', 'test-account-id');
    expect(service.getAccountID()).toEqual(sessionStorage.getItem('client.selectedAccountId'));
  });

  it('should return sessionStorage branchId on getBranchID', () => {
    sessionStorage.setItem('auth.defaultBranchId', 'test-branch-id');
    expect(service.getBranchID()).toEqual(sessionStorage.getItem('cert.defaultBranchId'));
  });
});
