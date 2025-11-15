import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

// Configuración de conexión con SQL Server
const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,     // Ej: DESKTOP-KVMIQUO\SQLEXPRESS
  database: process.env.DB_DATABASE, // Ej: StudyCare
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,                  // Cambia a true solo si usas Azure
    trustServerCertificate: true,    // Necesario para conexiones locales
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Función de conexión principal
export async function getConnection() {
  try {
    const pool = await sql.connect(dbSettings);
    console.log("🟢 Conexión exitosa a SQL Server:", process.env.DB_SERVER);
    return pool;
  } catch (err) {
    console.error("❌ Error al conectar con la base de datos:");
    console.error("   Mensaje:", err.message);
    console.error("   Servidor:", process.env.DB_SERVER);
    console.error("   Base de datos:", process.env.DB_DATABASE);
    console.error("   Usuario:", process.env.DB_USER);
  }
}

export { sql };
