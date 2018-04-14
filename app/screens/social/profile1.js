import React from 'react';
import {
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import {
  RkText,
  RkButton, RkStyleSheet
} from 'react-native-ui-kitten';
import {NavigationActions} from 'react-navigation';
import {Avatar} from '../../components/avatar';
import {Gallery} from '../../components/gallery';
import {data} from '../../data/';
import formatNumber from '../../utils/textUtils';

export class ProfileV1 extends React.Component {
  static navigationOptions = {
    title: 'User Profile'.toUpperCase()
  };

  constructor(props) {
    super(props);

    let {params} = this.props.navigation.state;
    let id = params ? params.id : 1;
    this.user = data.getUser(id);
    this.state = {
      user: {
      name: 'Your Profile',
      photoUrl: '#'
      },
    }

  }

  componentDidMount(){
    console.log("I am running!");
    this._loadData();
  }

  async _loadData(){
    const user1 = await AsyncStorage.getItem('@AuthStore:user');
    let user = JSON.parse(user1);
    console.log(user);

    if(user === null){
      let resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Auth'})]
      });
      this.props.navigation.dispatch(resetAction);
    }else{
      console.log("User setting...",user);
      this.setState({user: user});
      console.log("User set");
    }
  }

  render() {
    let name = `${this.user.firstName} ${this.user.lastName}`;
    let images = this.user.images;
    return (
      <ScrollView style={styles.root}>
        <View style={[styles.header, styles.bordered]}>
          <Avatar img={{uri: this.state.user.photoUrl}} rkType='big'/>
          <RkText rkType='header2'>{this.state.user.name}</RkText>
        </View>
        <View style={[styles.userInfo, styles.bordered]}>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}>{this.state.user.codeScan}</RkText>
            <RkText rkType='secondary1 hintColor'>Code Scans</RkText>
          </View>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followersCount)}</RkText>
            <RkText rkType='secondary1 hintColor'>Followers</RkText>
          </View>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}>{this.state.user.qrScan}</RkText>
            <RkText rkType='secondary1 hintColor'>QR Scans</RkText>
          </View>
        </View>
        <View style={styles.buttons}>
          <RkButton style={styles.button} rkType='clear link'>FOLLOW</RkButton>
          <View style={styles.separator}/>
          <RkButton style={styles.button} rkType='clear link'>MESSAGE</RkButton>
        </View>
        <Gallery items={images}/>
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 17
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 18,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base
  },
  section: {
    flex: 1,
    alignItems: 'center'
  },
  space: {
    marginBottom: 3
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 0,
    width: 1,
    height: 42
  },
  buttons: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  button: {
    flex: 1,
    alignSelf: 'center'
  }
}));