import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppContainer } from 'components/AppContainer';
import { CustomIcon } from 'components/CustomIcon';
import { Layout } from 'components/Layout';
import { TimestampsTable } from 'components/TimestampsTable';
import styles from 'modules/IndexPage.module.scss';
import moment, { Moment } from 'moment';
import { GetStaticProps } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState, VFC } from 'react';
import Datetime from 'react-datetime';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { SITE_TITLE } from 'src/config';
import { useLocale } from 'src/util/common';
import { typedServerSideTranslations } from 'src/util/i18n-server';

const dateInputId = 'date-input';

const IndexPage: VFC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const locale = useLocale(language);
  const [timestamp, setTimestamp] = useState<Moment | null>(null);
  const [inputValue, setInputValue] = useState<Moment | string>('');

  const handleChange = useCallback((value: Moment | string) => {
    if (moment.isMoment(value)) {
      setTimestamp(value);
    }
    setInputValue(value);
  }, []);

  useEffect(() => {
    const clientMoment = moment();
    handleChange(clientMoment);
  }, [handleChange]);

  const renderInput = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
    (props: any) => (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText tag="label" htmlFor={dateInputId} className={styles.dateInputAddon}>
            <FontAwesomeIcon icon="calendar" fixedWidth />
          </InputGroupText>
        </InputGroupAddon>
        <Input {...props} type="text" bsSize="lg" className={styles.dateInput} id={dateInputId} />
      </InputGroup>
    ),
    [],
  );

  return (
    <Layout>
      <AppContainer bg="discord">
        <h1 className="text-center">
          <CustomIcon src="/logos/app.svg" className="mr-3" alt="" />
          {SITE_TITLE}
        </h1>
        <p className="text-center">{t('common:howTo', { syntaxColName: t('common:table.syntax') })}</p>

        <div className={styles.datepicker}>
          <Datetime
            locale={locale}
            value={inputValue}
            onChange={handleChange}
            dateFormat={moment.localeData(locale).longDateFormat('LL')}
            timeFormat={moment.localeData(locale).longDateFormat('LTS')}
            renderInput={renderInput}
          />
        </div>
        {timestamp && <TimestampsTable locale={locale} timestamp={timestamp} t={t} />}
      </AppContainer>
    </Layout>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps<SSRConfig> = async ({ locale }) => ({
  props: {
    ...(await typedServerSideTranslations(locale, ['common'])),
  },
});
