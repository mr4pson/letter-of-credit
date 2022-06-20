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

  it('Возвращает test-access-token при вызове getAccessToken с ключом auth.accessToken', () => {
    sessionStorage.setItem('auth.accessToken', 'test-access-token');
    expect(service.getAccessToken()).toEqual(sessionStorage.getItem('auth.accessToken'));
  });

  it('Возвращает test-client-id при вызове getClientID с ключом client.defaultClientId', () => {
    sessionStorage.setItem('auth.defaultClientId', 'test-client-id');
    expect(service.getClientID()).toEqual(sessionStorage.getItem('client.defaultClientId'));
  });

  it('Возвращает test-account-id при вызове getAccountID с ключом client.selectedAccountId', () => {
    sessionStorage.setItem('auth.selectedAccountId', 'test-account-id');
    expect(service.getAccountID()).toEqual(sessionStorage.getItem('client.selectedAccountId'));
  });

  it('Возвращает test-branch-id при вызове getBranchID с ключом cert.defaultBranchId', () => {
    sessionStorage.setItem('auth.defaultBranchId', 'test-branch-id');
    expect(service.getBranchID()).toEqual(sessionStorage.getItem('cert.defaultBranchId'));
  });
});
