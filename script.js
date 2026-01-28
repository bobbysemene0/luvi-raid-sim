let chart;

function simulateBattle(cards, enemyAtk, turns = 15) {
  let totalDamage = 0;
  let damagePerTurn = [];

  let state = cards.map(c => ({ ...c, hp: c.hp }));

  for (let turn = 1; turn <= turns; turn++) {
    let turnDamage = 0;

    state.forEach(card => {
      if (card.hp > 0) {
        turnDamage += card.atk * card.mult;
      }
    });

    totalDamage += turnDamage;
    damagePerTurn.push(turnDamage);

    state.forEach(card => {
      if (card.hp > 0) {
        card.hp = Math.max(0, card.hp - enemyAtk);
      }
    });
  }

  return { totalDamage, damagePerTurn };
}

function runSim() {
  const cardEls = document.querySelectorAll(".card");
  const cards = [];

  cardEls.forEach(el => {
    const inputs = el.querySelectorAll("input");
    if (!inputs[1].value || !inputs[2].value) return;

    cards.push({
      name: inputs[0].value || "Card",
      hp: Number(inputs[1].value),
      atk: Number(inputs[2].value),
      mult: Number(inputs[3].value) || 1
    });
  });

  const enemyAtk = Number(document.getElementById("enemyAtk").value);
  if (!enemyAtk || cards.length === 0) return;

  const result = simulateBattle(cards, enemyAtk);

  document.getElementById("totalDamage").textContent =
    `Total Damage: ${Math.floor(result.totalDamage)}`;

  renderChart(result.damagePerTurn);
}

function renderChart(data) {
  const ctx = document.getElementById("damageChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, i) => `Turn ${i + 1}`),
      datasets: [{
        label: "Damage per Turn",
        data
      }]
    }
  });
}

document.getElementById("simulate").onclick = runSim;
