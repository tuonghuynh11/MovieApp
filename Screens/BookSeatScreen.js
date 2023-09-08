import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import IconLabel from "../Component/UI/IconLabel";
import { Ticket } from "../Model/Ticket";
import { insertNewTicket } from "../util/database";
import { addNewTicket } from "../util/firebase";
import { AuthContext } from "../Store/authContext";
function BookSeatScreen({ movieDetail, hideModal }) {
  const [seats, setSeats] = useState(generateSeat());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [calendar, setCalendar] = useState(generateCalendar());
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [cost, setCost] = useState(0);

  const authCtx = useContext(AuthContext);
  const timeArray = [
    "8:00",
    "10:00",
    "12:00",
    "13:30",
    "14:30",
    "16:00",
    "18:00",
    "20:00",
  ];

  function generateCalendar() {
    let date = new Date(Date.now());
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      let template = {
        date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
        day: weekDay[
          new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()
        ],
      };
      weekDays.push(template);
    }
    return weekDays;
  }

  function generateSeat() {
    const numberRow = 10;
    let numberColumn = 3;

    let rowArray = [];
    let reach = false;

    let start = 1;
    for (let i = 0; i < numberRow; i++) {
      let columnArray = [];
      for (let j = 0; j < numberColumn; j++) {
        let seatObject = {
          number: start,
          taken: Boolean(Math.round(Math.random())),
          selected: false,
          row: i + 1,
        };
        start++;
        columnArray.push(seatObject);
      }
      if (i === 2) {
        numberColumn -= 2;
      }
      if (i === 4) {
        reach = true;
      }
      if (reach) {
        if (i == 4 || i == 6) {
          numberColumn += 2;
        }
        numberColumn -= 2;
      } else {
        numberColumn += 2;
      }

      rowArray.push(columnArray);
    }
    return rowArray;
  }

  function selectedSeatHandler(index, subindex, number) {
    if (seats[index][subindex].taken) {
      return;
    }
    let temp = [...seats];
    let numberOfSeat = selectedSeats.length;
    temp[index][subindex].selected = !temp[index][subindex].selected;
    if (temp[index][subindex].selected) {
      setSelectedSeats((curr) => [...curr, temp[index][subindex]]);
      numberOfSeat += 1;
    } else {
      setSelectedSeats((curr) => curr.filter((item) => item.number !== number));
      numberOfSeat -= 1;
    }
    setSeats(temp);
    setCost(5 * numberOfSeat);
  }
  async function buyTicketHandler() {
    if (selectedSeats.length === 0) {
      Alert.alert("Warning", "Please select a number of seats");
      return;
    }
    let rows = "";
    let seats = "";
    selectedSeats.sort((a, b) => a.number - b.number);
    selectedSeats.forEach((item, index) => {
      if (index == selectedSeats.length - 1) {
        rows += "0" + item.row;
        seats += "0" + item.number;
      } else {
        rows += "0" + item.row + ", ";
        seats += "0" + item.number + ", ";
      }
    });
    const ticket = new Ticket(
      null,
      "18490283",
      movieDetail.id,
      "https://image.tmdb.org/t/p/w500/" + movieDetail.poster_path,
      rows,
      "02",
      calendar[selectedDateIndex].date + " " + calendar[selectedDateIndex].day,
      timeArray[selectedTimeIndex],
      seats
    );
    try {
      await insertNewTicket(ticket).then((ticket) => {
        addNewTicket(
          new Ticket(
            ticket.insertId,
            authCtx.uid,
            movieDetail.id,
            "https://image.tmdb.org/t/p/w500/" + movieDetail.poster_path,
            rows,
            "02",
            calendar[selectedDateIndex].date +
              " " +
              calendar[selectedDateIndex].day,
            timeArray[selectedTimeIndex],
            seats
          )
        );
        console.log(ticket);
      });
      hideModal();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator="false">
        <View style={styles.container}>
          {seats.map((item, index) => {
            return (
              <View key={index} style={styles.seatRow}>
                {item.map((seat, subindex) => {
                  return (
                    <TouchableOpacity
                      key={seat.number}
                      onPress={() => {
                        selectedSeatHandler(index, subindex, seat.number);
                      }}
                    >
                      <MaterialIcons
                        name="event-seat"
                        size={20}
                        color={
                          seat.taken
                            ? "#585656"
                            : !seat.selected
                            ? "white"
                            : "orange"
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View style={styles.seatInfo}>
          <IconLabel
            icon="radio-button-on-outline"
            color="white"
            title="Available"
            size={20}
          />
          <IconLabel
            icon="radio-button-on-outline"
            color="#585656"
            title="Taken"
            size={20}
          />
          <IconLabel
            icon="radio-button-on-outline"
            color="orange"
            title="Selected"
            size={20}
          />
        </View>
        <View style={styles.calendar}>
          <FlatList
            horizontal
            data={calendar}
            initialScrollIndex={selectedDateIndex}
            showsHorizontalScrollIndicator={false}
            renderItem={(itemData) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.calendarContainer,
                    selectedDateIndex === itemData.index
                      ? { backgroundColor: "orange" }
                      : null,
                  ]}
                  onPress={() => setSelectedDateIndex(itemData.index)}
                >
                  <Text style={styles.dateStyle}>{itemData.item.date}</Text>
                  <Text style={styles.dayStyle}>{itemData.item.day}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.time}>
          <FlatList
            horizontal
            data={timeArray}
            initialScrollIndex={selectedDateIndex}
            showsHorizontalScrollIndicator={false}
            renderItem={(itemData) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.timeContainer,
                    selectedTimeIndex === itemData.index
                      ? { backgroundColor: "orange" }
                      : null,
                  ]}
                  onPress={() => setSelectedTimeIndex(itemData.index)}
                >
                  <Text style={styles.timeStyle}>{itemData.item}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ScrollView>
      <View style={styles.rootPaymentContainer}>
        <View style={styles.rootPayment}>
          <View style={styles.payment}>
            <View style={styles.total}>
              <Text style={styles.totalText}>Total Price</Text>
              <View style={styles.price}>
                <Text style={{ color: "white", fontSize: 25 }}>$</Text>
                <Text style={styles.priceText}>{cost.toFixed(2)}</Text>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.buyTicket,
                pressed && styles.pressed,
              ]}
              onPress={buyTicketHandler}
            >
              <Text style={styles.buyStyle}>Buy Tickets</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
export default BookSeatScreen;
const styles = StyleSheet.create({
  root: {
    // flex: 1,
    height: "87%",
  },
  container: {
    alignItems: "center",
    gap: 17,
  },
  seatRow: {
    flexDirection: "row",
    gap: 20,
  },
  seatInfo: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  calendar: {
    marginVertical: 5,
    height: 70,
  },
  time: {
    marginTop: 5,
    paddingBottom: 50,
  },
  calendarContainer: {
    width: 50,
    backgroundColor: "#0A0A0A",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 10,
  },
  dateStyle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  dayStyle: {
    color: "white",
    fontSize: 10,
  },
  timeContainer: {
    width: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    marginHorizontal: 10,
  },
  timeStyle: {
    color: "gray",
  },
  payment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  rootPayment: {
    width: "100%",
    backgroundColor: "#0e1412df",
    height: 100,
    justifyContent: "center",
  },
  rootPaymentContainer: {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
  total: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalText: {
    color: "gray",
    fontSize: 14,
  },
  price: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "white",
    fontSize: 25,
  },
  buyStyle: { color: "white", fontWeight: "bold" },
  buyTicket: {
    backgroundColor: "orange",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  pressed: {
    opacity: 0.6,
  },
});
