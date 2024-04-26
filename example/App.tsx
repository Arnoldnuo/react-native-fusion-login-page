/* eslint-disable prettier/prettier */
import { LoginScreen } from "react-native-fusion-login-page";

import { aliSecretKey, client_id, client_secret, jwtApiForAli, jwtApiForHw, productId, key, iv } from './config';

export default function App() {
  return <LoginScreen
    onLogin={(from: string, token: string) => {
      console.log('example onLogin:', from, token);
    }}
    onCancle={() => { console.log('取消登录') }}
    aliSecretKey={aliSecretKey as string}
    aliAutoLoginUIConfig={{
      // navColor: '#000000',
    }}
    hwClientId={client_id}
    hwClientSecret={client_secret}
    hwProductId={productId}

    jwtApiForHw={jwtApiForHw}
    jwtApiForAli={jwtApiForAli}
    jwtApiKeyForHw={key}
    jwtApiIvForHw={iv}
    onJWTGot={(token) => {
      console.log('jwt token:', token);
    }}
  />;
};
