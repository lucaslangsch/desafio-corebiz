const { taskService } = require('../services');
const mapStatusHTTP = require('../utils/mapStatus.util.js');

const createTask = async (req, res) => {
  const userId = req.user.id;
  const { status, data } = await taskService.createTask(userId, req.body);
  return res.status(mapStatusHTTP(status)).json(data);
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { status, data } = await taskService.updateTask(id, userId, req.body);
  return res.status(mapStatusHTTP(status)).json(data);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { status, data } = await taskService.deleteTask(id, userId);
  return res.status(mapStatusHTTP(status)).json(data);
};

const getAllTasks = async (req, res) => {
  const { status, data } = await taskService.getAllTasks();
  return res.status(mapStatusHTTP(status)).json(data);
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks
};
