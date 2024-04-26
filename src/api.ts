/* eslint-disable prettier/prettier */
import { btoa, atob } from 'react-native-quick-base64';
import CryptoJS from 'crypto-js';

export const getToken = async (client_id: string, client_secret: string): Promise<string> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "useJwt": 0,
    "grant_type": "client_credentials",
    client_id,
    client_secret
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const response = await fetch("https://connect-drcn.dbankcloud.cn/agc/apigw/oauth2/v1/token", requestOptions)
  const access_token = (await response.json()).access_token;
  return access_token;
};

export const sendCode = async (client_id: string, productId: string, token: string, phone: string) => {
  const myHeaders = new Headers();
  myHeaders.append("client_id", client_id);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    "phone": `+86-${phone}`,
    "action": "1001",
    "sendInterval": 30,
    "lang": "zh_CN"
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const response = await fetch(`https://connect-drcn.dbankcloud.cn/agc/apigw/oauth2/third/v1/verify-code?productId=${productId}`, requestOptions);
  return response.json();
};

export const signIn = async (client_id: string, productId: string, token: string, phone: string, code: string) => {
  const myHeaders = new Headers();
  myHeaders.append("client_id", client_id);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    "provider": 11,
    "token": `+86-${phone}`,
    "extraData": `{"verifyCode":"${code}"}`,
    "autoCreateUser": 1
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const response = await fetch(`https://connect-drcn.dbankcloud.cn/agc/apigw/oauth2/third/v1/user-signin?productId=${productId}`, requestOptions);
  const responseJson = await response.json();
  const hwtoken = responseJson.accessToken?.token;
  const uid = responseJson.userInfo?.uid;
  const hwphone = responseJson.userInfo?.phone;
  return { token: hwtoken, uid, phone: hwphone };
};

export const getJwtByAliToken = async (api: string, token: string) => {
  const requestOptions = { method: "GET" };
  const response = await fetch(`${api}?token=${token}`, requestOptions)
  return (await response.json())?.data?.access_token;
};

const generateTokenForHwJwt = (info: any) => {
  const { token, uid, phone, jwtApiKeyForHw, jwtApiIvForHw } = info;
  console.log('info:', info);
  const str = btoa(`${phone}|${uid}|${token}`).split('').reverse().join('');
  console.log('str:', str);
  const key = CryptoJS.enc.Utf8.parse(jwtApiKeyForHw);
  const iv = CryptoJS.enc.Utf8.parse(jwtApiIvForHw);
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encrypted;
};

export const getJwtByHwToken = async (api: string, info: any) => {
  const token = generateTokenForHwJwt(info);
  console.log('token for hw jwt:', token);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({ token });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const response = await fetch(`${api}`, requestOptions);
  return (await response.json())?.data?.access_token;
};
