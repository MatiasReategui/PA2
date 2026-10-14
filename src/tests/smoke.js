const BASE = process.env.BASE_URL || 'http://localhost:3000';
let fallos = 0;

async function llamar(metodo, ruta, { token, body } = {}) {
  const res = await fetch(BASE + ruta, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* sin cuerpo */ }
  return { status: res.status, data };
}

function verificar(nombre, condicion, detalle = '') {
  console.log(`${condicion ? 'OK   ' : 'FALLO'}  ${nombre}${condicion ? '' : '  -> ' + detalle}`);
  if (!condicion) fallos++;
}

(async () => {
  const email = `prueba_${Date.now()}@ejemplo.com`;

  let r = await llamar('POST', '/api/auth/register', { body: { nombre: 'Prueba', email, password: '123456' } });
  verificar('Registro devuelve 201 y token', r.status === 201 && !!r.data.token, JSON.stringify(r.data));

  r = await llamar('POST', '/api/auth/login', { body: { email, password: '123456' } });
  verificar('Login devuelve 200 y token', r.status === 200 && !!r.data.token, JSON.stringify(r.data));
  const token = r.data && r.data.token;

  r = await llamar('POST', '/api/auth/login', { body: { email, password: 'incorrecta' } });
  verificar('Login con clave incorrecta devuelve 401', r.status === 401);

  r = await llamar('GET', '/api/solicitudes');
  verificar('Sin token devuelve 401', r.status === 401);

  r = await llamar('POST', '/api/solicitudes', {
    token, body: { titulo: 'Constancia', descripcion: 'Necesito constancia', tipo: 'constancia' },
  });
  verificar('Crear solicitud devuelve 201', r.status === 201 && !!r.data._id, JSON.stringify(r.data));
  const id = r.data && r.data._id;

  r = await llamar('GET', '/api/solicitudes', { token });
  verificar('Listar devuelve la solicitud creada', r.status === 200 && r.data.some((s) => s._id === id));

  r = await llamar('GET', `/api/solicitudes/${id}`, { token });
  verificar('Obtener por id devuelve 200', r.status === 200 && r.data._id === id);

  r = await llamar('PUT', `/api/solicitudes/${id}`, { token, body: { descripcion: 'Actualizada' } });
  verificar('Actualizar devuelve 200 y persiste el cambio', r.status === 200 && r.data.descripcion === 'Actualizada');

  r = await llamar('PUT', `/api/solicitudes/${id}`, { token, body: { estado: 'aprobada' } });
  verificar('Estudiante no puede cambiar estado (403)', r.status === 403);

  r = await llamar('DELETE', `/api/solicitudes/${id}`, { token });
  verificar('Estudiante no puede eliminar (403)', r.status === 403);

  r = await llamar('GET', '/api/usuarios', { token });
  verificar('Estudiante no puede listar usuarios (403)', r.status === 403);

  
  r = await llamar('POST', '/api/auth/login', {
    body: { email: process.env.ADMIN_EMAIL || 'admin@ejemplo.com', password: process.env.ADMIN_PASSWORD || 'Admin123!' },
  });
  if (r.status === 200) {
    const admin = r.data.token;
    r = await llamar('PUT', `/api/solicitudes/${id}`, { token: admin, body: { estado: 'aprobada' } });
    verificar('Admin cambia estado a aprobada', r.status === 200 && r.data.estado === 'aprobada');
    r = await llamar('DELETE', `/api/solicitudes/${id}`, { token: admin });
    verificar('Admin elimina solicitud (200)', r.status === 200);
    r = await llamar('GET', `/api/solicitudes/${id}`, { token: admin });
    verificar('Solicitud eliminada ya no existe (404)', r.status === 404);
  } else {
    console.log('AVISO  No hay admin (ejecuta npm run seed) -> se omiten las pruebas de admin');
  }

  console.log(fallos === 0 ? '\nTodas las pruebas pasaron' : `\n${fallos} prueba(s) fallaron`);
  process.exit(fallos === 0 ? 0 : 1);
})().catch((e) => {
  console.error('No se pudo conectar con el servidor:', e.message);
  process.exit(1);
});
