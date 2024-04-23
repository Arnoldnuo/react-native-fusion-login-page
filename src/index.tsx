/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from "react-native";
import { AutoLoginScreen } from './ali';
import { SmsLoginScreen } from './huawei';
export interface LoginScreenProps {
  style?: StyleProp<ViewStyle>;
  onLogin: any;
  onCancle: any;
  aliSecretKey: string;
  client_id: string;
  client_secret: string;
  productId: string;
  autoLoginUIConfig: any;
}

export const LoginScreen = (props: LoginScreenProps) => {
  const { client_id, client_secret, productId, onLogin } = props;
  const [showAutoLogin, setShowAutoLogin] = useState(true);
  return (showAutoLogin ?
    <AutoLoginScreen
      aliSecretKey={props.aliSecretKey}
      autoLoginUIConfig={props.autoLoginUIConfig}
      onFail={(error) => {
        console.log(error);
        setShowAutoLogin(false);
      }}
      onLogin={() => { }}
      onCancle={props.onCancle}
    />
    :
    <SmsLoginScreen client_id={client_id} client_secret={client_secret} productId={productId}
      onLogin={onLogin}
      onCancle={props.onCancle}
    />
  );
};
