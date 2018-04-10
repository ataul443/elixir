import React from 'react';
import {
  TouchableHighlight,
  View,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {
  RkStyleSheet,
  RkText,
  RkTheme
} from 'react-native-ui-kitten';
import {MainRoutes} from '../../config/navigation/routes';
import {FontAwesome} from '../../assets/icons';

export class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profileIcon : null
    }
    
    this._navigateAction = this._navigate.bind(this);
  }

  componentDidMount(){
    this._loadProfileIcon();
  }

  _navigate(route) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: route.id})
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }

  async _loadProfileIcon(){
    const user = await AsyncStorage.getItem('@AuthStore:user');
    user1 = JSON.parse(user);
    let url = user1.photoUrl;
    this.setState({profileIcon: url})
    console.log(url);
    return url;
  }

  _renderIcon() {
    if(this.state.profileIcon){
      if (RkTheme.current.name === 'light')
      return <Image style={styles.icon} source={{uri: this.state.profileIcon}}/>;
    return <Image style={styles.icon} source={{uri: this.state.profileIcon}}/>
    }else{

    if (RkTheme.current.name === 'light')
      return <Image style={styles.icon} source={require('../../assets/images/smallLogo.png')}/>;
    return <Image style={styles.icon} source={require('../../assets/images/smallLogoDark.png')}/>
    }
  }

  render() {
    let menu = MainRoutes.map((route, index) => {
      return (
        <TouchableHighlight
          style={styles.container}
          key={route.id}
          underlayColor={RkTheme.current.colors.button.underlay}
          activeOpacity={1}
          onPress={() => this._navigateAction(route)}>
          <View style={styles.content}>
            <View style={styles.content}>
              <RkText style={styles.icon}
                      rkType='moon primary xlarge'>{route.icon}</RkText>
              <RkText>{route.title}</RkText>
            </View>
            <RkText rkType='awesome secondaryColor small'>{FontAwesome.chevronRight}</RkText>
          </View>
        </TouchableHighlight>
      )
    });

    return (
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={[styles.container, styles.content]}>
            {this._renderIcon()}
            <RkText rkType='logo'>UI Kitten</RkText>
          </View>
          {menu}
        </ScrollView>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    height: 80,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base
  },
  root: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: theme.colors.screen.base
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 13,
    width: 50,
    height: 50,
    borderRadius: 50
  }
}));