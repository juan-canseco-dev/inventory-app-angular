import { Component, OnInit, Input } from '@angular/core';
import { ModuleWithPermissions, Permission } from 'app/core/models/backend/modules';
export { ModuleWithPermissions, Permission } from 'app/core/models/backend/modules';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, ControlContainer, ValidatorFn, AbstractControl} from '@angular/forms';
import { ControlItem} from 'app/core/models/frontend/control-item';

export interface ModuleItem {
  id : string;
  label : string;
  permissions : ControlItem[];
  requiredPermissions : ControlItem[];
  selectedPermissions : string[];
};

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  viewProviders: [
    {
    provide: ControlContainer,
    useExisting: FormGroupDirective
    }
  ]
})
export class PermissionsComponent implements OnInit {

  @Input() permissions : ModuleWithPermissions[];
  @Input() parent : FormGroup | undefined;
  @Input() readonly : boolean = false;

  private modulesArray !: FormArray;

  items : ModuleItem[];

  constructor(
    private fb : FormBuilder) { }
  
  ngOnInit(): void {
    this.initModules();
  }

  ngOnDestroy() : void {
    this.destroyForms();
  }

  private initForms() {
    if (this.parent === undefined) {
      this.parent = this.fb.group({});
    }
    this.modulesArray = this.fb.array(this.getModulesForms(), this.modulesValidator());
    this.parent.addControl('modules', this.modulesArray);
  }

  private destroyForms() {
    this.parent.removeControl('modules');
    this.modulesArray.clear();
  }

  private initModules() {
    this.items = this.permissions.map(m => this.mapToItem(m));
    this.initForms();
  }

  private getModulesForms() : FormGroup[] {
    return this.items.map(item => this.fb.group({
      moduleId: [item.id, {}], 
      permissions: [item.selectedPermissions, {
        updateOn: 'change'
      }]
    }, {validators: [this.permissionsValidator()]}));
  }

  private modulesValidator() : ValidatorFn {
    return (modulesForms : FormArray) : {[key : string] : boolean} | null => {
      let numberOfValidForms = 0;
      let numberOfSelectedForms = 0;
      for (let moduleIndex = 0; moduleIndex < modulesForms.length; moduleIndex++) {
        const moduleForm = modulesForms.controls[moduleIndex] as FormGroup;
        if (moduleForm.valid) {
          numberOfValidForms++;
          const formPermissions = moduleForm.value.permissions;
          if (formPermissions !== null && formPermissions.length) {
            numberOfSelectedForms++;
          }
        } 
      }
      if (numberOfValidForms !== modulesForms.length) {
        return {requiredPermissions:true};
      }
      if (numberOfSelectedForms < 1) {
        return {minNumOfModules:true};
      }
      return null;
    }
  }

  get modules() : FormArray {
    return <FormArray> this.parent.get('modules');
  }

  private getModuleForm(moduleIndex : number) : FormGroup {
    return this.modules.controls[moduleIndex] as FormGroup;
  }
  
  moduleFormHasError(moduleIndex : number) : boolean {
    let form = this.getModuleForm(moduleIndex);
    return form.hasError('requiredPermissions');
  }

  getRequiredPermissionsMessage(moduleIndex : number) : string {
    let requiredPermissions = this.items[moduleIndex]
    .requiredPermissions
    .map(s => s.label);
    return requiredPermissions.join(' , ');
  }


  private permissionsValidator() : ValidatorFn {
    return (c : AbstractControl) : {[key:string] : boolean} | null => {

      const values = c.value;      

      const moduleItem = this.items.find(i => i.id == values.moduleId);

      const permissions = values.permissions;

      if ((permissions !== null && permissions.length) && moduleItem.requiredPermissions !== null) {
        let permissions = values.permissions;
       
        let requieredPermissionsCount = moduleItem
        .requiredPermissions
        .filter(r => permissions.includes(r.value))
        .length;
      
        if (requieredPermissionsCount !== moduleItem.requiredPermissions.length) {;
          return {requiredPermissions: true};
        }
      }
      return null;
    }
  }

  private mapToControlItem(permission : Permission) : ControlItem {
    return {
      label: permission.name,
      value: permission.id
    };
  }
  
  private mapToItem(module : ModuleWithPermissions) : ModuleItem {
    return {
       id: module.id, 
       label: module.name,
       permissions: module.permissions.map(p => this.mapToControlItem(p)),
       requiredPermissions: module.permissions.filter(p => p.required === true).map(p => this.mapToControlItem(p)),
       selectedPermissions: this.getSelectedPermissions(module.permissions)
      };
  }


  private getSelectedPermissions(permissions : Permission[]) : string[] | null {
    if (!permissions.length)
    return null;
    const selectedPermissions = permissions.filter(p => p.selected === true);
    if (!selectedPermissions.length) {
      return null;
    }
    return selectedPermissions.map(p => p.id);
  }

}
