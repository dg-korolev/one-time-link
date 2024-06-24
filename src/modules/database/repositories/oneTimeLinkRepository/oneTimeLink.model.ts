import { Optional } from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { OneTimeLinkDbDto } from './oneTimeLink.types';

@Table({ tableName: 'one_time_links', freezeTableName: true })
export class OneTimeLinkModel
  extends Model<OneTimeLinkDbDto, Optional<OneTimeLinkDbDto, 'value'>>
  implements OneTimeLinkDbDto
{
  @Column({ primaryKey: true, type: DataType.UUIDV4, allowNull: false })
  declare id: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare value: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isUsed: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: false })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: false })
  declare updatedAt: Date;
}
