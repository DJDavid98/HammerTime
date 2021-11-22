import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import styles from 'modules/TimestampPicker.module.scss';
import { ChangeEventHandler, VFC } from 'react';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

interface DateTimeInputProps {
  id: string;
  value: string;
  icon: IconProp;
  className?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: 'date' | 'time';
  readOnly?: boolean;
}

export const DateTimeInput: VFC<DateTimeInputProps> = ({ id, value, icon, className, onChange, type, readOnly }) => (
  <InputGroup className={classNames(styles.dateInputGroup, className)}>
    <InputGroupAddon addonType="prepend">
      <InputGroupText tag="label" htmlFor={id} className={styles.inputAddon}>
        <FontAwesomeIcon icon={icon} fixedWidth />
      </InputGroupText>
    </InputGroupAddon>
    <Input type={type} bsSize="lg" id={id} value={value} onChange={onChange} disabled={readOnly} tabIndex={readOnly ? -1 : undefined} />
  </InputGroup>
);
