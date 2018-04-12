import React from "react";
import { View, Image, ScrollView, Dimensions } from "react-native";

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
      headerLeft: (
        <Entypo
          style={{ marginLeft: 10 }}
          name="chevron-left"
          size={32}
          colors="black"
          onPress={() => {
            navigation.goBack();
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    let respBody = this.props.navigation.state.params.codeResponse;
    console.log(respBody);
    this.status = "CE";

    if (respBody.run_status) {
      status = respBody.run_status.status;
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
    return (
      <ScrollView style={styles.screen}>
        <View style={chartBlockStyles}>
          <DoughnutChart status={this.status} />
        </View>
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
