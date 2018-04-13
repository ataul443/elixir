import React from "react";
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  WebView,
  Picker,
  TextInput,
  Keyboard
} from "react-native";
import { scale, scaleModerate, scaleVertical } from "../../utils/scale";

import ActionButton from "react-native-action-button";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";

import { RkCard, RkText, RkStyleSheet, RkButton } from "react-native-ui-kitten";
import Modal from "react-native-modal";
let moment = require("moment");

const TOOLBAR_HEIGHT = 56;
const { deviceWidth, deviceHeight } = Dimensions.get("window");

export class CodeEditor extends React.Component {
  static navigationOptions = {
    title: "Code Dojo".toUpperCase()
  };

  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    let inputText = null;
    if(props.navigation.state.params) inputText = props.navigation.state.params.textCode;
    if (!inputText || inputText.length == 0)
      inputText = "//! NO Code Found !\n\n";
    this.state = {
      webWidth: deviceWidth,
      inputData: inputText,
      uploadStatus: "Loading...",
      modalVisible: false,
      language: "Select",
      modalContent: "loader",
      fab: false,
      runButton: true
    };
  }
  onMessage(event) {
    if(event.nativeEvent.data == 'INSERTED'){
      this.setState({modalVisible: false,fab: true})
    }else{
    this.setState({modalVisible: false});
    console.log("message", event.nativeEvent.data);
    let data = event.nativeEvent.data;
    //"//! NO Code Found !\n//Welcome To APP"
    if( data == null || data.length  < 0) alert("Code Not Found");
    else this.props.navigation.navigate("IO", { code: data  });
    }
  }

  onModalOpen = () => {
    this.setState({ modalVisible: true });
  };
  closeModal = () => {
    this.setState({ modalVisible: false });
  };
  onModalHidden = () => {
    this.props.navigation.navigate("output", {
      outputResp: this.state.textCode
    });
  };

  onCompile = () => {
    console.log("Clicked");
  };

  componentDidMount() {
    //this.onModalOpen();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide); 

    let inputText = this.state.inputData;
    console.log(inputText, "Inserting Code Man");
    //this.webview.injectJavaScript(`editor.insert("${inputText}");`);
    console.log("injected broken");

    setTimeout(() => {
      console.log("inserted");
      this.refs.editorWebView.postMessage(inputText);
      this.setState({ fab: true });
    }, 1000);
  }

  runCode = () => {
    this.setState({ modalContent: "loader" });
    var params = {
      code: this.state.inputData,
      language: this.state.language,
      input: this.state.userInput,
      output: "HelloWorld!4"
    };
    var formBody = [];
    for (var property in params) {
      var encodeKey = encodeURI(property);
      var encodeValue = encodeURIComponent(params[property]);
      formBody.push(encodeKey + "=" + encodeValue);
    }
    formBody = formBody.join("&");
    console.log(formBody);
    let url = "http://nextvac.eastus.cloudapp.azure.com/test.php";
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: formBody
    })
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  };

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(){
    this.setState({runButton: false});
  }
  _keyboardDidHide(){
    this.setState({runButton: true});
  }



  render() {

    const loader = (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
        <Text
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            marginLeft: 10
          }}
        >
          {this.state.uploadStatus}
        </Text>
      </View>
    );

    let content = loader;

    let fab = (
      /*
      <ActionButton
        buttonColor="rgb(66, 194, 244)"
        nativeFeedbackRippleColor="rgba(255,255,255,0.75)"
        renderIcon={() => {
          return <Ionicons name="ios-play" size={32} color="white" />;
        }}
        onPress={() => {
          this.refs.editorWebView.postMessage("collect");
        }}
      />*/
      <Button
          small
          raised
          buttonStyle={{
            borderRadius: 30,
            backgroundColor: "#EA4265",
            width: 60,
            height: 60
          }}
          containerViewStyle={{
            position:'absolute',
            borderRadius: 30,
            width: 60,
            right: scale(30),
            bottom: scaleVertical(60),
            height:60,
          }}
          backgroundColor="#EA4265"
          title="Run"
          underlayColor = "transparent"
          textStyle={{  fontSize: 16  }}
          onPress={() => {
            this.onModalOpen();
            this.refs.editorWebView.postMessage("collect");
            //this.props.navigation.navigate('IO');
          }}
        />
    );

    let fabButton = this.state.fab && this.state.runButton ? fab : false;

    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.modalVisible}
          onBackButtonPress={() => {
            this.closeModal();
          }}
          onBackdropPress={() => {
            this.closeModal();
          }}
          onModalHide={() => {
            this.onModalHidden();
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <View style={styles.modalContent}>{content}</View>
            </View>
          </View>
        </Modal>
        <WebView
          style={{ width: this.state.webWidth }}
          source={require("../../assets/editor/editor.html")}
          ref="editorWebView"
          //ref={ref => {
          //  this.webview = ref;
          //}}
          onError={console.error.bind(console, "error")}
          onShouldStartLoadWithRequest={() => true}
          javaScriptEnabled={true}
          startInLoadingState={true}
          //injectedJavaScript={js}
          onMessage={this.onMessage}
        />
        {/*
        <Button
          title="Compile Code"
          fontWeight="bold"
          buttonStyle={styles.button}
          containerViewStyle={styles.buttonContainer}
          onPress={() => {
            this.refs.editorWebView.postMessage("collect");
          }}
        />
        */}
        {fabButton}
      </View>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  title: {
    marginBottom: 5
  },
  container: {
    flex: 1
  },
  webContainer: {
    width: deviceHeight
  },
  button: { backgroundColor: "green" },
  buttonContainer: { width: "100%", marginLeft: 0 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalInnerContainer: {
    width: "60%",
    height: "15%",
    backgroundColor: "#fff",
    borderRadius: 10
  },
  modalContent: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
}));
