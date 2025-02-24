const express = require('express');
const { userRoutes, taskRoutes } = require('./routes');
const setupSwagger = require('./swagger');

const app = express();

app.use(express.json());

setupSwagger(app);

app.use('/user', userRoutes);
app.use('/task', taskRoutes);

module.exports = app;
