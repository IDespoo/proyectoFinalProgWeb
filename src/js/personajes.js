document.addEventListener('DOMContentLoaded', async function () {
    await getCharactersRequest();

    const saveCharacterButton = document.getElementById('guardarPjButton');
    saveCharacterButton.addEventListener('click', async function () {
        const characterImageURL = document.getElementById('nuevoPjURL').value;
        const characterName = document.getElementById('nuevoPjNombre').value;
        const characterAbility = document.getElementById('nuevoPjHabilidad').value;
        const characterGenre = document.getElementById('nuevoPjGenero').value;

        if (!validateFields(characterName, characterAbility, characterGenre, characterImageURL)) {
            return;
        }

        try {
            await saveCharacterRequest({ characterImageURL, characterName, characterAbility, characterGenre });
            hideModal('nuevoPjModal');
            await getCharactersRequest();
        } catch (error) {
            console.error('Error al guardar el personaje', error);
        }
    });

    const updateCharacterButton = document.getElementById('actualizarPjButton');
    updateCharacterButton.addEventListener('click', async function () {
        const characterID = document.getElementById('editarPjIDs').textContent;
        const characterName = document.getElementById('editarPjNombre').value;
        const characterAbility = document.getElementById('editarPjHabilidad').value;
        const characterGenre = document.getElementById('editarPjGenero').value;
        const characterImageURL = document.getElementById('editarPjURL').value;

        if (!validateFields(characterName, characterAbility, characterGenre, characterImageURL)) {
            return;
        }

        try {
            await updateCharacterRequest({ characterID, characterName, characterAbility, characterGenre, characterImageURL });
            hideModal('editarPjModal');
            await getCharactersRequest();
        } catch (error) {
            console.error('Error al actualizar el personaje', error);
        }
    });

    const deleteCharacterButton = document.getElementById('borrarPjButton');
    deleteCharacterButton.addEventListener('click', async function () {
        const characterId = document.getElementById('eliminarPersonajeID').textContent;

        try {
            await deleteCharacterRequest(characterId);
            hideModal('eliminarPjModal');
            await getCharactersRequest();
        } catch (error) {
            console.error('Error al eliminar el personaje', error);
        }
    });

});

function validateFields(name, ability, genre, imageURL) {
    if (name === '' || ability === '' || genre === '' || imageURL === '') {
        alert('Todos los campos son obligatorios');
        return false;
    }
    return true;
}

    function createCell(text) {
        const cell = document.createElement('td');
        cell.textContent = text;
        return cell;
    }
    
    function createButton(className, iconClass, clickHandler) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = className;
        button.innerHTML = `<i class="${iconClass}"></i>`;
        button.addEventListener('click', clickHandler);
        return button;
    }
    
    function showCharacters(characters) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
    
        if (!!characters && characters.length > 0) {
            characters.forEach(character => {
                const row = document.createElement('tr');
    
                row.appendChild(createCell(character.id));
    
                const imageCell = document.createElement('td');
                imageCell.innerHTML = `<img src="${character.imagenURL}" alt="${character.nombre}" class="img-fluid table-img" width="100">`;                row.appendChild(imageCell);
    
                row.appendChild(createCell(character.nombre));
                row.appendChild(createCell(character.habilidad));
                row.appendChild(createCell(character.genero));
    
                const showCell = document.createElement('td');
                showCell.appendChild(createButton('btn btn-outline-success', 'bi bi-eye', () => showOneCharacter(character.id)));
                row.appendChild(showCell);

    
                const editCell = document.createElement('td');
                editCell.appendChild(createButton('btn btn-outline-primary', 'fas fa-pencil-alt', () => editCharacter(character.id, character.nombre, character.habilidad, character.genero, character.imagenURL)));
                row.appendChild(editCell);
    
                const deleteCell = document.createElement('td');
                deleteCell.appendChild(createButton('btn btn-outline-danger', 'bi bi-trash', () => deleteCharacter(character.id, character.nombre)));
                row.appendChild(deleteCell);
    
                tableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            const noCharactersCell = document.createElement('td');
            noCharactersCell.colSpan = 8;
            noCharactersCell.textContent = 'No hay personajes registrados';
            row.appendChild(noCharactersCell);
            tableBody.appendChild(row);
        }
    }

async function getCharactersRequest() {
    try {
        let response = await fetch('http://localhost:3000/personajes');
        let data = await response.json();
        showCharacters(data);
    } catch (error) {
        console.log(error);
        showCharacters([]);
    }
}

// Crear personaje
async function saveCharacterRequest({ characterImageURL, characterName, characterAbility, characterGenre }) {
    try {
        const response = await fetch('http://localhost:3000/personajes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imagenURL: characterImageURL,
                nombre: characterName,
                habilidad: characterAbility,
                genero: characterGenre,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.ok) {
                alert('Personaje creado exitosamente');
                hideModal('nuevoPjModal');
                await getCharactersRequest();
            } else {
                alert('Error al crear el personaje');
            }
        } else {
            alert('Error al crear el personaje');
        }
    } catch (error) {
        console.error(error);
        alert('Error al crear el personaje');
    }
}

// Actualizar personaje
async function updateCharacterRequest({ characterID, characterName, characterAbility, characterGenre, characterImageURL }) {
    try {
        let request = await fetch(`http://localhost:3000/personajes/${characterID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imagenURL: characterImageURL,
                nombre: characterName,
                habilidad: characterAbility,
                genero: characterGenre
            })
        });
        let data = await request.json();

        if (data.ok) {
            alert('Personaje actualizado exitosamente');
            hideModal('editarPjModal');
            // Actualizar la tabla sin recargar la página
            await getCharactersRequest();
        } else {
            alert('Error al actualizar el personaje');
        }
    } catch (error) {
        console.error(error);
        alert('Error al actualizar el personaje');
    }
}

function editCharacter(id, name, ability, genre, imageURL) {
    document.getElementById('editarPjIDs').textContent = id;
    document.getElementById('editarPjNombre').value = name;
    document.getElementById('editarPjHabilidad').value = ability;
    document.getElementById('editarPjGenero').value = genre;
    document.getElementById('editarPjURL').value = imageURL;
    showModal('editarPjModal');
}


function deleteCharacter(id, name) {
    document.getElementById('eliminarPersonajeID').textContent = id;
    document.getElementById('eliminarPersonajeNombre').textContent = name;
    showModal('eliminarPjModal');
}

// Eliminar personaje
async function deleteCharacterRequest(characterID) {
    try {
        let request = await fetch(`http://localhost:3000/personajes/${characterID}`, {
            method: 'DELETE'
        });
        let data = await request.json();

        if (data.ok) {
            alert('Personaje eliminado exitosamente');
            hideModal('eliminarPjModal');
            // Actualizar la tabla sin recargar la página
            await getCharactersRequest();
        } else {
            alert('Error al eliminar el personaje');
        }
    } catch (error) {
        console.error(error);
        alert('Error al eliminar el personaje');
    }
}

async function showOneCharacter(id) {
    console.log(`Solicitando personaje con ID: ${id}`);
    try {
        let request = await fetch(`http://localhost:3000/personajes/${id}`, {
            method: 'GET'
        });
        let data = await request.json();
        if (data.ok) {
            showCharacter(data.personaje);
            showModal('verPjModal');
        } else {
            alert(`Error al obtener el personaje: ${data.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error(error);
        alert('Error al procesar la solicitud');
    }
}


function showCharacter(character) {
    const characterContainer = document.getElementById('character-container');
    characterContainer.innerHTML = `
        <div class="card mb-3">
            <div class="row g-0 h-100 w-100">
                <div class="col-md-4">
                    <img src="${character.imagenURL}" class="img-fluid rounded-start h-100 w-100" alt="${character.nombre}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${character.nombre}</h5>
                        <p class="card-text">${character.habilidad}</p>
                        <p class="card-text"><small class="text-muted">${character.genero}</small></p>
                    </div>
                </div>
            </div>
        </div>`;
}

function hideModal(idModal) {
    const existingModal = document.getElementById(idModal);
    const modal = bootstrap.Modal.getInstance(existingModal);
    modal.hide();
}

function showModal(idModal) {
    const myModal = new bootstrap.Modal(`#${idModal}`, {
        keyboard: false
    });
    myModal.show();
}