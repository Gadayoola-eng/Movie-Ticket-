let selectedSeats = [];

   const TOTAL_SEATS = 30;

function bookTicket() {
    let seatSelect = document.getElementById("seats");
    let selectedSeats = [];

    for (let option of seatSelect.options) {
        if (option.selected) {
            selectedSeats.push(option.value);
        }
    }

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat");
        return;
    }

    let bookingID = generateBookingID();

    let booking = {
        id: bookingID,
        movie: document.getElementById("movie").value,
        time: document.getElementById("time").value,
        seats: selectedSeats,
        date: new Date().toLocaleString()
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    showReceipt(booking);
    updateSeatInfo();
}

document.getElementById("movie")?.addEventListener("change", loadComments);
document.addEventListener("DOMContentLoaded", loadComments);

function loadBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let output = "";

    bookings.forEach((b, i) => {
        output += `
        <p>
        <strong>Booking ${i + 1}</strong><br>
        Movie: ${b.movie}<br>
        Time: ${b.time}<br>
        Seats: ${b.seats.join(", ")}<br>
        Date: ${b.date}
        </p><hr>`;
    });

    document.getElementById("bookings").innerHTML =
        output || "No bookings yet.";
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

/* AUTO CHECK ADMIN LOGIN */
if (location.pathname.includes("admin.html")) {
    if (localStorage.getItem("adminLoggedIn") === "true") {
        showAdminPanel();
    }
}

function adminLogin() {
    let user = document.getElementById("adminUser").value;
    let pass = document.getElementById("adminPass").value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem("adminLoggedIn", "true");
        showAdminPanel();
    } else {
        document.getElementById("loginMsg").innerText =
            "❌ Invalid login details";
    }
}

function showAdminPanel() {
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
}

function logout() {
    localStorage.removeItem("adminLoggedIn");
    location.reload();
}

function loadBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let output = "";

    if (bookings.length === 0) {
        document.getElementById("bookings").innerHTML = "No bookings yet.";
        return;
    }

    bookings.forEach((b, index) => {
        output += `
<div style="border:1px solid #555; padding:10px; margin-bottom:10px;">
    <strong>Booking ID:</strong> ${b.id}<br>
    Movie: ${b.movie}<br>
    Time: ${b.time}<br>
    Seats: ${b.seats.join(", ")}<br>
    Date: ${b.date}<br><br>
    <button onclick="deleteBooking(${index})"
        style="background:red;color:white;border:none;padding:5px;">
        ❌ Delete
    </button>
</div>`;
    });

    document.getElementById("bookings").innerHTML = output;
}

function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (confirm("Delete this booking?")) {
        bookings.splice(index, 1);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        updateSeatInfo();
        loadBookings();
    }
}

function clearBookings() {
    if (confirm("Are you sure? This will delete all bookings")) {
        localStorage.removeItem("bookings");
        loadBookings();
    }
}

function updateSeatInfo() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let bookedSeatsCount = 0;

    bookings.forEach(b => {
        bookedSeatsCount += b.seats.length;
    });

    let remainingSeats = TOTAL_SEATS - bookedSeatsCount;

    let infoText = `
        🎟 Total Seats: ${TOTAL_SEATS}<br>
        ❌ Booked Seats: ${bookedSeatsCount}<br>
        ✅ Remaining Seats: ${remainingSeats}
    `;

    let seatInfo = document.getElementById("seatInfo");
    if (seatInfo) {
        seatInfo.innerHTML = infoText;
    }
}
   document.addEventListener("DOMContentLoaded", updateSeatInfo);
  
function generateBookingID() {
    let date = new Date();
    let y = date.getFullYear();
    let m = String(date.getMonth() + 1).padStart(2, "0");
    let d = String(date.getDate()).padStart(2, "0");
    let random = Math.floor(1000 + Math.random() * 9000);

    return `CINE-${y}${m}${d}-${random}`;
}

function showReceipt(booking) {
    let receiptDiv = document.getElementById("receipt");

    receiptDiv.style.display = "block";
    receiptDiv.innerHTML = `
        <div id="printArea">
            <h3>🎟 Cinema Booking Receipt</h3>
            <strong>Booking ID:</strong> ${booking.id}<br><br>

            <strong>Movie:</strong> ${booking.movie}<br>
            <strong>Show Time:</strong> ${booking.time}<br>
            <strong>Seats:</strong> ${booking.seats.join(", ")}<br>
            <strong>Date:</strong> ${booking.date}<br>

            <hr>
            <p>Please present this receipt at the cinema.</p>
        </div>

        <button onclick="downloadReceipt()">
            ⬇️ Download Receipt (PDF)
        </button>
    `;
}

function downloadReceipt() {
    let printContent = document.getElementById("printArea").innerHTML;

    let win = window.open("", "", "width=800,height=600");
    win.document.write(`
        <html>
        <head>
            <title>Booking Receipt</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 20px;
                }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);

    win.document.close();
    win.focus();
    win.print();
}

if (!localStorage.getItem("movies")) {
    localStorage.setItem("movies", JSON.stringify([
        { name: "Avengers", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
        { name: "Spider-Man", times: ["11:00 AM", "4:00 PM", "8:00 PM"] },
        { name: "Batman", times: ["12:00 PM", "5:00 PM", "9:00 PM"] }
    ]));
}

function addMovie() {
    let name = document.getElementById("movieName").value.trim();
    let timesInput = document.getElementById("movieTimes").value.trim();

    if (!name || !timesInput) {
        alert("Please enter movie name and show times");
        return;
    }

    let times = timesInput.split(",").map(t => t.trim());

    let movies = JSON.parse(localStorage.getItem("movies")) || [];

    let existing = movies.find(m => m.name.toLowerCase() === name.toLowerCase());

    if (existing) {
        existing.times = times; // update
        alert("Movie updated successfully");
    } else {
        movies.push({ name, times });
        alert("Movie added successfully");
    }

    localStorage.setItem("movies", JSON.stringify(movies));

    document.getElementById("movieName").value = "";
    document.getElementById("movieTimes").value = "";

    loadMovieList();
}

function loadMoviesForUser() {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let movieSelect = document.getElementById("movie");
    let timeSelect = document.getElementById("time");

    if (!movieSelect || !timeSelect) return;

    movieSelect.innerHTML = "";
    timeSelect.innerHTML = "";

    movies.forEach((m, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = m.name;
        movieSelect.appendChild(option);
    });

    updateShowTimes();
}

function updateShowTimes() {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let movieIndex = document.getElementById("movie").value;
    let timeSelect = document.getElementById("time");

    timeSelect.innerHTML = "";

    if (!movies[movieIndex]) return;

    movies[movieIndex].times.forEach(t => {
        let option = document.createElement("option");
        option.textContent = t;
        timeSelect.appendChild(option);
    });
}

function loadMovieList() {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let output = "<h4>Current Movies</h4>";

    movies.forEach((m, i) => {
        output += `
        <p>
            <strong>${m.name}</strong><br>
            Times: ${m.times.join(", ")}
            <br>
            <button onclick="deleteMovie(${i})"
            style="background:red;color:white;border:none;padding:4px;">
            ❌ Delete
            </button>
        </p>`;
    });

    document.getElementById("movieList").innerHTML = output;
}

function deleteMovie(index) {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];

    if (confirm("Delete this movie?")) {
        movies.splice(index, 1);
        localStorage.setItem("movies", JSON.stringify(movies));
        loadMovieList();
    }
}

if (location.pathname.includes("admin.html")) {
    loadMovieList();
}

if (!location.pathname.includes("admin.html")) {
    document.addEventListener("DOMContentLoaded", loadMoviesForUser);
    document.getElementById("movie")?.addEventListener("change", updateShowTimes);
}

function addComment() {
    let commentText = document.getElementById("commentText").value.trim();
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let movieIndex = document.getElementById("movie").value;

    if (!commentText) {
        alert("Please write a comment");
        return;
    }

    let comment = {
        movie: movies[movieIndex].name,
        text: commentText,
        date: new Date().toLocaleString()
    };

    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));

    document.getElementById("commentText").value = "";
    loadComments();
}

function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let movieIndex = document.getElementById("movie")?.value;

    let output = "";

    if (movieIndex === undefined) return;

    let movieName = movies[movieIndex].name;

    comments
        .filter(c => c.movie === movieName)
        .forEach(c => {
            output += `
            <div class="comment">
                <strong>${c.movie}</strong><br>
                ${c.text}<br>
                <small>${c.date}</small>
            </div>`;
        });

    document.getElementById("comments").innerHTML =
        output || "<p>No comments yet for this movie.</p>";
}

function loadAllComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    let output = "";

    comments.forEach((c, i) => {
        output += `
        <div style="border:1px solid #555;padding:8px;margin-bottom:6px;">
            <strong>${c.movie}</strong><br>
            ${c.text}<br>
            <small>${c.date}</small>
        </div>`;
    });

    document.getElementById("adminComments").innerHTML =
        output || "No comments available.";
}

