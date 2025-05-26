export const corsOptions = {
  origin: [process.env.CLIENT_SERVER!,process.env.CLIENT_SERVER_2!],
  credentials: true,
  optionsSuccessStatus: 200,
};
