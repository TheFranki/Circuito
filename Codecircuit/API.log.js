import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Solo POST');

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db('SistemaAcceso');
    const logs = database.collection('registros');

    const nuevoRegistro = {
      uid: req.body.uid,
      acceso: req.body.acceso,
      fecha: new Date()
    };

    await logs.insertOne(nuevoRegistro);
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}