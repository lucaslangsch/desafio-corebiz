const { userService } = require('../../src/services');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('User Service', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    })
  });

  it('1 - Deve criar um usuário com sucesso', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', password: 'password' };
    const result = await userService.createUser(userData);
    expect(result.status).toBe('SUCCESSFUL');
  });

  it('2 - Não deve criar um usuário', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', password: 'password' };
    const result = await userService.createUser(userData);
    expect(result.status).toBe('INVALID_VALUE');
  });

  it('3 - Não deve criar um usuário', async () => {
    const userData = { email: 'test@example.com', password: 'password' };
    const result = await userService.createUser(userData);
    expect(result.status).toBe('INVALID_VALUE');
  });

  it('4 - Deve logar um usuário com sucesso', async () => {
    const userData = { email: 'test@example.com', password: 'password' };
    const result = await userService.login(userData);
    expect(result.status).toBe('SUCCESSFUL');
  });

  it('5 - Não deve logar um usuário', async () => {
    const userData = { email: 'test@example.com' };
    const result = await userService.login(userData);
    expect(result.status).toBe('INVALID_VALUE');
  });

  it('6 - Não deve logar um usuário', async () => {
    const userData = { email: 'test@example.com', password: 'password1' };
    const result = await userService.login(userData);
    expect(result.status).toBe('UNAUTHORIZED');
  });

  it('7 - Não deve logar um usuário', async () => {
    const userData = { email: 'test1@example.com', password: 'password' };
    const result = await userService.login(userData);
    expect(result.status).toBe('UNAUTHORIZED');
  });
});