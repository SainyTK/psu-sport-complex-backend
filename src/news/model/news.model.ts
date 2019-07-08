import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    DataType,
    Default
} from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true,
})
export class News extends Model<News> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    newsId: number;

    @AllowNull(false)
    @Default('')
    @Column
    title: string;

    @AllowNull(false)
    @Default('')
    @Column
    featuredImageUrl: string;

    @AllowNull(false)
    @Column({type: DataType.TEXT('long')})
    content: string;
}