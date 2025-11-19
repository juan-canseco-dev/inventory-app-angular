import { Pipe, PipeTransform } from '@angular/core';
import { PagedList } from 'app/core/models/backend/shared';

@Pipe({
  name: 'numberOfRecordsMessage'
})
export class NumberOfRecordsMessagePipe implements PipeTransform {

  transform(value: PagedList<any> , pageSize : number, entity : string): string {
    let entriesCount = value.pageIndex * pageSize;
    let current = entriesCount - (pageSize - 1);
    entriesCount = value.rowsCount < entriesCount? value.rowsCount : entriesCount;
    return `${current} - ${entriesCount} of ${value.rowsCount} ${entity}`
  }

}
