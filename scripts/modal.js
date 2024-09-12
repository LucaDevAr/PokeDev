import { allPokemonData } from "./pokedex.js";
import { getTypeSvgCode } from "./cards.js";
export async function modal(pokemonData, types, variants) {
  const $modal = document.querySelector(".modal");
  await getAbilitiesDetails(pokemonData.abilities);
  const description = await obtenerDescripcionPokemon(pokemonData.name, 1);
  $modal.innerHTML = `
        <!-- Container -->
        <div class="container">
          <!-- Top Modal -->
          <div class="top">
            <i class="ri-arrow-left-s-line ${
              pokemonData.types[0].type.name
            }-c" id="back"></i>
            <div class="variants ${pokemonData.types[0].type.name}-bg">
              <i class="ri-sparkling-2-line ${
                pokemonData.types[0].type.name
              }" data-variant="shiny"></i>${variants}
            </div>
            <i class="ri-heart-line ${pokemonData.types[0].type.name}-c"></i>
          </div>
          <!-- Middle Modal -->
          <div class="middle">
            <!-- Pokemon -->
            <div class="pokemon">
              <img src="${pokemonData.sprites.other.home.front_default}" alt="${
    pokemonData.name
  }" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="560"
                height="380"
                viewBox="0 0 560 380"
                fill="none"
                id="sound"
              >
                <path
                  class="${pokemonData.types[0].type.name}-svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M159.922 0C71.5993 0 0 71.5993 0 159.922C0 234.46 50.9949 297.088 120 314.82V367.705C120 384.628 135.258 379.379 139.12 377.779C139.71 377.535 140.234 377.166 140.692 376.722L199.405 319.843H400.078C488.401 319.843 560 248.244 560 159.922C560 71.5993 488.401 0 400.078 0H159.922Z"
                  fill="#181721"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M330 82C318.954 82 310 90.9543 310 102V222C310 233.046 318.954 242 330 242C341.046 242 350 233.046 350 222V102C350 90.9543 341.046 82 330 82ZM210 162L90 231.282V92.718L210 162ZM250 142C250 130.954 258.954 122 270 122C281.046 122 290 130.954 290 142V182C290 193.046 281.046 202 270 202C258.954 202 250 193.046 250 182V142ZM370 142C370 130.954 378.954 122 390 122C401.046 122 410 130.954 410 142V182C410 193.046 401.046 202 390 202C378.954 202 370 193.046 370 182V142ZM450 82C438.954 82 430 90.9543 430 102V222C430 233.046 438.954 242 450 242C461.046 242 470 233.046 470 222V102C470 90.9543 461.046 82 450 82Z"
                  fill="#fff"
                />
              </svg>
            </div>
            <div class="header">
              <h3>${pokemonData.name}</h3>
              <div class="types">${types}</div>
              <span>#${String(pokemonData.id).padStart(4, "0")}</span>
            </div>
          </div>
        </div>
        <!-- Info --><div class="info ${pokemonData.types[0].type.name}-bg">
  <div class="tab__box ${pokemonData.types[0].type.name}-bg">
    <h3 class="tab__btn active">Details</h3>
    <h3 class="tab__btn">Stats</h3>
    <h3 class="tab__btn">Moves</h3>
    <div class="line"></div>
  </div>
  <div class="content__box">
    <div class="content active" id="details">
    </div>
    <div class="content" id="stats">
    </div>
    <div class="content" id="moves">
    </div>
  </div>
</div>

        <!-- Slider Indicator -->
          <div class="indicator-label ${
            pokemonData.types[0].type.name
          }-bg"></div>
        <!-- More -->
        <div class="more">
          <i class="ri-add-line ${pokemonData.types[0].type.name}-c"></i>
        </div>`;

  $modal.classList.add("show");

  var abilityDetails;
  var gender;

  async function obtenerDescripcionPokemon(nombrePokemon, info) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${nombrePokemon.toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener la información del Pokémon");
      }
      const data = await response.json();
      gender = data.gender_rate;
      const types = await fetch(`https://pokeapi.co/api/v2/type/1/`);
      const descripcion = data.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      ).flavor_text;
      if (info == 1) return descripcion;
    } catch (error) {
      console.error("Error al obtener la descripción del Pokémon:", error);
      return "Descripción no disponible";
    }
  }
  async function mostrarCadenaEvolutiva(nombrePokemonInicial) {
    try {
      // Obtener datos del Pokémon inicial
      const responsePokemonInicial = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombrePokemonInicial}`
      );
      const dataPokemonInicial = await responsePokemonInicial.json();

      // Obtener datos de la especie del Pokémon inicial
      const responseSpecies = await fetch(dataPokemonInicial.species.url);
      const dataSpecies = await responseSpecies.json();

      // Obtener la URL de la cadena evolutiva
      const evolutionChainUrl = dataSpecies.evolution_chain.url;

      // Realizar una solicitud para obtener los detalles de la cadena evolutiva
      const responseEvolutionDetails = await fetch(evolutionChainUrl);
      const dataEvolutionDetails = await responseEvolutionDetails.json();

      // Obtener información de cada etapa evolutiva
      const cadenaEvolutiva = [];
      let currentPokemon = dataEvolutionDetails.chain;
      while (currentPokemon) {
        const pokemonInfo = {
          nombre: currentPokemon.species.name,
          tipos: [], // Aquí almacenaremos los tipos del Pokémon
          nivelEvolucion: null, // Nivel de evolución del Pokémon
          imagen: null, // URL de la imagen del Pokémon
        };

        // Obtener información adicional del Pokémon
        const responsePokemonInfo = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonInfo.nombre}`
        );
        const dataPokemonInfo = await responsePokemonInfo.json();

        // Obtener tipos del Pokémon
        dataPokemonInfo.types.forEach((type) => {
          pokemonInfo.tipos.push(type.type.name);
        });

        // Obtener nivel de evolución del Pokémon
        currentPokemon.evolution_details.forEach((detail) => {
          if (detail.min_level) {
            pokemonInfo.nivelEvolucion = detail.min_level;
          }
        });

        // Obtener URL de la imagen del Pokémon
        pokemonInfo.imagen = dataPokemonInfo.sprites.front_default;

        // Agregar información del Pokémon a la cadena evolutiva
        cadenaEvolutiva.push(pokemonInfo);

        // Pasar al siguiente Pokémon en la cadena evolutiva
        currentPokemon = currentPokemon.evolves_to[0];
      }

      // Mostrar la cadena evolutiva en el gráfico
      mostrarGrafico(cadenaEvolutiva);
    } catch (error) {
      console.error("Error al obtener la cadena evolutiva:", error);
    }
  }

  // Función para mostrar la cadena evolutiva en el gráfico
  function mostrarGrafico(cadenaEvolutiva) {
    const container = $modal.querySelector("#pokemonChart");
    container.innerHTML = ``;

    // Crear elementos HTML para cada Pokémon en la cadena evolutiva
    let cont = 0;
    cadenaEvolutiva.forEach((pokemon) => {
      if (cont != 0) {
        const containerFlecha = document.createElement("div");
        containerFlecha.classList.add("flecha");
        const flecha = document.createElement("i");
        flecha.classList.add("ri-arrow-right-line");
        containerFlecha.appendChild(flecha);
        container.appendChild(containerFlecha);
      }
      const pokemonElement = document.createElement("div");
      pokemonElement.classList.add("pokemon");
      // Insertar imagen del Pokémon
      const imagen = document.createElement("img");
      imagen.src = pokemon.imagen;
      pokemonElement.appendChild(imagen);

      // Insertar nombre del Pokémon
      const nombre = document.createElement("p");
      nombre.textContent = pokemon.nombre;
      pokemonElement.appendChild(nombre);

      // Insertar tipos del Pokémon
      const tipos = document.createElement("div");
      tipos.classList.add("types");
      tipos.classList.add(`${pokemonData.types[0].type.name}`);
      const type = getTypeSvgCode(pokemon);
      tipos.innerHTML = `${type}`;
      pokemonElement.appendChild(tipos);

      // Insertar nivel de evolución del Pokémon
      const nivelEvolucion = document.createElement("p");
      nivelEvolucion.textContent = pokemon.nivelEvolucion
        ? pokemon.nivelEvolucion + "Lvl"
        : "";
      pokemonElement.appendChild(nivelEvolucion);

      // Agregar el Pokémon al contenedor
      container.appendChild(pokemonElement);
      cont++;
    });
  }

  function genderRatio(genderr) {
    let masculineRatio = 0,
      feminineRatio = 0;

    if (genderr % 2 === 0) {
      masculineRatio = 100 - genderr * 12.5;
      feminineRatio = genderr * 12.5;
    } else {
      masculineRatio = genderr * 100 - 12.5;
      feminineRatio = 12.5;
    }

    return { masculine: masculineRatio, feminine: feminineRatio };
  }
  const ratios = genderRatio(gender);

  async function getAbilitiesDetails(abilities) {
    const abilityDetailsPromises = abilities.map(async (ability) => {
      try {
        const response = await fetch(ability.ability.url);
        const data = await response.json();
        const effect =
          data.effect_entries && data.effect_entries.length > 0
            ? data.effect_entries[0].effect
            : "N/A";
        return `${ability.ability.name} - ${effect}`;
      } catch (error) {
        console.error("Error fetching ability details:", error);
        return "N/A";
      }
    });

    abilityDetails = await Promise.all(abilityDetailsPromises);
    return abilityDetails.join(", ");
  }

  const updateInfo = (pokemonData) => {
    const details = $modal.querySelector(".info .content");
    details.innerHTML = ``;
    details.innerHTML += `
    <h4>Description</h4>
    <div class="description">
      <p>${description}</p>
    </div>
    <h4>Caracteristic</h4>
    <div class="caracteristics">
      <div class="h-w">
        <p><span>Height</span> <br> ${pokemonData.height / 10} mt</p>
        <p><span>Weight</span> <br> ${pokemonData.weight / 10} kg</p>
      </div>
      <h6>Gender Rate</h6>
      <div class="gender-container">
        <div class="gender_ratio">
          <span>
            Women
            ${ratios.feminine}%
          </span>
          <div class="bar">
            <div class="feminine" style="width: ${ratios.feminine}%"></div>
          </div>
          <span>
            Men
            ${ratios.masculine}%
          </span>
        </div>
      </div>
    </div>
    <h4>Abilities</h4>
    <div class="abilities">
      <p>${abilityDetails[0]}</p>
      <p>${abilityDetails[1]}</p>
    </div>
    <h4>Evolution Line</h4>
    <div id="pokemonChart"></div>`;
    mostrarCadenaEvolutiva(pokemonData.name);
    async function obtenerMovimientos() {
      const moves = pokemonData.moves.map(async (move) => {
        const moveResponse = await fetch(move.move.url);
        const moveData = await moveResponse.json();
        return {
          name: move.move.name,
          type: moveData.type.name,
          category: moveData.damage_class.name,
          power: moveData.power,
          accuracy: moveData.accuracy,
          pp: moveData.pp,
        };
      });
      return Promise.all(moves);
    }
    obtenerMovimientos()
      .then((moves) => {
        // Insertar los movimientos en el elemento HTML 'moves'
        const movesElement = document.getElementById("moves");
        movesElement.innerHTML = `
        <h4>Moves List</h4>`;
        const table = document.createElement("table");
        // Crear encabezados de tabla
        const headers = ["Name", "Type", "Pow", "Acc", "PP"];
        const headerRow = document.createElement("tr");
        headers.forEach((headerText) => {
          const headerCell = document.createElement("th");
          headerCell.textContent = headerText;
          headerRow.appendChild(headerCell);
        });
        table.appendChild(headerRow);
        // Agregar filas de movimiento
        moves.forEach((move) => {
          const row = document.createElement("tr");
          ["name", "type", "power", "accuracy", "pp"].forEach((prop) => {
            const cell = document.createElement("td");
            cell.textContent = move[prop] || "-";
            row.appendChild(cell);
          });
          table.appendChild(row);
        });
        movesElement.appendChild(table);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    async function obtenerRelacionesDeDano(tiposPokemon) {
      const resultados = [];

      // Obtener todos los tipos de Pokémon disponibles
      const responseTipos = await fetch("https://pokeapi.co/api/v2/type/");
      const tiposData = await responseTipos.json();

      // Filtrar tipos válidos y excluir "shadow" y "unknown"
      const tiposValidos = tiposData.results.filter((tipo) => {
        const numeroTipo = parseInt(tipo.url.split("/").slice(-2, -1)[0]);
        return numeroTipo <= 18;
      });

      // Iterar sobre cada tipo de Pokémon proporcionado
      for (const tipoPokemon of tiposPokemon) {
        try {
          // Realizar una solicitud a la URL del tipo de Pokémon
          const response = await fetch(tipoPokemon.url);
          const tipoData = await response.json();

          // Procesar la información para obtener las relaciones de daño
          const relacionesDano = {
            veryWeakAgainst: [],
            weakAgainst: [],
            resistantAgainst: [],
            veryResistantAgainst: [],
            immuneTo: [],
            normalDamageFrom: [],
          };

          // Iterar sobre cada tipo y asignarlo a la categoría correspondiente
          tiposValidos.forEach((tipo) => {
            const nombreTipo = tipo.name;
            if (
              tipoData.damage_relations.double_damage_from.find(
                (t) => t.name === nombreTipo
              )
            ) {
              relacionesDano.weakAgainst.push(nombreTipo);
            } else if (
              tipoData.damage_relations.double_damage_from.find(
                (t) =>
                  t.name === nombreTipo && t.damage_relations[0].name === "quad"
              )
            ) {
              relacionesDano.veryWeakAgainst.push(nombreTipo);
            } else if (
              tipoData.damage_relations.half_damage_from.find(
                (t) => t.name === nombreTipo
              )
            ) {
              relacionesDano.resistantAgainst.push(nombreTipo);
            } else if (
              tipoData.damage_relations.no_damage_from.find(
                (t) => t.name === nombreTipo
              )
            ) {
              relacionesDano.immuneTo.push(nombreTipo);
            } else if (
              tipoData.damage_relations.double_damage_to.find(
                (t) => t.name === nombreTipo
              )
            ) {
              relacionesDano.veryResistantAgainst.push(nombreTipo);
            } else {
              relacionesDano.normalDamageFrom.push(nombreTipo);
            }
          });

          // Agregar la información procesada a los resultados
          resultados.push({
            tipo: tipoPokemon.name,
            relacionesDano: relacionesDano,
          });
        } catch (error) {
          console.error(
            `Error al obtener información del tipo ${tipoPokemon.name}:`,
            error
          );
        }
      }

      return resultados;
    }

    // Ejemplo de uso
    const tiposPokemon = pokemonData.types.map((tipo) => {
      return {
        name: tipo.type.name,
        url: tipo.type.url,
      };
    });

    obtenerRelacionesDeDano(tiposPokemon)
      .then((resultados) => {
        const statsContainer = document.getElementById("stats");
        statsContainer.innerHTML = "";
        statsContainer.innerHTML = `<h4>Base Stats</h4>
      <div class="stats">
        <li>
          <h5>HP</h5>
          <span class="bar">
            <span class="hp" style="width: ${pokemonData.stats[0].base_stat}px;"></span>
          </span>
          <p>${pokemonData.stats[0].base_stat}</p>
        </li>
        <li>
          <h5>Attack</h5>
          <span class="bar">
            <span class="attack" style="width: ${pokemonData.stats[1].base_stat}px;"></span>
          </span>
          <p>${pokemonData.stats[1].base_stat}</p>
        </li>
        <li>
          <h5>Defense</h5>
          <span class="bar">
            <span class="defense" style="width: ${pokemonData.stats[2].base_stat}px;"></span>
          </span>
          <p>${pokemonData.stats[2].base_stat}</p>
        </li>
        <li>
          <h5>Sp. Attack</h5>
          <span class="bar">
            <span class="sp-attack" style="width: ${pokemonData.stats[3].base_stat}px;"></span>
          </span>
          <p>${pokemonData.stats[3].base_stat}</p>
        </li>
        <li>
          <h5>Sp. Defense</h5>
          <span class="bar">
            <span class="sp-defense" style="width: ${pokemonData.stats[4].base_stat}px;"></span>
          </span>
          <p>${pokemonData.stats[4].base_stat}</p>
        </li>
        <li>
          <h5>Speed</h5>
          <span class="bar">
            <span class="speed" style="width: ${pokemonData.stats[5].base_stat}px;"></span>
          </span>
          <p>${pokemonData.stats[5].base_stat}</p>
        </li>
      </div>
      `;
        resultados.forEach((resultado) => {
          statsContainer.innerHTML += `
        <h4>${resultado.tipo}</h4>`;
          const tipoElement = document.createElement("div");
          tipoElement.classList.add("types-fd");
          tipoElement.innerHTML = `
          <div class="type-fd"><strong>Very Weak Against</strong>
            <div class="typeFd">
            ${
              getTypeSvgCode(resultado.relacionesDano.veryWeakAgainst) || "NONE"
            }
            </div>
          </div>
          <div class="type-fd"><strong>Weak Against</strong>
            <div class="typeFd">
              ${getTypeSvgCode(resultado.relacionesDano.weakAgainst) || "NONE"}
            </div>
          </div>
          <div class="type-fd"><strong>Resistant Against</strong>
            <div class="typeFd">
              ${
                getTypeSvgCode(resultado.relacionesDano.resistantAgainst) ||
                "NONE"
              }
            </div>
          </div >
          <div class="type-fd"><strong>Very Resistant Against</strong>
            <div class="typeFd">
              ${
                getTypeSvgCode(resultado.relacionesDano.veryResistantAgainst) ||
                "NONE"
              }
            </div>
          </div>
          <div class="type-fd"><strong>Immune To</strong>
            <div class="typeFd">
              ${getTypeSvgCode(resultado.relacionesDano.immuneTo) || "NONE"}
            </div>
          </div>
          <div class="type-fd"><strong>Normal Damage From</strong>
            <div class="typeFd">
              ${
                getTypeSvgCode(resultado.relacionesDano.normalDamageFrom) ||
                "NONE"
              }
            </div>
          </div>`;
          statsContainer.appendChild(tipoElement);
          const $tfd = $modal.querySelectorAll(".type-fd"),
            $fTD = $modal.querySelectorAll(".typeFd");
          $fTD.forEach((f) => {
            if (f.textContent.includes("NONE")) {
              f.setAttribute("exist", "none");
              $tfd.forEach((t) => {
                const f = t.querySelector(".typeFd");
                if (f.hasAttribute("exist")) {
                  t.style.display = "none";
                }
              });
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error al obtener relaciones de daño:", error);
      });
  };
  updateInfo(pokemonData);

  const $plus = $modal.querySelector(".more"),
    $close = $modal.querySelector("#back"),
    $variants = $modal.querySelectorAll(".variants *"),
    $sound = $modal.querySelector("#sound"),
    $tabs = $modal.querySelectorAll(".tab__btn"),
    $allContent = $modal.querySelectorAll(".content"),
    $info = document.querySelector(".info");

  $tabs.forEach((tab, i) => {
    tab.addEventListener("click", (e) => {
      $tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");
      var $line = $modal.querySelector(".line");
      $line.style.width = e.target.offsetWidth + "px";
      $line.style.left = e.target.offsetLeft + "px";
      $allContent.forEach((c) => {
        c.classList.remove("active");
      });
      $allContent[i].classList.add("active");
      $info.scrollTop = 0;
    });
  });

  $plus.addEventListener("click", () => {
    updateInfo(pokemonData);
    const $modal = document.querySelector(".modal");
    $modal.classList.toggle("info");
    setTimeout(() => {
      const $line = document.querySelector(".line");
      const $tab = document.querySelector("h3.active");
      $line.style.opacity = "1";
      $line.style.left = $tab.offsetLeft + "px";
    }, 1600);
    setTimeout(() => {
      $info.scrollTop = 0;
    }, 1500);
  });

  $close.addEventListener("click", () => {
    $modal.classList.remove("show");
    $modal.classList.remove("info");
  });

  $variants.forEach((variant) => {
    variant.addEventListener("click", (e) => {
      const variantee = e.target.hasAttribute("data-variant")
        ? e.target
        : e.target.closest("svg");
      const $pokemon = $modal.querySelector("img");
      const actives = [];
      $variants.forEach((v) => {
        if (v.classList.contains("active"))
          actives.push(v.getAttribute("data-variant"));
      });
      if (actives.length == 0) {
        const clickName = variantee.getAttribute("data-variant");
        variantee.classList.add("active");
        if (clickName == "shiny") {
          $pokemon.src = pokemonData.sprites.other.home.front_shiny;
        } else {
          const variantName = pokemonData.name + "-" + clickName;
          const variantData = allPokemonData.find((pokemon) => {
            if (pokemon.name === variantName) return pokemon.name;
          });
          $pokemon.src = variantData.sprites.other.home.front_default;
          $pokemon.alt = variantData.name;
        }
      } else if (actives.length == 1) {
        const clickName = variantee.getAttribute("data-variant");
        variantee.classList.add("active");
        if (clickName == "shiny" && actives[0] == "shiny") {
          $variants.forEach((v) => {
            v.classList.remove("active");
          });
          $pokemon.src = pokemonData.sprites.other.home.front_default;
          $pokemon.alt = pokemonData.name;
        } else if (clickName == "shiny" && actives[0] !== "shiny") {
          const variantName = pokemonData.name + "-" + actives[0];
          const variantData = allPokemonData.find((pokemon) => {
            if (pokemon.name === variantName) return pokemon.name;
          });
          $pokemon.src = variantData.sprites.other.home.front_shiny;
          $pokemon.alt = variantData.name;
        } else if (clickName !== "shiny" && actives[0] !== clickName) {
          $variants.forEach((v) => {
            v.classList.remove("active");
          });
          const variantName = pokemonData.name + "-" + clickName;
          const variantData = allPokemonData.find((pokemon) => {
            if (pokemon.name === variantName) return pokemon.name;
          });
          $pokemon.src = variantData.sprites.other.home.front_default;
          variantee.classList.add("active");
          $pokemon.alt = variantData.name;
        } else {
          $variants.forEach((v) => {
            v.classList.remove("active");
          });
          $pokemon.src = pokemonData.sprites.other.home.front_default;
          $pokemon.alt = pokemonData.name;
        }
      } else if (actives.length == 2) {
        const clickName = variantee.getAttribute("data-variant");
        if (
          clickName !== "shiny" &&
          actives[0] !== clickName &&
          actives[1] !== clickName
        ) {
          $variants.forEach((v) => {
            v.classList.remove("active");
          });
          const variantName = pokemonData.name + "-" + clickName;
          const variantData = allPokemonData.find((pokemon) => {
            if (pokemon.name === variantName) return pokemon.name;
          });
          $pokemon.src = variantData.sprites.other.home.front_default;
          variantee.classList.add("active");
          $pokemon.alt = variantData.name;
        } else if (
          (clickName !== "shiny" && actives[0] == clickName) ||
          actives[1] == clickName
        ) {
          $variants.forEach((v) => {
            v.classList.remove("active");
          });
          $pokemon.src = pokemonData.sprites.other.home.front_default;
          $pokemon.alt = pokemonData.name;
        } else if (clickName == "shiny") {
          variantee.classList.remove("active");
          const variantName = pokemonData.name + "-" + actives[1];
          const variantData = allPokemonData.find((pokemon) => {
            if (pokemon.name === variantName) return pokemon.name;
          });
          $pokemon.src = variantData.sprites.other.home.front_default;
          $pokemon.alt = variantData.name;
        }
      }
    });
  });

  let isPlaying = false;

  $sound.addEventListener("click", () => {
    if (isPlaying) return;

    const variantName = $modal.querySelector("img");
    const alt = variantName.alt;
    const variantData = allPokemonData.find((pokemon) => {
      if (pokemon.name === alt) return pokemon.name;
    });

    const audio = new Audio(variantData.cries.latest);
    $sound.style.filter = "brightness(50%)";
    setTimeout(() => {
      audio.play();
      isPlaying = true;
      audio.addEventListener("ended", () => {
        $sound.style.filter = "none";
        isPlaying = false;
      });
    }, 300);
  });
}
