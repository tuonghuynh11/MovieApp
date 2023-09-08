import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, FlatList, Text, Keyboard } from "react-native";
import SearchBox from "../Component/UI/SearchBox";
import MovieSearchItem from "../Component/MovieDetail/MovieSearchItem";
import {
  getMovieDetailById,
  getPopularMovies,
  getTopRatedMovies,
  searchMovies,
} from "../Services/httpService";
import { Movie } from "../Model/Movie";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import SearchError from "../Component/UI/SearchError";
import MoviesSearchList from "../Component/MovieDetail/MoviesSearchList";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import Loading from "../Component/UI/Loading";
import { useSharedValue } from "react-native-reanimated";

function SearchScreen({ navigation, route }) {
  console.log("SearchScreen");
  const [movies, setMovies] = useState([]);
  const [searchKeys, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <Ionicons
          name="ios-information-circle-outline"
          size={24}
          color={"white"}
          style={{
            marginRight: 10,
          }}
        />
      ),
    });
  }, []);

  // const searchMovie = useCallback(
  //   (movies, text) => {
  //     setIsLoading(1);
  //     setMovies(movies);
  //     setSearchKey(text);
  //     setIsLoading(0);
  //     setCurrentPage(1);
  //   },
  //   [movies]
  // );

  async function searchMovie(text) {
    if (text.trim() === "") {
      Alert.alert("Warning", "You need to enter a movie name");
      return;
    }
    try {
      Keyboard.dismiss();
      setIsLoading(1);
      await searchMovies(text)
        .then((response) => {
          setMovies(response.movies);
          setTotalPage(response.totalPage);
        })
        .catch((error) => {
          console.log(error);
        });
      setIsLoading(0);
    } catch (error) {
      console.log(error);
      setIsLoading(0);
    }
  }
  useEffect(() => {
    async function searchHandler(searchMovieName) {
      try {
        setIsLoading(1);

        await searchMovies(searchMovieName).then((response) => {
          // console.log(response);
          // const movieWrapper = response.map((item) => {
          //   return new Movie(
          //     item?.id,
          //     item?.title,
          //     item?.overview,
          //     null,
          //     item?.vote_average,
          //     item?.poster_path,
          //     item?.release_date,
          //     [...item?.genre_ids]
          //   );
          // });
          setMovies(response.movies);
          setTotalPage(response.totalPage);

          setIsLoading(0);
        });
      } catch (error) {
        console.log(error);
        setIsLoading(0);
      }
      // await searchMovies(searchMovieName).then((response) => {
      //   setIsLoading(0);
      //   console.log(response);
      //   setMovies(response);
      // });
    }
    if (route !== null) {
      if (route?.params?.searchKey) {
        setSearchKey(route.params.searchKey);
        searchHandler(route.params.searchKey);
        return;
      }
    }
    console.log("SearchingKey");
    searchHandler("Avengers");
    setSearchKey("Avengers");
  }, [route?.params?.searchKey]);

  function onLoadMoreHandler() {
    console.log("onLoadMoreHandler");
    if (currentPage + 1 > totalPage) {
      return;
    }
    setCurrentPage((currentPage) => currentPage + 1);

    async function searchHandler(searchMovieName, currentPage) {
      try {
        await searchMovies(searchMovieName, currentPage).then((response) => {
          setMovies((curr) => movies.concat(response.movies));
        });
      } catch (error) {
        console.log(error);
      }
    }
    console.log(currentPage + 1);
    searchHandler(searchKeys, currentPage + 1);
  }

  return (
    <View style={styles.root}>
      <SearchBox searchFunc={searchMovie} initValue={searchKeys} />
      <View style={styles.container}>
        {/* {movies ? <MoviesSearchList data={movies} /> : <SearchError />} */}
        {isLoading === 1 ? (
          <Loading message="Please wait....." />
        ) : movies.length === 0 ? (
          <SearchError />
        ) : (
          <MoviesSearchList
            data={movies}
            navigations={navigation}
            handleLoadMore={onLoadMoreHandler}
          />
        )}
      </View>
    </View>
  );
  // return <Text>Search Screen</Text>;
}
export default SearchScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
});
