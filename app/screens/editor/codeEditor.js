import React from "react";
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  WebView,
  Picker,
  TextInput
} from "react-native";
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
    let inputText = props.navigation.state.params.textCode;
    console.log(inputText);
    if (!inputText || inputText.length == 0)
      inputText = "//! NO Code Found !\n\n";
    this.state = {
      webWidth: deviceWidth,
      inputData: inputText,
      uploadStatus: "Executing Code...",
      modalVisible: false,
      language: "Select",
      modalContent: "picker",
      userInput: "0",
      outputResp: "",
      fab: false
    };
  }
  onMessage(event) {
    this.setState({ inputData: event.nativeEvent.data });
    console.log("message", event.nativeEvent.data);
    this.props.navigation.navigate("IO", { code: this.state.inputData });
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

  render() {
    const picker = (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            textAlignVertical: "center",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16
          }}
        >
          Select Language{" "}
        </Text>
        <Picker
          style={{ width: 100 }}
          selectedValue={this.state.language}
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue != "false") {
              this.setState({ language: itemValue, modalContent: "input" });
            }
          }}
        >
          <Picker.Item label="Select" value="false" />
          <Picker.Item label="C++" value="C++" />
          <Picker.Item label="C" value="C" />

          <Picker.Item label="Java" value="Java" />
          <Picker.Item label="JavaScript" value="Js" />
          <Picker.Item label="Python" value="Python" />
        </Picker>
      </View>
    );

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

    const userInput = (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              textAlignVertical: "center",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            User Input{" "}
          </Text>
          <TextInput
            onChangeText={changeText => {
              this.setState({ userInput: changeText });
            }}
            value={this.state.userInput}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Button
            title="Run Code"
            fontWeight="bold"
            buttonStyle={styles.button}
            raised
            containerViewStyle={{ borderRadius: 4 }}
            onPress={() => {
              this.runCode();
            }}
          />
        </View>
      </View>
    );

    let content = picker;
    if (this.state.modalContent == "input") {
      content = userInput;
    } else if (this.state.modalContent == "loader") {
      content = loader;
    }

    let fab = (
      <ActionButton
        buttonColor="rgb(66, 194, 244)"
        nativeFeedbackRippleColor="rgba(255,255,255,0.75)"
        renderIcon={() => {
          return <Ionicons name="ios-play" size={32} color="white" />;
        }}
        onPress={() => {
          this.refs.editorWebView.postMessage("collect");
        }}
      />
    );

    let fabButton = this.state.fab ? fab : false;

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
          style={{ width: this.state.webWidth, backgroundColor: "#141414" }}
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
    width: "80%",
    height: "25%",
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
