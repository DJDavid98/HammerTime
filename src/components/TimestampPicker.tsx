import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CombinedDateTimeInput } from 'components/CombinedDateTimeInput';
import { DateTimeInput } from 'components/DateTimeInput';
import styles from 'modules/TimestampPicker.module.scss';
import { ChangeEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useState, VFC, VoidFunctionComponent } from 'react';
import { TFunction } from 'react-i18next';
import Select from 'react-select';
import { StylesConfig } from 'react-select/src/styles';
import { ThemeConfig } from 'react-select/src/theme';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { getTimezoneValue } from 'src/util/timezone';

const dateInputId = 'date-input';
const timeInputId = 'time-input';
const dateTimeInputId = 'date-time-input';
const timezoneSelectId = 'timezone-input';

interface TimezoneOptionType {
  label: string;
  value: string;
}

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
const splitPrefKey = 'split-input';

interface PropTypes {
  changeTimezone: (tz: null | string) => void;
  dateString: string;
  fixedTimestamp: boolean;
  handleDateChange: (value: string | null) => void;
  handleTimeChange: (value: string | null) => void;
  handleDateTimeChange: (value: string | null) => void;
  t: TFunction;
  timeString: string;
  timezone: string;
  timezoneNames: TimezoneOptionType[];
  ButtonsComponent: VoidFunctionComponent;
}

export const TimestampPicker: VFC<PropTypes> = ({
  changeTimezone,
  dateString,
  fixedTimestamp,
  handleDateChange: onDateChange,
  handleTimeChange: onTimeChange,
  handleDateTimeChange: onDateTimeChange,
  t,
  timeString,
  timezone,
  timezoneNames,
  ButtonsComponent,
}) => {
  const handleTimezoneChange = useCallback(
    (selected: TimezoneOptionType | null) => {
      changeTimezone(selected ? selected.value : null);
    },
    [changeTimezone],
  );

  const [combinedInput, setCombinedInput] = useState(false);

  const timezoneSelectValue = useMemo(() => getTimezoneValue(timezone), [timezone]);

  const handleDateChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => onDateChange(e.target.value), [onDateChange]);
  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => onTimeChange(e.target.value), [onTimeChange]);
  const handleDateTimeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => onDateTimeChange(e.target.value),
    [onDateTimeChange],
  );
  const toggleCombinedInput: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();
    setCombinedInput((value) => !value);
  }, []);

  useEffect(() => {
    const storedPref = localStorage.getItem(splitPrefKey);
    if (storedPref !== null) {
      setCombinedInput(storedPref !== 'true');
      return;
    }

    // Feature detection for datetime-local input
    const testInput = document.createElement('input');
    testInput.setAttribute('type', 'datetime-local');
    const testValue = '1)';
    testInput.value = testValue;
    setCombinedInput(testInput.value !== testValue);
  }, []);

  useEffect(() => {
    localStorage.setItem(splitPrefKey, combinedInput ? 'false' : 'true');
  }, [combinedInput]);

  return (
    <div className={styles.datepicker}>
      <Row>
        <Col md>
          <FormGroup>
            <Label className={`${styles.formLabel} d-flex justify-content-between`}>
              {t('common:input.date')}
              <a href="#" className="text-white text-decoration-none" onClick={toggleCombinedInput}>
                <FontAwesomeIcon icon={combinedInput ? 'toggle-on' : 'toggle-off'} />
              </a>
            </Label>

            {combinedInput ? (
              <CombinedDateTimeInput
                value={dateString && timeString ? `${dateString}T${timeString}` : ''}
                className="mb-2 mb-xl-0"
                id={dateTimeInputId}
                onChange={handleDateTimeChange}
                readOnly={fixedTimestamp}
              />
            ) : (
              <Row>
                <Col xl={6}>
                  <DateTimeInput
                    type="date"
                    value={dateString}
                    className="mb-2 mb-xl-0"
                    id={dateInputId}
                    icon="calendar"
                    onChange={handleDateChange}
                    readOnly={fixedTimestamp}
                  />
                </Col>
                <Col xl={6}>
                  <DateTimeInput
                    type="time"
                    value={timeString}
                    id={timeInputId}
                    icon="clock"
                    onChange={handleTimeChange}
                    readOnly={fixedTimestamp}
                  />
                </Col>
              </Row>
            )}
          </FormGroup>
        </Col>
        <Col md={combinedInput ? 5 : 4}>
          <FormGroup>
            <Label className={styles.formLabel} for={timezoneSelectId}>
              {t('common:input.timezone')}
            </Label>
            <Select
              inputId={timezoneSelectId}
              value={timezoneSelectValue}
              options={timezoneNames}
              onChange={handleTimezoneChange}
              className="w-100"
              theme={customTheme}
              styles={customStyles}
              isClearable
              isDisabled={fixedTimestamp}
            />
            <div className="d-block d-xl-none mt-2">
              <ButtonsComponent />
            </div>
          </FormGroup>
        </Col>
        <Col xs="auto" className="d-none d-xl-flex flex-row align-items-end">
          <ButtonsComponent />
        </Col>
      </Row>
    </div>
  );
};
