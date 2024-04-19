import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReactNativeFusionLoginPage.web.ts
// and on native platforms to ReactNativeFusionLoginPage.ts
import ReactNativeFusionLoginPageModule from './ReactNativeFusionLoginPageModule';
import ReactNativeFusionLoginPageView from './ReactNativeFusionLoginPageView';
import { ChangeEventPayload, ReactNativeFusionLoginPageViewProps } from './ReactNativeFusionLoginPage.types';

// Get the native constant value.
export const PI = ReactNativeFusionLoginPageModule.PI;

export function hello(): string {
  return ReactNativeFusionLoginPageModule.hello();
}

export async function setValueAsync(value: string) {
  return await ReactNativeFusionLoginPageModule.setValueAsync(value);
}

const emitter = new EventEmitter(ReactNativeFusionLoginPageModule ?? NativeModulesProxy.ReactNativeFusionLoginPage);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ReactNativeFusionLoginPageView, ReactNativeFusionLoginPageViewProps, ChangeEventPayload };
