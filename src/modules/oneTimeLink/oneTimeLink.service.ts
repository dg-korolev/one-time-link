import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IOneTimeLinkRepository,
  OneTimeLinkRepository,
} from '../database/repositories';
import { OneTimeLinkDto } from './oneTimeLink.types';
import { Transaction } from 'sequelize';
import ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS;

@Injectable()
export class OneTimeLinkService {
  constructor(
    @Inject(OneTimeLinkRepository)
    private readonly oneTimeLinkRepository: IOneTimeLinkRepository,
  ) {}

  createLink(value: string): Promise<OneTimeLinkDto> {
    return this.oneTimeLinkRepository.createLink(value);
  }

  resolveLink(id: string): Promise<string> {
    return this.oneTimeLinkRepository.transaction(async (transaction) => {
      const dbLink =
        await this.oneTimeLinkRepository.getLinkByIdAndLockForUpdate(id, {
          transaction,
        });

      if (!dbLink) throw new NotFoundException('Not found');

      if (dbLink.isUsed) throw new BadRequestException('Link is expired');

      await this.oneTimeLinkRepository.resolveLink(id, {
        transaction,
      });

      return dbLink.value;
    });
  }
}
