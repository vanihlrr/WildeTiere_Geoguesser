import { writable } from "svelte/store";


export const animalsStore = writable([
    {
        name: "Hyäne",
        bild: "animals/hyena.png",
        habitats: [
            { latitude: -2.5, longitude: 35.0 },
            { latitude: 28.7, longitude: 58.7 },
        ],
    },
    {
        name: "Giraffe",
        bild: "animals/giraffe.png",
        habitats: [
            { latitude: 12.06, longitude: 12.4000 },
            { latitude: -27.2523, longitude: 21.5184 }
        ],
    },
    {
        name: "Schimpanse",
        bild: "animals/chimpanzee.png",
        habitats: [{ latitude: -1.5, longitude: 29.5 }],
    },
    {
        name: "Känguru",
        bild: "animals/kangaroo.png",
        habitats: [{ latitude: -35.0, longitude: 143.0 }],
    },
    {
        name: "Löwe",
        bild: "animals/lion.png",
        habitats: [
            { latitude: 8.4157, longitude: 28.0230 },
            { latitude: -24.6856, longitude: 28.1674 }
        ]
    },

    {
        name: "Vogelstrauß",
        bild: "animals/ostrich.png",
        habitats: [
            { latitude: 11.2028, longitude: -4.7170 },
            { latitude: -25.3430, longitude: 22.5597 }
        ],
    },
    {
        name: "Zebra",
        bild: "animals/zebra.png",
        habitats: [
            { latitude: 10.50, longitude: 24.06 },
            { latitude: -30.0, longitude: 20.05 }
        ],
    },
    {
        name: "Elch",
        bild: "animals/moose.png",
        habitats: [
            { latitude: 50.5, longitude: -100.5 },
            { latitude: 60.5, longitude: 10.5 },
        ],
    },
    {
        name: "Elefant",
        bild: "animals/elefant.png",
        habitats: [
            { latitude: -1.5, longitude: 37.0 },
            { latitude: 23.7, longitude: 90.4 },

        ],
    },
    {
        name: "Jaguar",
        bild: "animals/jaguar.png",
        habitats: [
            { latitude: -16.0, longitude: -70.0 },
            { latitude: 17.0, longitude: -135.0 },
        ],
    },
    {
        name: "Koala",
        bild: "animals/koala.png",
        habitats: [
            { latitude: -38.2, longitude: 145.3 },
        ]
    },
    {
        name: "Schnabeltier",
        bild: "animals/platypus.png",
        habitats: [
            { latitude: -33.8679, longitude: 151.2073 },
        ]
    },
    {
        name: "Weißkopfseeadler",
        bild: "animals/bald_eagle.png",
        habitats: [
            { latitude: 58.3019, longitude: -134.4197 },
        ]
    },
    {
        name: "Capybara",
        bild: "animals/capybara.png",
        habitats: [
            { latitude: -25.2637, longitude: -63.5759 },
        ]
    },
    {
        name: "Büffel",
        bild: "animals/buffalo.png",
        habitats: [
            { latitude: -24.6282, longitude: 26.7184 },
        ]
    },
    {
        name: "Panda",
        bild: "animals/panda.png",
        habitats: [
            { latitude: 30.6586, longitude: 104.0648 },
        ]
    },
    {
        name: "Schneeleopard",
        bild: "animals/snow_leopard.png",
        habitats: [
            { latitude: 43.0000, longitude: 87.0000 }
        ]
    },
    {
        name: "Kamel",
        bild: "animals/camel.png",
        habitats: [
            { latitude: 19.4326, longitude: 30.2165 },
            { latitude: 42.8794, longitude: 89.1658 }
        ]
    },
    {
        name: "Erdmännchen",
        bild: "animals/meerkat.png",
        habitats: [
            { latitude: -28.4793, longitude: 21.7195 }
        ]
    },
    {
        name: "Puma",
        bild: "animals/puma.png",
        habitats: [
            { latitude: 37.8651, longitude: -119.5383 },
            { latitude: -33.4378, longitude: -70.6505 }
        ]
    },
    {
        name: "Flamingo",
        bild: "animals/flamingo.png",
        habitats: [
            { latitude: -44.9788, longitude: -90.1997 },
            { latitude: -28.3472, longitude: 28.3830 },
            { latitude: 36.1347, longitude: -18.1045 }
        ]
    },
    {
        name: "Braunbär",
        bild: "animals/brown_bear.png",
        habitats: [
            { latitude: 58.3019, longitude: -134.4197 },
            { latitude: 55.7558, longitude: 94.4153 }
        ]
    },
    {
        name: "Nilpferd",
        bild: "animals/hippo.png",
        habitats: [
            { latitude: -13.9524, longitude: 32.5877 },
            { latitude: 3.6953, longitude: -14.0304 }
        ]
    },
    {
        name: "Okapi",
        bild: "animals/okapi.png",
        habitats: [
            { latitude: -8.4356, longitude: 14.5671 }
        ]
    },
    {
        name: "Bison",
        bild: "animals/bison.png",
        habitats: [
            { latitude: 44.4270, longitude: -110.5885 },
            { latitude: 52.6998, longitude: 23.9133 }
        ]
    },
    {
        name: "Wolf",
        bild: "animals/wolf.png",
        habitats: [
            { latitude: 61.1790, longitude: -149.2825 },
            { latitude: 55.3646, longitude: 82.8803 },
            { latitude: 45.4972, longitude: 10.9910 }
        ]
    },
    {
        name: "Quokka",
        bild: "animals/quokka.png",
        habitats: [
            { latitude: -43.0060, longitude: 130.5049 }
        ]
    },
    {
        name: "Tapir",
        bild: "animals/tapir.png",
        habitats: [
            { latitude: -15.905, longitude: -85.1342 }
        ]
    },
    {
        name: "Przewalski-Pferd",
        bild: "animals/przewalski_horse.png",
        habitats: [
            { latitude: 47.4316, longitude: 106.9533 },
            { latitude: 49.4203, longitude: 30.1540 },
        ]
    },
    {
        name: "Roter Panda",
        bild: "animals/red_panda.png",
        habitats: [
            { latitude: 27.8022, longitude: 86.6963 },
        ]
    },
    {
        name: "Bergziege",
        bild: "animals/mountain_goat.png",
        habitats: [
            { latitude: 59.6500, longitude: -136.9000 }
        ]
    },
    {
        name: "Nashorn",
        bild: "animals/rhino.png",
        habitats: [
            { latitude: -20.9981, longitude: 21.5925 }
        ]
    },
    {
        name: "Fuchs",
        bild: "animals/fox.png",
        habitats: [
            { latitude: 48.5200, longitude: 0.4050 },
            { latitude: 64.2008, longitude: -149.4937 },
            { latitude: 40.6895, longitude: 120.6917 }
        ]
    },
    {
        name: "Komodowaran",
        bild: "animals/komodo_dragon.png",
        habitats: [
            { latitude: -8.2433, longitude: 120.3270 }
        ]
    },
    {
        name: "Krokodil",
        bild: "animals/crocodile.png",
        habitats: [
            { latitude: -25.4842, longitude: 145.4629 },
            { latitude: 15.1234, longitude: 89.1526 },
            { latitude: -4.4419, longitude: -5.2663 },
            { latitude: 10.2866, longitude: -125.8987 }
        ]
    },
    {
        name: "Gnu",
        bild: "animals/wildbeest.png",
        habitats: [
            { latitude: -25.0023, longitude: 23.4162 }
        ]
    },
]);

// Aktuelles Tier
export const currentAnimal = writable(null);
export const foundHabitats = writable([]);

export function setCurrentAnimal(animal) {
    currentAnimal.set(animal);
}
