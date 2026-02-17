import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'rank_arena',
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const qr = dataSource.createQueryRunner();
  await qr.connect();

  const adminHash = await bcrypt.hash('AdminPass123!', 10);
  const vipHash = await bcrypt.hash('VipPass123!', 10);
  const normalHash = await bcrypt.hash('NormalPass123!', 10);

  await qr.query(
    `INSERT IGNORE INTO users (email, password_hash, full_name, role) VALUES
    ('admin@rankarena.test', ?, 'Admin User', 'admin'),
    ('vip@rankarena.test', ?, 'VIP User', 'vip'),
    ('normal@rankarena.test', ?, 'Normal User', 'normal')`,
    [adminHash, vipHash, normalHash],
  );

  const adminRows = await qr.query(
    `SELECT id FROM users WHERE email = 'admin@rankarena.test'`,
  );
  const adminId = (adminRows as any[])[0]?.id ?? 1;

  await qr.query(
    `INSERT INTO contests (name, description, access_level, start_time, end_time, prize_description, is_published, created_by)
    VALUES ('Normal Contest', 'A contest for all users', 'normal', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 'First place prize', 1, ?)`,
    [adminId],
  );
  const contestNormalRows = await qr.query(
    `SELECT id FROM contests WHERE name = 'Normal Contest' ORDER BY id DESC LIMIT 1`,
  );
  const contestNormalId = (contestNormalRows as any[])[0]?.id ?? 1;

  await qr.query(
    `INSERT INTO contests (name, description, access_level, start_time, end_time, prize_description, is_published, created_by)
    VALUES ('VIP Contest', 'A contest for VIP users', 'vip', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY), 'VIP exclusive prize', 1, ?)`,
    [adminId],
  );
  const contestVipRows = await qr.query(
    `SELECT id FROM contests WHERE name = 'VIP Contest' ORDER BY id DESC LIMIT 1`,
  );
  const contestVipId = (contestVipRows as any[])[0]?.id ?? 2;

  const normalQ1 = await qr.query(
    `INSERT INTO questions (contest_id, type, text, points, order_index) VALUES (?, 'single', 'What is 2+2?', 1, 0)`,
    [contestNormalId],
  );
  const q1Id = (normalQ1 as any).insertId;
  await qr.query(
    `INSERT INTO options (question_id, text, is_correct, order_index) VALUES (?, '4', 1, 0), (?, '3', 0, 1), (?, '5', 0, 2)`,
    [q1Id, q1Id, q1Id],
  );

  const normalQ2 = await qr.query(
    `INSERT INTO questions (contest_id, type, text, points, order_index) VALUES (?, 'multi', 'Select all prime numbers', 2, 1)`,
    [contestNormalId],
  );
  const q2Id = (normalQ2 as any).insertId;
  await qr.query(
    `INSERT INTO options (question_id, text, is_correct, order_index) VALUES (?, '2', 1, 0), (?, '3', 1, 1), (?, '4', 0, 2), (?, '5', 1, 3)`,
    [q2Id, q2Id, q2Id, q2Id],
  );

  const normalQ3 = await qr.query(
    `INSERT INTO questions (contest_id, type, text, points, order_index) VALUES (?, 'truefalse', 'The Earth is flat.', 1, 2)`,
    [contestNormalId],
  );
  const q3Id = (normalQ3 as any).insertId;
  await qr.query(
    `INSERT INTO options (question_id, text, is_correct, order_index) VALUES (?, 'True', 0, 0), (?, 'False', 1, 1)`,
    [q3Id, q3Id],
  );

  const normalQ4 = await qr.query(
    `INSERT INTO questions (contest_id, type, text, points, order_index) VALUES (?, 'single', 'Capital of France?', 1, 3)`,
    [contestNormalId],
  );
  const q4Id = (normalQ4 as any).insertId;
  await qr.query(
    `INSERT INTO options (question_id, text, is_correct, order_index) VALUES (?, 'Paris', 1, 0), (?, 'London', 0, 1), (?, 'Berlin', 0, 2)`,
    [q4Id, q4Id, q4Id],
  );

  const vipQ1 = await qr.query(
    `INSERT INTO questions (contest_id, type, text, points, order_index) VALUES (?, 'single', 'VIP: What is 10*10?', 1, 0)`,
    [contestVipId],
  );
  const vq1Id = (vipQ1 as any).insertId;
  await qr.query(
    `INSERT INTO options (question_id, text, is_correct, order_index) VALUES (?, '100', 1, 0), (?, '10', 0, 1), (?, '1000', 0, 2)`,
    [vq1Id, vq1Id, vq1Id],
  );

  const vipQ2 = await qr.query(
    `INSERT INTO questions (contest_id, type, text, points, order_index) VALUES (?, 'truefalse', 'VIP: JavaScript is a programming language.', 1, 1)`,
    [contestVipId],
  );
  const vq2Id = (vipQ2 as any).insertId;
  await qr.query(
    `INSERT INTO options (question_id, text, is_correct, order_index) VALUES (?, 'True', 1, 0), (?, 'False', 0, 1)`,
    [vq2Id, vq2Id],
  );

  const normalUserRows = await qr.query(
    `SELECT id FROM users WHERE email = 'normal@rankarena.test'`,
  );
  const normalUserId = (normalUserRows as any[])[0]?.id ?? 3;

  await qr.query(
    `INSERT IGNORE INTO contest_participants (contest_id, user_id) VALUES (?, ?)`,
    [contestNormalId, normalUserId],
  );

  await qr.release();
  await dataSource.destroy();
  console.log('Seed completed');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
