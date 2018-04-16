import { FontIcons } from "../../assets/icons";
import * as Screens from "../../screens/index";
import _ from "lodash";
import React from "react";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

export const MainRoutes = [
  {
    id: "Scanner",
    title: "Scanner",
    icon: <Ionicons name="md-qr-scanner" size={40} />,
    screen: Screens.Scanner,
    children: []
  },
  {
    id: "CodeEditor",
    title: "Code Dojo",
    icon: <FontAwesome name="code" size={40} />,
    screen: Screens.CodeEditor,
    children: []
  },
  {
    id: "QRScanner",
    title: "QR Reader",
    icon: <FontAwesome name="qrcode" size={40} />,
    screen: Screens.QRScanner,
    children: []
  },
  {
    id: "Profile",
    title: "Profile",
    icon: FontIcons.profile,
    screen: Screens.ProfileV1,
    children: []
  }
];

export const SideRoutes = [
  {
    id: "Profile",
    title: "Profile",
    icon: FontIcons.profile,
    screen: Screens.ProfileV1,
    children: []
  },
  {
    id: "Settings",
    title: "Settings",
    icon: FontIcons.dashboard,
    screen: Screens.Settings,
    children: []
  }
];
let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: "GridV1",
  title: "Home",
  screen: Screens.GridV1,

  /*
  id: "QRScanner",
title: "QR Reader",
  ,

  id: "Scanner",
  title: "Scanner",
  screen: Screens.QRScanner,
  */

  children: []
});

menuRoutes.push({
  id: "Logout",
  title: "Auth",
  screen: Screens.LoginV2,
  children: []
});

menuRoutes.push({
  id: "GridV1",
  title: "Dashboard",
  screen: Screens.GridV1,
  children: []
});

export const MenuRoutes = menuRoutes;
