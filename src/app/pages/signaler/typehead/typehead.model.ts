export interface SelectChangeEventDetail<T = any> {
  value: T;
}
export interface SelectCustomEvent<T = any> extends CustomEvent {
  detail: SelectChangeEventDetail<T>;
  target: HTMLIonSelectElement;
}

export interface Item {
  text: string;
  value: string;
}
