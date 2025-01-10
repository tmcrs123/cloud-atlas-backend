import { asFunction, Resolver } from "awilix";

export type DatabaseConfig = {
  engine: "dynamoDb" | "postgres";
  endpoint?: string,
  
};

export type DatabaseConfigDependencies = {
  databaseConfig: DatabaseConfig;
};

type DatabaseDiConfig = Record<
  keyof DatabaseConfigDependencies,
  Resolver<DatabaseConfig>
>;

export type DatabaseInjectableDependencies = DatabaseConfigDependencies;

export function resolveDatabaseDiConfig(
  dbConfig: DatabaseConfig
): DatabaseDiConfig {
  return {
    databaseConfig: asFunction(
      () => {
        return {
          engine: dbConfig.engine,
        };
      },
      { lifetime: "SINGLETON" }
    ),
  };
}