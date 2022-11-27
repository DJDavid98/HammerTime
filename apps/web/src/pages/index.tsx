import TimestampIndexPage, { getStaticProps as timestampGetStaticProps } from './[t]';
import { GetStaticProps } from 'next';

export default TimestampIndexPage;

export const getStaticProps: GetStaticProps = (context) => timestampGetStaticProps(context);
