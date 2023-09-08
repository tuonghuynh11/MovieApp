import { ActivityIndicator, FlatList } from "react-native";
import MovieSearchItem from "./MovieSearchItem";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  getCastOfMovie,
  getMovieWatchList,
  getReviewsOfMovie,
  getTrailerOfMovie,
} from "../../Services/httpService";
import { AuthContext } from "../../Store/authContext";
import { fetchWatchList } from "../../util/firebase";
import { View, StyleSheet } from "react-native";

function MoviesSearchList({
  data,
  navigations,
  isWatchList = false,
  isLoading,
  handleLoadMore,
}) {
  const [watchList, setWatchList] = useState([]);
  const authCtx = useContext(AuthContext);
  console.log("MoviesSearchList");
  useEffect(() => {
    async function getWatchList() {
      try {
        // const watchLists = await getMovieWatchList();
        const watchLists = await fetchWatchList(authCtx.uid);
        setWatchList(watchLists);
      } catch (error) {}
    }
    getWatchList();
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
  // const navigation = useNavigation();
  // console.log(navigations.getParent("search"));
  const navigation = navigations;
  async function movieDetailHandler(movieDetail) {
    let navigateName = "";
    if (navigation.getParent("home")) {
      navigateName = "MovieDetailHomeScreen";
    } else if (navigation.getParent("search")) {
      navigateName = "MovieDetailSearchScreen";
    } else {
      navigateName = "MovieDetail";
    }
    async function getDatas() {
      const reviews = await getReviewsOfMovie(movieDetail.id)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          //console.log(error);
          return null;
        });
      const casts = await getCastOfMovie(movieDetail.id)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          //console.log(error);
          return null;
        });
      const youtubeKey = await getTrailerOfMovie(movieDetail.id)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          //console.log(error);
          return null;
        });
      navigation.navigate(navigateName, {
        movieDetail: movieDetail,
        reviews: reviews,
        casts: casts,
        youtubeKey: youtubeKey,
        isWatchList: isWatchList ? true : isInWatchList(movieDetail.id),
      });
    }
    await getDatas();

    // navigation.navigate(navigateName, {
    //   movieDetail: movieDetail,
    //   reviews: reviews,
    //   casts: casts,
    //   youtubeKey: youtubeKey,
    //   isWatchList: isWatchList ? true : isInWatchList(movieDetail.id),
    // });
  }
  // function renderMovie(itemData) {
  //   return (
  //     <MovieSearchItem movie={itemData.item} onPressed={movieDetailHandler} />
  //   );
  // }
  const renderMovie = useCallback(
    (itemData) => (
      <MovieSearchItem movie={itemData.item} onPressed={movieDetailHandler} />
    ),
    []
  );
  function renderFooter() {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  }

  return (
    <FlatList
      initialNumToRender={5}
      keyExtractor={(item, index) => index.toString()}
      data={data}
      renderItem={renderMovie}
      showsVerticalScrollIndicator="false"
      // ListFooterComponent={renderFooter}
      // onEndReachedThreshold={0}
      onEndReached={handleLoadMore}
      maxToRenderPerBatch={5}
    />
  );
}
export default MoviesSearchList;
const styles = StyleSheet.create({
  loader: {
    marginTop: 20,
    alignItems: "center",
  },
});
