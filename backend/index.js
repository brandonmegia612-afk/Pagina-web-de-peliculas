const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const databaseUrl = process.env.DATABASE_URL || 'sqlite:./database.sqlite';
const sequelize = new Sequelize(databaseUrl, {
  dialect: databaseUrl.startsWith('sqlite:') ? 'sqlite' : 'postgres',
  logging: false,
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Email = sequelize.define('Email', {
  subject: DataTypes.STRING,
  sender: DataTypes.STRING,
});

const ContentItem = sequelize.define('ContentItem', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'video',
  },
  embedUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general',
  },
  coverUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Notification = sequelize.define('Notification', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const AccessLog = sequelize.define('AccessLog', {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.TEXT,
  disconnectedAt: DataTypes.DATE,
});

User.hasMany(AccessLog);
AccessLog.belongsTo(User);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'brandonmegia612@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '336796uy';
const sessions = new Map();

const publicUser = user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  dateOfBirth: user.dateOfBirth,
  role: user.role,
  verified: user.verified,
});

const createSession = user => {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, user.id);
  return token;
};

const getRequestIp = req =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();

const getTokenFromRequest = req => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
};

const recordAccess = async (req, user, action) => {
  await AccessLog.create({
    UserId: user.id,
    action,
    ipAddress: getRequestIp(req),
    userAgent: req.headers['user-agent'] || '',
  });
};

const normalizeEmbedUrl = url => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtube.com') {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch {
    return url;
  }
};

const authRequired = async (req, res, next) => {
  const token = getTokenFromRequest(req);
  const userId = sessions.get(token);

  if (!userId) {
    return res.status(401).json({ message: 'Debes iniciar sesion.' });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    sessions.delete(token);
    return res.status(401).json({ message: 'Sesion invalida.' });
  }

  req.user = user;
  next();
};

const adminRequired = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Solo el administrador puede acceder a esta seccion.' });
  }

  next();
};

const seedAdminUser = async () => {
  const admin = await User.findOne({ where: { email: ADMIN_EMAIL } });
  const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10);

  if (!admin) {
    await User.create({
      name: 'Brandon Megia',
      email: ADMIN_EMAIL,
      password: hash,
      phone: '0000000000',
      dateOfBirth: null,
      role: 'admin',
      verified: true,
    });
    console.log('Admin user created successfully');
    return;
  }

  await User.update(
    { name: 'Brandon Megia', password: hash, role: 'admin', verified: true },
    { where: { email: ADMIN_EMAIL } }
  );
  console.log('Admin user updated successfully');
};

app.get('/api/users', authRequired, adminRequired, async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'phone', 'dateOfBirth', 'role', 'verified'],
    order: [['id', 'ASC']],
  });
  res.json(users);
});

app.put('/api/users/:id', authRequired, adminRequired, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await User.update({ name }, { where: { id } });
  res.sendStatus(200);
});

app.delete('/api/users/:id', authRequired, adminRequired, async (req, res) => {
  const { id } = req.params;
  if (Number(id) === req.user.id) {
    return res.status(400).json({ message: 'No puedes eliminar tu propio usuario administrador.' });
  }

  await User.destroy({ where: { id } });
  res.sendStatus(204);
});

app.get('/api/emails', authRequired, adminRequired, async (req, res) => {
  const emails = await Email.findAll();
  res.json(emails);
});

app.get('/api/admin/content', authRequired, adminRequired, async (req, res) => {
  const items = await ContentItem.findAll({ order: [['createdAt', 'DESC']] });
  res.json(items);
});

app.post('/api/admin/content', authRequired, adminRequired, async (req, res) => {
  const { title, description, type, embedUrl, body, durationMinutes, category, coverUrl, featured } = req.body;
  const normalizedType = type === 'blog' ? 'blog' : 'video';

  if (!title || (normalizedType === 'video' && !embedUrl) || (normalizedType === 'blog' && !body)) {
    return res.status(400).json({ message: 'Completa titulo y contenido requerido.' });
  }

  const item = await ContentItem.create({
    title,
    description,
    type: normalizedType,
    embedUrl: normalizedType === 'video' ? normalizeEmbedUrl(embedUrl) : null,
    body: normalizedType === 'blog' ? body : null,
    durationMinutes: normalizedType === 'video' ? Number(durationMinutes || 0) : null,
    category: normalizedType === 'video' ? category || 'general' : 'blog',
    coverUrl: normalizedType === 'video' ? coverUrl || null : null,
    featured: normalizedType === 'video' ? Boolean(featured) : false,
    active: true,
  });

  res.status(201).json(item);
});

app.delete('/api/admin/content/:id', authRequired, adminRequired, async (req, res) => {
  await ContentItem.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

app.get('/api/content', authRequired, async (req, res) => {
  const { type } = req.query;
  const where = { active: true };
  if (type === 'video' || type === 'blog') {
    where.type = type;
  }

  const items = await ContentItem.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(items);
});

app.get('/api/content/:id', authRequired, async (req, res) => {
  const item = await ContentItem.findOne({
    where: {
      id: req.params.id,
      active: true,
    },
  });

  if (!item) {
    return res.status(404).json({ message: 'Contenido no encontrado.' });
  }

  res.json(item);
});

app.get('/api/admin/notifications', authRequired, adminRequired, async (req, res) => {
  const notifications = await Notification.findAll({ order: [['createdAt', 'DESC']] });
  res.json(notifications);
});

app.post('/api/admin/notifications', authRequired, adminRequired, async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ message: 'Titulo y mensaje son obligatorios.' });
  }

  const notification = await Notification.create({ title, message, active: true });
  res.status(201).json(notification);
});

app.delete('/api/admin/notifications/:id', authRequired, adminRequired, async (req, res) => {
  await Notification.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

app.get('/api/notifications', authRequired, async (req, res) => {
  const notifications = await Notification.findAll({
    where: { active: true },
    order: [['createdAt', 'DESC']],
  });
  res.json(notifications);
});

app.get('/api/admin/access-logs', authRequired, adminRequired, async (req, res) => {
  const logs = await AccessLog.findAll({
    include: [{ model: User, attributes: ['id', 'name', 'email', 'phone', 'role'] }],
    order: [['createdAt', 'DESC']],
    limit: 200,
  });
  res.json(logs);
});

app.delete('/api/admin/access-logs', authRequired, adminRequired, async (req, res) => {
  await AccessLog.destroy({ where: {} });
  res.sendStatus(204);
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, dateOfBirth } = req.body;
  if (!name || !email || !password || !phone || !dateOfBirth) {
    return res.status(400).json({ message: 'Nombre, email, contrasena, telefono y fecha de nacimiento son obligatorios.' });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'El email ya existe. Usa otro correo o inicia sesion.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    dateOfBirth,
    verified: false,
  });
  const token = createSession(newUser);
  await recordAccess(req, newUser, 'register');

  return res.status(201).json({
    user: publicUser(newUser),
    token,
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contrasena son requeridos.' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Email o contrasena incorrectos.' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Email o contrasena incorrectos.' });
  }

  const token = createSession(user);
  await recordAccess(req, user, 'login');

  return res.json({
    user: publicUser(user),
    token,
  });
});

app.post('/api/logout', authRequired, async (req, res) => {
  const token = getTokenFromRequest(req);
  await AccessLog.create({
    UserId: req.user.id,
    action: 'logout',
    ipAddress: getRequestIp(req),
    userAgent: req.headers['user-agent'] || '',
    disconnectedAt: new Date(),
  });
  sessions.delete(token);
  res.sendStatus(204);
});

app.get('/api/profile', authRequired, async (req, res) => {
  return res.json(publicUser(req.user));
});

const init = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await seedAdminUser();

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

init();
