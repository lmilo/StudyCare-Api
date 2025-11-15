import { getConnection } from "./config/db.js";

const probarConexion = async () => {
  const pool = await getConnection();
  if (pool) {
    const result = await pool.request().query("SELECT GETDATE() AS fecha_actual");
    console.log("✅ Conexión correcta. Fecha en SQL Server:", result.recordset[0].fecha_actual);
  }
};

probarConexion();
