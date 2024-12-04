import { NextPage } from 'next';

export type NextPageWithLayout = NextPage & {
  noLayout?: boolean;
}; 