import { PlayableMaps } from "../model/playable_maps.js";
import { MapController } from "../controller/map_controller.js";

export class Game {
    // instance of MapController object
    #controller;
    
    // attribute which permite to know if the controller must start a new game or a saved game
    #loadSavedGame;

    // attribute which permite to know if there is a list of maps available in the game in the localStorage
    #loadMapsList;

    /**
     * Constructor
     */
    constructor() {
        this.#loadMapsList = (window.localStorage.getItem('mapsList') !== null || window.localStorage.getItem('mapsList') != null);
        this.#loadSavedGame = window.localStorage.getItem('loadSavedGame');
        this.#controller = new MapController();  
        this.#makeGame();
    }

    /**
     * initiate the list of maps avalaible in the game from the localStorage data if there is
     * if #loadSavedGame is equals to "true", load the saved game
     * if #loadSavedGame is equals to "false", load a new game
     */
    #makeGame() {
        if(this.#loadMapsList) { 
            this.#controller.mapsList.maps = JSON.parse(window.localStorage.getItem('mapsList'));
        }
        if(this.#loadSavedGame == 'true') { 
            this.#controller.mapsList.currentMapIndex = JSON.parse(window.localStorage.getItem('currentMapIndex'));
            this.#controller.loadGame(JSON.parse(window.localStorage.getItem('backup'))); 
        } else { 
            this.#controller.newGame(); 
            window.localStorage.setItem('loadSavedGame', 'true');
        }
    }

    /**
     * save in localStorage the current map data, the list of maps and the index in this list of the map currently played
     */
    saveGameInWeb() {
        window.localStorage.setItem('backup', JSON.stringify(this.#controller.map.saveGame()));
        window.localStorage.setItem('mapsList', JSON.stringify(this.#controller.mapsList.maps));
        window.localStorage.setItem('currentMapIndex', JSON.stringify(this.#controller.mapsList.currentMapIndex));
    }
    
    /**
     * reload the current level to try again
     */
    retry() {
        let bool =confirm("Voulez-vous recommencer la partie ?");
        if (bool == true) { this.#controller.retryLevel(); }
    }
}




/**
 * set the volume of the background music
 */
function volume() {
    let audio = document.getElementById('audio');
    if(audio.duration > 0 && !audio.paused) { 
        audio.muted = !audio.muted;
        if(audio.muted == true) { window.sessionStorage.setItem('muted', 'true'); }
        else { window.sessionStorage.setItem('muted', 'false'); }
    }
    else { 
        audio.play();
        window.sessionStorage.setItem('muted', 'false');
    }
}

/**
 * return to the index page
 */
function return_menu() {
    let bool =confirm("Voulez-vous retourner à l'accueil ? Votre partie sera sauvegardée.");
    if (bool == true) { window.location.href='../index.html'; }
}




// declaration of the variable game which will be initialized after the loading of the page
let game = null;




/**
 * set the volume of the background music
 * initialize the game variable by created a new instance of Game object
 */
window.addEventListener("load", () => {
    document.getElementById('audio').volume = 0.2;
    if(window.sessionStorage.getItem('muted') == 'true') { document.getElementById('audio').muted = true; }
    
    game = new Game();
});

/**
 * attach the saveGameInWeb function of Game class called by the variable game to the event beforeunload
 */
window.addEventListener('beforeunload', () => {
    game.saveGameInWeb();
});

/**
 * attach the retry function of Game class called by the variable game to the button #retry
 */
document.querySelector("#retry").addEventListener("click", () => {
    game.retry();
});

/**
 * attach the volume function to the button #volume
 */
document.querySelector("#volume").addEventListener("click", volume);

/**
 * attach the return_menu function to the button #home
 */
document.querySelector("#home").addEventListener("click", return_menu);