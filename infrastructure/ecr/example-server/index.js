import fastify from "fastify";

const app = fastify();

app.get("/", async () => {
  return "hello world";
});

app.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
});
