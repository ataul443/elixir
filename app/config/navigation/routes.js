import { FontIcons } from "../../assets/icons";
import * as Screens from "../../screens/index";
import _ from "lodash";
import React from 'react'
import {FontAwesome,Ionicons}from "@expo/vector-icons";

export const MainRoutes = [
  {
    id: "Scanner",
    title: "Scanner",
    icon: <Ionicons name="md-qr-scanner" size={40}></Ionicons>,
    screen: Screens.Scanner,
    children: []
  },
  {
    id: "CodeEditor",
    title: "Code Dojo",
    icon: (<FontAwesome name="code" size={40}></FontAwesome>),
    screen: Screens.CodeEditor,
    children: []
  },
  {
    id: "QRScanner",
    title: "QR Reader",
  icon: <FontAwesome name="qrcode" size={40}></FontAwesome>,
    screen: Screens.QRScanner,
    children: []
  },
];

export const SideRoutes = [
  {
    id: "Scanner",
    title: "Scanner",
    icon: <Ionicons name="md-qr-scanner" size={32}></Ionicons>,
    screen: Screens.Scanner,
    children: []
  },
  {
    id: "CodeEditor",
    title: "Code Dojo",
    icon: (<FontAwesome name="code" size={32}></FontAwesome>),
    screen: Screens.CodeEditor,
    children: []
  },
  {
    id: "QRScanner",
    title: "QR Reader",
  icon: <FontAwesome name="qrcode" size={32}></FontAwesome>,
    screen: Screens.QRScanner,
    children: []
  },
];
let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  
  id: 'GridV1',
  title: 'Home',
  screen: Screens.GridV1,
  
  
  /*
  id: "QRScanner",
title: "QR Reader",
  id: "Scanner",
  title: "Scanner",
*/

  //screen: Screens.QRScanner,

  children: []
});

menuRoutes.push({
  id: "GridV1",
  title: "Home",
  screen: Screens.GridV1,
  children: []
});

export const MenuRoutes = menuRoutes;
