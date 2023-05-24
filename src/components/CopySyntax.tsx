import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, ActionIconProps, Code, CodeProps, Group, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { TFunction } from 'i18next';
import styles from 'modules/TimestampsTable.module.scss';
import { useCallback, useMemo, VoidFunctionComponent } from 'react';

const elementSizes: ActionIconProps['size'] = 'lg';
const codeSx: CodeProps['sx'] = (theme) => ({ fontSize: theme.fontSizes[elementSizes] });

export const CopySyntax: VoidFunctionComponent<{ syntax: string; t: TFunction }> = ({ t, syntax }) => {
  const clipboard = useClipboard({ timeout: 500 });
  const buttonTooltipText = useMemo(
    () =>
      t('common:buttons.copy', {
        defaultValue: false,
        fallbackLng: [],
      }),
    [t],
  );
  const copyToClipboard = useCallback(() => {
    clipboard.copy(syntax);
  }, [clipboard, syntax]);

  let actionItemJsx: JSX.Element = (
    <ActionIcon size={elementSizes} color="primary" variant="filled" onClick={copyToClipboard}>
      <FontAwesomeIcon icon="clipboard" />
    </ActionIcon>
  );

  if (buttonTooltipText) {
    actionItemJsx = (
      <Tooltip label={buttonTooltipText} position="left">
        {actionItemJsx}
      </Tooltip>
    );
  }

  return (
    <Group spacing={5} className={styles['copy-syntax']}>
      {actionItemJsx}
      <Code sx={codeSx}>{syntax}</Code>
    </Group>
  );
};
