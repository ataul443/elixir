import React from "react";
import {
  ImageEditor,
  Image,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  AsyncStorage
} from "react-native";
import { ImagePicker } from "expo";
import { RkCard, RkText, RkStyleSheet, RkButton } from "react-native-ui-kitten";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
let moment = require("moment");
import { scale, scaleModerate, scaleVertical } from "../../utils/scale";
import {MaterialIcons,Entypo} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

export class Scanner extends React.Component {
  static navigationOptions = {
    title: "Scanner".toUpperCase(),
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
      image: null,
      uploadImage: null,
      textCode: null,
      modalVisible: false,
      uploadStatus: "Loading...",
      modalContent: "picker",
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

  _pickImage = async (crop,picker) => {
    this.closeModal();
    let imagePicker = null;
    if(picker == 'Camera') imagePicker = ImagePicker.launchCameraAsync;
    else imagePicker = ImagePicker.launchImageLibraryAsync;
    let result = await imagePicker({
      base64: true,
      allowsEditing: crop,
      aspect: [4, 3]
    });

    if (result.cancelled) {
      console.log("got here");
      this.setState({
        modalContent: "imageCrop",
        modalVisible: false
      });
      return;
    } else {
      //console.log(result,"full size base64");
      
      this.setState({ image: result, modalContent: "imageFilter" });
      console.log(this.state.image);
      this.openModal();
    }

    /*
    let resizedUri = await new Promise((resolve, reject) => {
      ImageEditor.cropImage(
        result.uri,
        {
          offset: { x: 0, y: 0 },
          size: { width: result.width, height: result.height },
          displaySize: { width: 50, height: 50 },
          resizeMode: "contain"
        },
        uri => {
          ImageStore.getBase64ForTag(
            uri,
            data => {
              // data == base64 encoded image
              //console.log(data,"base64 resized")
            },
            e => console.warn("getBase64ForTag: ", e)
          );
        },
        e => console.warn("cropImage: ", e)
      );
    });

    // this gives you a rct-image-store URI or a base64 image tag that
    // you can use from ImageStore

    */
  };

  _onUpload = choice => {
    let imageBase64 = `data:image/jpg;base64,${this.state.image.base64}`;
    this.setState({ uploadStatus: "Uploading Image..." });
    if (choice != "b/w") {
      console.log("Running....Tess");
      this.tessaractUpload(imageBase64);
    } else {
      console.log("Running....");
      const colourToBwImage = `http://tesseract.eastus.cloudapp.azure.com/image.php`;
      fetch(colourToBwImage, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          fileToUpload: imageBase64,
          type: "jpg"
        })
      })
        .then(res => {
          console.log(res);
          let responseObj = JSON.parse(res._bodyText);
          let imageData = responseObj.image;
          this.setState({ uploadStatus: "Recognising Code..." });
          this.tessaractUpload(imageData);
        })
        .catch(error => {
          this.setState({
            modalVisible: false,
            modalContent: "imageCrop"
          });
          alert("Error!\nPlease try again." + "\n" + error);
        });
    }
  };

  tessaractUpload = imageData => {
    console.log("Running....");
    let imageToText = `http://tesseract.eastus.cloudapp.azure.com/tesseract.php`;
    fetch(imageToText, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ fileToUpload: imageData, type: "png" })
    })
      .then(res => {
        this._loadData();
        let responseObj = JSON.parse(res._bodyText);
        console.log(res);
        let textString = responseObj.text;
        console.log(textString, "text String");
        this.closeModal();
        this.onResetModal();

        this.props.navigation.navigate("CodeEditor", {
          textCode: textString
        });
      })
      .catch(error => {
        this.setState({
          modalVisible: false,
          modalContent: "imageCrop"
        });
        alert("Error!\nPlease try again.");
      });
  };

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

  _loadData = async ()=>{
    const user1 = await AsyncStorage.getItem('@AuthStore:user');
    let user = JSON.parse(user1);

    if(user.codeScan == null){
      user.codeScan = 0;
    }else{
      user.codeScan += 1; 
    }

    await AsyncStorage.setItem('@AuthStore:user',JSON.stringify(user));
  }

  render() {
    let { image } = this.state;
    console.log(
      this.state.image,
      "image data\n",
      this.state.uploadImage,
      "uploade image"
    );


    const imageP = (
      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text style={{fontSize: 14, marginLeft: 30,marginTop: 20, fontWeight: 'bold',  width: '100%'}}>Select Image from</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
      <RkButton
     onPress={() => {
      this.pickerChoice = 'Camera';
      this.setState({modalContent: 'imageCrop'});
    }}
      style={{backgroundColor: '#dcdde1', width: 80,height: 80, margin: 10}}>
        <MaterialIcons  name={'camera-alt'} size={44}></MaterialIcons>
      </RkButton>
     

        <RkButton
        onPress={() => {
          this.pickerChoice = 'ImageLibrary';
          this.setState({modalContent: 'imageCrop'});
        }} style={{backgroundColor: '#dcdde1',width: 80,height: 80, margin: 10}}>
          <Ionicons name={'md-images'} size={44}></Ionicons>
        </RkButton>
      </View>
      </View>
    );
     {/*
        <Button
          title="Open Camera"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={22}
          onPress={() => {
            this.pickerChoice = 'Camera';
            this.setState({modalContent: 'imageCrop'});
          }}
        />
          
        <Button
          title="Open Gallery"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={22}
          onPress={() => {
            this.pickerChoice = 'ImageLibrary';
            this.setState({modalContent: 'imageCrop'});
          }}
        />
        **/}

    const imageFilter = (
      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text style={{fontSize: 14, marginLeft: 30,marginTop: 20, fontWeight: 'bold',  width: '100%'}}>Is Image in Black and White?</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >

      <RkButton
      onPress={() => {
        this._onUpload("color");
        this.setState({
          modalContent: "loader"
        });
      }}
      style={{backgroundColor: '#dcdde1', width: 80,height: 80, margin: 10}}>
        <MaterialIcons style={{color: 'green'}}  name={'check'} size={44}></MaterialIcons>
      </RkButton>
     

        <RkButton
         onPress={() => {
          this._onUpload("b/w");
          this.setState({
            modalContent: "loader"
          });
        }}
        style={{backgroundColor: '#dcdde1',width: 80,height: 80, margin: 10}}>
          <Entypo style={{color: '#C62828'}} name={'cross'} size={44}></Entypo>
        </RkButton>
      {/*
        <Button
          title="B/W Image Upload"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            this._onUpload("b/w");
            this.setState({
              modalContent: "loader"
            });
          }}
        />
        <Button
          title="Non B/W Image Upload"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            this._onUpload("color");
            this.setState({
              modalContent: "loader"
            });
          }}
        />
        **/}
      </View>
      </View>
      
    );

    const imageCrop = (
      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text style={{fontSize: 14, marginLeft: 30,marginTop: 20, fontWeight: 'bold',  width: '100%'}}>Select Image format</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >


        <RkButton
     onPress={() => {
      this._pickImage(true,this.pickerChoice);
    }}
      style={{backgroundColor: '#dcdde1', width: 80,height: 80, margin: 10}}>
        <MaterialIcons  name={'crop'} size={44}></MaterialIcons>
      </RkButton>
     

        <RkButton
        onPress={() => {
          this._pickImage(false);
        }}
        style={{backgroundColor: '#dcdde1',width: 80,height: 80, margin: 10}}>
          <MaterialIcons name={'image'} size={44}></MaterialIcons>
        </RkButton>

      </View>
      {/*
        <Button
          title="Cropped Image"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            this._pickImage(true,this.pickerChoice);
          }}
        />
        <Button
          title="Full Image"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            this._pickImage(false);
          }}
        />
        **/}

      </View>
      

      
      
      
    );

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

    let contentModal = null;
    switch (this.state.modalContent) {
      case "imageCrop":
        contentModal = imageCrop;
        break;
      case "loader":
        contentModal = loader;
        break;
      case "imageFilter":
        contentModal = imageFilter;
        break;
      default:
        contentModal = imageP;
        break;
    }

    return (
      <View style={styles.container}>
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
        <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
        <Text>Welcome</Text>
        <Text>Please Capture an Image.</Text>
        <Text>Or</Text>
        <Text>Select one from gallery.</Text>
        </View>
        

        {/*
            onPress={() => {
            this.props.navigation.navigate("editor", {
              textCode: this.state.textCode
            });
          }}
            */}
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
          title="Scan Image"
          underlayColor = "transparent"
          textStyle={{  fontSize: 16  }}
          onPress={() => {
            this.openModal();
            //this.props.navigation.navigate('IO');
          }}
        />
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
    width: "70%",
    height: "25%",
    backgroundColor: "#f5f6fa",
    
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
