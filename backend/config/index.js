const config = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DATABASE: process.env.DATABASE,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
};

Object.keys(config).forEach((key) => {
  if (!config[key]) {
    throw new Error(
      `.env ${key} is empty, please set the value before stating the applications.`
    );
  }
});

module.exports = config;
