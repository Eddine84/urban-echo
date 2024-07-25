// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken:
      'pk.eyJ1IjoiZHpmdWxsc3RhY2tkZXYiLCJhIjoiY2x2eWJkejkzMjVodTJrbnlvaGs2c2Y0ZyJ9.IVAMRDDapDnAT7KWCYk4mA',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyCV-vExmckUfc3t0mAOrtOOIUpnvkDUw2Y',
    authDomain: 'urbanecho-dcb01.firebaseapp.com',
    projectId: 'urbanecho-dcb01',
    storageBucket: 'urbanecho-dcb01.appspot.com',
    messagingSenderId: '681789095193',
    appId: '1:681789095193:web:d2dd5f9add0fb9b5be5988',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
