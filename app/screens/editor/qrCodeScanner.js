import React from "react";
import {
  ImageEditor,
  Image,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet
} from "react-native";
import Expo from 'expo';

import { RkCard, RkText, RkStyleSheet, RkButton } from "react-native-ui-kitten";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
let moment = require("moment");
import { scale, scaleModerate, scaleVertical } from "../../utils/scale";

export class QRScanner extends React.Component {
  static navigationOptions = {
    title: "QR Scanner".toUpperCase(),
    headerMode: true
  };

  constructor(props) {
    super(props);
    this.pickerChoice = false;
    
    this.state = {
      image: null,
      uploadImage: null,
      textCode: null,
      modalVisible: false,
      uploadStatus: "Loading...",
      modalContent: "picker",
      modalClick: false,
      barCode: false,
    };
  }

  componentWillUnmount() {
    this.onResetModal();
  }

  //Modal Section
  openModal = () => {
    this.setState({ modalVisible: true });
  };

  onResetModal = ()=>{
    this.setState({
      modalVisible: false,
      uploadStatus: "Loading...",
      modalContent: "loader",
      modalClick: false,
      
    });
  }

  onModalHidden = () => {
    /*
    if (this.state.modalClick) {
      let textString = this.state.textCode;
      this.setState({
        modalContent: "imageCrop",
        modalClick: false,
        textCode: ""
      });

      this.props.navigation.navigate("editor", {
        textCode: textString
      });
    }
    this.setState({
      modalContent: "imageCrop",
      modalClick: false
    });
    */

    return;
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  _handleBarCodeRead = ({ data}) =>{
    console.log(data);
      let barcodeData = data;
      this.setState({barCode: false});
      this.openModal();
      this.barcodeUpload(barcodeData);
  }

 barcodeUpload = barcodeData => {
      console.log("Running....");
      let barcodeUploadUrl = 'http://tesseract.eastus.cloudapp.azure.com/tutorials.php';
      console.log(barcodeData,"QR Data");
      fetch(barcodeUploadUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ hash: barcodeData })
      })
        .then(res => {
          console.log(res);
          let responseObj = JSON.parse(res._bodyText);
          let message = null;
          let status = responseObj.status;
          this.closeModal();
          switch(status){
              case 305:
              //
              break;

              case 301:
              message = 'Invalid request.\nPlease Try again!';
              break;

              case 302:
              message = 'Invalid JSON.\nPlease Try again!';
              break;

              case 200:
              this._loadData();
              message = responseObj.question;
              this.onResetModal();
              this.closeModal();
              this.props.navigation.navigate('CodeEditor',{
                  textCode: message
              })
              break;

              case 404:
              message = 'Invalid QR Code.\nPlease Try again!';
              break;

          }
        })  
        .catch(error => {
          this.setState({
            modalVisible: false,
          });
          console.log(error)
          alert("Error!\nPlease try again.");
        });
};


async _loadData(){
  const user1 = await AsyncStorage.getItem('@AuthStore:user');
  let user = JSON.parse(user1);

  if(user.codeScan == null){
    user.qrScan = 0;
  }else{
    user.qrScan += 1; 
  }

  await AsyncStorage.setItem('@AuthStore:user',JSON.stringify(user));
}

renderImage = image => {
  return (
    <Image
      style={{ width: 300, height: 200, resizeMode: "contain" }}
      source={image}
    />
  );
};

renderAsset = image => {
  return this.renderImage(image);
};

render() {

  const loader = (
    <View style={styles.modalContent}>
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

  let contentModal = loader;
  let codeScanner = (<View style={{ flex: 1 }}>
      <Expo.BarCodeScanner
        onBarCodeRead={this._handleBarCodeRead}
        barCodeTypes={[Expo.BarCodeScanner.Constants.BarCodeType.qr]}
        style={{ marginTop: scaleVertical(70) ,height: scaleVertical(450), width: scale(280) }}
      />
      </View>);

  codeScanner = this.state.barCode ? codeScanner: false;
  codeScannerIntro = (
  <View>
  <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
  <Text>Welcome</Text>
  <Text>Scan QR Code</Text>
  </View>
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
          marginBottom: scaleVertical(60),
          height: scaleVertical(44),
        }}
        backgroundColor="#EA4265"
        title="Scan QR"
        underlayColor = "transparent"
        textStyle={{  fontSize: 16  }}
        onPress={() => {
          //this.openModal();
          //this.props.navigation.navigate('IO');
          this.setState({barCode: true})
        }}
      />
  </View>
  );

  codeScannerIntro = this.state.barCode? false: codeScannerIntro;
  return (
    <View style={styles.container}>
    {codeScanner}
      <Modal

        isVisible={this.state.modalVisible}
        onBackButtonPress={() => {
          this.onResetModal();
        }}
        onModalHide={() => {
          this.onModalHidden();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>{contentModal}</View>
        </View>
      </Modal>
      {codeScannerIntro}
      

      {/*
          onPress={() => {
          this.props.navigation.navigate("editor", {
            textCode: this.state.textCode
          });
        }}
          */}
      
    </View>
  );
  /*
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Pick an image from camera roll"
        onPress={this._pickImage}
      />
      {image &&
        <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, resizeMode: 'contain' }} />}
    </View>
  );
  */
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalInnerContainer: {
    width: "80%",
    height: "20%",
    backgroundColor: "#fff",
    borderRadius: 10
  },
  modalContent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center"
  },
  button: { backgroundColor: "green", borderRadius: 3 },
  buttonContainer: { margin: 20 }
}));

/*
    const imageP = (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Button
          title="Open Camera"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={22}
          onPress={() => {
            this.onImage("openCamera");
          }}
        />

        <Button
          title="Open Gallery"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={22}
          onPress={() => {
            this.onImage("openPicker");
          }}
        />
      </View>
    );

    */
