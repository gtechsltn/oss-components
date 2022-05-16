import Service from '@ember/service';
import { isEmpty } from '@ember/utils';

enum ToastType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

const ICONS_DEFINITION = {
  info: 'far fa-info-circle',
  warning: 'far fa-exclamation-circle',
  error: 'far fa-exclamation-triangle',
  success: 'far fa-check-circle'
};

/**
 * Toast Options
 *
 * @param {boolean} closeButton - Whether or not a button should be displayed to close the toast early.
 * @param {boolean} tapToDismiss - Whether or not a tap on the toast should close it.
 * @param {Function} onclick - A function to be called when the toast is clicked.
 */
export type ToastOptions = {
  tapToDismiss?: boolean;
  onclick?: Function;
  timeout?: number | 'none';
};

type ToastFunction = (message: string, title: string, opts?: ToastOptions) => void;

const DEFAULT_TOAST_TIMEOUT = 5000;

const DEFAULT_OPTIONS: ToastOptions = Object.freeze({
  tapToDismiss: true,
  onclick: undefined,
  timeout: DEFAULT_TOAST_TIMEOUT
});

export default class Toast extends Service {
  private _toasts: Map<Element, Animation> = new Map();
  private counterDownKeyframes: KeyframeEffect | null = null;

  /**
   * Display a success toast
   *
   * @param {string} message - The Toast's message
   * @param {string} title - The toast's title
   * @param {Object} opts - Toast options
   * @param {boolean} [opts.closeButton=true] - Display a button to close the toast manually.
   */
  success: ToastFunction = this._delegate(ToastType.SUCCESS);

  /**
   * Display an error toast
   *
   * @param {string} message - The Toast's message
   * @param {string} title - The toast's title
   * @param {Object} opts - Toast options
   * @param {boolean} [opts.closeButton=true] - Display a button to close the toast manually.
   */
  error: ToastFunction = this._delegate(ToastType.ERROR);

  /**
   * Display a warning toast
   *
   * @param {string} message - The Toast's message
   * @param {string} title - The toast's title
   * @param {Object} opts - Toast options
   * @param {boolean} [opts.closeButton=true] - Display a button to close the toast manually.
   */
  warning: ToastFunction = this._delegate(ToastType.WARNING);

  /**
   * Display an information toast
   *
   * @param {string} message - The Toast's message
   * @param {string} title - The toast's title
   * @param {Object} opts - Toast options
   * @param {boolean} [opts.closeButton=true] - Display a button to close the toast manually.
   */
  info: ToastFunction = this._delegate(ToastType.INFO);

  private _delegate(type: ToastType): ToastFunction {
    return (message: string, title?: string, opts?: ToastOptions): void => {
      if (isEmpty(message) && isEmpty(title)) return;

      this._buildToast(type, message, title, { ...DEFAULT_OPTIONS, ...(opts || {}) });
    };
  }

  private _initCounterAnimation(element: HTMLElement, opts: ToastOptions): Animation {
    const duration = typeof opts.timeout === 'number' ? opts.timeout : DEFAULT_TOAST_TIMEOUT;
    this.counterDownKeyframes = new KeyframeEffect(element, [{ width: '100%' }, { width: '0' }], {
      duration: duration,
      fill: 'forwards'
    });
    return new Animation(this.counterDownKeyframes, document.timeline);
  }

  private _playCounterAnimation(event: Event): void {
    this._toasts.get(<HTMLElement>event.target)?.play();
  }

  private _pauseCounterAnimation(event: Event): void {
    this._toasts.get(<HTMLElement>event.target)?.pause();
  }

  private _buildToast(type: ToastType, message: string, title: string | undefined, opts: ToastOptions): void {
    const container: HTMLElement = this._buildContainer();
    const toast: HTMLElement = this._buildElement('div', ['toast', 'toast--hidden', `toast--${type}`]);
    const mainContainer: HTMLElement = this._buildElement('div', ['main-container']);

    const counter = this._buildElement('div', ['counter']);
    const counterDownAnimation = this._initCounterAnimation(counter, opts);

    const iconContainer: HTMLElement = this._buildElement(
      'span',
      ['icon'],
      `<i class="${ICONS_DEFINITION[type]}"></i>`
    );

    const closeButton: HTMLElement = this._buildElement('button', [], '<i class="far fa-times"></i>');
    closeButton.addEventListener('click', this._onToastClose.bind(this), { once: true });

    const textContainer: HTMLElement = this._buildElement('div', ['text-container']);
    if (title) {
      const mainTitle: HTMLElement = this._buildElement('span', ['title'], title);
      textContainer.append(mainTitle);
    }
    const subtitle: HTMLElement = this._buildElement('span', ['subtitle'], message);
    textContainer.append(subtitle);

    mainContainer.append(iconContainer);
    mainContainer.append(textContainer);
    mainContainer.append(closeButton);
    toast.append(counter);
    toast.append(mainContainer);
    container.append(toast);

    this._toasts.set(toast, counterDownAnimation);

    this._setupToastEvents(toast, opts);
    this._handleVisibility(toast, opts);
  }

  private _handleVisibility(toast: Element, opts: ToastOptions) {
    toast.classList.remove('toast--hidden');
    toast.classList.add('toast--visible');

    if (opts.timeout === 'none') return;
    this._toasts.get(toast)?.play();
  }

  private _destroyToast(toast: Element | null | undefined): void {
    if (!toast) return;
    toast.removeEventListener('mouseenter', this._pauseCounterAnimation.bind(this));
    toast.removeEventListener('mouseleave', this._playCounterAnimation.bind(this));
    this._toasts.delete(toast);
    toast?.remove();
  }

  private _onToastClose(evt: Event): void {
    evt.stopPropagation();

    const button =
      (<Element>evt.target).tagName === 'I'
        ? (<Element>evt.target).parentElement?.parentElement
        : (<Element>evt.target).parentElement;

    this._destroyToast(button?.parentElement);
  }

  private _setupToastEvents(toast: Element, opts: ToastOptions) {
    if (opts.onclick && typeof opts.onclick === 'function') {
      toast.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
          opts.onclick?.(e);
        },
        { once: true }
      );
    }

    if (opts.tapToDismiss) {
      toast.addEventListener(
        'click',
        () => {
          this._destroyToast(toast);
        },
        { once: true }
      );
    }

    this._toasts.get(toast)?.finished.then(() => {
      this._destroyToast(toast);
    });

    if (opts.timeout === 'none') return;

    toast.addEventListener('mouseenter', () => {
      this._toasts.get(toast)?.pause();
    });

    toast.addEventListener('mouseenter', this._pauseCounterAnimation.bind(this));
    toast.addEventListener('mouseleave', this._playCounterAnimation.bind(this));
  }

  private _buildElement(tagName: string, classes: string[], content?: string): HTMLElement {
    const element: HTMLElement = document.createElement(tagName);
    element.classList.add(...classes);

    if (content) {
      element.innerHTML = content;
    }

    return element;
  }

  private _buildContainer(): HTMLElement {
    let container: HTMLElement | null = document.querySelector('.toasts-container');

    if (!container) {
      container = document.createElement('div');
      container.classList.add('toasts-container');
      document.body.append(container);
    }

    return container;
  }
}

declare module '@ember/service' {
  interface Registry {
    toast: Toast;
  }
}
