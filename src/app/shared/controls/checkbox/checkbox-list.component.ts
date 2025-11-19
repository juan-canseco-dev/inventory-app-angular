import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ControlItem, Value } from 'app/core/models/frontend/control-item';
export { ControlItem, Value } from 'app/core/models/frontend/control-item';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true
    }
  ]
})
export class CheckboxListComponent implements OnInit, ControlValueAccessor {

  value !: Value[];
  @Input()
  isDisabled : boolean = false;
  
  @Input()
  readonly : boolean = false;

  @Input() items !: ControlItem[];
  @Output() changed = new EventEmitter<Value[]>();

  constructor() { }

  ngOnInit(): void {

  }
  
  private propagateChange : any = () => {};

  writeValue(value : Value[]) : void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChanged(value : Value, checked : Event) {
    const {target} = checked;
    const result = (target as HTMLInputElement).checked; 
    const selected = this.getSelected(value, result);
    
    this.value = selected;
    this.propagateChange(selected);
    this.changed.emit(selected);
  }

  private getSelected(value: Value, checked: boolean): Value[]{
    const selected: Value[] = this.value ? [...this.value] : [];
    if(checked) {
      if(!selected.includes(value)) {
        selected.push(value);
      }
    }
    else{
      const index = selected.indexOf(value);
      selected.splice(index, 1);
    }
    return selected.length ? selected : [];
  }

  isChecked(value : Value) : boolean {
    return this.value && this.value.includes(value);
  }

}
