import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, forkJoin, merge, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { getAccountValidator, getInnSizeValidator } from '../../validators';
import { PartnersService } from '../../services/partners.service';
import { Client } from '../../interfaces/client.interface';
import { Partner } from '../../interfaces/partner.interface';
import { Page, paths } from '../../constants/routes';
import { StepService } from '../../services/step.service';

import { getRequiredFormControlValidator } from '@psb/validations/required';
import { AccountService } from 'src/app/services/account.service';
import { BankSearch } from 'src/app/interfaces/api/bank-search.interface';
import { ButtonType } from '@psb/fe-ui-kit';
import { StoreService } from 'src/app/services/store.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { isFormValid } from 'src/app/utils';

@Component({
  selector: 'counterparty',
  templateUrl: 'counterparty.component.html',
  styleUrls: ['counterparty.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class СounterpartyComponent extends OnDestroyMixin implements OnInit {
  public clientCompanyName = this.store.letterOfCredit.reciverName;
  public reciverBankName = this.store.letterOfCredit.reciverBankName;
  public ButtonType = ButtonType;

  public form = new FormGroup({
    inn: new FormControl('', [
      getRequiredFormControlValidator('Укажите ИНН контрагента'),
      getInnSizeValidator('Укажите ИНН 10 или 12 цифр'),
    ]),
    bik: new FormControl('', [
      getRequiredFormControlValidator('Укажите БИК банка получателя'),
    ]),
    account: new FormControl('', [
      getRequiredFormControlValidator('Укажите счет получателя'),
      getAccountValidator('Некорректный счёт получателя'),
    ]),
  });

  public clients$: Observable<Client[]> = this.innControl.valueChanges.pipe(
    filter((inn: string) => inn?.length === 10 || inn?.length === 12),
    switchMap((inn: string) => (
      this.accountService.searchClientByInn(inn).pipe(
        catchError(() => {
          this.errorHandlerService.showErrorMessage('Невозможно получить список Клиентов');

          return EMPTY;
        }),
      )
    )),
    map(clients => (
      clients.map(client => ({
        ...client,
        innFound: client.inn.substring(0, this.innControl.value.length),
        innTail: client.inn.substring(this.innControl.value.length),
      }))
    )),
  );

  private partners$: Observable<Partner[]> = this.partnersService.getPartners().pipe(
    catchError(() => {
      this.errorHandlerService.showErrorMessage('Невозможно получить список партнеров');

      return of<Partner[]>([]);
    }),
  );

  get innControl() {
    return this.form.controls.inn;
  }
  get bikControl() {
    return this.form.controls.bik;
  }
  get accountControl() {
    return this.form.controls.account;
  }

  constructor(
    private store: StoreService,
    private accountService: AccountService,
    private partnersService: PartnersService,
    private errorHandlerService: ErrorHandlerService,
    private stepService: StepService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.form.patchValue({
      inn: this.store.letterOfCredit.reciverInn,
      bik: this.store.letterOfCredit.reciverBankBik,
      account: this.store.letterOfCredit.reciverAccount,
    });

    merge(
      this.bikControl.valueChanges.pipe(
        switchMap(() => {
          if (this.bikControl.value?.length === 9) {
            this.bikControl.setErrors(null);

            return this.accountService.searchBankByBik(this.bikControl.value);
          }

          this.store.letterOfCredit.reciverBankName = '';
          this.reciverBankName = '';
          return of<BankSearch>(null);
        }),
        tap((bank) => {
          if (!bank) {
            this.bikControl.setErrors({ incorrect: 'Банк не определен. Проверьте БИК' });
            this.bikControl.markAsTouched();
            this.store.letterOfCredit.reciverBankName = '';
            this.reciverBankName = '';

            return;
          }

          this.store.letterOfCredit.reciverBankName = bank.fullName;
          this.reciverBankName = bank.fullName;
          this.store.letterOfCredit.reciverBankBik = this.bikControl.value;
        }),
        catchError(() => {
          this.errorHandlerService.showErrorMessage('Невозможно получить информацию о банке');

          return EMPTY;
        }),
      ),
      this.accountControl.valueChanges.pipe(
        tap(() => {
          this.store.letterOfCredit.reciverAccount = this.accountControl.valid ?
            this.accountControl.value : '';
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();
  }

  public selectClient(client: Client) {
    this.clientCompanyName = '';

    if (client) {
      this.innControl.setValue(client.inn);
      this.clientCompanyName = client.shortName;
      this.store.letterOfCredit.reciverInn = client.inn;
      this.store.letterOfCredit.reciverName = client.shortName;

      this.partners$.pipe(
        filter(partners => !!partners?.length),
        tap((partners) => {
          const curPartner: Partner = partners.find(partner => partner.inn === this.store.letterOfCredit.reciverInn);
          if (curPartner?.banks && curPartner?.banks.length > 0) {
            this.bikControl.setValue(curPartner.banks[0].bik);
            this.accountControl.setValue(curPartner.banks[0].acc);
          }
        }),
        untilComponentDestroyed(this),
      ).subscribe();
    }
  }

  public handleSubmit(): void {
    if (isFormValid(this.form)) {
      this.stepService.setStepDescription(
        paths[Page.COUNTERPARTY],
        this.store.letterOfCredit.reciverName,
      );
      this.router.navigateByUrl(paths[Page.COUNTERPARTY_CONTRACT]);
    }
  }
}
