import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import styles from 'modules/TimestampPicker.module.scss';
import { Moment } from 'moment-timezone';
import { ChangeEventHandler, useMemo, VFC } from 'react';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

interface DateTimeInputProps {
  id: string;
  format: string;
  value: Moment | null;
  icon: IconProp;
  className?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: 'date' | 'time';
}

export const DateTimeInput: VFC<DateTimeInputProps> = ({ id, format, value, icon, className, onChange, type }) => {
  const normalizedValue = useMemo(() => (value ? value.format(format) : ''), [format, value]);

  return (
    <InputGroup className={classNames(styles.dateInputGroup, className)}>
      <InputGroupAddon addonType="prepend">
        <InputGroupText tag="label" htmlFor={id} className={styles.inputAddon}>
          <FontAwesomeIcon icon={icon} fixedWidth />
        </InputGroupText>
      </InputGroupAddon>
      <Input type={type} bsSize="lg" id={id} value={normalizedValue} onChange={onChange} />
    </InputGroup>
  );
};
