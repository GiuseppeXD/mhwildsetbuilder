const ARMOR_PIECES = [
  { slot: "Head", name: "Hope Crown S", skills: { "Divine Blessing": 1, "Evade Window": 1 } },
  { slot: "Head", name: "Chatacabra Helm", skills: { "Attack Boost": 2, Guard: 1 } },
  { slot: "Head", name: "Doshaguma Helm", skills: { Agitator: 2, "Attack Boost": 1 } },
  { slot: "Head", name: "Balahara Helm", skills: { Constitution: 2, "Evade Window": 1 } },
  { slot: "Head", name: "Rey Dau Helm", skills: { "Critical Eye": 2, "Weakness Exploit": 1 } },
  { slot: "Head", name: "Ajarakan Helm", skills: { Focus: 2, Handicraft: 1 } },

  { slot: "Chest", name: "Hope Mail S", skills: { "Critical Eye": 1, "Divine Blessing": 1 } },
  { slot: "Chest", name: "Chatacabra Mail", skills: { Guard: 2, "Attack Boost": 1 } },
  { slot: "Chest", name: "Doshaguma Mail", skills: { Agitator: 2, "Weakness Exploit": 1 } },
  { slot: "Chest", name: "Balahara Mail", skills: { Constitution: 1, "Evade Window": 2 } },
  { slot: "Chest", name: "Rey Dau Mail", skills: { "Critical Eye": 2, "Attack Boost": 1 } },
  { slot: "Chest", name: "Ajarakan Mail", skills: { Focus: 2, Handicraft: 1 } },

  { slot: "Arms", name: "Hope Vambraces S", skills: { "Divine Blessing": 1, Constitution: 1 } },
  { slot: "Arms", name: "Chatacabra Vambraces", skills: { Guard: 2, Focus: 1 } },
  { slot: "Arms", name: "Doshaguma Vambraces", skills: { "Attack Boost": 2, Agitator: 1 } },
  { slot: "Arms", name: "Balahara Vambraces", skills: { "Evade Window": 2, Constitution: 1 } },
  { slot: "Arms", name: "Rey Dau Vambraces", skills: { "Weakness Exploit": 2, "Critical Eye": 1 } },
  { slot: "Arms", name: "Ajarakan Vambraces", skills: { Handicraft: 2, Focus: 1 } },

  { slot: "Waist", name: "Hope Coil S", skills: { "Critical Eye": 1, "Evade Window": 1 } },
  { slot: "Waist", name: "Chatacabra Coil", skills: { "Attack Boost": 1, Guard: 2 } },
  { slot: "Waist", name: "Doshaguma Coil", skills: { Agitator: 2, "Attack Boost": 1 } },
  { slot: "Waist", name: "Balahara Coil", skills: { Constitution: 2, "Evade Window": 1 } },
  { slot: "Waist", name: "Rey Dau Coil", skills: { "Critical Eye": 2, "Weakness Exploit": 1 } },
  { slot: "Waist", name: "Ajarakan Coil", skills: { Focus: 2, Handicraft: 1 } },

  { slot: "Legs", name: "Hope Greaves S", skills: { "Divine Blessing": 1, "Critical Eye": 1 } },
  { slot: "Legs", name: "Chatacabra Greaves", skills: { Guard: 1, "Attack Boost": 2 } },
  { slot: "Legs", name: "Doshaguma Greaves", skills: { Agitator: 2, "Weakness Exploit": 1 } },
  { slot: "Legs", name: "Balahara Greaves", skills: { Constitution: 2, "Evade Window": 1 } },
  { slot: "Legs", name: "Rey Dau Greaves", skills: { "Critical Eye": 2, "Weakness Exploit": 1 } },
  { slot: "Legs", name: "Ajarakan Greaves", skills: { Focus: 2, Handicraft: 1 } }
];

const SLOT_ORDER = ["Head", "Chest", "Arms", "Waist", "Legs"];
const MAX_RENDERED_RESULTS = 40;
const SET_VARIANTS = {
  Hope: "Alpha",
  Chatacabra: "Beta",
  Doshaguma: "Alpha",
  Balahara: "Beta",
  "Rey Dau": "Gamma",
  Ajarakan: "Gamma"
};

const form = document.getElementById("finder-form");
const skillSelect = document.getElementById("skill-select");
const levelInput = document.getElementById("level-input");
const helperText = document.getElementById("helper-text");
const resultsEl = document.getElementById("results");

const piecesBySlot = SLOT_ORDER.map((slot) => ARMOR_PIECES.filter((piece) => piece.slot === slot));

function skillValue(piece, skill) {
  return piece.skills[skill] || 0;
}

function pieceVariant(piece) {
  if (piece.variant) {
    return piece.variant;
  }

  for (const [setName, variant] of Object.entries(SET_VARIANTS)) {
    if (piece.name.startsWith(setName)) {
      return variant;
    }
  }

  return "Alpha";
}

function allSkills() {
  const set = new Set();
  for (const piece of ARMOR_PIECES) {
    for (const skill of Object.keys(piece.skills)) {
      set.add(skill);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

function maxForSkill(skill) {
  return piecesBySlot.reduce((sum, slotPieces) => {
    const bestInSlot = slotPieces.reduce((best, piece) => Math.max(best, skillValue(piece, skill)), 0);
    return sum + bestInSlot;
  }, 0);
}

function findSets(skill, targetLevel) {
  const maxBySlot = piecesBySlot.map((slotPieces) =>
    slotPieces.reduce((best, piece) => Math.max(best, skillValue(piece, skill)), 0)
  );

  const suffixMax = new Array(SLOT_ORDER.length + 1).fill(0);
  for (let i = SLOT_ORDER.length - 1; i >= 0; i -= 1) {
    suffixMax[i] = suffixMax[i + 1] + maxBySlot[i];
  }

  const sortedBySlot = piecesBySlot.map((slotPieces) =>
    [...slotPieces].sort((a, b) => skillValue(b, skill) - skillValue(a, skill))
  );

  const currentSet = [];
  const matches = [];

  function dfs(slotIndex, currentLevel) {
    if (currentLevel + suffixMax[slotIndex] < targetLevel) {
      return;
    }

    if (slotIndex === SLOT_ORDER.length) {
      if (currentLevel >= targetLevel) {
        matches.push({ pieces: [...currentSet], total: currentLevel });
      }
      return;
    }

    for (const piece of sortedBySlot[slotIndex]) {
      currentSet.push(piece);
      dfs(slotIndex + 1, currentLevel + skillValue(piece, skill));
      currentSet.pop();
    }
  }

  dfs(0, 0);

  matches.sort((a, b) => {
    const overA = a.total - targetLevel;
    const overB = b.total - targetLevel;
    if (overA !== overB) {
      return overA - overB;
    }

    const skillPiecesA = a.pieces.reduce((count, piece) => count + (skillValue(piece, skill) > 0 ? 1 : 0), 0);
    const skillPiecesB = b.pieces.reduce((count, piece) => count + (skillValue(piece, skill) > 0 ? 1 : 0), 0);
    return skillPiecesA - skillPiecesB;
  });

  return { matches, maxPossible: suffixMax[0] };
}

function renderResults(skill, targetLevel) {
  const { matches, maxPossible } = findSets(skill, targetLevel);
  resultsEl.innerHTML = "";

  if (targetLevel > maxPossible) {
    helperText.className = "helper-text error";
    helperText.textContent = `No set can reach level ${targetLevel} for ${skill}. Max possible with this data is level ${maxPossible}.`;
    return;
  }

  helperText.className = "helper-text ok";

  if (matches.length === 0) {
    helperText.textContent = `No combinations found for ${skill} level ${targetLevel}.`;
    return;
  }

  const visible = matches.slice(0, MAX_RENDERED_RESULTS);
  helperText.textContent =
    `Found ${matches.length} matching sets for ${skill} level ${targetLevel}. ` +
    `Showing the first ${visible.length}. Max possible level: ${maxPossible}.`;

  for (let i = 0; i < visible.length; i += 1) {
    const set = visible[i];
    const card = document.createElement("article");
    card.className = "set-card";

    const header = document.createElement("div");
    header.className = "set-header";

    const title = document.createElement("span");
    title.className = "set-title";
    title.textContent = `Set ${i + 1}`;

    const totalLevel = document.createElement("span");
    totalLevel.className = "set-level";
    totalLevel.textContent = `${skill} +${set.total}`;

    header.appendChild(title);
    header.appendChild(totalLevel);

    const list = document.createElement("ul");
    list.className = "pieces";

    for (const piece of set.pieces) {
      const li = document.createElement("li");
      const gain = skillValue(piece, skill);
      const gainText = gain > 0 ? ` (+${gain})` : "";
      li.innerHTML = `<span class="slot">${piece.slot}:</span> ${piece.name} <span class="variant">[${pieceVariant(piece)}]</span>${gainText}`;
      list.appendChild(li);
    }

    card.appendChild(header);
    card.appendChild(list);
    resultsEl.appendChild(card);
  }
}

function init() {
  const skills = allSkills();

  for (const skill of skills) {
    const option = document.createElement("option");
    option.value = skill;
    option.textContent = skill;
    skillSelect.appendChild(option);
  }

  if (skills.includes("Attack Boost")) {
    skillSelect.value = "Attack Boost";
  }

  helperText.className = "helper-text";
  helperText.textContent =
    "Dataset includes 30 armor pieces, and each recommendation now shows Alpha/Beta/Gamma variant labels.";

  renderResults(skillSelect.value, Number(levelInput.value) || 1);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedSkill = skillSelect.value;
  const requestedLevel = Number(levelInput.value);
  if (!selectedSkill || Number.isNaN(requestedLevel) || requestedLevel < 1) {
    helperText.className = "helper-text error";
    helperText.textContent = "Choose a valid skill and a level of at least 1.";
    return;
  }

  const maxPossible = maxForSkill(selectedSkill);
  levelInput.max = String(Math.max(maxPossible, 1));
  renderResults(selectedSkill, requestedLevel);
});

init();
