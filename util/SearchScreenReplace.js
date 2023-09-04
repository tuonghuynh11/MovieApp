import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalColor } from "../Color/colors";
import SearchScreen from "../Screens/SearchScreen";
import MovieDetailScreen from "../Screens/MovieDetailScreen";
const Stack = createNativeStackNavigator();
function SearchScreenReplace() {
  console.log("SearchScreenReplace");
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
export default SearchScreenReplace;
