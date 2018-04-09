import {FontIcons} from '../../assets/icons';
import * as Screens from '../../screens/index';
import _ from 'lodash';

export const MainRoutes = [
  
  {
    id: 'MessagingMenu',
    title: 'Messaging',
    icon: FontIcons.mail,
    screen: Screens.MessagingMenu,
    children: [
      {
        id: 'Chat',
        title: 'Chat',
        screen: Screens.Chat,
        children: []
      },
      {
        id: 'ChatList',
        title: 'Chat List',
        screen: Screens.ChatList,
        children: []
      },
      {
        id: 'Comments',
        title: 'Comments',
        screen: Screens.Comments,
        children: []
      },
    ]
  },
  {
    id: 'DashboardsMenu',
    title: 'Dashboards',
    icon: FontIcons.dashboard,
    screen: Screens.DashboardMenu,
    children: [{
      id: 'Dashboard',
      title: 'Dashboard',
      screen: Screens.Dashboard,
      children: []
    },]
  },
  {
    id: 'WalkthroughMenu',
    title: 'Walkthroughs',
    icon: FontIcons.mobile,
    screen: Screens.WalkthroughMenu,
    children: [{
      id: 'Walkthrough',
      title: 'Walkthrough',
      screen: Screens.WalkthroughScreen,
      children: []
    }]
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
 id: 'Login2',
        title: 'Login V2',
        screen: Screens.LoginV2,
        */
  children: []
},);

menuRoutes.push({
  id: 'GridV1',
  title: 'Home',
  screen: Screens.GridV1,
  children: []
})

export const MenuRoutes = menuRoutes;