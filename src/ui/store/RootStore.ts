import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { TYPES } from '@/config/types';

import { NetworkStore } from './NetworkStore';

@injectable()
export class RootStore {
  constructor(@inject(TYPES.NetworkStore) public networkStore: NetworkStore) {
    makeAutoObservable(this);
  }
}
