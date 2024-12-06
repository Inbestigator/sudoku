import CaptureClient, { fingerprint } from "@capture/analytics";
import { getSudoku } from "sudoku-gen";

const analytics = new CaptureClient({
  projectId: "SMTi_VwQN",
  key: "cak_uMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEob7IrrIyBNy62N62a7c+cVj1V+Ws",
});

let printData: {
  fingerprint: string;
};

const startedAt = Date.now();
const game = getSudoku("easy");

const table = document.querySelector("table");
if (!table) throw new Error("Table not found");
const tbody = table.querySelector("tbody");
if (!tbody) throw new Error("Table body not found");
const rows = tbody.children;

getPreviousPlays();

async function getPreviousPlays() {
  printData = await fingerprint();
  if (!printData.fingerprint) return;
  const res = await fetch(
    "/api/plays?fingerprint=" + encodeURIComponent(printData.fingerprint),
  );

  if (!res.ok) {
    return;
  }

  const data = await res.json();

  const winCount = document.createElement("p");
  winCount.textContent = `You have won ${data.length} time${
    data.length !== 1 ? "s" : ""
  }`;
  document.querySelector("body")?.appendChild(winCount);
}

function winCheck() {
  let solution = "";
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.children;
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell.firstElementChild instanceof HTMLInputElement) {
        solution += cell.firstElementChild.value;
      }
    }
  }
  if (solution !== game.solution) return;
  analytics.capture("win", {
    level: "easy",
    startedAt,
    print: printData.fingerprint,
    endedAt: Date.now(),
  });
  alert("You win!");
}

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const cells = row.children;
  for (let j = 0; j < cells.length; j++) {
    const cell = cells[j];
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "9";
    input.maxLength = 1;
    input.value = game.puzzle.split("")[i * 9 + j];
    input.pattern = "[0-9]*"
    if (input.value !== "") {
      input.disabled = true;
    }
    cell.appendChild(input);
    input.addEventListener("input", (e) => {
      const value = Number((e.target as HTMLInputElement).value);
      if (value && !isNaN(value) && value !== 0 && value < 10) {
        winCheck();
      } else if (value && !isNaN(value) && value > 9) {
        (e.target as HTMLInputElement).value = value % 10;
      } else {
        (e.target as HTMLInputElement).value = "";
      }
    });
  }
}
