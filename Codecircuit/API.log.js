import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db('Integracion');
    const logs = database.collection('historial');

    const nuevoRegistro = {
      uid: req.body.uid,
      acceso: req.body.acceso,
      fecha: new Date()
    };

    await logs.insertOne(nuevoRegistro);

    return res.status(200).json({ status: 'Exito', mensaje: 'Registro guardado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al conectar a MongoDB' });
  } finally {
    await client.close();
  }
}
