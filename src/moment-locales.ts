import 'moment/locale/ar';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/fr';
import 'moment/locale/hu';
import 'moment/locale/ru';
import 'moment/locale/pt-br';
import moment from 'moment-timezone';
import latestTimezoneData from 'moment-timezone/data/packed/latest.json';

moment.tz.load(latestTimezoneData);
