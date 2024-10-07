import { JSONFilePreset } from 'lowdb/node'
import { serve } from '@hono/node-server'
const defaultData = {
  data: {
    lock: false,
  }
};

const db = await JSONFilePreset('remote-lock-screen.json', defaultData)

import { Hono } from 'hono'
const app = new Hono()

app.get('/get_lock', async (c) => {
  const lock = db.data.data.lock;
  if (lock) {
    db.data.data.lock = false;
    await db.write();
  }
  return c.json({
    lock,
  });
});

app.post('/set_lock', async (c) => {
  db.data.data.lock = true;
  const data = db.data.data;
  await db.write();
  return c.json(data);
});

// export default app
serve({
  fetch: app.fetch,
  port: 8008, // Port number, default is 3000
});
