import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { tap } from 'rxjs/operators';

import { InputAutocompleteComponent } from '@psb/fe-ui-kit/src/components/input-autocomplete/input-autocomplete.component';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { Partner } from 'src/app/classes/interfaces/api-partner.interface';
import { ClientSearch } from 'src/app/classes/interfaces/client-search.interface';
import { AccountService } from 'src/app/models/account.service';
import { LetterOfCredit } from 'src/app/models/letter-of-credit.model';
import { PartnersService } from 'src/app/models/partners.service';

@Component({
  selector: 'counterparty',
  templateUrl: 'counterparty.component.html',
  styleUrls: ['counterparty.component.scss'],
})
export class СounterpartyComponent extends OnDestroyMixin implements OnInit {
  public issue2Group = new FormGroup({
    InnControl: new FormControl('', [
      getRequiredFormControlValidator('Укажите ИНН контрагента'),
      this.innSizeValidator,
    ]),
    BikControl: new FormControl('', [
      getRequiredFormControlValidator('Укажите БИК банка получателя'),
    ]),
    AccountControl: new FormControl('', [
      getRequiredFormControlValidator('Укажите счет получателя'),
      this.accountValidator,
    ]),
  });

  public foundInnList: ClientSearch[] = [];
  public innCompany = '';
  private currentSearchInn = '';
  private partnerList: Partner[] = [];

  @Input() locInstance: LetterOfCredit;

  constructor(
    private accountServiceInstance: AccountService,
    private partners: PartnersService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.locInstance.reciverInn.length > 0) {
      this.issue2Group.controls.InnControl.setValue(this.locInstance.reciverInn);
    }

    let prevReciverBik: string;
    this.issue2Group.get('BikControl')?.valueChanges.subscribe(() => {
      if (prevReciverBik === this.issue2Group.controls.BikControl.value) {
        return;
      }

      prevReciverBik = this.issue2Group.controls.BikControl.value;

      if (this.issue2Group.controls.BikControl.value.length === 9) {
        this.searchBankAsync();
        return;
      }

      this.locInstance.reciverBankName = '';
    });

    this.issue2Group.get('AccountControl')?.valueChanges.subscribe(() => {
      this.locInstance.reciverAccount = this.issue2Group.controls.AccountControl.valid ?
        this.issue2Group.controls.AccountControl.value : '';
    });

    this.currentSearchInn = '';

    this.issue2Group.controls.InnControl.setValue(this.locInstance.reciverInn);
    this.innCompany = this.locInstance.reciverName;

    this.issue2Group.controls.BikControl.setValue(this.locInstance.reciverBankBik);
    this.issue2Group.controls.AccountControl.setValue(this.locInstance.reciverAccount);

    this.initPartnersAsync();
  }

  private async initPartnersAsync() {
    if (this.locInstance.reciverInn === '') {
      this.partnerList = await this.partners.getListAsync();
    }
  }

  private innSizeValidator(control: FormControl) {
    return control.value?.length > 0 && control.value.length !== 10 && control.value.length !== 12 ? { error: 'Укажите ИНН 10 или 12 цифр' } : {};
  }

  private accountValidator(control: FormControl) {
    const account: string = control.value?.replaceAll(' ', '');
    return account?.length > 0 && account.length !== 20 ? { error: 'Некорректный счёт получателя' } : {};
  }

  public isValid(): boolean {
    this.issue2Group.controls.InnControl.setValue(this.issue2Group.controls.InnControl.value);

    this.issue2Group.controls.InnControl.markAsTouched();
    this.issue2Group.controls.BikControl.markAsTouched();
    this.issue2Group.controls.AccountControl.markAsTouched();

    return this.issue2Group.controls.InnControl.valid &&
      this.issue2Group.controls.BikControl.valid &&
      this.issue2Group.controls.AccountControl.valid;
  }

  public selectInn(inn: InputAutocompleteComponent) {
    this.innCompany = '';
    if (!inn.isOpened) {
      return;
    }
    if (inn.selectedOption?.inn) {
      this.issue2Group.controls.InnControl.setValue(inn.selectedOption.inn);
      this.innCompany = inn.selectedOption.shortName;

      this.locInstance.reciverInn = inn.selectedOption.inn;
      this.locInstance.reciverName = inn.selectedOption.shortName;

      if (this.partnerList.length > 0) {
        const partner: Partner = this.partnerList.find(e => e.inn === this.locInstance.reciverInn);
        if (null != partner && partner.banks && partner.banks.length > 0) {
          this.issue2Group.controls.BikControl.setValue(partner.banks[0].bik);
          this.issue2Group.controls.AccountControl.setValue(partner.banks[0].acc);
        }
      }
    }
  }

  public searchInnAsync() {
    const inn = this.issue2Group.controls.InnControl.value.trim();
    if (inn === this.currentSearchInn) {
      return;
    }

    this.currentSearchInn = inn;

    if (inn.length < 5) {
      return;
    }

    this.foundInnList = [];
    this.accountServiceInstance.searchClientByInn(inn).pipe(
      tap((foundInnList) => {
        foundInnList.forEach((foundInn) => {
          foundInn.innFound = foundInn.inn.substring(0, inn.length);
          foundInn.innTail = foundInn.inn.substring(inn.length);
          this.foundInnList.push(foundInn);
        });
      }),
      untilComponentDestroyed(this),
    ).subscribe();
  }

  private searchBankAsync() {
    this.issue2Group.controls.BikControl.setErrors(null);

    const bik = this.issue2Group.controls.BikControl.value;
    this.accountServiceInstance.searchBankByBik(bik).pipe(
      tap((bank) => {
        if (null === bank) {
          this.issue2Group.controls.BikControl.setErrors({ incorrect: 'Банк не определен. Проверьте БИК' });
          this.issue2Group.controls.BikControl.markAsTouched();
          this.locInstance.reciverBankName = '';
          return;
        }
        this.locInstance.reciverBankName = bank.fullName;
        this.locInstance.reciverBankBik = bik;
      }),
      untilComponentDestroyed(this),
    ).subscribe();
  }
}
