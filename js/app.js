document.addEventListener("DOMContentLoaded", () => {
  // Budget output formatting
  const budget = document.getElementById("budget");
  const out = document.getElementById("budgetOut");
  const format = v => `€${Number(v).toLocaleString(undefined)}`;
  const updateBudget = () => { out.value = format(budget.value); };
  budget.addEventListener("input", updateBudget);
  updateBudget();

  // Handle form submit
  document.getElementById("finderForm").addEventListener("submit", e => {
    e.preventDefault();
    const params = new URLSearchParams(new FormData(e.target));
    // you can also persist to localStorage if you prefer
    window.location.href = `results.html?${params.toString()}`;
  });
});
