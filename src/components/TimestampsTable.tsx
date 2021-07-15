import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TFunction } from 'i18next';
import { Moment } from 'moment';
import { useEffect, useMemo, useState, VFC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Table } from 'reactstrap';
import styles from 'modules/TimestampsTable.module.scss';

interface PropTypes {
  timestamp: Moment;
  locale: string;
  t: TFunction;
}

interface TimeValue {
  example: string;
  syntax: string;
}

export const TimestampsTable: VFC<PropTypes> = ({ locale, timestamp, t }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 5e3);

    return () => clearInterval(timer);
  }, []);

  const localizedTs = useMemo(() => timestamp.locale(locale), [timestamp, locale]);

  const timeInSeconds = localizedTs.locale(locale).format('X');
  const rows = useMemo<TimeValue[]>(() => {
    const shortDate: TimeValue = {
      example: localizedTs.format('L'),
      syntax: `<t:${timeInSeconds}:d>`,
    };
    const shortFull: TimeValue = {
      example: localizedTs.format('LLL'),
      syntax: `<t:${timeInSeconds}:f>`,
    };
    const shortTime: TimeValue = {
      example: localizedTs.format('LT'),
      syntax: `<t:${timeInSeconds}:t>`,
    };
    const longDate: TimeValue = {
      example: localizedTs.format('LL'),
      syntax: `<t:${timeInSeconds}:D>`,
    };
    const longFull: TimeValue = {
      example: localizedTs.format('LLL'),
      syntax: `<t:${timeInSeconds}:F>`,
    };
    const relativeTime: TimeValue = {
      example: localizedTs.from(now),
      syntax: `<t:${timeInSeconds}:R>`,
    };
    const longTime: TimeValue = {
      example: localizedTs.format('LTS'),
      syntax: `<t:${timeInSeconds}:F>`,
    };
    return [shortDate, shortFull, shortTime, longDate, longFull, relativeTime, longTime];
  }, [now, timeInSeconds, localizedTs]);

  return (
    <Table responsive>
      <thead>
        <tr>
          <th className={styles.syntaxColumn}>{t('table:syntax')}</th>
          <th>{t('table:example')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((value, i) => (
          <tr key={i}>
            <td className={styles.syntaxColumn}>
              <CopyToClipboard text={value.syntax}>
                <Button color="link" className="mr-2">
                  <FontAwesomeIcon icon="clipboard" />
                </Button>
              </CopyToClipboard>
              <code>{value.syntax}</code>
            </td>
            <td>{value.example}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
