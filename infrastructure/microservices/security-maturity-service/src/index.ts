import { createApp } from "./app";

const app = createApp();

const PORT = Number(process.env.PORT ?? 4010);

app.listen(PORT, () => {
  console.log(`security-maturity-service listening on port ${PORT}`);
});
