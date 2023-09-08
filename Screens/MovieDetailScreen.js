import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
  Alert,
  Modal,
  Pressable,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import YoutubeIframe from "react-native-youtube-iframe";
import YoutubePlayer from "react-native-youtube-iframe";
import IconLabel from "../Component/UI/IconLabel";
import About from "../Component/MovieDetail/About";
import Reviews from "../Component/MovieDetail/Reviews";
import Cast from "../Component/MovieDetail/Cast";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { GlobalColor } from "../Color/colors";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import IconButton from "../Component/UI/IconButton";
import {
  addMovieWatchList,
  addRatingMovie,
  deleteMovieWatchList,
  getTrailerOfMovie,
} from "../Services/httpService";
import Slider from "@react-native-community/slider";
import BookSeatScreen from "./BookSeatScreen";
import {
  addMovieToWatchList,
  deleteMovieInWatchList,
  fetchWatchList,
} from "../util/firebase";
import { AuthContext } from "../Store/authContext";
const Tab = createMaterialTopTabNavigator();
function MovieDetailScreen({ navigation, route }) {
  console.log("MovieDetailScreen");
  const [movieDetail, setMovieDetail] = useState({});
  const [youtubeKey, setYoutubeKey] = useState("");
  const [reviews, setReviews] = useState([]);
  const [casts, setCasts] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(0.5);

  const authCtx = useContext(AuthContext);
  async function onLikeHandler() {
    setIsLike(!isLike);
    // await addMovieWatchList(movieDetail.id);
    let response;
    try {
      if (!isLike) {
        console.log("like");

        await addMovieWatchList(route.params.movieDetail.id);
        addMovieToWatchList(authCtx.uid, route.params.movieDetail.id);
        setIsLike(true);
      } else {
        try {
          console.log("unlike");
          await deleteMovieWatchList(route.params.movieDetail.id);
          deleteMovieInWatchList(authCtx.uid, route.params.movieDetail.id);
          if (navigation.getParent("watchLists")) {
            navigation.goBack();
          }
          setIsLike(false);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }

    // Alert.alert("Message", response);
  }

  useLayoutEffect(() => {
    function isInWatchList(movieId, watchList) {
      if (watchList.length > 0) {
        return watchList.find((movie) => {
          return movie.id === movieId;
        })
          ? true
          : false;
      }
      console.log(0);

      return false;
    }
    async function getWatchList() {
      console.log("Get Watch List");
      try {
        // const watchLists = await getMovieWatchList();
        await fetchWatchList(authCtx.uid).then((response) => {
          setIsLike(isInWatchList(route?.params?.movieDetail?.id, response));
        });
      } catch (error) {}
    }
    getWatchList();
  }, []);

  useLayoutEffect(() => {
    try {
      if (route !== null) {
        if (route?.params?.movieDetail) {
          setMovieDetail(route.params.movieDetail);
          console.log(route.params.movieDetail.genres[0].name);
        }
        if (route?.params?.reviews) {
          setReviews(route.params.reviews);
        }
        if (route?.params?.casts) {
          setCasts(route.params.casts);
        }
        if (route?.params?.youtubeKey) {
          setYoutubeKey(route.params.youtubeKey);
        }
        // if (route.params.isWatchList != null) {
        //   if (!route.params.isWatchList) {
        //   } else {
        //     setIsLike(route.params.isWatchList);
        //   }
        // }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          color={!isLike ? tintColor : "yellow"}
          icon="bookmark"
          size={24}
          onPress={onLikeHandler}
        />
        // <Ionicons
        //   name="bookmark"
        //   size={24}
        //   // color={!isLike ? tintColor : "yellow"}
        //   onPress={onLikeHandler}
        // />
      ),
    });
  }, [isLike]);
  function Abouts({ route }) {
    console.log("Abouts");
    return <About overview={movieDetail?.overview}></About>;
  }
  function Reviewss() {
    console.log("Reviews");

    return (
      <View style={styles.reviewList}>
        <Reviews reviews={reviews}></Reviews>
      </View>
    );
  }
  function Casts() {
    console.log("Casts");

    return (
      <View style={styles.castList}>
        <Cast casts={casts}></Cast>
      </View>
    );
  }

  function valueChangeHandler(ratingValue) {
    setRatingValue(ratingValue);
  }
  async function ratingHandler() {
    setModalVisible(false);
    await addRatingMovie(route.params.movieDetail.id, ratingValue);
    Alert.alert("Success!");
  }

  function hideTicketBookingModel() {
    setBookModalVisible(false);
    Alert.alert("Success!", "Please check information in your ticket boxes");
  }

  function bookingTicketHandler() {}
  return (
    <View style={styles.root}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
        style={styles.modal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.close}>
              <Ionicons
                name="close-outline"
                size={40}
                color="gray"
                onPress={() => setModalVisible(false)}
              />
            </View>
            <View style={styles.action}>
              <Text style={styles.modalText}>Rate this movie</Text>
              <Text style={styles.rateText}>{ratingValue.toFixed(1)}</Text>
              <View style={styles.sliderBar}>
                <Slider
                  minimumValue={0}
                  maximumValue={5.0}
                  lowerLimit={0.5}
                  step={0.5}
                  value={ratingValue}
                  minimumTrackTintColor="orange"
                  onValueChange={valueChangeHandler}
                />
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={ratingHandler}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={bookModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setBookModalVisible(!bookModalVisible);
        }}
        style={styles.modal}
      >
        <View style={styles.bookCenteredView}>
          <View style={styles.bookModalView}>
            <View style={styles.background}>
              <ImageBackground
                source={{
                  uri:
                    "https://image.tmdb.org/t/p/w500" +
                    route.params.movieDetail.poster_path,
                }}
                imageStyle={{ borderRadius: 20 }}
                style={styles.imageBG}
              >
                <LinearGradient
                  colors={["#0000001a", "#000000"]}
                  style={styles.linearGradient}
                >
                  <View style={styles.close1}>
                    <Ionicons
                      name="close-outline"
                      size={40}
                      color="white"
                      style={styles.icon}
                      onPress={() => setBookModalVisible(false)}
                    />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>
            {/* <ScrollView style={styles.action}></ScrollView> */}
            <View style={styles.action}>
              <View style={styles.bookSeatScreen}>
                <BookSeatScreen
                  movieDetail={route.params.movieDetail}
                  hideModal={hideTicketBookingModel}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={styles.video}>
          <YoutubePlayer
            webViewStyle={{
              borderRadius: 10,
              overflow: "hidden",
            }}
            height={240}
            videoId={youtubeKey}
          />
        </View>
        <View style={styles.titleContainer}>
          <View style={styles.iconLabel}>
            <Pressable onPress={() => setModalVisible(true)}>
              <IconLabel
                icon="ios-star-outline"
                size={20}
                color={"orange"}
                title={"9.2"}
              />
            </Pressable>
          </View>
          <Text style={styles.title}>{movieDetail?.title}</Text>

          <View style={styles.iconLabel}>
            <Pressable onPress={() => setBookModalVisible(true)}>
              <IconLabel
                icon="ios-basket-outline"
                size={20}
                color={"yellow"}
                title={"Ticket"}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.info}>
          <IconLabel
            icon="calendar-outline"
            size={20}
            color={"#92929D"}
            title={movieDetail?.release_date}
          />
          <Text style={{ color: "#92929D" }}>|</Text>
          <IconLabel
            icon="time-outline"
            size={20}
            color={"#92929D"}
            title={movieDetail?.runtime + " minutes"}
          />
          <Text style={{ color: "#606664" }}>|</Text>
          <IconLabel
            icon="md-pricetags-outline"
            size={20}
            color={"#92929D"}
            title={
              Object.hasOwn(route.params.movieDetail, "genres")
                ? route.params.movieDetail.genres[0].name
                : route.params.movieDetail.categories[0]?.name
            }
          />
        </View>
        <View style={styles.navigateContainer}>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 14,
              },
              tabBarAllowFontScaling: true,
              tabBarInactiveTintColor: "#c8c0c0",
              tabBarActiveTintColor: GlobalColor.icon_active,
              tabBarIndicatorStyle: {
                borderBottomWidth: 1,
                borderColor: GlobalColor.icon_active,
              },
            }}
          >
            <Tab.Screen
              name="About"
              component={About}
              initialParams={{ movie: route?.params?.movieDetail }}
            />
            <Tab.Screen
              name="Reviews"
              component={Reviews}
              initialParams={{ reviews: route?.params?.reviews }}
            />
            <Tab.Screen
              name="Cast"
              component={Cast}
              initialParams={{ casts: route?.params?.casts }}
            />
          </Tab.Navigator>
        </View>
      </View>
    </View>
  );
}
export default MovieDetailScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  labelContainer: {
    flex: 1,
  },
  video: {
    width: "100%",
  },
  image: {
    width: 110,
    height: 180,
    borderRadius: 15,
    marginEnd: 10,
    borderColor: "#606664",
    borderWidth: 1,
  },
  titleContainer: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  title: {
    width: "50%",
    color: "white",
    fontSize: 20.5,
    marginLeft: 5,
    marginTop: 5,
    textAlign: "center",
  },
  iconLabel: {
    width: 80,
    marginTop: 10,
    backgroundColor: "#35363E",
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.5,
  },
  info: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  navigateContainer: {
    flex: 1,
  },
  reviewList: {
    paddingHorizontal: 10,
  },
  castList: {
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bookCenteredView: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 20,
  },
  bookModalView: {
    height: "95%",
    backgroundColor: GlobalColor.background,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal: {
    flex: 1,
  },
  close: {
    padding: 5,
    alignItems: "flex-end",
  },
  close1: {
    marginEnd: 10,
    marginTop: 10,
    width: 46,
    height: 46,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: "red",
  },
  icon: {
    borderRadius: 10,
  },
  action: {
    alignItems: "center",

    // marginTop: -25,
  },
  button: {
    backgroundColor: "#149eee",
    height: 40,
    width: 150,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rateText: {
    fontSize: 34,
    color: "#4E4B66",
  },
  modalText: {
    fontSize: 24,
    color: "#4E4B66",
    fontWeight: "300",
    paddingBottom: 5,
  },
  sliderBar: {
    width: "80%",
    paddingVertical: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    height: "30%",
  },
  imageBG: {
    width: "100%",
    aspectRatio: 3072 / 1727,
    borderRadius: 20,
  },
  linearGradient: {
    height: "100%",
  },
  bookSeatScreen: {
    paddingVertical: 20,
  },
  button1: {
    backgroundColor: "#ef1026",
    height: 40,
    width: 150,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    borderRadius: 20,
  },
});
