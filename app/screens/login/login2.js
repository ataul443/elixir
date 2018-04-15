import React from "react";
import Expo from "expo";
import {
  View,
  Image,
  Keyboard,
  AsyncStorage,
  StatusBar,
  Platform
} from "react-native";
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet
} from "react-native-ui-kitten";
import { FontAwesome } from "../../assets/icons";
import { GradientButton } from "../../components/gradientButton";
import Loader from "../../components/loader";
import { RkTheme } from "react-native-ui-kitten";
import { scale, scaleModerate, scaleVertical } from "../../utils/scale";
import { NavigationActions } from "react-navigation";
import { DarkKittenTheme } from "../../config/darkTheme";

export class LoginV2 extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };

    this.signInWithGoogleAsync = this.signInWithGoogleAsync.bind(this);
  }

  async signInWithGoogleAsync() {
    console.log("I am running");
    this.setState({ loading: true });
    //AsyncStorage.setItem('@AuthStore:user',JSON.stringify({user: "ataul"}));
    //console.log('Inserted User');
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId:
          "510839253130-aiamg0sjr39uj2b5f8fqla421qo98a3b.apps.googleusercontent.com",
        iosClientId:
          "510839253130-ffmntg6nkr693hbcj7bmefobq01liesv.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        console.log("result => ", result);
        console.log(result.user);
        let user = result.user;
        user.codeScan = 0;
        user.qrScan = 0;
        await AsyncStorage.setItem("@AuthStore:user", JSON.stringify(user));
        this.setState({ loading: false });
        this._resetNavigationStateToHome();
        return result.accessToken;
      } else {
        this.setState({ loading: false });
        return { cancelled: true };
      }
    } catch (e) {
      this.setState({ loading: false });
      alert(`Failed!\n${e}`);
      return { error: true };
    }
  }

  _resetNavigationStateToHome() {
    let toHome = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Home" })]
    });
    this.props.navigation.dispatch(toHome);
  }

  render() {
    RkTheme.setTheme(DarkKittenTheme);
    StatusBar.setBarStyle("light-content", true);
    Platform.OS == "android" &&
      StatusBar.setBackgroundColor(DarkKittenTheme.colors.screen.base);
    let renderIcon = () => {
      if (RkTheme.current.name === "light")
        return (
          <Image
            style={styles.image}
            source={require("../../assets/images/logo.png")}
          />
        );
      return (
        <Image
          style={styles.image}
          source={require("../../assets/images/logo.png")}
        />
      );
    };

    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={e => true}
        onResponderRelease={e => Keyboard.dismiss()}
      >
        <View style={styles.header}>
          {renderIcon()}
          <RkText rkType="logo h0">Elixir</RkText>
        </View>
        <View style={styles.content}>
          <Loader loading={this.state.loading} />
          <View>
            <RkTextInput rkType="rounded" placeholder="Username" />
            <RkTextInput
              rkType="rounded"
              placeholder="Password"
              secureTextEntry={true}
            />
            <GradientButton
              style={styles.save}
              rkType="large"
              text="LOGIN"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </View>
          <View style={styles.buttons}>
            <RkButton style={styles.button} rkType="social">
              <RkText rkType="awesome hero">{FontAwesome.twitter}</RkText>
            </RkButton>
            <RkButton style={styles.button} rkType="social">
              <RkText
                onPress={() => {
                  this.signInWithGoogleAsync();
                }}
                rkType="awesome hero"
              >
                {FontAwesome.google}
              </RkText>
            </RkButton>
            <RkButton style={styles.button} rkType="social">
              <RkText rkType="awesome hero">{FontAwesome.facebook}</RkText>
            </RkButton>
          </View>

          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType="primary3">Don’t have an account?</RkText>
              <RkButton
                rkType="clear"
                onPress={() => this.props.navigation.navigate("SignUp")}
              >
                <RkText rkType="header6"> Sign up now </RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </RkAvoidKeyboard>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: scaleVertical(16),
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: theme.colors.screen.base
  },
  image: {
    height: scaleVertical(77),
    resizeMode: "contain"
  },
  header: {
    paddingBottom: scaleVertical(10),
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  content: {
    justifyContent: "space-between"
  },
  save: {
    marginVertical: 20
  },
  buttons: {
    flexDirection: "row",
    marginBottom: scaleVertical(24),
    marginHorizontal: 24,
    justifyContent: "space-around"
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "center"
  },
  button: {
    borderColor: theme.colors.border.solid
  },
  footer: {}
}));
