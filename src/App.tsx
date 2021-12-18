import React, {useContext} from 'react'
import {Text, useColorScheme} from 'react-native'
import {Button} from '@ant-design/react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator, NativeStackHeaderProps} from '@react-navigation/native-stack'

// USE CONTEXT as global state management
const Stack = createNativeStackNavigator()

const HomeScreen = ({navigation}: NativeStackHeaderProps) => {
  return (
    <Button onPress={() => navigation.navigate('Profile', {name: 'Jane'})}>
      Go to Jane's profile
    </Button>
  )
}
const ProfileScreen = ({navigation, route}: NativeStackHeaderProps) => {
  return <Text>This is {route?.params?.name}'s profile</Text>
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Welcome'}} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
