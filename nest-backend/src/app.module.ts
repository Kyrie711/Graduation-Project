import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stock/stock.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInfo } from './stock/stock.entity';
import { User } from './user/entities/user.entity';
import { CorsMiddleware } from './cors.middleware';
import { UserModule } from './user/user.module';
import { UserStockHoldings } from './user-stock-holdings/user-stock-holdings.entity';
import { UserStockHoldingsModule } from './user-stock-holdings/user-stock-holdings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
      entities: [StockInfo, User, UserStockHoldings],
      synchronize: true, // 这个选项会在每次应用启动时自动创建数据库表
      extra: {
        timezone: 'Z', // 使用 UTC 时间
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '170828',
    //   database: 'stock',
    //   entities: [StockInfo, User, UserStockHoldings],
    //   synchronize: true, // 这个选项会在每次应用启动时自动创建数据库表
    //   extra: {
    //     timezone: 'Z', // 使用 UTC 时间
    //   },
    // }),
    StockModule,
    UserModule,
    UserStockHoldingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
