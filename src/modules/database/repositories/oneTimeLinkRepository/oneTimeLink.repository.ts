import { Injectable } from '@nestjs/common';
import { Sequelize, Transaction, TransactionOptions } from 'sequelize';
import { IOneTimeLinkRepository, OneTimeLinkDbDto } from './oneTimeLink.types';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { OneTimeLinkModel } from './oneTimeLink.model';
import * as uuid from 'uuid';

@Injectable()
export class OneTimeLinkRepository implements IOneTimeLinkRepository {
  private static readonly model = 'queues';

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(OneTimeLinkModel)
    public readonly oneTimeLinkModel: typeof OneTimeLinkModel,
  ) {}

  async createLink(value: string): Promise<OneTimeLinkDbDto> {
    const id = uuid.v4();

    const dbLink: OneTimeLinkDbDto = await this.oneTimeLinkModel.create({
      id,
      value,
      isUsed: false,
    });

    return dbLink;
  }

  async getLinkByIdAndLockForUpdate(
    id: string,
    options: { transaction?: Transaction } = {},
  ): Promise<OneTimeLinkDbDto | null> {
    const dbLink: OneTimeLinkDbDto = await this.oneTimeLinkModel.findOne({
      where: { id },
      transaction: options.transaction,
      lock: options.transaction.LOCK.UPDATE,
    });

    return dbLink ?? null;
  }

  async resolveLink(
    id: string,
    options: { transaction?: Transaction } = {},
  ): Promise<void> {
    await this.oneTimeLinkModel.update(
      { isUsed: true },
      { where: { id }, transaction: options.transaction },
    );
  }

  async transaction<T>(
    autoCallback: (t: Transaction) => PromiseLike<T>,
    options: TransactionOptions = {},
  ): Promise<T> {
    return await this.oneTimeLinkModel.sequelize.transaction(
      options,
      autoCallback,
    );
  }
}
