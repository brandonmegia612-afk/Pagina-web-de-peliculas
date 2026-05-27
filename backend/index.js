const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

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
  subscriptionTier: {
    type: DataTypes.STRING,
    defaultValue: 'free',
    allowNull: false,
    validate: {
      isIn: [['free', 'premium']],
    },
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
  premiumOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
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

const Subscription = sequelize.define('Subscription', {
  planName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Premium',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'trial',
  },
  amountCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD',
  },
  cardBrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardLast4: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paidThrough: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  adultContentEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  receivingCardName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  receivingCardLast4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const ReceivingCard = sequelize.define('ReceivingCard', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardBrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardLast4: {
    type: DataTypes.STRING,
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

const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

User.hasMany(AccessLog);
AccessLog.belongsTo(User);
User.hasOne(Subscription);
Subscription.belongsTo(User);
User.hasMany(Comment);
Comment.belongsTo(User);
ContentItem.hasMany(Comment);
Comment.belongsTo(ContentItem);

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

const normalizeEmail = email => String(email || '').trim().toLowerCase();

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

const isAdult = dateOfBirth => {
  if (!dateOfBirth) return false;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age >= 18;
};

const detectCardBrand = cardNumber => {
  const cleanNumber = String(cardNumber || '').replace(/\D/g, '');
  if (/^4\d{12}(\d{3})?$/.test(cleanNumber)) return 'Visa';
  if (/^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/.test(cleanNumber)) return 'Mastercard';
  return null;
};

const passesLuhn = cardNumber => {
  const digits = String(cardNumber || '').replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return digits.length >= 13 && sum % 10 === 0;
};

const isFutureExpiry = expiry => {
  const match = String(expiry || '').trim().match(/^(\d{2})\/(\d{2}|\d{4})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(match[2].length === 2 ? `20${match[2]}` : match[2]);
  if (month < 1 || month > 12) return false;

  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= new Date();
};

const addMonths = (date, months) => {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
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
    include: [{ model: Subscription }],
    order: [['id', 'ASC']],
  });
  res.json(users);
});

app.put('/api/users/:id', authRequired, adminRequired, async (req, res) => {
  const { id } = req.params;
  const { name, subscriptionTier } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (subscriptionTier && ['free', 'premium'].includes(subscriptionTier)) {
    updates.subscriptionTier = subscriptionTier;
  }
  await User.update(updates, { where: { id } });
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
  const { title, description, type, embedUrl, body, durationMinutes, category, coverUrl, featured, premiumOnly } = req.body;
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
    premiumOnly: Boolean(premiumOnly),
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

  // Filter premium content based on user subscription
  const userSubscriptionTier = req.user.subscriptionTier || 'free';
  if (userSubscriptionTier === 'free') {
    where.premiumOnly = false;
  }
  // Premium users see all content

  const items = await ContentItem.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(items);
});

app.get('/api/content/:id', authRequired, async (req, res) => {
  const item = await ContentItem.findOne({
    where: {
      id: req.params.id,
      active: true,
    },
    include: [
      {
        model: Comment,
        include: [{ model: User, attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
        limit: 50,
      },
    ],
  });

  if (!item) {
    return res.status(404).json({ message: 'Contenido no encontrado.' });
  }

  // Check if user has access to this content
  if (item.premiumOnly && req.user.subscriptionTier !== 'premium') {
    return res.status(403).json({ message: 'Este contenido es solo para usuarios premium.' });
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

app.get('/api/admin/subscriptions', authRequired, adminRequired, async (req, res) => {
  const subscriptions = await Subscription.findAll({
    include: [{ model: User, attributes: ['id', 'name', 'email', 'phone', 'dateOfBirth'] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(subscriptions);
});

app.get('/api/admin/receiving-cards', authRequired, adminRequired, async (req, res) => {
  const cards = await ReceivingCard.findAll({ order: [['createdAt', 'DESC']] });
  res.json(cards);
});

app.post('/api/admin/receiving-cards', authRequired, adminRequired, async (req, res) => {
  const { name, cardNumber } = req.body;
  const cleanCardNumber = String(cardNumber || '').replace(/\D/g, '');
  const brand = detectCardBrand(cleanCardNumber);

  if (!name || !brand || !passesLuhn(cleanCardNumber)) {
    return res.status(400).json({ message: 'Agrega una tarjeta Visa o Mastercard valida.' });
  }

  await ReceivingCard.update({ active: false }, { where: {} });
  const card = await ReceivingCard.create({
    name,
    cardBrand: brand,
    cardLast4: cleanCardNumber.slice(-4),
    active: true,
  });

  res.status(201).json(card);
});

app.put('/api/admin/receiving-cards/:id/activate', authRequired, adminRequired, async (req, res) => {
  const card = await ReceivingCard.findByPk(req.params.id);
  if (!card) {
    return res.status(404).json({ message: 'Tarjeta no encontrada.' });
  }

  await ReceivingCard.update({ active: false }, { where: {} });
  await card.update({ active: true });
  res.json(card);
});

app.delete('/api/admin/receiving-cards/:id', authRequired, adminRequired, async (req, res) => {
  await ReceivingCard.destroy({ where: { id: req.params.id } });
  const activeCard = await ReceivingCard.findOne({ where: { active: true } });
  if (!activeCard) {
    const nextCard = await ReceivingCard.findOne({ order: [['createdAt', 'DESC']] });
    if (nextCard) await nextCard.update({ active: true });
  }
  res.sendStatus(204);
});

app.post('/api/admin/subscriptions/:id/notify', authRequired, adminRequired, async (req, res) => {
  const { subject, message } = req.body;
  const subscription = await Subscription.findByPk(req.params.id, {
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
  });

  if (!subscription) {
    return res.status(404).json({ message: 'Suscripcion no encontrada.' });
  }

  if (!subject || !message) {
    return res.status(400).json({ message: 'Asunto y mensaje son obligatorios.' });
  }

  await Email.create({
    subject,
    sender: subscription.User.email,
  });
  await Notification.create({
    title: subject,
    message: `${subscription.User.name}: ${message}`,
    active: true,
  });

  res.json({ message: 'Notificacion y correo administrativo registrados.' });
});

app.delete('/api/admin/access-logs', authRequired, adminRequired, async (req, res) => {
  await AccessLog.destroy({ where: {} });
  res.sendStatus(204);
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, dateOfBirth } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (!name || !email || !password || !phone || !dateOfBirth) {
    return res.status(400).json({ message: 'Nombre, email, contrasena, telefono y fecha de nacimiento son obligatorios.' });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Ingresa un correo electronico valido.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'La contrasena debe tener al menos 8 caracteres.' });
  }

  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    return res.status(409).json({ message: 'El email ya existe. Usa otro correo o inicia sesion.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await User.create({
    name,
    email: normalizedEmail,
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
  const normalizedEmail = normalizeEmail(email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contrasena son requeridos.' });
  }

  const user = await User.findOne({ where: { email: normalizedEmail } });
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
  const subscription = await Subscription.findOne({ where: { UserId: req.user.id } });
  return res.json({ ...publicUser(req.user), subscription });
});

app.get('/api/subscription', authRequired, async (req, res) => {
  const subscription = await Subscription.findOne({ where: { UserId: req.user.id } });
  const receivingCard = await ReceivingCard.findOne({ where: { active: true } });
  res.json({ subscription, receivingCard });
});

app.post('/api/subscription', authRequired, async (req, res) => {
  const { cardNumber, cardName, expiry, cvv } = req.body;
  const cleanCardNumber = String(cardNumber || '').replace(/\D/g, '');
  const brand = detectCardBrand(cleanCardNumber);

  if (!isAdult(req.user.dateOfBirth)) {
    return res.status(403).json({ message: 'Debes ser mayor de 18 anos para activar este plan.' });
  }

  if (!cardName || !brand || !passesLuhn(cleanCardNumber) || !isFutureExpiry(expiry) || !/^\d{3,4}$/.test(String(cvv || ''))) {
    return res.status(400).json({ message: 'Tarjeta invalida. Usa Visa o Mastercard vigente.' });
  }

  const receivingCard = await ReceivingCard.findOne({ where: { active: true } });
  if (!receivingCard) {
    return res.status(400).json({ message: 'El administrador debe agregar una tarjeta de cobro activa.' });
  }

  const now = new Date();
  const trialEndsAt = addMonths(now, 1);
  const paidThrough = addMonths(trialEndsAt, 1);
  const values = {
    planName: 'Premium tiempo real',
    status: 'paid_ahead',
    amountCents: 25,
    currency: 'USD',
    cardBrand: brand,
    cardLast4: cleanCardNumber.slice(-4),
    trialEndsAt,
    paidThrough,
    adultContentEnabled: true,
    receivingCardName: receivingCard.name,
    receivingCardLast4: receivingCard.cardLast4,
    UserId: req.user.id,
  };

  const existingSubscription = await Subscription.findOne({ where: { UserId: req.user.id } });
  const subscription = existingSubscription
    ? await existingSubscription.update(values)
    : await Subscription.create(values);

  await Email.create({
    subject: 'Pago de suscripcion recibido',
    sender: req.user.email,
  });

  return res.status(201).json(subscription);
});

app.post('/api/comments', authRequired, async (req, res) => {
  const { ContentItemId, text, rating } = req.body;

  if (!ContentItemId || !text) {
    return res.status(400).json({ message: 'Contenido y texto son obligatorios.' });
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'La calificacion debe estar entre 1 y 5.' });
  }

  const item = await ContentItem.findByPk(ContentItemId);
  if (!item) {
    return res.status(404).json({ message: 'Contenido no encontrado.' });
  }

  // Only premium users can comment
  if (req.user.subscriptionTier !== 'premium') {
    return res.status(403).json({ message: 'Solo usuarios premium pueden dejar comentarios.' });
  }

  const comment = await Comment.create({
    text,
    rating: rating || null,
    UserId: req.user.id,
    ContentItemId,
  });

  res.status(201).json(comment);
});

app.get('/api/comments/:contentItemId', authRequired, async (req, res) => {
  const { contentItemId } = req.params;
  const comments = await Comment.findAll({
    where: { ContentItemId: contentItemId },
    include: [{ model: User, attributes: ['id', 'name'] }],
    order: [['createdAt', 'DESC']],
    limit: 100,
  });

  res.json(comments);
});

app.delete('/api/comments/:id', authRequired, async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: 'Comentario no encontrado.' });
  }

  if (comment.UserId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No puedes eliminar este comentario.' });
  }

  await comment.destroy();
  res.sendStatus(204);
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
