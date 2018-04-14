import React from 'react';
import {
  View,
  AsyncStorage,
  StatusBar,
  Platform
} from 'react-native';
import {RkStyleSheet,RkTheme} from 'react-native-ui-kitten';
import {GradientButton} from '../../components/';
import {Walkthrough} from '../../components/walkthrough';
import {Walkthrough1} from './walkthrough1';
import {Walkthrough2} from './walkthrough2';
import {PaginationIndicator} from '../../components';
import {DarkKittenTheme} from '../../config/darkTheme';
import {NavigationActions} from 'react-navigation'


export default class WalkthroughScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {index: 0};
  }

  changeIndex(index) {
    this.setState({index})
  }
  componentDidMount(){
    StatusBar.setHidden(true, 'none');
  }

  _toHome = async ()=>{
    const user = await AsyncStorage.getItem('@AuthStore:user')
    let nextScreen = 'Home';
    try{ 
      if(user !== null){
          
        console.log("User Found");
        return;
      }else{
        nextScreen = 'Auth';
        console.log("User Not FOund!");
        
      }
    }catch(e){
      alert(error)
      console.log(error);
      
    }
    finally{
      let toHome = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: nextScreen})]
      });
      this.props.navigation.dispatch(toHome);
    }
  }

  render() {
    RkTheme.setTheme(DarkKittenTheme);
    StatusBar.setBarStyle('light-content', true);
    Platform.OS == 'android' && StatusBar.setBackgroundColor(DarkKittenTheme.colors.screen.base);
    return (
      <View style={styles.screen}>
        <Walkthrough onChanged={(index) => this.changeIndex(index)}>
          <Walkthrough1/>
          <Walkthrough2/>
        </Walkthrough>
        <PaginationIndicator length={2} current={this.state.index}/>
        <GradientButton
          rkType='large'
          style={styles.button}
          text="GET STARTED"
          onPress={() => {
            this._toHome();
          }}/>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.base,
    paddingVertical: 28,
    alignItems: 'center',
    flex: 1,
  },
  button: {
    marginTop: 25,
    marginHorizontal: 16,
  }
}));