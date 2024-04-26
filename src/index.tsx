/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from "react-native";
import { AutoLoginScreen } from './ali';
import { SmsLoginScreen } from './huawei';
import { getJwtByAliToken, getJwtByHwToken } from './api';
export interface LoginScreenProps {
  style?: StyleProp<ViewStyle>;
  onLogin?: any;
  onCancle: any;
  onJWTGot?: (token: string) => any;

  aliSecretKey: string;
  aliAutoLoginUIConfig: any;
  jwtApiForAli?: string;

  hwClientId: string;
  hwClientSecret: string;
  hwProductId: string;
  jwtApiForHw?: string;
  jwtApiKeyForHw?: string;
  jwtApiIvForHw?: string
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
      onLogin={async (from: string, info: any) => {
        onLogin(from, info);
        if (from === 'ali' && jwtApiForAli && onJWTGot) {
          const jwt = await getJwtByAliToken(jwtApiForAli, info?.token);
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
      onLogin={async (from: string, info: any) => {
        onLogin(from, info);
        if (from === 'huawei' && jwtApiForHw && onJWTGot) {
          const jwt = await getJwtByHwToken(jwtApiForHw, { ...info, jwtApiKeyForHw: props.jwtApiKeyForHw, jwtApiIvForHw: props.jwtApiIvForHw });
          if (jwt) {
            onJWTGot(jwt);
          } else {
            throw new Error('通过hw token获取登录jwt失败');
          }
        }
      }}
      onCancle={onCancle}
      jwtApiForHw={jwtApiForHw}
    />
  );
};
