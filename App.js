import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
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
import TicketsScreen from "./Screens/TicketScreen";
import { Entypo } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { init } from "./util/database";
import LoginScreen from "./Screens/LoginScreen";
import SignupScreen from "./Screens/SignupScreen";
import AuthContextProvider, { AuthContext } from "./Store/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "./Component/UI/Loading";
const Stack = createNativeStackNavigator();

const BottomTab = createBottomTabNavigator();
export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (!dbInitialized) {
    return <Text />;
  }

  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: GlobalColor.background,
          },

          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Log In",
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            title: "Sign Up",
          }}
        />
      </Stack.Navigator>
    );
  }

  function AuthenticatedStack() {
    const authCtx = useContext(AuthContext);

    return (
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
            headerShown: true,
            title: "Home",
            headerTitle: "What do you want to watch?",
            headerTitleStyle: {
              fontSize: 23,
              color: "white",
            },
            headerTitleAlign: "left",
            headerRight: ({ tintColor }) => (
              <Ionicons
                onPress={() => {
                  authCtx.logout();
                  console.log(authCtx.isAuthenticated);
                }}
                style={{
                  marginRight: 10,
                }}
                name="log-in-outline"
                size={30}
                color="white"
              />
            ),
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
        <BottomTab.Screen
          name="TicketsScreen"
          component={TicketsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Entypo name="ticket" size={24} color={color} />
            ),
            headerShown: false,
            title: "My Tickets",
          }}
        />
      </BottomTab.Navigator>
    );
  }

  function Navigation() {
    const authCtx = useContext(AuthContext);

    return (
      <NavigationContainer
        style={styles.container}
        theme={{
          colors: {
            backgroundColor: GlobalColor.background,
            background: GlobalColor.background,
          },
        }}
      >
        {authCtx.isAuthenticated && <AuthenticatedStack />}
        {!authCtx.isAuthenticated && <AuthStack />}
      </NavigationContainer>
    );
  }
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

  function Root() {
    const [isTryLoading, setIsTryLoading] = useState(true);
    const authCtx = useContext(AuthContext);
    useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUid = await AsyncStorage.getItem("uid");
        if (storedToken) {
          authCtx.authenticate(storedToken, storedUid);
        }
        setIsTryLoading(false);
      }
      fetchToken();
    }, []);
    if (isTryLoading) {
      return <Loading />;
    }
    return <Navigation />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
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
