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

  //TX A RX JSOU Z POHLEDU SERVERU
  SERIAL_PORT_SERVICE_UUID: string;
  TX_CHARACTERISTIC_UUID: string;
  RX_CHARACTERISTIC_UUID: string;

  private conectCallback: any[] = [];
  private disconectCallback: any[] = [];
  private callBackList = [];
  private mesage = "";

  constructor() {
    /* this.DEVICE_ADRESS = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    this.TEMPRATURE_DESCRIPTOR_ADDRES =  'beb5483e-36e1-4688-b7f5-ea07361b26a8';
    this.HUMIDYTY_DESCRIPTOR_ADDRES = '578798ab-8ab0-4826-8736-a5d7a8d4be3f';
    this.LED_DESCRIPTOR_ADDRES = '0278a5b0-bb22-46de-afcd-3e9e3ada667a'; */

    this.DEVICE_ADRESS = "4a981800-1cc4-e7c1-c757-f1267dd021e8"
    this.TEMPRATURE_DESCRIPTOR_ADDRES = "4a982a00-1cc4-e7c1-c757-f1267dd021e8"
    this.HUMIDYTY_DESCRIPTOR_ADDRES = "4a982a01-1cc4-e7c1-c757-f1267dd021e8"
    this.LED_DESCRIPTOR_ADDRES = "4a982a37-1cc4-e7c1-c757-f1267dd021e8"

    /* this.SERIAL_PORT_SERVICE_UUID = "4a98f100-1cc4-e7c1-c757-f1267dd021e8"
    this.TX_CHARACTERISTIC_UUID =   "4a98f101-1cc4-e7c1-c757-f1267dd021e8"
    this.RX_CHARACTERISTIC_UUID =   "4a98f102-1cc4-e7c1-c757-f1267dd021e8" */

    this.SERIAL_PORT_SERVICE_UUID = "e8c54132-c483-416b-9cdf-aa4f735b65e3"
    this.TX_CHARACTERISTIC_UUID = "7b29c5be-df4e-41ae-8c38-df7034a5df3d"
    this.RX_CHARACTERISTIC_UUID = "b26a3567-fcda-431e-86da-8ee7ed604b20"
  }
  public getDeviceInfo() {
    return this.DeviceInfo;
  }
  public async search(): Promise<BluttotDeviceInfo> {
    try {
      var nav: any = navigator;
      var device = await nav.bluetooth.requestDevice({
        filters: [
          {
            //services: [this.DEVICE_ADRESS]
            namePrefix: 'ESP'
          }],
        optionalServices: [this.DEVICE_ADRESS, this.SERIAL_PORT_SERVICE_UUID]
      })
      this.Device = device;
      let sub = this;

      var server = await device.gatt.connect();
      device.addEventListener('gattserverdisconnected', () => {
        if (sub.DeviceInfo.conected) {
          sub.DeviceInfo.conected = false;
          sub.disconectCallback.forEach(callBack => {
            callBack();
          });
        }
      });
      var service = await server.getPrimaryService(this.DEVICE_ADRESS);
      //var xcx = await service.getCharacteristics();
      var characteristicks = await Promise.all([
        service.getCharacteristic(this.TEMPRATURE_DESCRIPTOR_ADDRES),
        service.getCharacteristic(this.HUMIDYTY_DESCRIPTOR_ADDRES),
        service.getCharacteristic(this.LED_DESCRIPTOR_ADDRES)
      ]);
      var seriaPortService = await server.getPrimaryService(this.SERIAL_PORT_SERVICE_UUID);
      //var xcx = await service.getCharacteristics();
      var seriaPortcharacteristicks = await Promise.all([
        seriaPortService.getCharacteristic(this.TX_CHARACTERISTIC_UUID),
        seriaPortService.getCharacteristic(this.RX_CHARACTERISTIC_UUID)
      ]);
      try {
        //console.log(await seriaPortcharacteristicks[0].getDescriptors());
        await seriaPortcharacteristicks[0].startNotifications();
      }
      catch (err) {
        console.error(err);
      }

      seriaPortcharacteristicks[0].addEventListener('characteristicvaluechanged', (event) => {
        let value = event.target.value;
        var strData = String.fromCharCode.apply(null, new Uint8Array(value.buffer));
        if (strData == "!") {
          sub.callBackList.forEach(callBack => {
            callBack(sub.mesage);
          });
          sub.mesage = "";
        }
        else {
          sub.mesage = sub.mesage + strData;
        }
      });



      var enc = new TextEncoder();
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
            /*  if (deviceDescription.conected)
               sub.disconetEventWraper(); */
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
            /* if (deviceDescription.conected)
              sub.disconetEventWraper(); */
            throw err;
          }
        },
        getLedData: async () => {
          try {
            var rawData = await characteristicks[2].readValue();
            var strData = String.fromCharCode.apply(null, new Uint8Array(rawData.buffer));
            //console.log(rawData.getUint8(0))
            //console.log(strData)
            return (strData == '1') ? true : false;
          }
          catch (err) {
            /* if (deviceDescription.conected)
              sub.disconetEventWraper(); */
            throw err;
          }
        },
        setLedData: (state: boolean) => {
          try {

            if (state)
              characteristicks[2].writeValue(enc.encode("1"));
            else
              characteristicks[2].writeValue(enc.encode("0"));
          }
          catch (err) {
            /* if (deviceDescription.conected)
              sub.disconetEventWraper(); */
            throw err;
          }
        },
        async serialWrite(data) {
          //var enc = new TextEncoder();
          for (var i = 0; i < data.length; i++) {
            await seriaPortcharacteristicks[1].writeValue(enc.encode(data.charAt(i)));
          }
          await seriaPortcharacteristicks[1].writeValue(enc.encode('!'));
        },
        serialReadCallbackRegister(callBack) {
          sub.callBackList.push(callBack);
          let removed = false;
          return () => {
            if (!removed) {
              for (let i = 0; i < sub.callBackList.length; i++) {
                if (sub.callBackList[i] === callBack)
                  sub.callBackList.splice(i, 1);
              }
              removed = true;
            }
          }
        }

      };
      this.DeviceInfo = deviceDescription;
      this.conect();
      return deviceDescription;
    }
    catch (err) {
      console.warn("WARINGI: NO DEVICE SELECTED", err);
    }
  }

  public async reconect() {
    if (this.Device == undefined && !this.DeviceInfo.conected)
      return false;
    //await this.Device.gatt.disconnect();
    //var v = await this.Device.gatt.connect();
    await this.conect();
    return true;
  }
  public async disconect() {
    if (this.Device == undefined && this.DeviceInfo.conected)
      return false;
    //  this.disconetEventWraper();
    await this.Device.gatt.disconnect();
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
      },
      serialWrite(data) {
      },
      serialReadCallbackRegister(callBack) {

      }

    }

    return bleDeviceInfo;
  }

  public onConection(callback: () => void): () => void {
    if (this.DeviceInfo != undefined && this.DeviceInfo.conected)
      callback();
    this.conectCallback.push(callback);
    let removed = false;
    let sub = this;
    return () => {
      if (!removed) {
        for (let i = 0; i < sub.conectCallback.length; i++) {
          if (sub.conectCallback[i] === callback)
            sub.conectCallback.splice(i, 1);
        }
        removed = true;
      }
    }
  }
  public onDisconect(callback: () => void) {
    this.disconectCallback.push(callback);
  }


  private async conect() {
    if (this.Device == undefined)
      throw new Error("Bad calling of bleservice conect, must be called search first");
    
    var server = await this.Device.gatt.connect();
    var service = await server.getPrimaryService(this.DEVICE_ADRESS);
    //var xcx = await service.getCharacteristics();
    var characteristicks = await Promise.all([
      service.getCharacteristic(this.TEMPRATURE_DESCRIPTOR_ADDRES),
      service.getCharacteristic(this.HUMIDYTY_DESCRIPTOR_ADDRES),
      service.getCharacteristic(this.LED_DESCRIPTOR_ADDRES)
    ]);
    var seriaPortService = await server.getPrimaryService(this.SERIAL_PORT_SERVICE_UUID);
    //var xcx = await service.getCharacteristics();
    var seriaPortcharacteristicks = await Promise.all([
      seriaPortService.getCharacteristic(this.TX_CHARACTERISTIC_UUID),
      seriaPortService.getCharacteristic(this.RX_CHARACTERISTIC_UUID)
    ]);
    this.DeviceInfo.conected = true;

    this.conectCallback.forEach(callBack => {
      callBack();
    });
    ///return deviceDescription;
  }

  private disconetEventWraper() {
    console.warn("Attemp to read from disconected device");
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
  serialWrite: (data: string) => void;
  serialReadCallbackRegister(callback: (string) => void): void;
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