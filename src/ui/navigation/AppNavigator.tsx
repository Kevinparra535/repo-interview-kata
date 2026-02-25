import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import HomeScreen from '@/ui/screens/Home/HomeScreen';
import TaskDetailScreen from '@/ui/screens/TaskDetail/TaskDetailScreen';
import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tasks', headerShown: false }} />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={({ navigation }) => ({
            title: 'Task',
            headerStyle: styles.header,
            headerShadowVisible: false,
            headerTitleStyle: {
              ...Fonts.header2,
              color: Colors.mode.light.textPrimary,
            },
            headerLeft: () => (
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <Feather name="chevron-left" size={20} color={Colors.mode.light.textPrimary} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                  <Feather name="share" size={18} color={Colors.mode.light.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                  <Feather name="more-vertical" size={18} color={Colors.mode.light.textPrimary} />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.mode.light.bgPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.sm - 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.mode.light.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
