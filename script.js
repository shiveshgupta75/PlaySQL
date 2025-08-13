let db; // In-memory SQL database

window.onload = async () => {
  const SQL = await window.initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  });

  db = new SQL.Database();

  createSampleDB();

  document.getElementById("runBtn").onclick = runQuery;
};

function createSampleDB() {
  // Create books table
  db.run(`CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    year INTEGER
  );`);

  // Insert sample data
 db.run(`INSERT INTO books (title, author, year) VALUES
  ('Godan', 'Munshi Premchand', 1936),
  ('Gitanjali', 'Rabindranath Tagore', 1910),
  ('Train to Pakistan', 'Khushwant Singh', 1956),
  ('Midnight’s Children', 'Salman Rushdie', 1981),
  ('The Guide', 'R.K. Narayan', 1958);
`);

}

function runQuery() {
  const query = document.getElementById("sqlInput").value;
  const errorDiv = document.getElementById("error");
  const resultsDiv = document.getElementById("results");

  errorDiv.textContent = "";
  resultsDiv.innerHTML = "";

  try {
    const result = db.exec(query);

    if (result.length === 0) {
      resultsDiv.textContent = "Query ran successfully but no results.";
      return;
    }

    // Build results table
    const table = document.createElement("table");

    const columns = result[0].columns;
    const values = result[0].values;

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    columns.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    values.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(val => {
        const td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    resultsDiv.appendChild(table);
  } catch (err) {
    errorDiv.textContent = "Error: " + err.message;
  }
}
