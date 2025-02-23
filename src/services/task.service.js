const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VALID_STATUS = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

const createTask = async (userId, body) => {
  const { title, description, dueDate, status } = body;

  if (!title || !description || !dueDate || !status) {
    return { status: 'INVALID_VALUE', data: { message: 'Todos os campos são obrigatórios' } };
  }

  if (!VALID_STATUS.includes(status)) {
    return { status: 'INVALID_VALUE', data: { message: 'Status inválido' } };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status,
        userId,
      },
    });

    return { status: 'SUCCESSFUL', data: task };
  } catch (error) {
    return { status: 'SERVER_ERROR', data: { message: error.message } };
  }
};

const updateTask = async (taskId, userId, updates) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return { status: 'NOT_FOUND', data: { message: 'Tarefa não encontrada' } };
    }

    if (task.userId !== userId) {
      return { status: 'FORBIDDEN', data: { message: 'Você não tem permissão para editar esta tarefa' } };
    }

    if (!VALID_STATUS.includes(updates.status)) {
      return { status: 'INVALID_VALUE', data: { message: 'Status inválido' } };
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updates,
    });

    return { status: 'SUCCESSFUL', data: updatedTask };
  } catch (error) {
    return { status: 'SERVER_ERROR', data: { message: 'Erro ao atualizar tarefa' } };
  }
};

const deleteTask = async (taskId, userId) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return { status: 'NOT_FOUND', data: { message: 'Tarefa não encontrada' } };
    }

    if (task.userId !== userId) {
      return { status: 'FORBIDDEN', data: { message: 'Você não tem permissão para deletar esta tarefa' } };
    }

    await prisma.task.delete({ where: { id: taskId } });

    return { status: 'SUCCESSFUL', data: { message: 'Tarefa deletada com sucesso' } };
  } catch (error) {
    return { status: 'SERVER_ERROR', data: { message: 'Erro ao deletar tarefa' } };
  }
};

const getAllTasks = async () => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { status: 'SUCCESSFUL', data: tasks };
  } catch (error) {
    return { status: 'SERVER_ERROR', data: { message: 'Erro ao listar tarefas' } };
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks
};
