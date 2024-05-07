import { Component, OnInit } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  idToken,
  user,
} from '@angular/fire/auth';
import * as firebaseUI from 'firebaseui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private ui!: firebaseUI.auth.AuthUI;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.ui = new firebaseUI.auth.AuthUI(this.auth);

    const firebaseUiConfig: firebaseUI.auth.Config = {
      callbacks: {
        uiShown: () => {
          const loader = document.getElementById('loader');
          if (loader) loader.style.display = 'none';
        },
      },
      signInSuccessUrl: '/',
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    };
    this.ui.start('#firebaseui-auth-container', firebaseUiConfig);

    //Subscribe to Auth observables
    user(this.auth).subscribe((user: User | null) => {
      if (!user) return;
      localStorage.setItem(
        'username',
        user.displayName || user.email || user.uid,
      );
    });
    idToken(this.auth).subscribe((token: string | null) => {
      if (!token) return;
      localStorage.setItem('accessToken', token);
    });
  }
}
