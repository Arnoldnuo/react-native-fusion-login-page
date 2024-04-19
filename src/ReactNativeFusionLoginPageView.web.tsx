import * as React from 'react';

import { ReactNativeFusionLoginPageViewProps } from './ReactNativeFusionLoginPage.types';

export default function ReactNativeFusionLoginPageView(props: ReactNativeFusionLoginPageViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
