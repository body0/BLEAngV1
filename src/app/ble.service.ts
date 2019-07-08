import { Injectable } from '@angular/core';
import { bypassSanitizationTrustResourceUrl } from '@angular/core/src/sanitization/bypass';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  Device: any;
  DeviceInfo: BluttotDeviceInfo;

  DEVICE_ADRESS: string;
  TEMPRATURE_DESCRIPTOR_ADDRES: string;
  HUMIDYTY_DESCRIPTOR_ADDRES: string;
  LED_DESCRIPTOR_ADDRES: string;

  private conectCallback: any[] = [];
  private disconectCallback: any[] = [];

  constructor() {
    /* this.DEVICE_ADRESS = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    this.TEMPRATURE_DESCRIPTOR_ADDRES =  'beb5483e-36e1-4688-b7f5-ea07361b26a8';
    this.HUMIDYTY_DESCRIPTOR_ADDRES = '578798ab-8ab0-4826-8736-a5d7a8d4be3f';
    this.LED_DESCRIPTOR_ADDRES = '0278a5b0-bb22-46de-afcd-3e9e3ada667a'; */

    this.DEVICE_ADRESS = "4a981800-1cc4-e7c1-c757-f1267dd021e8"
    this.TEMPRATURE_DESCRIPTOR_ADDRES = "4a982a00-1cc4-e7c1-c757-f1267dd021e8"
    this.HUMIDYTY_DESCRIPTOR_ADDRES = "4a982a01-1cc4-e7c1-c757-f1267dd021e8"
    this.LED_DESCRIPTOR_ADDRES = "4a982a37-1cc4-e7c1-c757-f1267dd021e8"
  }
  public getDeviceInfo() {
    return this.DeviceInfo;
  }

  public async search(): Promise<BluttotDeviceInfo> {
    var nav: any = navigator;

    var device = await nav.bluetooth.requestDevice({
      filters: [
        {
          services: [this.DEVICE_ADRESS]
        }]
    })
    this.Device = device;
    var server = await device.gatt.connect();
    this.conectCallback.forEach(callBack => {
      callBack();
    });
    var service = await server.getPrimaryService(this.DEVICE_ADRESS);
    var xcx = await service.getCharacteristics();
    var characteristicks = await Promise.all([
      service.getCharacteristic(this.TEMPRATURE_DESCRIPTOR_ADDRES),
      service.getCharacteristic(this.HUMIDYTY_DESCRIPTOR_ADDRES),
      service.getCharacteristic(this.LED_DESCRIPTOR_ADDRES)
    ]);


    var sub = this;
    var disconected = false;
    var disconetEventWraper = function () {
      if (!disconected) {
        sub.DeviceInfo.conected = false;
        sub.disconectCallback.forEach(callBack => {
          callBack();
        });
      }
    }
    var deviceDescription: BluttotDeviceInfo = {
      name: device.name,
      description: "TEST DEVICE: esp32 with senzor DHT11 (pressure and temperature) and led diode",
      conected: true,
      getTemperatureData: async () => {
        try {
          var rawData = await characteristicks[0].readValue();
          var strData = String.fromCharCode.apply(null, new Uint8Array(rawData.buffer));
          //console.log(rawData.getUint8(0))
          //console.log(strData)
          return parseFloat(strData);
        }
        catch (err) {
          disconetEventWraper();
          throw err;
        }

      },
      getHumidytyData: async () => {
        try {
          var rawData = await characteristicks[1].readValue();
          var strData = String.fromCharCode.apply(null, new Uint8Array(rawData.buffer));
          //console.log(rawData.getUint8(0))
          //console.log(strData)
          return parseFloat(strData);
        }
        catch (err) {
          disconetEventWraper();
          throw err;
        }
      },
      getLedData: async () => {
        try {
          var rawData = await characteristicks[2].readValue();
          var strData = String.fromCharCode.apply(null, new Uint8Array(rawData.buffer));
          //console.log(rawData.getUint8(0))
          console.log(strData)
          return (strData == '1') ? true : false;
        }
        catch (err) {
          disconetEventWraper();
          throw err;
        }
      },
      setLedData: (state: boolean) => {
        try {
          var enc = new TextEncoder();
          if (state)
            characteristicks[2].writeValue(enc.encode("1"));
          else
            characteristicks[2].writeValue(enc.encode("0"));
        } 
        catch (err) {
          disconetEventWraper();
          throw err;
        }
      }
    };
    this.DeviceInfo = deviceDescription;
    return deviceDescription;
  }

  /*   private async conect(){
      if(this.Device == undefined) 
        throw new Error("Bad calling of bleservice conect, must be called search first");
    } */

  public reconect(): boolean {
    if (this.Device == undefined)
      return false;
    this.disconect();
    this.Device.conect();
    return true;
  }

  public async disconect() {
    if (this.Device == undefined)
      return false;
    await this.Device.disconnect();
    return true;
  }

  public monkSearch(): BluttotDeviceInfo {
    var ledState = false;
    var bleDeviceInfo: BluttotDeviceInfo = {
      name: "test device",
      description: "Test data, deta generated randomly.",
      conected: true,
      getTemperatureData: async () => {
        return Math.floor(Math.random() * 20) - 10;
      },
      getHumidytyData: async () => {
        return Math.floor(Math.random() * 20) - 10;
      },
      getLedData: async () => {
        return ledState;
      },
      setLedData: (state: boolean) => {
        ledState = state;
      }

    }

    return bleDeviceInfo;
  }

  public onConection(callback: () => void) {
    this.conectCallback.push(callback);
  }
  public onDisconect(callback: () => void) {
    this.disconectCallback.push(callback);
  }
}

export interface BluttotDeviceInfo {
  name: string;
  description: string;
  conected: boolean;
  getTemperatureData: () => Promise<number>;
  getHumidytyData: () => Promise<number>;
  getLedData: () => Promise<boolean>;
  setLedData: (state: boolean) => void;
}


/*

var characteristicks = await nav.bluetooth.requestDevice({
      filters: [
        {
          services: [sub.DEVICE_ADRESS]
        }]
    })
      .then(device => {
        name = device.name;
        return device.gatt.connect();
      })
      .then(server => {
        return server.getPrimaryService(sub.DEVICE_ADRESS);
      })
      .then(service => {
        return (
          service.getCharacteristic(sub.TEMPRATURE_DESCRIPTOR_ADDRES),
          service.getCharacteristic(sub.HUMIDYTY_DESCRIPTOR_ADDRES)
        );
      })
      .catch(error => {
        console.log("SERVICE ERR" + error);
      });

*/