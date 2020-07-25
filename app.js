const API = 'https://swapi.dev/api'
const getFilms = async () => {
    console.time('Time this');
    console.log('loading...')
    // Get all the films
    films = await fetchItem(`${API}/films`)
    let newFilms = await getData(films.results.map(async film => {
        let newFilm = {};
        newFilm.name = film.title;
        newFilm.planets = await getData(film.planets.map(async planet => {
            let fethPlanet = await fetchItem(planet)
            let { name, terrain, diameter, gravity, population } = fethPlanet;
            return { name, terrain, diameter, gravity, population }
        }));
        newFilm.people = await getData(film.characters.map(async character => {
            let fethCharacter = await fetchItem(character)
            let { name, gender, hair_color, skin_color, eye_color, height, homeworld, species } = fethCharacter;
            species = await getData(species.map(async specie => {
                let fethSpecie = await fetchItem(specie)
                let { name, language, average_height } = fethSpecie;
                return { name, language, average_height }
            }));
            return { name, gender, hair_color, skin_color, eye_color, height, homeworld, species }
        }));
        newFilm.starships = await getData(film.starships.map(async starship => {
            let fethStarship = await fetchItem(starship)
            let { name, model, manufacturer, passengers } = fethStarship;
            return { name, model, manufacturer, passengers }
        }));
        return newFilm;
    }))
    console.timeEnd('Time this');
    console.log(newFilms);
}

const getData = async (list) => {
    return Promise.all(list)
}
const fetchItem = async (url) => {
    try {
        let data = await fetch(url);
        data = await data.json()
        return data;
    } catch (e) {
        console.warn(e)
    }
}
getFilms();