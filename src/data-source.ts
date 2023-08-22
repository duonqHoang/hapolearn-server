import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  database: process.env.MYSQL_DATABASE,
});

export default AppDataSource;
