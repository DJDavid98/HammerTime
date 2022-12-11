import IndexPage, { getStaticProps as timestampGetStaticProps } from '../index';
import { GetStaticPaths, GetStaticProps } from 'next';
import { GetStaticPathsResult } from 'next/types';

export default IndexPage;

export const getStaticProps: GetStaticProps = (context) => timestampGetStaticProps(context);

export const getStaticPaths: GetStaticPaths = () => {
  const result: GetStaticPathsResult = {
    paths: [],
    fallback: true,
  };
  return result;
};
