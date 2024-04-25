/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from "react-native";
import { AutoLoginScreen } from './ali';
import { SmsLoginScreen } from './huawei';
import { getJwtByAliToken } from './api';
export interface LoginScreenProps {
  style?: StyleProp<ViewStyle>;
  onLogin: any;
  onCancle: any;
  onJWTGot?: (token: string) => any;

  aliSecretKey: string;
  aliAutoLoginUIConfig: any;
  jwtApiForAli?: string;

  hwClientId: string;
  hwClientSecret: string;
  hwProductId: string;
  jwtApiForHw?: string;
}

export const LoginScreen = (props: LoginScreenProps) => {
  const { onLogin, onCancle, onJWTGot,
    hwClientId, hwClientSecret, hwProductId, jwtApiForHw,
    aliAutoLoginUIConfig, aliSecretKey, jwtApiForAli } = props;
  const [showAutoLogin, setShowAutoLogin] = useState(true);
  return (showAutoLogin ?
    <AutoLoginScreen
      aliSecretKey={aliSecretKey}
      autoLoginUIConfig={aliAutoLoginUIConfig}
      onFail={(error) => {
        console.log(error);
        setShowAutoLogin(false);
      }}
      onLogin={async (from: string, token: string) => {
        onLogin(from, token);
        if (jwtApiForAli && onJWTGot) {
          const jwt = await getJwtByAliToken(jwtApiForAli, token);
          if (jwt) {
            onJWTGot(jwt);
          } else {
            throw new Error('通过ali token获取登录jwt失败');
          }
        }
      }}
      onCancle={onCancle}
      jwtApiForAli={jwtApiForAli}
    />
    :
    <SmsLoginScreen client_id={hwClientId} client_secret={hwClientSecret} productId={hwProductId}
      onLogin={onLogin}
      onCancle={onCancle}
      jwtApiForHw={jwtApiForHw}
    />
  );
};
