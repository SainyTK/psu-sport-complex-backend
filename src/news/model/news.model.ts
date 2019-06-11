import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table
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
    @Column
    content: string;
}