export interface IAbiElementInput {
  name: string;
  type: string;
}

export interface IAbiElement {
  inputs: Array<IAbiElementInput>;
  name: string;
}
