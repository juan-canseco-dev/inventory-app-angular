import { NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from './notifications.service';

@NgModule({
    imports: [
        CommonModule
    ]
})
export class NotificationsModule {
    static forRoot() : ModuleWithProviders<NotificationsModule> {
        return {
            ngModule: NotificationsModule,
            providers: [
                NotificationsService
            ]
        }
    }
};