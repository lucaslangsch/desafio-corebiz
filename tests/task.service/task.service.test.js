const { taskService, userService } = require('../../src/services');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Task Service', () => {
  let user;

  beforeAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: { in: ['test@example.com', 'other@example.com'] }
      }
    });
  
    const userData = { name: 'Test User', email: 'test@example.com', password: 'password' };
    await userService.createUser(userData);
  
    user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
  });

  afterAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: { in: ['test@example.com', 'other@example.com'] }
      }
    });
    await prisma.$disconnect();
  });

  it('1 - Deve criar uma tarefa com sucesso', async () => {
    const taskData = { 
      title: 'Nova Tarefa', 
      description: 'Descrição da tarefa', 
      dueDate: new Date("2025-03-01"), 
      status: 'PENDING'
    };

    const result = await taskService.createTask(user.id, taskData);
    expect(result.status).toBe('SUCCESSFUL');
    expect(result.data.title).toBe(taskData.title);
  });

  it('2 - Não deve criar uma tarefa sem título', async () => {
    const taskData = { description: 'Descrição', dueDate: new Date("2025-03-01"), status: 'PENDING' };
    const result = await taskService.createTask(user.id, taskData);
    expect(result.status).toBe('INVALID_VALUE');
  });

  it('3 - Não deve criar uma tarefa sem data de vencimento', async () => {
    const taskData = { title: 'Tarefa', description: 'Descrição', status: 'PENDING' };
    const result = await taskService.createTask(user.id, taskData);
    expect(result.status).toBe('INVALID_VALUE');
  });

  it('4 -Não deve criar uma tarefa para outro usuário', async () => {
    const taskData = { title: 'Tarefa', description: 'Descrição', dueDate: new Date("2025-03-01"), status: 'PENDING' };
    const result = await taskService.createTask('outro-id', taskData);
    expect(result.status).toBe('SERVER_ERROR');
  });

  it('5 - Deve listar todas as tarefas corretamente', async () => {
    const result = await taskService.getAllTasks();
    expect(result.status).toBe('SUCCESSFUL');
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('6 - Deve editar uma tarefa do usuário', async () => {
    const task = await prisma.task.create({
      data: { title: 'Tarefa Antiga', description: 'Desc', dueDate: new Date("2025-03-01"), status: 'PENDING', userId: user.id }
    });

    const updatedData = { title: 'Tarefa Atualizada', status: 'IN_PROGRESS' };
    const result = await taskService.updateTask(task.id, user.id, updatedData);
    expect(result.status).toBe('SUCCESSFUL');
    expect(result.data.title).toBe('Tarefa Atualizada');
  });

  it('7 - Não deve editar uma tarefa com status inválido', async () => {
    const task = await prisma.task.create({
      data: { title: 'Tarefa Antiga', description: 'Desc', dueDate: new Date("2025-03-01"), status: 'PENDING', userId: user.id }
    });

    const updatedData = { title: 'Tarefa Atualizada', status: 'INVALIDO' };
    const result = await taskService.updateTask(task.id, user.id, updatedData);
    expect(result.status).toBe('INVALID_VALUE');
  });

  let anotherUser;

  it('8 - Não deve editar uma tarefa que não pertence ao usuário', async () => {
    const task = await prisma.task.create({
      data: {
        title: "Tarefa Antiga",
        description: "Desc",
        dueDate: new Date("2025-03-01"),
        status: "PENDING",
        userId: user.id
      }
    });
  
    anotherUser = await prisma.user.create({
      data: { name: 'Outro Usuário', email: 'other@example.com', password: 'password' }
    });
  
    const result = await taskService.updateTask(task.id, anotherUser.id, { status: "IN_PROGRESS" });
  
    expect(result.status).toBe('FORBIDDEN');
  });

  it('9 - Deve excluir uma tarefa do usuário', async () => {
    const task = await prisma.task.create({
      data: { title: 'Tarefa para excluir', description: 'Desc', dueDate: new Date("2025-03-01"), status: 'PENDING', userId: user.id }
    });

    const result = await taskService.deleteTask(task.id, user.id);
    expect(result.status).toBe('SUCCESSFUL');
  });

  it('10 - Não deve excluir uma tarefa que não pertence ao usuário', async () => {
    const task = await prisma.task.create({
      data: {
        title: "Tarefa de Outro Usuário",
        description: "Desc",
        dueDate: new Date("2025-03-01"),
        status: "PENDING",
        userId: user.id
      }
    });
  
    const result = await taskService.deleteTask(task.id, anotherUser.id);
  
    expect(result.status).toBe('FORBIDDEN');
  });
  
});
