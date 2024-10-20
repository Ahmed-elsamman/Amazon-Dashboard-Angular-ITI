import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// استيراد المكونات والخدمات
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
// ... (استيراد باقي المكونات)

// استيراد وحدات Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
// ... (استيراد باقي وحدات Angular Material)

// استيراد وحدات Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
// import { firebaseConfig } from './firebase.config';
import { importProvidersFrom } from '@angular/core';
import { HeaderComponent } from './Components/header/header.component';
import { SideMenuComponent } from './path-to-side-menu/side-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SideMenuComponent,

    // ... (إعلان باقي المكونات)
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // وحدات Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    // ... (استيراد باقي وحدات Angular Material)
    // تهيئة Firebase
    // importProvidersFrom(
    //   provideFirebaseApp(() => initializeApp(firebaseConfig)),
    //   provideFirestore(() => getFirestore()),
    //   provideAuth(() => getAuth()),
    //   provideStorage(() => getStorage())
    // ),
    // ... (استيراد أي وحدات إضافية)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
