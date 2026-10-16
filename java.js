
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const reportsRef = database.ref("reports");


const alertsList = document.getElementById("alerts-list");

const alertIcons = {
    Waterlogging: "🌧",
    Roadblock: "🚧",
    "Traffic jam": "🚗",
    Construction: "🏗"
};

// Listen for database changes.
// Every connected page receives updated reports.
reportsRef.on("value", snapshot => {
    alertsList.replaceChildren();

    snapshot.forEach(child => {
        const report = child.val();

        const item = document.createElement("div");
        item.className = "alert-item";

        const symbol = document.createElement("div");
        symbol.className = "alert-symbol";
        symbol.textContent = alertIcons[report.type] || "⚠";

        const content = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = `${report.type} · ${report.location}`;

        const description = document.createElement("p");
        description.textContent = report.description;

        const status = document.createElement("span");
        status.className = "alert-status";
        status.textContent = "COMMUNITY REPORT · UNVERIFIED";

        content.append(heading, description, status);
        item.append(symbol, content);
        alertsList.prepend(item);
    });

    document.getElementById("alert-count").textContent =
        String(snapshot.size).padStart(2, "0");
});

// Submit a report to the shared database.
document.getElementById("alert-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const location =
            document.getElementById("alert-location").value;
        const type =
            document.getElementById("alert-type").value;
        const description =
            document.getElementById("alert-description")
                .value.trim();

        if (!description) return;

        try {
            await reportsRef.push({
                location,
                type,
                description,
                createdAt: Date.now()
            });

            this.reset();
            alert("Report submitted to DhakaPath!");
        } catch (error) {
            console.error(error);
            alert("Report could not be saved. Check Firebase settings.");
        }
    });


