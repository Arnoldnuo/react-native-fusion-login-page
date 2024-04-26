/* eslint-disable prettier/prettier */
// 华为云认证服务，发送验证码
import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleProp, ViewStyle } from "react-native";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { TextField, Button, View, Text, Incubator, Modal, Assets, NumberInput } from 'react-native-ui-lib';
import { useCountdown } from "usehooks-ts";
import { getToken, sendCode, signIn } from './api';

export interface LoginScreenProps {
  style?: StyleProp<ViewStyle>;
  onLogin: any;
  onCancle: any;
  client_id: string;
  client_secret: string;
  productId: string;
  jwtApiForHw?: string;
  onJWTGot?: any;
}

export const SmsLoginScreen = gestureHandlerRootHOC((props: LoginScreenProps) => {
  const { client_id, client_secret, productId } = props;
  const accessTokenRef = useRef('');
  const countStart = 30;
  const [number, countdownCtrl] = useCountdown({ countStart, countStop: 0 });
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const checkPhone = (phone: string) => /^1[0-9]{10}$/.test(phone);
  const checkCode = (code: string) => code.length >= 4;
  const [isCounting, setIsCounting] = useState(false);
  useEffect(() => {
    if (number === 0) {
      setIsCounting(false);
    }
  }, [number]);

  const onSendCodePress = async (phone: string) => {
    countdownCtrl.resetCountdown();
    countdownCtrl.startCountdown();
    setIsCounting(true);

    const access_token = await getToken(client_id, client_secret);
    accessTokenRef.current = access_token;
    await sendCode(client_id, productId, access_token, phone);
  };

  const onLogin = async () => {
    const { token, uid, phone: hwphone } = await signIn(client_id, productId, accessTokenRef.current, phone, code);
    if (token) {
      props.onLogin && props.onLogin('huawei', { token, uid, phone: hwphone });
    } else {
      setErr('验证码错误，请重试');
    }
  };

  return (
    <View paddingH-20>
      <Modal.TopBar
        title={'验证码登录'}
        onCancel={() => { props.onCancle && props.onCancle() }}
      />
      <TextField
        placeholder={'请输入手机号'}
        preset='default'
        // floatingPlaceholder
        onChangeText={setPhone}
        validate={['required', (value: string) => checkPhone(value)]}
        validationMessage={['请输入手机号', '请输入有效的手机号']}
        enableErrors={false}
        keyboardType='number-pad'
        marginT-50
        marginB-20
        trailingAccessory={<Button label={isCounting ? `${number}秒后重新获取` : '获取验证码'} link
          onPress={() => onSendCodePress(phone)}
          disabled={!checkPhone(phone) || isCounting}
        />}
      />
      <TextField
        placeholder={'请输入验证码'}
        preset='default'
        marginB-20
        // floatingPlaceholder
        onChangeText={setCode}
        validate={['required', (value: string) => value.length >= 4]}
        validationMessage={['请输入验证码', '请输入有效的验证码']}
        enableErrors={false}
      />
      <Button label='登录' disabled={!(checkPhone(phone) && checkCode(code))}
        onPress={onLogin}
      />
      <Incubator.Toast visible={!!err} position='top' message={err} autoDismiss={2000} onDismiss={() => { setErr('') }} />
    </View>
  );

});
