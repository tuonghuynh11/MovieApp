import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, FlatList, Text } from "react-native";
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

function SearchScreen({ navigation, route }) {
  console.log("SearchScreen");

  const [movies, setMovies] = useState([]);
  const [searchKeys, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState();
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

  const searchMovie = useCallback(
    (movies) => {
      setIsLoading(1);
      setMovies(movies);
      setIsLoading(0);
    },
    [movies]
  );

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
          setMovies(response);
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
      if (route.params?.searchKey) {
        searchHandler(route.params.searchKey);
        setSearchKey(route.params.searchKey);
        return;
      }
    }
    searchHandler("Avengers");
  }, [searchKeys]);

  return (
    <View style={styles.root}>
      <SearchBox searchFunc={searchMovie} initValue={searchKeys} />
      <View style={styles.container}>
        {/* {movies ? <MoviesSearchList data={movies} /> : <SearchError />} */}
        {isLoading === 1 ? (
          <Loading />
        ) : movies.length === 0 ? (
          <SearchError />
        ) : (
          <MoviesSearchList data={movies} navigations={navigation} />
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
