import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  DEVICE_ADRESS: string;
  TEMPRATURE_DESCRIPTOR_ADDRES: string;
  HUMIDYTY_DESCRIPTOR_ADDRES: string;

  constructor() {
    this.DEVICE_ADRESS = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    this.TEMPRATURE_DESCRIPTOR_ADDRES =  'beb5483e-36e1-4688-b7f5-ea07361b26a8';
    this.HUMIDYTY_DESCRIPTOR_ADDRES = '578798ab-8ab0-4826-8736-a5d7a8d4be3f';
  }

  public async search(): Promise<BluttotDeviceInfo> {
    var nav: any = navigator;
    
    var device = await nav.bluetooth.requestDevice({
      filters: [
        {
          services: [this.DEVICE_ADRESS]
        }]
    })
    var server = await device.gatt.connect();
    var service = await server.getPrimaryService(this.DEVICE_ADRESS);
    var characteristicks = await Promise.all([
      service.getCharacteristic(this.TEMPRATURE_DESCRIPTOR_ADDRES),
      service.getCharacteristic(this.HUMIDYTY_DESCRIPTOR_ADDRES)
    ]);

    var deviceDescription: BluttotDeviceInfo = {
      name: device.name,
      description: "TEST",
      getTemperatureData: async () => {
        var rawData = await characteristicks[0].readValue();
        var strData = String.fromCharCode.apply(null, new Uint8Array(rawData.buffer));
        //console.log(rawData.getUint8(0))
        //console.log(strData)
        return parseFloat(strData);
      },
      getHumidytyData: async () => {
        var rawData = await characteristicks[1].readValue();
        var strData = String.fromCharCode.apply(null, new Uint8Array(rawData.buffer));
        //console.log(rawData.getUint8(0))
        //console.log(strData)
        return parseFloat(strData);
      }
    };
    return deviceDescription;
  }

  public async monkSearch(): Promise<BluttotDeviceInfo> {
    var bleDeviceInfo: BluttotDeviceInfo = {
      name: "test device",
      description: "Test data, deta generated randomly.",
      getTemperatureData: async () => {
        return Math.floor(Math.random() * 20) - 10;
      },
      getHumidytyData: async () => {
        return Math.floor(Math.random() * 20) - 10;
      }
    }

    return bleDeviceInfo;
  }
}

export interface BluttotDeviceInfo {
  name: string;
  description: string;
  getTemperatureData: () => Promise<number>;
  getHumidytyData: () => Promise<number>;
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