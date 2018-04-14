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
import {SideRoutes} from '../../config/navigation/routes';
import {FontAwesome} from '../../assets/icons';

export class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profileIcon : null,
      user: null
    }
    
    this._navigateAction = this._navigate.bind(this);
  }

  componentDidMount(){
    this._loadProfileIcon();
    
  }

  _navigate(route) {
    /*
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: route.id})
      ]
    });
    */
   let navigateAction = NavigationActions.navigate({
     routeName: route.id,
     params: {},
   })
    this.props.navigation.dispatch(navigateAction)
  }

  async _loadProfileIcon(){
    const user = await AsyncStorage.getItem('@AuthStore:user');
    user1 = JSON.parse(user);
    this.setState({user: user1});
    let url = user1.photoUrl;
    this.setState({profileIcon: url})
    console.log(this.state.user);
    return url;
  }

  _renderIcon() {
    if(this.state.profileIcon){
      if (RkTheme.current.name === 'light')
      return <Image style={styles.icon} source={{uri: this.state.profileIcon}}/>;
    return <Image style={styles.icon} source={{uri: this.state.profileIcon}}/>
    }else{

    if (RkTheme.current.name === 'light')
      return <Image style={styles.icon} source={require('../../assets/images/logo.png')}/>;
    return <Image style={styles.icon} source={require('../../assets/images/smallLogoDark.png')}/>
    }
  }

  render() {
    let menu = SideRoutes.map((route, index) => {
      return (
        <TouchableHighlight
          style={styles.container}
          key={route.id}
          underlayColor={RkTheme.current.colors.button.underlay}
          activeOpacity={1}
          onPress={() => this._navigate(route)}>
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

    let name = null;
    if(this.state.user) name = this.state.user.name;
    else name = 'Elixer';
    
    return (
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={[styles.container, styles.content]}>
            {this._renderIcon()}
            <RkText rkType='logo'>{name}</RkText>
            
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
    marginTop: 19,
    width: 50,
    height: 50,
    borderRadius: 50
  }
}));