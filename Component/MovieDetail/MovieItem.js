import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { GlobalColor } from "../../Color/colors";

function MovieItem({
  index,
  imageUri,
  onPressed,
  isTop = 1,
  style,
  rootStyle,
}) {
  const BASE_IMAGE_URI = "https://image.tmdb.org/t/p/w500" + imageUri;
  let number = <></>;
  if (isTop === 1) {
    number = (
      <View style={styles.numberView}>
        <Text style={styles.number}> {index + 1} </Text>
      </View>
    );
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        rootStyle ? rootStyle : null,
        pressed ? styles.pressed : null,
      ]}
      onPress={onPressed}
    >
      <View>
        <View>
          <Image
            style={[styles.image, style ? style : null]}
            source={{ uri: BASE_IMAGE_URI }}
          />
        </View>
        {number}
      </View>
    </Pressable>
  );
}

export default MovieItem;
const styles = StyleSheet.create({
  root: {
    height: 220,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: -100,
  },
  image: {
    width: 150,
    height: 220,
    borderRadius: 15,
  },
  number: {
    fontSize: 96,
    color: GlobalColor.number,
    borderColor: GlobalColor.numberStoke,
    fontWeight: "semibold",
  },
  numberView: {
    position: "relative",
    marginTop: -75,
    marginLeft: -37,
  },
  pressed: {
    opacity: 0.5,
  },
});
