import { Pipe, PipeTransform } from '@angular/core';
import { IKeyValue } from 'app/foundation';

const createKeyValue = (key, value): IKeyValue<any> => {
  return {
    key,
    value
  };
};

@Pipe({
  name: 'toArray'
})
export class ToArrayPipe implements PipeTransform {
  transform(src: any): IKeyValue<any>[] {
    return Object.keys(src).map((key) => createKeyValue(key, src[key]));
  }
}
