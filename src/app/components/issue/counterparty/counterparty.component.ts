import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, forkJoin, merge, Observable, of } from 'rxjs';

import { getAccountValidator, getInnSizeValidator } from '../validators';

import { getRequiredFormControlValidator } from '@psb/validations/required';
import { Partner } from 'src/app/classes/interfaces/api-partner.interface';
import { Client } from 'src/app/components/issue/interfaces/client.interface';
import { AccountService } from 'src/app/services/account.service';
import { LetterOfCredit } from 'src/app/models/letter-of-credit.model';
import { PartnersService } from 'src/app/models/partners.service';
import { BankSearch } from 'src/app/classes/interfaces/bank-search.interface';
import { ButtonType } from '@psb/fe-ui-kit';
import { StoreService } from 'src/app/models/state.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'counterparty',
  templateUrl: 'counterparty.component.html',
  styleUrls: ['counterparty.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class СounterpartyComponent extends OnDestroyMixin implements OnInit {
  @Input() locInstance = {} as LetterOfCredit;

  public clientCompanyName = this.locInstance?.reciverName;
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
    switchMap((inn: string) => forkJoin([
      of(inn),
      this.accountServiceInstance.searchClientByInn(inn).pipe(
        catchError(() => {
          this.errorHandlerService.showErrorMesssage('Невозможно получить список Клиентов');

          return EMPTY;
        }),
      ),
    ])),
    map(([inn, clients]) => (
      clients.map(client => ({
        ...client,
        innFound: client.inn.substring(0, inn.length),
        innTail: client.inn.substring(inn.length),
      }))
    )),
  );

  private partners$: Observable<Partner[]> = this.partners.getPartners().pipe(
    catchError(() => {
      this.errorHandlerService.showErrorMesssage('Невозможно получить список партнеров');

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
    private accountServiceInstance: AccountService,
    private partners: PartnersService,
    private errorHandlerService: ErrorHandlerService,
  ) {
    super();
  }

  ngOnInit() {
    this.form.patchValue(this.locInstance);

    merge(
      this.bikControl.valueChanges.pipe(
        switchMap(() => {
          if (this.bikControl.value?.length === 9) {
            this.bikControl.setErrors(null);

            return this.accountServiceInstance.searchBankByBik(this.bikControl.value);
          }

          this.locInstance.reciverBankName = '';
          return of<BankSearch>(null);
        }),
        tap((bank) => {
          if (!bank) {
            this.bikControl.setErrors({ incorrect: 'Банк не определен. Проверьте БИК' });
            this.bikControl.markAsTouched();
            this.locInstance.reciverBankName = '';

            return;
          }
          this.locInstance.reciverBankName = bank.fullName;
          this.locInstance.reciverBankBik = this.bikControl.value;
        }),
        catchError(() => {
          this.errorHandlerService.showErrorMesssage('Невозможно получить информацию о банке');

          return EMPTY;
        }),
      ),
      this.accountControl.valueChanges.pipe(
        tap(() => {
          this.locInstance.reciverAccount = this.accountControl.valid ?
            this.accountControl.value : '';
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public selectClient(client: Client) {
    this.clientCompanyName = '';

    if (client) {
      this.innControl.setValue(client.inn);
      this.clientCompanyName = client.shortName;
      this.locInstance.reciverInn = client.inn;
      this.locInstance.reciverName = client.shortName;

      this.partners$.pipe(
        filter(partners => !!partners?.length),
        tap((partners) => {
          const curPartner: Partner = partners.find(partner => partner.inn === this.locInstance.reciverInn);
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
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    });

    if (this.isFormValid()) {
      this.store.issueStep2Text = this.locInstance.reciverName;

      // this.currentStep = 3;

      console.log(this.form);
    }
  }
}
