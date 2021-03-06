import {Component, ViewChild} from "@angular/core";
import {Platform, Nav} from "ionic-angular";
import {StatusBar, Splashscreen, InAppBrowser} from "ionic-native";
import {TabsPage} from "../pages/tabs/tabs";
import {SettingsPage} from "../pages/settings/settings";
import {PageInterface, UtilService} from "../pages/providers";
import * as _ from "lodash";

@Component({
  templateUrl: 'app.html'
})
export class MosumApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = TabsPage;
  pages: Array<{heading: string,items: PageInterface[]}> = [
    {
      heading: 'Weather',
      items: [
        {title: 'Home', component: TabsPage, index: 0, icon: 'home', active: true},
        {title: 'World', component: TabsPage, index: 1, icon: 'globe', active: false}
      ]
    },
    {
      heading: 'Settings',
      items: [
        {title: 'Settings', component: SettingsPage, icon: 'settings', active: false}
      ]
    }
  ];

  constructor(platform: Platform, public utilService: UtilService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleLightContent();
      StatusBar.backgroundColorByHexString("#12121c");
      Splashscreen.hide();
      this.init();
    });
  }

  openPage(page: PageInterface) {
    //if page active, do nothing
    if (page.active) {
      return;
    }
    //inactive all pages
    this.resetMenu();
    //active current page
    page.active = !page.active;
    if (page.index === undefined) {
      this.nav.setRoot(page.component);
    } else {
      this.nav.setRoot(page.component, {tabIndex: page.index});
    }
  }

  init() {
    this.utilService.getTabChangeEvent().subscribe(tabIndex => {
      this.resetMenu();
      let obj = this.findPage(tabIndex);
      if (obj) {
        _.set(obj, 'active', true);
      }
    });
  }

  resetMenu() {
    _.forEach(this.pages, page => _.forEach(page.items, item => {
      item.active = false
    }));
  }

  findPage(index: number): PageInterface {
    let result = null;
    _.forEach(this.pages, page => {
      let obj = _.find(page.items, {index: index});
      if (obj) {
        result = obj;
        return false;
      }
    });
    return result;
  }

  poweredBy() {
    new InAppBrowser('https://darksky.net/poweredby/', '_system');
  }
}
