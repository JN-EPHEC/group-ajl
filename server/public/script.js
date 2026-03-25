async function init(){
    const donnees = await fetch("http://localhost:3000/api/users");
    const utilisateurs = await donnees.json();
    const liste = document.getElementById('userList');
    liste.innerHTML = "";

    for(i of utilisateurs){
        liste.innerHTML += `<li id='${i.id}' class="list-group-item d-flex justify-content-between align-items-center">
        ${i.nom} ${i.prenom}<button class='btn btn-secondary btn-sm' onclick='delete_user(${i.id});'>X</button></li>`;
    }
}

async function soumission_form(){
    const form = document.getElementById('userForm');
    const nom = form.nom.value;
    const prenom = form.prenom.value;

    await fetch("http://localhost:3000/api/users", {
        method : "POST",
        headers: {"Content-Type": "application/json"},
        body : JSON.stringify({
            nom : nom,
            prenom : prenom
        })
    });

    init();
}

async function delete_user(id){
    await fetch(`http://localhost:3000/api/users/${id}`, {
        method : "DELETE",
    });

    init();
}