const app = require('./app');

const PORT = process.env.API_PORT;

app.listen(PORT, () => {
  console.log(`API está sendo executada na porta ${PORT}`);
});
