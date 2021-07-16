import 'moment/locale/en-gb';
import 'moment/locale/hu';
import 'moment/locale/fr';
import moment from 'moment-timezone';
import latestTimezoneData from 'moment-timezone/data/packed/latest.json';

moment.tz.load(latestTimezoneData);
