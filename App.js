import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, View } from "react-native";
import { getNowPlayingMovies } from "./Services/httpService";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import WatchListScreen from "./Screens/WatchListScreen";
import MovieDetailScreen from "./Screens/MovieDetailScreen";
import HomeScreen from "./Screens/HomeScreen";
import SearchScreen from "./Screens/SearchScreen";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColor } from "./Color/colors";
import SearchScreenReplace from "./util/SearchScreenReplace";

const Stack = createNativeStackNavigator();

const BottomTab = createBottomTabNavigator();
export default function App() {
  function Home({ navigation }) {
    return (
      <Stack.Navigator
        id="home"
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: GlobalColor.background,
          },

          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="mainScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="searchHomeScreen"
          component={SearchScreen}
          options={{
            title: "Search",
          }}
        />
        <Stack.Screen
          name="MovieDetailHomeScreen"
          component={MovieDetailScreen}
          options={{
            title: "Movie Detail",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    );
  }
  function Search() {
    return (
      <Stack.Navigator
        id="search"
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: GlobalColor.background,
          },

          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="searchScreen"
          component={SearchScreen}
          options={{
            title: "Search",
          }}
        />
        <Stack.Screen
          name="MovieDetailSearchScreen"
          component={MovieDetailScreen}
          options={{
            title: "Movie Detail",
          }}
        />
      </Stack.Navigator>
    );
  }

  function WatchList() {
    return (
      <Stack.Navigator
        id="watchLists"
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: GlobalColor.background,
          },

          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="watchList"
          component={WatchListScreen}
          options={{
            title: "Watch List",
          }}
        />
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{
            title: "Movie Detail",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer
        style={styles.container}
        theme={{
          colors: {
            backgroundColor: GlobalColor.background,
            background: GlobalColor.background,
          },
        }}
      >
        <BottomTab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: GlobalColor.background,
            },
            tabBarActiveTintColor: GlobalColor.icon_active,
            tabBarInactiveTintColor: GlobalColor.icon_non_active,
            headerTitleStyle: {
              color: "white",
            },
          }}
        >
          <BottomTab.Screen
            name="HomeScreen"
            component={Home}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="ios-home-outline" size={24} color={color} />
              ),
              headerShown: false,
              title: "Home",
            }}
          />
          <BottomTab.Screen
            name="SearchScreen"
            component={SearchScreenReplace}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="search-outline" size={24} color={color} />
              ),
              headerShown: false,
              title: "Search",
            }}
          />
          <BottomTab.Screen
            name="WatchListScreen"
            component={WatchList}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="bookmark-outline" size={24} color={color} />
              ),
              headerShown: false,
              title: "Watch List",
            }}
          />
        </BottomTab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GlobalColor.background,
  },
});
