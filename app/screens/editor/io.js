import React from "react";
import {
  ImageEditor,
  Image,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Keyboard
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import { Ionicons, Entypo } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { RkStyleSheet, RkPicker } from "react-native-ui-kitten";
import { Button, Card } from "react-native-elements";
import ActionButton from "react-native-action-button";
import { scale, scaleModerate, scaleVertical } from "../../utils/scale";



let moment = require("moment");

const languages = [{ key: 1, value: "Jun" }, { key: 2, value: "Feb" }];

export default class IO extends React.Component {
  static navigationOptions = ({ navigate }) => {
    return {
      title: "IO".toUpperCase(),
      /** 
      headerLeft: (
        <Entypo
          style={{ marginLeft: 10 }}
          name="chevron-left"
          size={32}
          colors="black"
          onPress={() => {
          
            let resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({routeName: 'GridV1'})
              ]
            });
            navigation.dispatch(resetAction)
          
            navigate('Scanner');
          }}
        />
      )
      */
    };
  };

  constructor(props) {
    super(props);
    let codeText = null;
    if(props.navigation.state.params) codeText = props.navigation.state.params.code;
     
    if (!codeText || codeText.length == 0 ){
       codeText = "//! NO Code Found !\n\n";

       //alert("No COde Found");
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
      expectedOutput: "",
      runButton: true
    };
  }

  componentDidMount(){
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide); 
   }
  componentDidUpdate(){

  }

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
        this.setState({modalIdentifier: 'picker'})
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
      /*
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
      */
     <Button
          small
          raised
          
          buttonStyle={{
            borderRadius: 30,
            backgroundColor: "#EA4265",
            height: scaleVertical(44),
          }}
          containerViewStyle={{
            borderRadius: 30,
            width: scale(120),
            
            marginBottom: scaleVertical(40),
            height: scaleVertical(44),
          }}
          backgroundColor="#EA4265"
          title="Run Code"
          underlayColor = "transparent"
          textStyle={{  fontSize: 16  }}
          onPress={() => {
            this.openModal();
            //this.props.navigation.navigate('IO');
          }}
        />
    );

    let modal = this.state.modalIdentifier != "picker" ? loader : imageCrop;

    let fabButton =
    this.state.runButton && this.state.userInput && this.state.expectedOutput ? fab : false;

    return (
      <View style={styles.container}>
      
        <View style={{ flex: 1, flexDirection: "column" }}>
        <Card title='User Input'>
        <TextInput multiline
        underlineColorAndroid='transparent'
        value={this.state.userInput}
        style={{
    
         height: scale(80),
          margin: scale(10),
          padding: scale(10),
          borderColor: "#b2bec3",
          borderWidth: 1,
          textAlignVertical: 'top'
        
      }}
      onChangeText={(value)=>{
        this.setState({userInput: value})
      }}
      ></TextInput>

        </Card>
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
          
            <Card title='Expected Output'>
            <TextInput multiline
            
            
            underlineColorAndroid='transparent'
            value={this.state.expectedOutput}
        style={{
    
         height: scale(80),
          margin: scale(10),
          padding: scale(10),
          borderColor: "#b2bec3",
          borderWidth: 1,
          textAlignVertical: 'top'
        
      }}
      onChangeText={(value)=>{
        this.setState({expectedOutput: value})
      }}
      ></TextInput>

            </Card>
      </View>
      <View style={{justifyContent: 'center',alignItems:'center'}}>
        {fabButton}
        </View>
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
