import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { GlobalColor } from "../../Color/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Pressable } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const threshold = -deviceHeight * 0.05;
function TicketItem({
  posterImage,
  dateTime,
  time,
  row,
  column,
  seats,
  onDelete,
}) {
  const dragY = useSharedValue(0);
  const isHide = useSharedValue(0);
  const panGesture = useAnimatedGestureHandler({
    onActive: (e) => {
      if (e.translationY > -93 && e.translationY < 0) {
        dragY.value = e.translationY;
      }
      console.log(e.translationY);
    },
    onEnd: (e) => {
      if (threshold < e.translationY) {
        dragY.value = withTiming(0);
      } else {
        // dragY.value = withTiming(-deviceHeight);
      }
    },
  });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: dragY.value,
        },
      ],
    };
  });

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(dragY.value < threshold ? 1 : 0);
    const bottom = isHide.value === 0 ? 40 : -200;
    return {
      opacity,
      bottom,
    };
  });

  return (
    // <View style={styles.root}>
    //   <ImageBackground
    //     source={{
    //       uri: "https://image.tmdb.org/t/p/w500/" + posterImage,
    //     }}
    //     style={styles.imageBG}
    //   >
    //     <LinearGradient
    //       colors={["#ff552400", "#FF5524"]}
    //       style={styles.linearGradient}
    //     />
    //   </ImageBackground>
    //   <View style={styles.footer}>
    //     <View style={styles.borderStyle}>
    //       <View style={styles.halfLeftCircle}></View>
    //       <View
    //         style={{
    //           borderStyle: "dashed",
    //           borderWidth: 2,
    //           borderColor: "orange",
    //           margin: -2,
    //           flex: 1,
    //           marginHorizontal: 1,
    //         }}
    //       ></View>
    //       <View style={styles.halfRightCircle}></View>
    //     </View>
    //     <View style={styles.dateTime}>
    //       <View style={styles.dateContainer}>
    //         <Text style={styles.date}>{dateTime.date}</Text>
    //         <Text style={styles.day}>{dateTime.day}</Text>
    //       </View>
    //       <View style={styles.timeContainer}>
    //         <Ionicons name="md-time-outline" size={25} color="white" />
    //         <Text style={styles.time}>{time}</Text>
    //       </View>
    //     </View>

    //     <View style={styles.moreTicketInfo}>
    //       <View style={styles.dateContainer}>
    //         <Text style={styles.date}>Hall</Text>
    //         <Text style={styles.day}>02</Text>
    //       </View>
    //       <View style={styles.dateContainer}>
    //         <Text style={styles.date}>Row</Text>
    //         <Text style={styles.day}>
    //           {row.length > 7 ? row.slice(0, 7) + "..." : row}
    //         </Text>
    //       </View>
    //       <View style={styles.dateContainer}>
    //         <Text style={styles.date}>Seats</Text>
    //         {/* <Text style={styles.day}>
    //           {seats.reduce((seatString, seat, index) => {
    //             if (index === this.length - 1) {
    //               seatString += "0" + seat.number;
    //             }
    //             seatString += "0" + seat.number + ", ";
    //           }, "")}
    //         </Text> */}
    //         <Text style={styles.day}>
    //           {" "}
    //           {seats.length > 7 ? seats.slice(0, 7) + "..." : seats}
    //         </Text>
    //       </View>
    //     </View>
    //     <View style={styles.imageContainer}>
    //       <Image
    //         source={require("../../icons/barcode.png")}
    //         style={styles.image}
    //       ></Image>
    //     </View>
    //   </View>
    // </View>
    <View style={styles.root}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableNativeFeedback
          onLongPress={() => {
            isHide.value = withTiming(0);

            dragY.value = withTiming(-93);
          }}
          onPress={() => {
            isHide.value = withTiming(1);
            dragY.value = withTiming(0);
          }}
        >
          <Animated.View style={[styles.root, rStyle]}>
            <ImageBackground
              source={{
                uri: "https://image.tmdb.org/t/p/w500/" + posterImage,
              }}
              style={styles.imageBG}
            >
              <LinearGradient
                colors={["#ff552400", "#FF5524"]}
                style={styles.linearGradient}
              />
            </ImageBackground>
            <View style={styles.footer}>
              <View style={styles.borderStyle}>
                <View style={styles.halfLeftCircle}></View>
                <View
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: "orange",
                    margin: -2,
                    flex: 1,
                    marginHorizontal: 1,
                  }}
                ></View>
                <View style={styles.halfRightCircle}></View>
              </View>
              <View style={styles.dateTime}>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>{dateTime.date}</Text>
                  <Text style={styles.day}>{dateTime.day}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Ionicons name="md-time-outline" size={25} color="white" />
                  <Text style={styles.time}>{time}</Text>
                </View>
              </View>

              <View style={styles.moreTicketInfo}>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>Hall</Text>
                  <Text style={styles.day}>02</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>Row</Text>
                  <Text style={styles.day}>
                    {row.length > 7 ? row.slice(0, 7) + "..." : row}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>Seats</Text>

                  <Text style={styles.day}>
                    {" "}
                    {seats.length > 7 ? seats.slice(0, 7) + "..." : seats}
                  </Text>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../icons/barcode.png")}
                  style={styles.image}
                ></Image>
              </View>
            </View>
          </Animated.View>
        </TouchableNativeFeedback>
      </GestureHandlerRootView>
      <Animated.View style={[styles.deleteIconContainer, rIconContainerStyle]}>
        <Ionicons
          name="ios-trash-bin"
          size={40}
          color="red"
          onPress={onDelete}
        />
      </Animated.View>
    </View>
  );
}

export default TicketItem;
const styles = StyleSheet.create({
  root: {
    height: "100%",
    paddingTop: 30,
    paddingBottom: 10,
    marginHorizontal: 20,
  },
  linearGradient: {
    height: "70%",
  },
  imageBG: {
    alignSelf: "center",
    width: 300,
    aspectRatio: 200 / 300,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  borderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfLeftCircle: {
    backgroundColor: GlobalColor.background,
    height: 70,
    width: 70,
    borderRadius: 35,
    marginLeft: -30,
  },
  halfRightCircle: {
    backgroundColor: GlobalColor.background,
    height: 70,
    width: 70,
    borderRadius: 35,
    marginRight: -30,
  },
  footer: {
    backgroundColor: "#FF5524",
    alignSelf: "center",
    width: 300,
    flex: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  dateTime: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    alignItems: "center",
    marginTop: -20,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    color: "white",
    fontSize: 10,
    paddingTop: 5,
  },
  date: {
    color: "white",
    fontSize: 25,
  },
  day: {
    color: "white",
    fontSize: 10,
    paddingTop: 5,
  },
  moreTicketInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 60,
  },
  imageContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconContainer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#323232e4",
    justifyContent: "center",
    alignItems: "center",
  },
});
