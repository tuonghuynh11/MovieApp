import * as SQLite from "expo-sqlite";
import { Ticket } from "../Model/Ticket";

const database = SQLite.openDatabase("ticketBooking.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ticketBooking (
                  id INTEGER PRIMARY KEY NOT NULL ,
                  idUser INTEGER  KEY NOT NULL,
                  idMovie INTEGER  KEY NOT NULL,
                  movieImage TEXT NOT NULL,
                  row Text NOT NULL,
                  hall Text NOT NULL,
                  date Text NOT NULL,
                  time Text NOT NULL,
                  seats Text NOT NULL
              )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function insertNewTicket(ticket) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ticketBooking (idUser, idMovie, movieImage,row,hall, date, time, seats) VALUES (
              ?,?,?,?,?,?,?,?
          )`,
        [
          ticket.idMovie,
          ticket.idUser,
          ticket.movieImage,
          ticket.row,
          ticket.hall,
          ticket.date,
          ticket.time,
          ticket.seats,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}
export function fetchTicket() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ticketBooking`,
        [],
        (_, result) => {
          const tickets = [];
          for (const ticket of result.rows._array) {
            tickets.push(
              new Ticket(
                ticket.id,
                ticket.idUser,
                ticket.idMovie,
                ticket.movieImage,
                ticket.row,
                ticket.hall,
                ticket.date,
                ticket.time,
                ticket.seats
              )
            );
          }
          resolve(tickets);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}
export function deleteTicket(idTicket) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ticketBooking WHERE id = ?`,
        [idTicket],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}
