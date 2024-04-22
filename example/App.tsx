import { StyleSheet, Text, View } from 'react-native';

import { LoginScreen } from "react-native-fusion-login-page";

export default function App() {
  return <LoginScreen
    onSendCode={() => { }}
    onLogin={(phone, code) => { console.log(phone, code) }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
