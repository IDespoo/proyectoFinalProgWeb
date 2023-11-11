document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/personajes');
        const personajes = await response.json();
        showPersonajes(personajes);
    } catch (error) {
        console.log(error);
    }
});

function showPersonajes(personajes) {
    const arrayPersonajes = personajes.map((personaje, index) => {
        const startRow = index % 3 === 0 ? '<div class="row">' : '';
        const endRow = index % 3 === 2 || index === personajes.length - 1 ? '</div>' : '';
        return `
            ${startRow}
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${personaje.imagenURL}" class="img-fluid rounded-start h-100 card-img" alt="${personaje.nombre}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${personaje.nombre}</h5>
                                <p class="card-text">${personaje.habilidad}</p>
                                <p class="card-text"><small class="text-muted">${personaje.genero}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${endRow}`;
    }).join('');

    const personajesContainer = document.getElementById('personajes-container');
    personajesContainer.innerHTML = arrayPersonajes;
}