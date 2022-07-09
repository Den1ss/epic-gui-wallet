
import { createApp } from 'vue'
import { store } from './store/index'
import router from './router'
import { createI18n } from 'vue-i18n/index'
import walletService from './shared/walletService.js';
import nodeService from './shared/nodeService.js';
import ngrokService from './shared/ngrokService.js';
import configService from './shared/configService.js';
import userService from './shared/userService.js';
import addressbookService from './shared/addressbookService.js';
import addressTransactionsService from './shared/addressTransactionService.js';
import {words} from './shared/words.js';
import App from './App.vue'
import mitt from 'mitt';
import moment from 'moment'
import Toaster from "@meforma/vue-toaster";



import './assets/css/epiccashApp.scss';
import './assets/css/animate.css';

import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';

import en from './lang/en';
import zh from './lang/zh';
import ru from './lang/ru';


const messages = {
  en,
  ru,
  zh,
}

const emitter = mitt();
const app = createApp(App);
const i18n = createI18n({
  locale: 'en',
  messages
})

app.use(i18n);
app.use(mdiVue, {
  icons: mdijs
});
app.use(store);
app.use(router);
app.use(Toaster);


let config = new configService(emitter);
app.config.globalProperties.$walletService = new walletService(emitter, config);
app.config.globalProperties.$nodeService = new nodeService(emitter, config);
app.config.globalProperties.$ngrokService = new ngrokService(emitter, config);

app.config.globalProperties.$userService =  new userService();
app.config.globalProperties.$addressBookService =  new addressbookService();
app.config.globalProperties.$addressTransactionsService =  new addressTransactionsService();
app.config.globalProperties.configService = config;
app.config.globalProperties.mnemonicWords = words;
app.config.globalProperties.$filters = {
  datetimeFormat(date) {

     if(date != undefined){
       let formatDatetime = moment(date).format('YYYY-MM-DD, HH:mm:ss');
       return formatDatetime
     }else{
       return '-'
     }
  },
  truncate(text, length) {
    if (text.length > length) {
        return text.substring(0, length);
    } else {
        return text;
    }
  },
  truncateMid(fullStr, strLen){
    if (fullStr.length <= strLen) return fullStr;

    let separator = '...';

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2);

    return fullStr.substr(0, frontChars) +
           separator +
           fullStr.substr(fullStr.length - backChars);
  },
  paymentProof(data, field){
    if(data && data[field]){
      return data[field];
    }else{
      return ''
    }
  }

}
app.config.globalProperties.emitter = emitter;
app.mount('#app');
