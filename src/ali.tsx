/* eslint-disable prettier/prettier */
// https://help.aliyun.com/zh/pnvs/product-overview/what-is-the-number-certification-services 
// 阿里云号码认证，手机号自动检测登录
import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from "react-native";
import * as OnePass from 'react-native-ali-onepass';

export interface AutoLoginScreenProps {
  style?: StyleProp<ViewStyle>;
  aliSecretKey: string;
  onLogin: any;
  onFail: any;
  onCancle: any;
  autoLoginUIConfig: any;
  jwtApiForAli?: string;
}
export const AutoLoginScreen = (props: AutoLoginScreenProps) => {
  const init = async () => {
    try {
      await OnePass.init(props.aliSecretKey);
      const available = await OnePass.checkEnvAvailable();
      await OnePass.prefetch();
    } catch (error) {
      props.onFail(error);
    }
  };
  const addListeners = () => {
    return [
      OnePass.addListener(OnePass.EVENTS.onTokenSuccess, async (data) => {
        try {
          console.log('onTokenSuccess', data);
          const { code, msg, requestCode, token, vendorName } = data;
          const numberCode = Number(code);
          if (numberCode === OnePass.RESULT_CODES["600000"]) {
            await props.onLogin('ali', token);
            await OnePass.hideLoginLoading();
            await OnePass.quitLoginPage();
          } else if (numberCode === OnePass.RESULT_CODES["600001"]) {
            console.log('唤起授权页成功');
          } else {
            props.onFail({ from: 'ali auto login onTokenSuccess error', data });
            await OnePass.hideLoginLoading();
            await OnePass.quitLoginPage();
          }
        } catch (error) {
          props.onFail({ from: 'ali auto login onTokenSuccess error', error });
          await OnePass.hideLoginLoading();
          await OnePass.quitLoginPage();
        }
      }),
      OnePass.addListener(OnePass.EVENTS.onTokenFailed, async (data) => {
        try {
          console.log('onTokenFailed', data);
          const { code } = data;
          if (Number(code) === OnePass.RESULT_CODES['700000']) {
            props.onCancle && props.onCancle();
          } else {
            props.onFail({ from: 'ali auto login onTokenFailed', data });
            await OnePass.hideLoginLoading();
            await OnePass.quitLoginPage();
          }
        } catch (error) {
          props.onFail({ from: 'ali auto login onTokenFailed', error });
          await OnePass.hideLoginLoading();
          await OnePass.quitLoginPage();
        }
      })
    ];
  };
  const showLogin = async () => {
    await OnePass.setUIConfig(props.autoLoginUIConfig);
    await OnePass.onePass();
  };
  useEffect(() => {
    let listeners: OnePass.Listener[] = [];
    (async () => {
      await init();
      listeners = addListeners();
      await showLogin();
    })();
    return () => {
      listeners.forEach(item => item.remove());
    }
  }, []);
  return null;
};
