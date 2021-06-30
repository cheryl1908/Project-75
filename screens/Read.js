import * as React from 'react';
import { SearchBar } from 'react-native-elements';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import db from '../config';

export default class Read extends React.Component {
  constructor() {
    super();
    this.state = {
      allStories: [],
      lastVisibleStory: null,
      search: '',
    };
  }
  componentDidMount = async () => {
    const ref = await db.collection('Story').get();
    ref.docs.map((doc) => {
      this.setState({
        allStories: [...this.state.allStories, doc.data()],
      });
    });
  };
  fetchMoreStories = async (text) => {
    //console.log("inside fetch")
    const story = await db
      .collection('Story')
      .where('title', '==', text)
      .startAfter(this.state.lastVisibleStory)
      .limit(10)
      .get();
    story.docs.map((doc) => {
      this.setState({
        allStories: [...this.state.allStories, doc.data()],
        lastVisibleStory: doc,
      });
    });
  };

  searchFilterFunction = async (text) => {
    //console.log("inside filter");
    const story = await db.collection('Story').where('title', '==', text).get();
    story.docs.map((doc) => {
      this.setState({
        allStories: [...this.state.allStories, doc.data()],
        lastVisibleStory: doc,
      });
    });
  };
  render() {
    return (
      <View style={{ backgroundColor: 'crimson' }}>
        <View style={styles.head}>
          <Text style={styles.headT}> Read Stories</Text>
        </View>
        <View>
          <SearchBar
            style={styles.searchBar}
            placeholder="Enter the Title of your Story"
            onChangeText={(text) => {
              this.setState({ search: text });
            }}
            value={this.state.search}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              this.searchFilterFunction(this.state.search);
            }}>
            <Text style={{fontSize:20, textAlign:"center"}}> Search </Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={this.state.allStories}
            renderItem={({ item }) => (
              <View
                style={{
                  borderBottomWidth: 2,
                  marginTop: 10,
                  marginBottom: 10,
                  borderBottomColor: 'white',
                }}>
                <Text style={{ fontSize: 20, color: 'white' }}>
                  {'Title: ' + item.title}
                </Text>
                <Text style={{ fontSize: 20, color: 'white' }}>
                  {'Author: ' + item.author}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.fetchMoreStories}
            onEndReachedThreshold={0.7}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  head: {
    backgroundColor: 'pink',
    marginTop: 2,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    padding: 5,
  },
  headT: {
    textAlign: 'center',
    color: 'black',
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchButton: {
    height: 40,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 30,
    width: 200,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  searchBar:{
    placeholderTextColor: 'white',
  }
});
