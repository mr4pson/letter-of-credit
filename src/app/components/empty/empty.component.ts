import {Component} from '@angular/core';
import {StoreService} from 'src/app/models/state.service';

@Component({
	selector: "loc-empty",
	template: "",
	styles: []
})
export class EmptyComponent {
	constructor(private Store: StoreService) { }
}
