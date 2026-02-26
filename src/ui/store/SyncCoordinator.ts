import { inject, injectable } from 'inversify';
import { IReactionDisposer, reaction } from 'mobx';

import { TYPES } from '@/config/types';
import { SyncTasksUseCase } from '@/domain/useCases/SyncTasksUseCase';
import Logger from '@/ui/utils/Logger';

import { NetworkStore } from './NetworkStore';

@injectable()
export class SyncCoordinator {
  private readonly logger = new Logger('SyncCoordinator');
  private disposeConnectionReaction?: IReactionDisposer;
  private isSyncing = false;

  constructor(
    @inject(TYPES.NetworkStore)
    private readonly networkStore: NetworkStore,
    @inject(TYPES.SyncTasksUseCase)
    private readonly syncTasksUseCase: SyncTasksUseCase,
  ) {}

  start(): void {
    if (this.disposeConnectionReaction) return;

    this.disposeConnectionReaction = reaction(
      () => this.networkStore.isOffline,
      async (isOffline, wasOffline) => {
        if (wasOffline && !isOffline) {
          await this.syncOnReconnect();
        }
      },
      {
        equals: (oldValue, newValue) => oldValue === newValue,
        fireImmediately: false,
      },
    );

    void this.syncOnReconnect();
  }

  stop(): void {
    this.disposeConnectionReaction?.();
    this.disposeConnectionReaction = undefined;
  }

  private async syncOnReconnect(): Promise<void> {
    if (this.networkStore.isOffline || this.isSyncing) return;

    this.isSyncing = true;
    try {
      await this.syncTasksUseCase.run(undefined);
      this.logger.info('Tasks synchronized after reconnect');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected sync error';
      this.logger.error(message);
    } finally {
      this.isSyncing = false;
    }
  }
}
