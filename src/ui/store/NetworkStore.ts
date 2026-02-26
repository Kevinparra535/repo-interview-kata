import NetInfo, { NetInfoCellularGeneration, NetInfoState, NetInfoStateType, NetInfoSubscription } from '@react-native-community/netinfo';
import { injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

@injectable()
export class NetworkStore {
  public isOffline = false;
  public connectionType: NetInfoStateType | null = null;
  public effectiveType: NetInfoCellularGeneration | null = null;
  public isConnectionUnstable = false;

  private forcedOffline = false;
  private unsubscribe?: NetInfoSubscription;

  constructor() {
    makeAutoObservable(this);
    this.startMonitoring();
  }

  public cleanUp(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  public goOffline(): void {
    this.forcedOffline = true;
    this.isOffline = true;
  }

  public async goOnline(): Promise<void> {
    this.forcedOffline = false;
    const state = await NetInfo.fetch();
    this.applyState(state);
  }

  private startMonitoring(): void {
    this.unsubscribe = NetInfo.addEventListener((nextState) => {
      this.applyState(nextState);
    });
  }

  private applyState(state: NetInfoState): void {
    const effectiveType = state.type === 'cellular' ? state.details.cellularGeneration : null;
    const isExpensive = state.details?.isConnectionExpensive ?? false;

    runInAction(() => {
      this.connectionType = state.type;
      this.effectiveType = effectiveType;
      this.isConnectionUnstable = isExpensive || effectiveType === '2g' || effectiveType === '3g';
      this.isOffline = this.forcedOffline || state.isConnected === false || state.isInternetReachable === false;
    });
  }
}
