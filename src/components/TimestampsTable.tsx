import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Text } from '@mantine/core';
import { CopySyntax } from 'components/CopySyntax';
import { IconCol } from 'components/IconCol';
import styles from 'modules/TimestampsTable.module.scss';
import moment, { Moment } from 'moment-timezone';
import { FC, useEffect, useMemo, useState } from 'react';
import { TFunction } from 'react-i18next';

interface TimeValue {
  example: string;
  syntax: string;
}

interface PropTypes {
  timestamp: Moment | null;
  timeInSeconds: string;
  locale: string;
  t: TFunction;
}

export const TimestampsTable: FC<PropTypes> = ({ t, locale, timestamp, timeInSeconds }) => {
  const [now, setNow] = useState(() => moment());

  useEffect(() => {
    const timer = setInterval(() => setNow(moment()), 1e3);

    return () => clearInterval(timer);
  }, []);

  const localizedTs = useMemo(() => {
    const value = timestamp ? timestamp.toDate() : 0;
    return moment(value).locale(locale);
  }, [timestamp, locale]);

  const rows = useMemo<TimeValue[]>(() => {
    const shortDate: TimeValue = {
      example: localizedTs.format('L'),
      syntax: `<t:${timeInSeconds}:d>`,
    };
    const longDate: TimeValue = {
      example: localizedTs.format('LL'),
      syntax: `<t:${timeInSeconds}:D>`,
    };
    const shortTime: TimeValue = {
      example: localizedTs.format('LT'),
      syntax: `<t:${timeInSeconds}:t>`,
    };
    const longTime: TimeValue = {
      example: localizedTs.format('LTS'),
      syntax: `<t:${timeInSeconds}:T>`,
    };
    const shortFull: TimeValue = {
      example: localizedTs.format('LLL'),
      syntax: `<t:${timeInSeconds}:f>`,
    };
    const longFull: TimeValue = {
      example: localizedTs.format('LLLL'),
      syntax: `<t:${timeInSeconds}:F>`,
    };
    const relativeTime: TimeValue = {
      example: localizedTs.from(now),
      syntax: `<t:${timeInSeconds}:R>`,
    };
    const unixTs: TimeValue = {
      example: timeInSeconds,
      syntax: timeInSeconds,
    };
    return [shortDate, longDate, shortTime, longTime, shortFull, longFull, relativeTime, unixTs];
  }, [now, timeInSeconds, localizedTs]);

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.syntaxColumn} colSpan={2}>
            {t('common:table.syntax')}
          </th>
          <th className={styles.exampleColumn}>{t('common:table.example')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((value, i) => (
          <tr key={i}>
            <IconCol className={styles.iconColumn} i={i} />
            <td className={styles.syntaxColumn}>
              <CopySyntax t={t} syntax={value.syntax} />

              <Text className={styles.exampleText}>
                <FontAwesomeIcon icon="eye" />
                {` ${value.example}`}
              </Text>
            </td>
            <td className={styles.exampleColumn}>
              <Text size="lg">{value.example}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
