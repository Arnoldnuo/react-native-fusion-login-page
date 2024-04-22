/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from "react-native";
import { useCountdown } from "usehooks-ts";
import { TextField, Button, View, Text } from 'react-native-ui-lib';

export interface LoginScreenProps {
  style?: StyleProp<ViewStyle>
  onSendCode: any
  onLogin: any
}

export const LoginScreen = (props: LoginScreenProps) => {
  const countStart = 10;
  const [number, countdownCtrl] = useCountdown({ countStart, countStop: 0 });
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const checkPhone = (phone: string) => /^1[0-9]{10}$/.test(phone);
  const checkCode = (code: string) => code.length >= 4;
  const [isCounting, setIsCounting] = useState(false);
  useEffect(() => {
    if (number === 0) {
      setIsCounting(false);
    }
  }, [number]);

  const onSendCodePress = (phone: string) => {
    console.log(phone);
    props.onSendCode(phone);
    countdownCtrl.resetCountdown();
    countdownCtrl.startCountdown();
    setIsCounting(true);
  };

  return (
    <View marginT-100 paddingH-20>
      <Text text60M marginB-30>手机快捷登录</Text>
      <TextField
        placeholder={'请输入手机号'}
        preset='default'
        // floatingPlaceholder
        onChangeText={setPhone}
        validate={['required', (value: string) => checkPhone(value)]}
        validationMessage={['请输入手机号', '请输入有效的手机号']}
        enableErrors={false}
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
        onPress={() => props.onLogin(phone, code)}
      />
    </View>
  );

};
