import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ReactNativeFusionLoginPageViewProps } from './ReactNativeFusionLoginPage.types';

const NativeView: React.ComponentType<ReactNativeFusionLoginPageViewProps> =
  requireNativeViewManager('ReactNativeFusionLoginPage');

export default function ReactNativeFusionLoginPageView(props: ReactNativeFusionLoginPageViewProps) {
  return <NativeView {...props} />;
}
