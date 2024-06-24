import { Transaction, TransactionOptions } from 'sequelize';

export interface IOneTimeLinkRepository {
  createLink(value: string): Promise<OneTimeLinkDbDto>;

  getLinkByIdAndLockForUpdate(
    id: string,
    options: { transaction?: Transaction },
  ): Promise<OneTimeLinkDbDto | null>;

  resolveLink(
    id: string,
    options?: { transaction?: Transaction },
  ): Promise<void>;

  transaction<T>(
    autoCallback: (t: Transaction) => PromiseLike<T>,
    options?: TransactionOptions,
  ): Promise<T>;
}

export interface OneTimeLinkDbDto {
  id: string;
  value: string;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOneTimeLinkDbDto = Pick<OneTimeLinkDbDto, 'value'>;
