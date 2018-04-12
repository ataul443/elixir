import React from "react";
import {
  ImageEditor,
  Image,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { StackNavigator } from "react-navigation";
import { Ionicons, Entypo } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { RkStyleSheet, RkPicker } from "react-native-ui-kitten";
import { Button } from "react-native-elements";
import ActionButton from "react-native-action-button";

let moment = require("moment");

const languages = [{ key: 1, value: "Jun" }, { key: 2, value: "Feb" }];

export default class IO extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "IO".toUpperCase(),
      headerLeft: (
        <Entypo
          style={{ marginLeft: 10 }}
          name="chevron-left"
          size={32}
          colors="black"
          onPress={navigation => {
            navigation.goBack();
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    let codeText = props.navigation.state.params.code;
    if (!codeText || codeText.length == 0 ){
       codeText = "//! NO Code Found !\n\n";

       alert("No COde Found");
    }else{
      //alert(codeText);
    }
    
    this.state = {
      text: "Input Goes Here",
      language: "C++",
      modalVisible: false,
      modalIdentifier: "picker",
      code: codeText,
      userInput: "",
      expectedOutput: ""
    };
  }

  runCode = () => {
    var params = {
      code: this.state.code,
      language: this.state.language,
      input: this.state.userInput,
      output: this.state.expectedOutput
    };
    var formBody = [];
    for (var property in params) {
      var encodeKey = encodeURI(property);
      var encodeValue = encodeURIComponent(params[property]);
      formBody.push(encodeKey + "=" + encodeValue);
    }
    formBody = formBody.join("&");
    console.log(formBody);
    let url = "http://nextvac.eastus.cloudapp.azure.com/judge.php";
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
        let respBody = JSON.parse(res._bodyText);
        console.log(respBody);
        this.closeModal();
        this.props.navigation.navigate("Output", {
          codeResponse: respBody
        });
      })
      .catch(error => console.log(error));
  };

  openModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  onModalHidden = () => {
    return;
  };
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
          Compiling Code ....
        </Text>
      </View>
    );
    const imageCrop = (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Button
          title="C++"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            this.setState({ modalIdentifier: "loader" });
            this.runCode();
          }}
        />
        <Button
          title="Python"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            alert("Python support is coming soon.");
          }}
        />
        <Button
          title="Java"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            alert("Java support is coming soon.");
          }}
        />
      </View>
    );
    let fab = (
      <ActionButton
        buttonColor="rgb(66, 194, 244)"
        nativeFeedbackRippleColor="rgba(255,255,255,0.75)"
        renderIcon={() => {
          return <Ionicons name="ios-play" size={32} color="white" />;
        }}
        onPress={() => {
          this.openModal();
        }}
      />
    );

    let modal = this.state.modalIdentifier != "picker" ? loader : imageCrop;

    let fabButton =
      this.state.userInput && this.state.expectedOutput ? fab : false;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text
            style={{
              marginTop: 40,
              marginLeft: 40,
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            {" "}
            User Input:
          </Text>
          <View
            style={{
              marginLeft: 40,
              marginTop: 20,
              width: "80%",
              height: 100,
              borderRadius: 8,
              backgroundColor: "white"
            }}
          >
            <TextInput
              multiline
              style={{
                marginLeft: "5%",
                marginTop: "5%",
                width: "80%",
                marginRight: "5%"
              }}
              onChangeText={value => {
                this.setState({ userInput: value });
              }}
            />
          </View>
        </View>

        <Modal
          isVisible={this.state.modalVisible}
          onBackButtonPress={() => {
            this.closeModal();
          }}
          onModalHide={() => {
            this.onModalHidden();
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>{modal}</View>
          </View>
        </Modal>

        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text
            style={{
              marginTop: 40,
              marginLeft: 40,
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            {" "}
            Expected Output:
          </Text>
          <View
            style={{
              marginLeft: 40,
              marginTop: 20,
              width: "80%",
              height: 100,
              borderRadius: 8,
              backgroundColor: "white"
            }}
          >
            <TextInput
              multiline
              style={{
                marginLeft: "5%",
                marginTop: "5%",
                width: "80%",
                marginRight: "5%"
              }}
              onChangeText={value => {
                this.setState({ expectedOutput: value });
              }}
            />
          </View>
        </View>
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
  container: { flex: 1, flexDirection: "column" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalInnerContainer: {
    width: "60%",
    height: "20%",
    backgroundColor: "#fff",
    borderRadius: 10
  },
  modalContent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center"
  }
}));
