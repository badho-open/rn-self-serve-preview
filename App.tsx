import React from 'react';
import codePush from 'react-native-code-push';
import AppNavigator from './navigation';

function App(): React.JSX.Element {
  return <AppNavigator />;
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

export default codePush(codePushOptions)(App);
