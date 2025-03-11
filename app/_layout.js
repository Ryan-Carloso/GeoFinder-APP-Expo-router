import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name='index' 
        options={{ 
          title: 'Home',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name='screens/Find/index' 
        options={{ 
          title: 'Find Location', 
        }} 
      />

      <Stack.Screen 
        name='screens/catch/index' 
        options={{ 
          title: 'Generate Code', 
        }} 
      />
      <Stack.Screen 
        name='screens/tutorial/index' 
        options={{ 
          title: 'Tutorial', 
        }} 
      />
    </Stack>
  );
}
