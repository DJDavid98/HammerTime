import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { TFunction } from 'react-i18next';
import styles from 'modules/TimestampsTable.module.scss';
import moment, { Moment } from 'moment-timezone';
import { useEffect, useMemo, useRef, useState, VFC, VoidFunctionComponent } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Col, InputGroup, InputGroupText, Row, Table, UncontrolledTooltip } from 'reactstrap';

interface TimeValue {
  example: string;
  syntax: string;
}

const extendFromBreakpoint = 'md';
const textAlignmentClasses = `text-center text-${extendFromBreakpoint}-left`;
const syntaxJustifyClasses = `justify-content-center justify-content-${extendFromBreakpoint}-start`;
const tableCellClasses = `d-none d-${extendFromBreakpoint}-table-cell`;

const IconCol: VoidFunctionComponent<{ i: number }> = ({ i }) => {
  let content: JSX.Element | null;
  const rowspan = i >= 6 ? undefined : 2;
  switch (i) {
    case 0:
      content = <FontAwesomeIcon icon="calendar" size="2x" />;
      break;
    case 2:
      content = <FontAwesomeIcon icon="clock" size="2x" />;
      break;
    case 4:
      content = (
        <span className="fa-stack fa-1x">
          <FontAwesomeIcon icon={['far', 'calendar']} className="fa-stack-2x" />
          <FontAwesomeIcon icon="clock" className="fa-stack-1x" transform={{ y: 4.5 }} />
        </span>
      );
      break;
    case 6:
      content = <FontAwesomeIcon icon="user-clock" size="2x" />;
      break;
    case 7:
      content = <FontAwesomeIcon icon="code" size="2x" />;
      break;
    default:
      content = null;
  }

  if (!content) return content;

  return (
    <td rowSpan={rowspan} className={`${styles.iconColumn} d-none d-md-table-cell`}>
      {content}
    </td>
  );
};

const CopySyntax: VoidFunctionComponent<{ syntax: string; className?: string; t: TFunction }> = ({ t, syntax, className }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonTooltipText = t('common:buttons.copy', '');
  return (
    <>
      <InputGroup className={classNames(`flex-nowrap ${syntaxJustifyClasses}`, className)}>
        <CopyToClipboard text={syntax}>
          <Button color="discord" innerRef={buttonRef}>
            <FontAwesomeIcon icon="clipboard" />
          </Button>
        </CopyToClipboard>
        <InputGroupText className={`${styles.codeText} font-monospace`}>{syntax}</InputGroupText>
      </InputGroup>
      {Boolean(buttonTooltipText) && (
        <UncontrolledTooltip target={buttonRef} placement="left" fade={false}>
          {buttonTooltipText}
        </UncontrolledTooltip>
      )}
    </>
  );
};

interface PropTypes {
  timestamp: Moment | null;
  timeInSeconds: string;
  locale: string;
  t: TFunction;
}

export const TimestampsTable: VFC<PropTypes> = ({ t, locale, timestamp, timeInSeconds }) => {
  const [now, setNow] = useState(() => moment());

  useEffect(() => {
    const timer = setInterval(() => setNow(moment()), 5e3);

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
    <Table responsive className={styles.table}>
      <thead>
        <tr>
          <th className={`${styles.syntaxColumn} ${textAlignmentClasses}`} colSpan={2}>
            {t('common:table.syntax')}
          </th>
          <th className={tableCellClasses}>{t('common:table.example')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((value, i) => (
          <tr key={i}>
            <IconCol i={i} />
            <td className={styles.syntaxColumn}>
              <Row
                className={`${syntaxJustifyClasses} align-items-center text-center text-${extendFromBreakpoint}-left ${textAlignmentClasses}`}
              >
                <Col xs={12} md="auto" lg={12} className={`mb-3 mb-${extendFromBreakpoint}-0`}>
                  <CopySyntax t={t} syntax={value.syntax} />
                </Col>
                <Col className={`d-${extendFromBreakpoint}-none`}>
                  <p className="flex-grow-1">
                    <FontAwesomeIcon icon="eye" className="me-2" />
                    {value.example}
                  </p>
                </Col>
              </Row>
            </td>
            <td className={tableCellClasses}>{value.example}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
