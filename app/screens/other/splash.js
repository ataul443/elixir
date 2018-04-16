import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  StatusBar,
  AsyncStorage
} from 'react-native';
import {
  RkText,
  RkTheme
} from 'react-native-ui-kitten'
import {ProgressBar} from '../../components';
import {
  KittenTheme
} from '../../config/theme';
import {NavigationActions} from 'react-navigation';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

let timeFrame = 1000;

export class SplashScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    }

    this.authstatus = this.authstatus.bind(this);
  }

  componentDidMount() {
    StatusBar.setHidden(true, 'none');
    RkTheme.setTheme(KittenTheme);
    this.authstatus();
    
  }

    async authstatus(){
      let nextScreen = 'Home';
      console.log("Started");
    try {
      
      const user1 = await AsyncStorage.getItem('@AuthStore:user')
      let user = JSON.parse(user1);
      const walkthrough = await AsyncStorage.getItem('@walkthrough');

      if(walkthrough === null){
        const walkthroughScreen = await AsyncStorage.setItem('@walkthrough','Walkthrough');
        nextScreen = 'Walkthrough';
      }else{
        if(user !== null){
        
          console.log("User Found");
          return;
        }else{
          if(!user.codeScan) user.codeScan = 0;
          if(!user.qrScan) user.qrScan = 0;
          nextScreen = 'Auth';
          await AsyncStorage.setItem('@AuthStore:user',JSON.stringify(user));
          console.log("User Not FOund!");
          
        }
      }
      

    } catch (error) {
      console.log(error)
      nextScreen = 'Auth';
      // Error retrieving data
    } finally{
      this.timer = setInterval(() => {
        if (this.state.progress == 1) {
          clearInterval(this.timer);
          setTimeout(() => {
            StatusBar.setHidden(false, 'slide');
            let toHome = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: nextScreen})]
            });
            this.props.navigation.dispatch(toHome)
          }, timeFrame);
        } else {
          let random = Math.random() * 0.5;
          let progress = this.state.progress + random;
          if (progress > 1) {
            progress = 1;
          }
          this.setState({progress});
        }
      }, timeFrame)
  
    }
  }

  render() {
    let width = Dimensions.get('window').width;
    return (
      <View style={styles.container}>
        <View>
          <Image style={[styles.image, {width}]} source={require('../../assets/images/splashBack.png')}/>
        </View>
        <ProgressBar
          color={'#1C81D7'}
          style={styles.progress}
          progress={this.state.progress} width={scale(220)}/>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: KittenTheme.colors.screen.base,
    justifyContent: 'space-between',
    flex: 1
  },
  image: {
    resizeMode: 'cover',
    height: '100%',
  },
  text: {
    alignItems: 'center'
  },
  hero: {
    fontSize: 37,
  },
  appName: {
    fontSize: 62,
  },
  progress: {
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
    //marginBottom: 35,
    backgroundColor: '#e5e5e5'
  }
});