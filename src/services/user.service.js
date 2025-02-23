const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

const createUser = async (body) => {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return { status: 'INVALID_VALUE', data: { message: 'Campos inválidos' } };
  }

  try {
    const isUser = await prisma.user.findUnique({ where: { email } });
    if (isUser) return { status: 'INVALID_VALUE', data: { message: 'Usuário já cadastrado' } };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });

    return { status: 'SUCCESSFUL', data: { token } };
  } catch (error) {
    return { status: 'SERVER_ERROR', data: { message: 'Erro ao cadastrar' } };
  }
};

const login = async (body) => {
  const { email, password } = body;
  if (!email || !password) {
    return { status: 'INVALID_VALUE', data: { message: 'Campos inválidos' } };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { status: 'UNAUTHORIZED', data: { message: 'Usuário ou senha inválidos' } };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { status: 'UNAUTHORIZED', data: { message: 'Usuário ou senha inválidos' } };
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });

    return { status: 'SUCCESSFUL', data: { token  } };
  } catch (error) {
    return { status: 'SERVER_ERROR', data: { message: 'Erro ao tentar logar' } };
  }

}

module.exports = {
  createUser,
  login,
};
