import { StyleSheet, Text, View } from 'react-native';

import * as ReactNativeFusionLoginPage from 'react-native-fusion-login-page';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeFusionLoginPage.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
