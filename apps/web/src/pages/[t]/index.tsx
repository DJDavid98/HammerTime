import TimezonePage, { getStaticPaths as timezoneGetStaticPaths, getStaticProps as timezoneGetStaticProps } from './[...tz]';
import { GetStaticPaths, GetStaticProps } from 'next';

export default TimezonePage;

export const getStaticProps: GetStaticProps = (context) => timezoneGetStaticProps(context);

export const getStaticPaths: GetStaticPaths = (context) => timezoneGetStaticPaths(context);
