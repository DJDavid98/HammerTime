import IndexPage, { getStaticProps as indexGetStaticProps } from '../index';
import { getStaticPaths as timezoneGetStaticPaths } from './[...tz]';
import { GetStaticPaths, GetStaticProps } from 'next';

export default IndexPage;

export const getStaticProps: GetStaticProps = (context) => indexGetStaticProps(context);

export const getStaticPaths: GetStaticPaths = (context) => timezoneGetStaticPaths(context);
