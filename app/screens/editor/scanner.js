import React from "react";
import {
  ImageEditor,
  Image,
  View,
  Text,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { ImagePicker } from "expo";

import { RkCard, RkText, RkStyleSheet, RkButton } from "react-native-ui-kitten";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
let moment = require("moment");

export class Scanner extends React.Component {
  static navigationOptions = {
    title: "Scanner".toUpperCase(),
    headerMode: true
  };

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploadImage: null,
      textCode: null,
      modalVisible: false,
      uploadStatus: "Loading...",
      modalContent: "imageCrop",
      modalClick: false,
      cropChoice: false
    };
  }

  //Modal Section
  openModal = () => {
    this.setState({ modalVisible: true });
  };

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

  _pickImage = async crop => {
    let result = await ImagePicker.launchImageLibraryAsync({
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
      this.closeModal();
      this.setState({ image: result, modalContent: "imageFilter" });
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
        let responseObj = JSON.parse(res._bodyText);
        let textString = responseObj.text;
        this.setState({ textCode: res._bodyText, modalClick: true });
        console.log(textString, "text String");
        this.closeModal();

        this.props.navigation.navigate("CodeEditor", {
          textCode: this.state.textCode
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

  render() {
    let { image } = this.state;
    console.log(
      this.state.image,
      "image data\n",
      this.state.uploadImage,
      "uploade image"
    );

    const imageFilter = (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
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
          title="Cropped Image"
          buttonStyle={{ backgroundColor: "transparent" }}
          containerViewStyle={{ width: "100%" }}
          textStyle={{ color: "black" }}
          fontSize={18}
          onPress={() => {
            this._pickImage(true);
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
      case "picker":
        contentModal = imageP;
        break;
      case "loader":
        contentModal = loader;
        break;
      case "imageFilter":
        contentModal = imageFilter;
        break;
      default:
        contentModal = imageCrop;
        break;
    }

    return (
      <View style={styles.container}>
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
            <View style={styles.modalInnerContainer}>{contentModal}</View>
          </View>
        </Modal>
        <ScrollView>
          {this.state.image ? this.renderAsset(this.state.image) : null}
        </ScrollView>
        <Text>Welcome</Text>
        <Text>Please Capture an Image.</Text>
        <Text>Or</Text>
        <Text>Select one from gallery.</Text>

        {/*
            onPress={() => {
            this.props.navigation.navigate("editor", {
              textCode: this.state.textCode
            });
          }}
            */}

        <RkButton
          rkType="primary"
          style={{
            borderRadius: 50,
            width: 90,
            height: 90,
            marginBottom: 60
          }}
          onPress={() => {
            this.openModal();
            //this.props.navigation.navigate('IO');
          }}
        >
          <Image
            style={{ width: 60, height: 60 }}
            source={require("../../assets/images/scan.png")}
          />
        </RkButton>
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
