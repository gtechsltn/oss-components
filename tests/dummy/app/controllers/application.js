import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service toast;

  @tracked loading = false;

  @action
  triggerToast(type) {
    this.toast[type]('message', 'title');
  }

  @action
  toggleLoading() {
    this.loading = !this.loading;
  }
}
