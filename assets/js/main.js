const API_URL = "https://www.codigo-alfa.cl/aglo/Tester/";
const DB_URL = "/db/peliculas.json";

let peliculas_API = JSON.parse(sessionStorage.getItem("peli_api"));
let peliculas_BD = JSON.parse(sessionStorage.getItem("peli_db"));

const reValor = () => {
  API_URL;
  DB_URL;
  getPelicula();
  getPeliculas();
};

const resetPelicula = () => {
  $("#pelicula__header").html("");
  $("#pelicula__titulo").html("");
  $("#pelicula__title").html("");
  $("#pelicula__data").html("");
  $("#pelicula__resumen").html("");
  $("#pelicula__puntuacion").html("");
  $("#pelicula__puntuacion").html("");
  $("#pelicula__director").html("");
  $("#pelicula__reparto").html("");
};

const dataPelicula = (dataPeli, peliAleatoria) => {
  resetPelicula();

  $("#pelicula__header").css("background-image", `url(${dataPeli.imagen})`);

  $("#pelicula__titulo").html(
    `<h1 class="title is-2">${dataPeli.tituloLat}</h1>`
  );

  $("#pelicula__title").html(
    `<small>Titulo Original: <strong class="text-rojo">${peliAleatoria.title}</strong></small>`
  );

  $("#pelicula__data").html(
    `<span>${peliAleatoria.year}</span> - <span>${dataPeli.duracion}</span> - <span>${peliAleatoria.genre}</span>`
  );

  $("#pelicula__resumen").html(`<p>${dataPeli.resumen}</p>`);

  $("#pelicula__puntuacion").html(
    `<p class="is-flex is-align-items-center"><span class="icon has-text-warning pr-1"><i class="fas fa-star"></i></span><strong class="is-size-5">${dataPeli.puntuacion}</strong>/10 IMDb</p>`
  );

  $("#pelicula__trailer").html(
    `<button id="pelicula__btn" class="button" onclick="verTrailer('${dataPeli.trailer}');">TRAILER</button><div id="pelicula__modal-background"></div><div id="pelicula__modal" onclick="cerrarTrailer()"><iframe src="${dataPeli.trailer}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`
  );

  let aux = dataPeli.director.length > 1 ? "Directores(as): " : "Director(a): ";
  $("#pelicula__director").append(aux);
  $.each(dataPeli.director, function (i, director) {
    $("#pelicula__director").append(
      `<strong class="text-rojo">${director}</strong>`
    );
  });

  $("#pelicula__reparto").append("Reparto: ");
  $.each(dataPeli.reparto, function (i, reparto) {
    $("#pelicula__reparto").append(
      `<strong class="text-rojo">${reparto}</strong>`
    );
    if (i < 2) $("#pelicula__reparto").append(" - ");
  });
};

const getPelicula = (id = 0) => {
  let dataPeli;
  let peliAleatoria;

  if (id == 0) {
    $.get(API_URL + "peliculaAleatoria", function (response) {
      peliAleatoria = response.pelicula;
      dataPeli = peliculas_BD[peliAleatoria.id - 1];
      dataPelicula(dataPeli, peliAleatoria);
    });
  } else {
    dataPeli = peliculas_BD[id - 1];
    peliAleatoria = peliculas_API[id - 1];
    dataPelicula(dataPeli, peliAleatoria);
  }
};

const getPeliculas = () => {
  $.each(peliculas_BD, function (i, pelicula) {
    $("#peliculas__slider").append(
      `<div class="peliculas__slider-item px-2 text-center" onclick="getPelicula(${pelicula.id})"><div class="peliculas__slider-item-header" style="background:url(${pelicula.imagen});"></div><small>${pelicula.tituloLat}</small></div>`
    );
    $("#peliculas__select").append(
      `<option value='${pelicula.id}'>${pelicula.tituloLat}</option>`
    );
  });

  $("#peliculas__slider").slick({
    slidesToShow: 7,
    infinite: true,
    centerMode: true,
    centerPadding: "60px",
    speed: 300,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
          centerMode: true,
          slidesToShow: 2,
        },
      },
    ],
  });
};

const verTrailer = (peliUrl) => {
  $("#pelicula__trailer-video").attr("src", peliUrl);
  $("#pelicula__modal-background").addClass("active");
  $("#pelicula__modal").addClass("active");
};

const cerrarTrailer = () => {
  $("#pelicula__trailer-video").attr("src", "");
  $("#pelicula__modal-background").removeClass("active");
  $("#pelicula__modal").removeClass("active");
};

$(document).ready(function () {
  if (peliculas_API === null) {
    $.when($.get(API_URL + "listasPeliculas"), $.get(DB_URL)).then(function (
      r1,
      r2
    ) {
      peliculas_API = r1[0].peliculas;
      peliculas_BD = r2[0].peliculas;
      sessionStorage.setItem("peli_api", JSON.stringify(peliculas_API));
      sessionStorage.setItem("peli_db", JSON.stringify(peliculas_BD));
      reValor();
    });
  } else {
    getPelicula();
    getPeliculas();
  }

  $("#peliculas__select").on("change", function () {
    getPelicula(this.value);
  });
});
