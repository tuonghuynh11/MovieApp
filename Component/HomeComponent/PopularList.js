import { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import {
  getCastOfMovie,
  getMovieDetailById,
  getMovieWatchList,
  getNowPlayingMovies,
  getPopularMovies,
  getReviewsOfMovie,
  getTopRatedMovies,
  getTrailerOfMovie,
} from "../../Services/httpService";
import MovieItem from "../MovieDetail/MovieItem";
import { useNavigation } from "@react-navigation/native";

function PopularList() {
  const navigation = useNavigation();
  const [popularMovies, setPopularMovies] = useState([]);

  const [watchList, setWatchList] = useState([]);
  // useEffect(() => {
  //   async function getWatchList() {
  //     try {
  //       const watchLists = await getMovieWatchList();
  //       setWatchList(watchLists);
  //     } catch (error) {}
  //   }
  //   getWatchList();
  // }, [watchList]);

  useEffect(() => {
    navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();
      navigation.jumpTo("Popular");
      // Do something manually
      // ...
      async function getWatchList() {
        try {
          const watchLists = await getMovieWatchList();
          setWatchList(watchLists);
        } catch (error) {}
      }
      getWatchList();
    });
  }, [navigation]);
  useEffect(() => {
    async function fetchPopularMovies() {
      const movies = await getPopularMovies();
      setPopularMovies(movies);
    }
    fetchPopularMovies();
  }, []);

  function isInWatchList(movieId) {
    if (watchList.length > 0) {
      return watchList.find((movie) => {
        return movie.id === movieId;
      })
        ? true
        : false;
    }
  }

  async function movieHandler(movieID) {
    console.log("click");
    try {
      const movieDetail = await getMovieDetailById(movieID)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          //console.log(error);
          return null;
        });
      const reviews = await getReviewsOfMovie(movieID)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          //console.log(error);
          return null;
        });
      const casts = await getCastOfMovie(movieID)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          //console.log(error);
          return null;
        });
      const trailerId = await getTrailerOfMovie(movieID)
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
        isWatchList: isInWatchList(movieID),
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <FlatList
      style={styles.moviesListNew}
      data={popularMovies}
      initialNumToRender={15}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <MovieItem
          onPressed={movieHandler.bind(this, itemData.item.id)}
          imageUri={itemData.item.backdrop_path}
          index={itemData.index}
          isTop={0}
          style={{
            width: 100,
            height: 120,
            marginBottom: 0,
          }}
          rootStyle={{
            width: 100,
            height: 120,
            marginBottom: 0,
            margin: 10,
          }}
        />
      )}
      numColumns="3"
    />
  );
}
export default PopularList;
const styles = StyleSheet.create({
  moviesListNew: {
    alignSelf: "center",
  },
});
