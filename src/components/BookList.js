import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Axios from 'axios';

import defaultImage from '../../assets/book.jpg';

export default function BookList({ navigation, term }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [timeOuts, setTimeOuts] = useState(null);

  function renderBook({ item }) {
    return (
      <View style={styles.bookContainer}>
        {item.volumeInfo.imageLinks ? (
          <Image
            source={{
              uri: item.volumeInfo.imageLinks.smallThumbnail,
            }}
            style={styles.bookImage}
          />
        ) : (
          <Image source={defaultImage} style={styles.bookImage} />
        )}

        <View style={styles.bookDescriptionContainer}>
          <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
          <Text style={styles.bookDescription} numberOfLines={5}>
            {item.volumeInfo.description}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BookDetail', { book: item });
            }}
          >
            <Text style={styles.seeMoreTxt}>Ver mais!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  useEffect(() => {
    loadBooks();
    console.log(`${term} pesquisado`);
  }, [term]);

  useEffect(() => {
    paginatonRequest();
  }, [page]);

  function loadBooks() {
    setBooks([]);
    setPage(0);
    setTimeOuts(clearTimeout(timeOuts));
    if (term.length) {
      setTimeOuts(
        setTimeout(async () => {
          const { data } = await Axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${term}`
          );
          data && setBooks([...books, ...data.items]);
        }, 300)
      );
    }
  }

  function paginatonRequest() {
    console.log(page);
    setTimeOuts(clearTimeout(timeOuts));
    if (term.length) {
      setTimeOuts(
        setTimeout(async () => {
          const { data } = await Axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${term}&startIndex=${page}`
          );
          data && setBooks([...books, ...data.items]);
        }, 300)
      );
    }
  }

  function loadMore() {
    setPage(page + 10);
  }

  return (
    <View>
      <FlatList
        data={books}
        keyExtractor={(book) => book.id}
        renderItem={renderBook}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 20,
  },
  bookDescriptionContainer: {
    flexDirection: 'column',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  bookImage: {
    height: 150,
    width: 100,
    marginRight: 10,
  },
  bookDescription: {
    fontSize: 14,
    color: '#666',
  },
  seeMoreTxt: {
    fontSize: 18,
    color: '#486ABC',
    marginTop: 10,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
