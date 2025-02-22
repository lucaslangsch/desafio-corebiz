const express = require('express');
const { userRoutes, taskRoutes } = require('./routes');


const app = express();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/task', taskRoutes);

module.exports = app;
