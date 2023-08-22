import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  database: "hapolearn",
});

export default AppDataSource;
