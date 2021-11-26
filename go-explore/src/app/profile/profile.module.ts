import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

import { IonicStorageModule } from '@ionic/storage-angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    RouterModule.forChild([{ path: '', component: ProfilePage }]),
    IonicStorageModule,
    ExploreContainerComponentModule
  ],
  declarations: [ProfilePage,HeaderComponent]
})
export class ProfilePageModule {}
