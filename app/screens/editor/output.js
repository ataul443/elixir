import React from "react";
import { View, Image, ScrollView, Dimensions,Text } from "react-native";

import { RkText, RkStyleSheet, RkTheme } from "react-native-ui-kitten";

import { FontAwesome } from "../../assets/icons";
import { Ionicons, Entypo } from "@expo/vector-icons";

import {
  ProgressChart,
  DoughnutChart,
  AreaChart,
  AreaSmoothedChart
} from "../../components/";

export default class Output extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Output".toUpperCase(),
    };
  };

  constructor(props) {
    super(props);
    let respBody = null;
    if(this.props.navigation.state.params) respBody = this.props.navigation.state.params.codeResponse;
    else respBody = {"true": true}
    console.log(respBody);
    this.status = "CE";
    this.error = null;
    this.output = null;
    if (respBody.compile_status == "OK") {
      this.status = respBody.run_status.status;
      this.output = respBody.run_status.output;
    }else{
      this.error = respBody.error;
    }
    this.data = {
      statItems: [
        {
          name: "Stars",
          value: "4,512",
          icon: "github",
          background: RkTheme.current.colors.dashboard.stars
        },
        {
          name: "Tweets",
          value: "2,256",
          icon: "twitter",
          background: RkTheme.current.colors.dashboard.tweets
        },
        {
          name: "Likes",
          value: "1,124",
          icon: "facebook",
          background: RkTheme.current.colors.dashboard.likes
        }
      ]
    };
  }

  render() {
    let chartBlockStyles = [
      styles.chartBlock,
      {
        backgroundColor: RkTheme.current.colors.control.background,
        marginTop: 40
      }
    ];
    let errors = [];
    if(this.error!= null && this.error.length > 0){
      this.error.forEach(element => {
        console.log(element)
        errors.push(<Text style={{fontFamily: RkTheme.current.fonts.family.regular, padding: 10,color:RkTheme.current.colors.charts.doughnut[3]}}>{element}</Text>);
      })
    }

    let outputCode = (<Text style={{fontFamily: RkTheme.current.fonts.family.regular, padding: 10}}>{this.output}</Text>)

    let outputView = (<View style={chartBlockStyles}>
        
      <Text style={{fontFamily: RkTheme.current.fonts.family.bold, paddingBottom: 20}}>Your Output: </Text>
      {outputCode}
      </View>)
    let errorView = (<View style={chartBlockStyles}>
        
      <Text style={{fontFamily: RkTheme.current.fonts.family.bold, paddingBottom: 20}}>Error: </Text>
      {errors}
      </View>)
    return (
      <ScrollView style={styles.screen}>
        <View style={chartBlockStyles}>
          <DoughnutChart status={this.status}/>
        </View>
        {this.error? (errorView): false}
        {this.output? (outputView): false}
      </ScrollView>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.scroll,
    paddingHorizontal: 15
  },
  statItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15
  },
  statItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  statItemIcon: {
    alignSelf: "center",
    marginLeft: 10,
    color: "white"
  },
  statItemValue: {
    color: "white"
  },
  statItemName: {
    color: "white"
  },
  chartBlock: {
    padding: 15,
    marginBottom: 15,
    justifyContent: "center"
  }
}));
