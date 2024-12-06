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
      solution += cell.textContent;
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
    cell.textContent = game.puzzle.split("")[i * 9 + j].replace("-", "");
    if (cell.textContent !== "") {
      cell.classList.add("uneditable");
    }
    cell.addEventListener("click", () => {
      const value = prompt("Enter a number:");
      if (value && !isNaN(Number(value))) {
        cell.textContent = value.slice(0, 1);
        winCheck();
      }
    });
  }
}
