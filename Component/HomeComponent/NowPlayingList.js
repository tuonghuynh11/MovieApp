import { useContext, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import {
  getCastOfMovie,
  getMovieDetailById,
  getMovieWatchList,
  getNowPlayingMovies,
  getReviewsOfMovie,
  getTrailerOfMovie,
} from "../../Services/httpService";
import MovieItem from "../MovieDetail/MovieItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Store/authContext";
import { fetchWatchList } from "../../util/firebase";
import Loading from "../UI/Loading";

function NowPlayingList({ route }) {
  const navigation = useNavigation();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // const isFocus = useIsFocused();

  console.log("NowPlayingList");
  // useEffect(() => {
  //   if (isFocus) {
  //     async function getWatchList() {
  //       try {
  //         const watchLists = await getMovieWatchList();
  //         setWatchList(watchLists);
  //       } catch (error) {}
  //     }
  //     getWatchList();
  //   }
  // }, []);

  useEffect(() => {
    navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();
      navigation.jumpTo("NowPlaying");
      // Do something manually
      // ...
      // async function getWatchList() {
      //   try {
      //     // const watchLists = await getMovieWatchList();
      //     const watchLists = await fetchWatchList(authCtx.uid);
      //     setWatchList(watchLists);
      //   } catch (error) {}
      // }
      // getWatchList();
    });
  }, [navigation]);

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
    async function fetchNowPlayingMovies() {
      setIsLoading(true);

      try {
        const movies = await getNowPlayingMovies();
        if (movies) {
          if (movies.length !== nowPlayingMovies.length) {
            setNowPlayingMovies(movies);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }

    fetchNowPlayingMovies();
  }, []);

  // function isInWatchList(movieId) {
  //   if (watchList.length > 0) {
  //     return watchList.find((movie) => {
  //       return movie.id === movieId;
  //     })
  //       ? true
  //       : false;
  //   }
  // }

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
        isWatchList: false,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return isLoading ? (
    <Loading />
  ) : (
    <FlatList
      style={styles.moviesListNew}
      data={nowPlayingMovies}
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
export default NowPlayingList;
const styles = StyleSheet.create({
  moviesListNew: {
    alignSelf: "center",
  },
});
