import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import light from './theme'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: {
          base: '#FFE800',
          darken1: '#ebd500',
          darken2: '#dec900',
          darken3: '#c7b400',
          darken4: '#a69600'
        },
        accent: '#000000',
        secondary: '#00B4EE',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
        bannercolor: '#FFFFFF'
      },
      dark: {
        primary: {
          base: '#FFE800',
          darken1: '#ebd500',
          darken2: '#dec900',
          darken3: '#c7b400',
          darken4: '#a69600'
        },
        secondary: '#00B4EE'
      }
    },
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});
