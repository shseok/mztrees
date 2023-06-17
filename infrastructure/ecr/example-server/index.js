import fastify from "fastify";

const app = fastify();

app.get("/", async () => {
  return "안녕하세요? 제 비밀번호는 ".concat(process.env.PASSWORD);
});

app.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
});
