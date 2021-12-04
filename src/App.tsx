/**
 * @format
 */

import React, {useCallback, useEffect} from 'react';
import {
  NativeAppEventEmitter,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Button, Provider} from '@ant-design/react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BleManager from 'react-native-ble-manager';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const handleDiscoverPeripheral = useCallback(data => {
    console.log(data);
  }, []);

  useEffect(() => {
    NativeAppEventEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
  }, [handleDiscoverPeripheral]);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Provider>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Button
              type="primary"
              onPress={() => {
                BleManager.start({showAlert: false})
                  .then(() => {
                    console.log('Module initialized');
                  })
                  .catch(console.error);
              }}>
              Start
            </Button>
            <View style={styles.gap} />
            <Button
              type="primary"
              onPress={() => {
                BleManager.scan([], 5, true)
                  .then(res => {
                    // Success code
                    console.log('Scan started', res);
                  })
                  .catch(console.error);
              }}>
              Scan
            </Button>
          </View>
        </Provider>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  gap: {
    height: 40,
  },
});

export default App;
