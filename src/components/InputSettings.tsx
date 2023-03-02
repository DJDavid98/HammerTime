import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, MantineSize, Popover, Switch, Text, Tooltip } from '@mantine/core';
import styles from 'modules/InputSettings.module.scss';
import { useTranslation } from 'next-i18next';
import React, { ChangeEventHandler, FC } from 'react';

interface PropTypes {
  customInputEnabled: boolean;
  separateInputsEnabled: boolean;
  toggleCustomInput: ChangeEventHandler<HTMLInputElement>;
  toggleSeparateInputs: ChangeEventHandler<HTMLInputElement>;
  size?: MantineSize;
}

export const InputSettings: FC<PropTypes> = ({
  customInputEnabled,
  separateInputsEnabled,
  toggleCustomInput,
  toggleSeparateInputs,
  size,
}) => {
  const { t } = useTranslation();
  const settingsLabel = t('input.settings.label');
  // Key is required to correctly reposition dropdown due to DOM changes
  const dropdownKey = `${String(customInputEnabled)}-${String(separateInputsEnabled)}`;

  return (
    <Popover shadow="xl" width={250}>
      <Popover.Target>
        <Tooltip label={settingsLabel}>
          {size ? (
            <Button size={size} color="gray" aria-label={settingsLabel}>
              <FontAwesomeIcon icon="cog" />
            </Button>
          ) : (
            <button type="button" className={styles.button} aria-label={settingsLabel}>
              <FontAwesomeIcon icon="cog" />
            </button>
          )}
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown className={styles['dropdown-body']} key={dropdownKey}>
        <Text>{settingsLabel}</Text>

        <div>
          <Switch label={t('input.settings.customInputs.label')} checked={customInputEnabled} onChange={toggleCustomInput} />
          <Text size="xs">{t('input.settings.customInputs.explanation')}</Text>
        </div>

        <div>
          <Switch label={t('input.settings.separateInputs.label')} checked={separateInputsEnabled} onChange={toggleSeparateInputs} />
          <Text size="xs">{t('input.settings.separateInputs.explanation')}</Text>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
