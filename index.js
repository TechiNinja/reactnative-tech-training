/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';
import "react-native-url-polyfill/auto";

enableScreens();

AppRegistry.registerComponent(appName, () => App);
