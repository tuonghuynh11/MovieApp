import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MoviesSearchList from "../Component/MovieDetail/MoviesSearchList";
import { getMovieWatchList } from "../Services/httpService";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import EmptyWatchList from "../Component/UI/EmptyWatchList";

function WatchListScreen({ navigation }) {
  const [movieWatchList, setMovieWatchList] = useState([]);
  const isFocus = useIsFocused();

  // async function getWatchList() {
  //   try {
  //     const watchList = await getMovieWatchList();
  //     if (movieWatchList.length === 0 || data.length != movieWatchList.length) {
  //       console.log("load");
  //       setMovieWatchList(watchList);
  //     }
  //     // loadData(watchList);
  //   } catch (error) {}
  // }
  useEffect(() => {
    if (isFocus) {
      async function getWatchList() {
        try {
          const watchList = await getMovieWatchList();
          console.log("watchList", watchList.length);
          console.log("movieWatchList", movieWatchList.length);

          setMovieWatchList(watchList);
          // loadData(watchList);
        } catch (error) {}
      }
      getWatchList();
    }
  }, [isFocus]);

  // async function getWatchList() {
  //   try {
  //     const watchList = await getMovieWatchList();
  //     console.log("watchList", watchList.length);
  //     console.log("movieWatchList", movieWatchList.length);
  //     if (movieWatchList.length === 0 || data.length != movieWatchList.length) {
  //       console.log("load");
  //       setMovieWatchList(watchList);
  //     }
  //     // loadData(watchList);
  //   } catch (error) {}
  // }

  return movieWatchList.length === 0 ? (
    <EmptyWatchList style={styles.root} />
  ) : (
    <View style={styles.root}>
      <MoviesSearchList
        data={movieWatchList}
        isWatchList="true"
        navigations={navigation}
      />
    </View>
  );
}
export default WatchListScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },
});
