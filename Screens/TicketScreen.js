import { View, StyleSheet, FlatList, Text, Alert } from "react-native";
import TicketItem from "../Component/Tickets/TicketItem";
import { useContext, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { deleteTicket, fetchTicket } from "../util/database";
import { deleteTicketOfUser, fetchTickets } from "../util/firebase";
import { AuthContext } from "../Store/authContext";
import EmptyTicket from "../Component/UI/EmptyTicket";

function TicketsScreen() {
  const [tickets, setTickets] = useState([]);
  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    async function loadTickets() {
      // const tickets = await fetchTicket();
      const tickets = await fetchTickets(authCtx.uid);
      setTickets(tickets);
    }
    if (isFocused) {
      loadTickets();
      // setLoadPlaces((currPlaces) => [...currPlaces, route.params.place]);
    }
  }, [isFocused]);
  async function loadTickets() {
    // const tickets = await fetchTicket();
    const tickets = await fetchTickets(authCtx.uid);
    setTickets(tickets);
  }
  function renderTicketItem(itemData) {
    const dateTime = itemData.item.date.split(" ");
    const dates = {
      date: dateTime[0],
      day: dateTime[1],
    };

    async function deleteTicketHandler() {
      try {
        deleteTicketOfUser(authCtx.uid, itemData.item.id);
        const response = await deleteTicket(itemData.item.id);
        setTickets((tickets) =>
          tickets.filter((tk) => tk.id !== itemData.item.id)
        );
        // await loadTickets();
      } catch (error) {
        console.log(error);
      }
    }
    function deleteTickets() {
      Alert.alert("Warning", "Are you sure delete", [
        {
          text: "Sure",
          onPress: () => {
            deleteTicketHandler();
          },
        },
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
      ]);
    }
    return (
      <TicketItem
        posterImage={itemData.item.movieImage}
        dateTime={dates}
        time={itemData.item.time}
        seats={itemData.item.seats}
        row={itemData.item.row}
        onDelete={deleteTickets}
      />
    );
  }
  return (
    <View style={styles.root}>
      {tickets.length > 0 ? (
        <FlatList
          horizontal
          keyExtractor={(item) => item.id}
          data={tickets}
          renderItem={renderTicketItem}
          showsHorizontalScrollIndicator="false"
        />
      ) : (
        <EmptyTicket />
      )}
    </View>
  );
}

export default TicketsScreen;
const styles = StyleSheet.create({
  root: {
    height: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
});
