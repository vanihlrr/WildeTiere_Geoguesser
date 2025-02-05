import { writable } from "svelte/store";

const savedScore = Number(localStorage.getItem("score")) || 0;
const savedFoundAnimals = Number(localStorage.getItem("foundAnimals")) || 0;

export const score = writable(savedScore);
export const foundAnimals = writable(savedFoundAnimals);

score.subscribe((value) => {
    localStorage.setItem("score", value.toString());
});

foundAnimals.subscribe((value) => {
    localStorage.setItem("foundAnimals", value.toString());
});

export function updateScore(points) {
    score.update((currentScore) => Math.max(0, currentScore + Math.max(0, points)));
}

export function increaseFoundAnimals() {
    foundAnimals.update((currentCount) => currentCount + 1);
}

export function resetScore() {
    score.set(0);
    foundAnimals.set(0);
}
