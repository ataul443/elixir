import { FontIcons } from "../../assets/icons";
import * as Screens from "../../screens/index";
import _ from "lodash";

export const MainRoutes = [
  {
    id: "MessagingMenu",
    title: "Messaging",
    icon: FontIcons.mail,
    screen: Screens.MessagingMenu,
    children: [
      {
        id: "Chat",
        title: "Chat",
        screen: Screens.Chat,
        children: []
      },
      {
        id: "ChatList",
        title: "Chat List",
        screen: Screens.ChatList,
        children: []
      },
      {
        id: "Comments",
        title: "Comments",
        screen: Screens.Comments,
        children: []
      }
    ]
  },
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: FontIcons.dashboard,
    screen: Screens.Dashboard,
    children: []
  },
  {
    id: "Scanner",
    title: "Scanner",
    icon: FontIcons.mail,
    screen: Screens.Scanner,
    children: []
  },
  {
    id: "CodeEditor",
    title: "Code Dojo",
    icon: FontIcons.mail,
    screen: Screens.CodeEditor,
    children: []
  },
];

let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  /*
  id: 'GridV1',
  title: 'Home',
  screen: Screens.GridV1,
  */

  /*
  id: "Scanner",
  title: "Scanner",
*/
  id: "CodeEditor",
    title: "Code Dojo",
  screen: Screens.Scanner,

  children: []
});

menuRoutes.push({
  id: "GridV1",
  title: "Home",
  screen: Screens.GridV1,
  children: []
});

export const MenuRoutes = menuRoutes;
