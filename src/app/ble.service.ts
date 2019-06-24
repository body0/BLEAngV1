import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  constructor() { }
}

export interface BluttotDeviceInfo {
  name:string;
  description:string;
  getTemperatureData: () => Promise<number>;
}
