<template>
    <div>
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="d-flex flex-column justify-content-center align-items-center p-5 mt-5">
                <h1>
                    <i>Gare<strong>NoTicket</strong></i>
                </h1>
                <p>Le premier site d'aide aux stationnements pour les étudiants du cégep.</p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center">
                <p class="fs-3">Pour commencer</p>
                <div class="btn btn-primary">S'inscrire</div>
                <p>ou</p>
                <div class="btn btn-primary">
                    <RouterLink style="text-decoration: none; color: inherit" to="/login">
                        Se connecter
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Accueil',
}
</script>

<style>
.lien {
    color: white;
    text-decoration: none;
}
/* Add any custom styles for your home page here */
</style>
