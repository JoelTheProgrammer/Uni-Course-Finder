document.addEventListener("DOMContentLoaded", () => {
  // Budget output + slider fill
  const budget = document.getElementById("budget");
  const out = document.getElementById("budgetOut");
  const format = v => `€${Number(v).toLocaleString(undefined)}`;

  function updateBudget() {
    // update the output text
    out.value = format(budget.value);

    // update the slider background fill
    const min = +budget.min;
    const max = +budget.max;
    const val = +budget.value;
    const percent = ((val - min) / (max - min)) * 100;
    budget.style.background = `linear-gradient(to right, var(--brand) 0%, var(--brand) ${percent}%, #eee ${percent}%, #eee 100%)`;
  }

  budget.addEventListener("input", updateBudget);
  updateBudget(); // initialize on page load

  // Handle form submit
  document.getElementById("finderForm").addEventListener("submit", e => {
    e.preventDefault();
    const params = new URLSearchParams(new FormData(e.target));
    // you can also persist to localStorage if you prefer
    window.location.href = `results.html?${params.toString()}`;
  });
});
