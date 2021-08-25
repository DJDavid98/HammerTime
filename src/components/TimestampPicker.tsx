import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TFunction } from 'i18next';
import styles from 'modules/TimestampPicker.module.scss';
import moment, { Moment } from 'moment-timezone';
import { useCallback, VFC } from 'react';
import Datetime from 'react-datetime';
import Select from 'react-select';
import { StylesConfig } from 'react-select/src/styles';
import { ThemeConfig } from 'react-select/src/theme';
import { Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';

const dateInputId = 'date-input';
const timezoneSelectId = 'timezone-input';

interface TimezoneOptionType {
  label: string;
  value: string;
}

interface PropTypes {
  changeTimezone: (tz: null | string) => void;
  datetime: Moment | string;
  handleDateChange: (value: Moment | string) => void;
  locale: string;
  t: TFunction;
  timestamp: Moment;
  timezone: string;
  timezoneNames: TimezoneOptionType[];
}

const DateInput: VFC<unknown> = (props) => (
  <InputGroup className={styles.dateInputGroup}>
    <InputGroupAddon addonType="prepend">
      <InputGroupText tag="label" htmlFor={dateInputId} className={styles.inputAddon}>
        <FontAwesomeIcon icon="calendar" fixedWidth />
        <FontAwesomeIcon icon="clock" fixedWidth />
      </InputGroupText>
    </InputGroupAddon>
    <Input {...props} type="text" bsSize="lg" id={dateInputId} readOnly />
  </InputGroup>
);

const customTheme: ThemeConfig = (theme) => ({
  ...theme,
  spacing: {
    ...theme.spacing,
    controlHeight: 48,
  },
  colors: {
    primary: 'hsl(211,100%,57%)',
    primary75: 'hsl(211,100%,65%)',
    primary50: 'hsl(211,100%,85%)',
    primary25: 'hsl(211,100%,94%)',

    danger: '#de350b',
    dangerLight: '#ffbdad',

    neutral90: 'hsl(0, 0%, 100%)',
    neutral80: 'hsl(0, 0%, 95%)',
    neutral70: 'hsl(0, 0%, 90%)',
    neutral60: 'hsl(0, 0%, 80%)',
    neutral50: 'hsl(0, 0%, 70%)',
    neutral40: 'hsl(0, 0%, 60%)',
    neutral30: 'hsl(0, 0%, 50%)',
    neutral20: 'hsl(0, 0%, 40%)',
    neutral10: 'hsl(0, 0%, 30%)',
    neutral5: 'hsl(0, 0%, 20%)',
    neutral0: 'hsl(0, 0%, 10%)',
  },
});

const customStyles: StylesConfig<TimezoneOptionType, false> = {
  option(base, props) {
    return {
      ...base,
      color: props.isSelected ? '#fff' : base.color,
      backgroundColor: props.isFocused ? (props.isSelected ? '#717cf4' : '#2f3136') : props.isSelected ? '#5865f2' : 'transparent',
    };
  },
  control(base, props) {
    const boxShadowColor = 'rgba(0,123,255,0.25)';
    return {
      ...base,
      borderWidth: '1px',
      borderColor: props.isFocused ? '#80bdff' : '#202225',
      boxShadow: props.isFocused ? `0 0 0 0.2rem ${boxShadowColor}` : '0',
      backgroundColor: '#2f3136',
    };
  },
};

export const TimestampPicker: VFC<PropTypes> = ({
  changeTimezone,
  datetime,
  handleDateChange,
  locale,
  t,
  timestamp,
  timezone,
  timezoneNames,
}) => {
  const handleTimezoneChange = useCallback(
    (selected: TimezoneOptionType | null) => {
      changeTimezone(selected ? selected.value : null);
    },
    [changeTimezone],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderDateInput = useCallback((props: any) => <DateInput {...props} />, []);

  return (
    <div className={styles.datepicker}>
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label className={styles.formLabel} for={dateInputId}>
              {t('common:input.date')}
            </Label>
            <Datetime
              locale={locale}
              value={datetime}
              onChange={handleDateChange}
              dateFormat={moment.localeData(locale).longDateFormat('LL')}
              timeFormat={moment.localeData(locale).longDateFormat('LTS')}
              displayTimeZone={timezone}
              renderInput={renderDateInput}
            />
          </FormGroup>
        </Col>
        {timestamp && (
          <Col md={6}>
            <FormGroup>
              <Label className={styles.formLabel} for={timezoneSelectId}>
                {t('common:input.timezone')}
              </Label>
              <Select
                inputId={timezoneSelectId}
                value={{
                  label: timezone,
                  value: timezone,
                }}
                options={timezoneNames}
                onChange={handleTimezoneChange}
                className="w-100"
                theme={customTheme}
                styles={customStyles}
              />
            </FormGroup>
          </Col>
        )}
      </Row>
    </div>
  );
};
