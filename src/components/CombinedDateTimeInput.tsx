import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import styles from 'modules/TimestampPicker.module.scss';
import { ChangeEventHandler, VFC } from 'react';
import { Input, InputGroup, InputGroupText } from 'reactstrap';
import { inputWithPickerClickHandler } from 'src/util/common';

interface DateTimeInputProps {
  id: string;
  value: string;
  className?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
}

export const CombinedDateTimeInput: VFC<DateTimeInputProps> = ({ id, value, className, onChange, readOnly }) => (
  <InputGroup className={classNames(styles.dateInputGroup, className)}>
    <InputGroupText tag="label" htmlFor={id} className={styles.inputAddon} onClick={inputWithPickerClickHandler}>
      <FontAwesomeIcon icon="calendar" />
      &nbsp;
      <FontAwesomeIcon icon="clock" />
    </InputGroupText>
    <Input
      type="datetime-local"
      bsSize="lg"
      id={id}
      value={value}
      step="1"
      onChange={onChange}
      disabled={readOnly}
      tabIndex={readOnly ? -1 : undefined}
    />
  </InputGroup>
);
