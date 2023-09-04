import { FlatList } from "react-native";
import MovieSearchItem from "./MovieSearchItem";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getMovieWatchList } from "../../Services/httpService";

function MoviesSearchList({ data, navigations, isWatchList = false }) {
  const [watchList, setWatchList] = useState([]);
  useEffect(() => {
    async function getWatchList() {
      try {
        const watchLists = await getMovieWatchList();
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
  function movieDetailHandler(movieDetail, reviews, casts, youtubeKey) {
    let navigateName = "";
    if (navigation.getParent("home")) {
      navigateName = "MovieDetailHomeScreen";
    } else if (navigation.getParent("search")) {
      navigateName = "MovieDetailSearchScreen";
    } else {
      navigateName = "MovieDetail";
    }
    navigation.navigate(navigateName, {
      movieDetail: movieDetail,
      reviews: reviews,
      casts: casts,
      youtubeKey: youtubeKey,
      isWatchList: isWatchList ? true : isInWatchList(movieDetail.id),
    });
  }
  function renderMovie(itemData) {
    return (
      <MovieSearchItem movie={itemData.item} onPressed={movieDetailHandler} />
    );
  }
  return (
    <FlatList
      initialNumToRender={5}
      keyExtractor={(item) => item.id}
      data={data}
      renderItem={renderMovie}
    />
  );
}
export default MoviesSearchList;
