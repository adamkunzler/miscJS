import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'number-base',
  templateUrl: './number-base.component.html',
  styleUrls: ['./number-base.component.css'],
})
export class NumberBaseComponent implements OnInit {
  model: NumberBaseModel;

  constructor() {}

  ngOnInit() {
    this.model = {
      dec1: 255,
      dec2: 255,
      dec3: 255,
      dec4: 255,
      decimal: 4294967295,
      hex: this.toHex(4294967295),
      binary: this.toBinary(4294967295),
      base32: this.toBase36(4294967295),
    };
  }

  decimalChannelsChanged() {
    if (
      +this.model.dec1 > 255 ||
      +this.model.dec2 > 255 ||
      +this.model.dec3 > 255 ||
      +this.model.dec4 > 255
    ) {
      alert('Max value is 255');
      return;
    }

    let num = 0;
    num += +this.model.dec1 << 24;
    num += +this.model.dec2 << 16;
    num += +this.model.dec3 << 8;
    num += +this.model.dec4;

    num = num >>> 0; // force unsigned 32-bit number

    this.model.decimal = num;
    this.model.hex = this.toHex(num);
    this.model.binary = this.toBinary(num);
    this.model.base32 = this.toBase36(num);
  }

  decimalChanged() {
    if (+this.model.decimal > 4294967295) {
      alert('Max value is 4294967295');
      return;
    }

    let num = +this.model.decimal >>> 0;

    this.model.dec1 = (num & 0xff000000) >>> 24;
    this.model.dec2 = (num & 0x00ff0000) >>> 16;
    this.model.dec3 = (num & 0x0000ff00) >>> 8;
    this.model.dec4 = num & 0x000000ff;
    this.model.hex = this.toHex(num);
    this.model.binary = this.toBinary(num);
    this.model.base32 = this.toBase36(num);
  }

  toHex(value: number) {
    let hex = value.toString(16).toUpperCase().padStart(8, '0');
    hex = hex.replace(/.{1,2}(?=(.{2})+$)/g, '$&  ');
    return hex;
  }

  toBinary(value: number) {
    let binary = value.toString(2).toUpperCase().padStart(32, '0');
    binary = binary.replace(/.{1,8}(?=(.{8})+$)/g, '$&  ');
    return binary;
  }

  toBase36(value: number) {
    let base36 = value.toString(36).toUpperCase().padStart(8, '0');
    base36 = base36.replace(/.{1,2}(?=(.{2})+$)/g, '$&  ');
    return base36;
  }
}

export interface NumberBaseModel {
  dec1: number;
  dec2: number;
  dec3: number;
  dec4: number;
  decimal: number;
  hex: string;
  binary: string;
  base32: string;
}
