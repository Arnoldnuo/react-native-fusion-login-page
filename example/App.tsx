/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View } from 'react-native';

import { LoginScreen } from "react-native-fusion-login-page";

import { aliSecretKey, client_id, client_secret, productId } from './config';

export default function App() {
  return <LoginScreen
    onLogin={(from: string, token: string) => {
      console.log('example onLogin:', from, token);
    }}
    onCancle={() => { console.log('取消登录') }}
    aliSecretKey={aliSecretKey as string}
    autoLoginUIConfig={{
      navColor: '#fffff',
    }}
    client_id={client_id}
    client_secret={client_secret}
    productId={productId}
  />;
};
