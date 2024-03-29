import React from "react";
import { View, Image, Dimensions } from "react-native";
import {
  RkComponent,
  RkText,
  RkTheme,
  RkStyleSheet
} from "react-native-ui-kitten";

import { VictoryPie } from "victory-native";

import { Svg, Text as SvgText } from "react-native-svg";
import { scale } from "../../utils/scale";

export class DoughnutChart extends RkComponent {
  constructor(props) {
    super(props);
    let status = this.props.status;
    let colors = null;
    let statusCode = "CE";
    console.log(status, "dougnut status");
    switch (status) {
      case "CE":
        status = "Compilation Errors";
        colors = RkTheme.current.colors.charts.doughnut[0];
        break;

      case "AC":
        statusCode = "AC";
        status = "Accepted Answer";
        colors = RkTheme.current.colors.charts.doughnut[2];
        break;

      case "TLE":
        statusCode = "TLE";
        status = "Time Limit Exceeded";
        colors = RkTheme.current.colors.charts.doughnut[1];
        break;

      case "WA":
        statusCode = "WA";
        status = "Wrong Answer";
        colors = RkTheme.current.colors.charts.doughnut[3];
        break;

      case "MLE":
        statusCode = "MLE";
        status = "Memory Limit Exceeded";
        colors = RkTheme.current.colors.charts.doughnut[1];
        break;
    }
    this.size = 300;
    this.fontSize = 40;
    this.state = {
      selected: 0,
      statusCode: statusCode,
      data: [
        {
          x: 1,
          y: 240,
          title: "24%",
          name: status,
          color: colors
        }
        /** 
        {
          x: 2,
          y: 270,
          title: "27%",
          name: "Comments",
          color: RkTheme.current.colors.charts.doughnut[1]
        },
        {
          x: 3,
          y: 170,
          title: "17%",
          name: "Shares",
          color: RkTheme.current.colors.charts.doughnut[2]
        },
        {
          x: 4,
          y: 1020,
          title: "32%",
          name: "People",
          color: RkTheme.current.colors.charts.doughnut[3]
        }
        */
      ]
    };
  }

  computeColors() {
    return this.state.data.map(i => i.color);
  }

  handlePress(e, props) {
    this.setState({
      selected: props.index
    });
  }

  render() {
    return (
      <View>
        <RkText rkType="header4">RESULT OVERVIEW</RkText>
        <View style={{ alignSelf: "center" }}>
          <Svg width={scale(this.size)} height={scale(this.size)}>
            <VictoryPie
              labels={[]}
              width={scale(this.size)}
              height={scale(this.size)}
              colorScale={this.computeColors()}
              data={this.state.data}
              standalone={false}
              padding={scale(25)}
              innerRadius={scale(70)}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPressIn: (evt, props) => this.handlePress(evt, props)
                  }
                }
              ]}
            />
            <SvgText
              textAnchor="middle"
              verticalAnchor="middle"
              x={scale(this.size / 2)}
              y={scale(this.size / 2 - this.fontSize / 2)}
              dy={scale(this.fontSize * -0.25)}
              height={scale(this.fontSize)}
              fontSize={scale(this.fontSize)}
              fontFamily={RkTheme.current.fonts.family.regular}
              stroke={RkTheme.current.colors.text.base}
              fill={RkTheme.current.colors.text.base}
            >
              {this.state.statusCode}
            </SvgText>
          </Svg>
        </View>
        <View style={styles.legendContainer}>
          {this.state.data.map(item => {
            return (
              <View key={item.name} style={styles.legendItem}>
                <View
                  style={[styles.itemBadge, { backgroundColor: item.color }]}
                />
                <RkText rkType="primary3">{item.name}</RkText>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5
  }
}));
