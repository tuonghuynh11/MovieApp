import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import SearchBox from "../Component/UI/SearchBox";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  getCastOfMovie,
  getMovieDetailById,
  getMovieWatchList,
  getNowPlayingMovies,
  getPopularMovies,
  getReviewsOfMovie,
  getTopRatedMovies,
  getTrailerOfMovie,
  getUpcomingMovies,
} from "../Services/httpService";
import MovieItem from "../Component/MovieDetail/MovieItem";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColor } from "../Color/colors";
import Loading from "../Component/UI/Loading";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import NowPlayingList from "../Component/HomeComponent/NowPlayingList";
import UpcomingList from "../Component/HomeComponent/UpcomingList";
import TopRatedList from "../Component/HomeComponent/TopRatedList";
import PopularList from "../Component/HomeComponent/PopularList";

const Tab = createMaterialTopTabNavigator();
function HomeScreen({ navigation, route }) {
  const [watchList, setWatchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    console.log("WatchListHomeScreen");
    async function getWatchList() {
      try {
        const watchLists = await getMovieWatchList();
        setWatchList(watchLists);
      } catch (error) {}
    }
    getWatchList();
  }, [navigation]);
  function isInWatchList(movieId) {
    if (watchList.length > 0) {
      return watchList.find((movie) => {
        return movie.id === movieId;
      })
        ? true
        : false;
    }
    return false;
  }
  useEffect(() => {
    console.log("UpcomingMoviesHomeScreen");

    async function fetchUpcomingMovies() {
      try {
        const movies = await getUpcomingMovies();
        if (movies) {
          if (movies.length !== upcomingMovies.length) {
            setUpcomingMovies(movies);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUpcomingMovies();
  }, []);
  function renderMovieItem(itemData) {
    async function movieHandler() {
      console.log("click");
      setIsLoading(true);
      try {
        const movieDetail = await getMovieDetailById(itemData.item.id)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            //console.log(error);
            return null;
          });
        const reviews = await getReviewsOfMovie(itemData.item.id)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            //console.log(error);
            return null;
          });
        const casts = await getCastOfMovie(itemData.item.id)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            //console.log(error);
            return null;
          });
        const trailerId = await getTrailerOfMovie(itemData.item.id)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            //console.log(error);
            return null;
          });
        navigation.navigate("MovieDetailHomeScreen", {
          movieDetail: movieDetail,
          reviews: reviews,
          casts: casts,
          youtubeKey: trailerId,
          isWatchList: isInWatchList(itemData.item.id),
        });
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    return (
      <MovieItem
        imageUri={itemData.item.backdrop_path}
        index={itemData.index}
        isTop={1}
        onPressed={movieHandler}
      />
    );
  }
  async function searchHandler(response, textInput) {
    navigation.getParent("home").navigate("SearchScreen", {
      searchKey: textInput,
    });
    // navigation.navigate("searchHomeScreen", {
    //   searchKey: textInput,
    // });
  }
  return isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>What do you want to watch?</Text>
        <SearchBox
          searchFunc={searchHandler}
          navigationParent={route?.params?.navigationParent}
        />
        <FlatList
          style={styles.moviesList}
          horizontal
          keyExtractor={(item) => item.id}
          data={upcomingMovies}
          renderItem={renderMovieItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.navigateContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: 10,
            },
            tabBarAllowFontScaling: true,
            tabBarInactiveTintColor: "#c8c0c0",
            tabBarActiveTintColor: GlobalColor.icon_active,
            lazy: true,
            lazyPreloadDistance: 2,
          }}
        >
          <Tab.Screen
            name="NowPlaying"
            component={NowPlayingList}
            initialParams={{ watchList: watchList }}
          />
          <Tab.Screen name="Upcoming" component={UpcomingList} />
          <Tab.Screen name="Top Rated" component={TopRatedList} />
          <Tab.Screen name="Popular" component={PopularList} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: GlobalColor.background,
    shadowColor: GlobalColor.background,
  },
  container: {
    flex: 1.1,
    padding: 10,
  },
  navigateContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  moviesList: {
    paddingHorizontal: 5,
    paddingTop: 40,
  },
  moviesListNew: {
    alignSelf: "center",
  },
});
