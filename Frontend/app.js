const API_URL = 'http://localhost:5000/api';

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submitBtn");
const contactList = document.getElementById("contactList");
const contactCount = document.getElementById("contactCount");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");

const toggleBtn = document.getElementById("toggleContactsBtn");
const overlay = document.getElementById("contactOverlay");
const overlayList = document.getElementById("overlayContactList");
const closeOverlay = document.getElementById("closeOverlay");

let editContactId = null;

function showMessage(text, color) {
  message.innerText = text;
  message.style.color = color;
  setTimeout(() => message.innerText = "", 3000);
}

async function fetchContacts() {
  const res = await fetch(`${API_URL}/contacts`);
  const result = await res.json();
  if (result.success) renderContacts(result.data);
}

function renderContacts(contacts) {
  contactList.innerHTML = "";

  if (!contacts.length) {
    contactList.innerHTML = `<div class="empty-state">No contacts added</div>`;
    contactCount.innerText = "0 contacts";
    return;
  }

  contacts.forEach(c => {
    contactList.innerHTML += `
      <div class="contact-card">
        <div class="contact-info">
          <h3>${c.name}</h3>
          <p>📞 ${c.phone}</p>
          ${c.email ? `<p>📧 ${c.email}</p>` : ""}
        </div>

        <div class="contact-actions">
          <button class="btn-edit" onclick="editContact(${c.id})">Edit</button>
          <button class="btn-delete" onclick="deleteContact(${c.id})">Delete</button>
        </div>
      </div>
    `;
  });

  contactCount.innerText = `${contacts.length} contact${contacts.length > 1 ? "s" : ""}`;
}

contactForm.addEventListener("submit", async e => {
  e.preventDefault();

  if (!nameInput.value || !phoneInput.value) {
    showMessage("⚠️ Fill required fields", "#dc3545");
    return;
  }

  const data = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim()
  };

  const url = editContactId
    ? `${API_URL}/contacts/${editContactId}`
    : `${API_URL}/contacts`;

  const method = editContactId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    showMessage("✅ Saved successfully", "#28a745");
    resetForm();
    fetchContacts();
  }
});

async function editContact(id) {
  const res = await fetch(`${API_URL}/contacts`);
  const result = await res.json();

  const c = result.data.find(x => x.id === id);
  if (!c) return;

  editContactId = id;
  nameInput.value = c.name;
  phoneInput.value = c.phone;
  emailInput.value = c.email || "";

  submitBtn.innerText = "Update Contact";
  document.querySelector(".form-section h2").innerText = "Edit Contact";
  overlay.style.display = "none";
}

async function deleteContact(id) {
  if (!confirm("Delete this contact?")) return;

  await fetch(`${API_URL}/contacts/${id}`, { method: "DELETE" });
  showMessage("🗑️ Contact deleted", "#666");
  overlay.style.display = "none";
  fetchContacts();
}

function resetForm() {
  editContactId = null;
  contactForm.reset();
  submitBtn.innerText = "Add Contact";
  document.querySelector(".form-section h2").innerText = "Add New Contact";
}

searchInput.addEventListener("input", async () => {
  const q = searchInput.value.trim();

  if (!q) {
    fetchContacts();
    return;
  }

  const res = await fetch(`${API_URL}/contacts/search?query=${encodeURIComponent(q)}`);
  const result = await res.json();

  if (result.success) {
    if (result.data.length === 0) {
      contactList.innerHTML = `<div class="empty-state">Contact not found</div>`;
      contactCount.innerText = "0 contacts";
    } else {
      renderContacts(result.data);
    }
  }
});

toggleBtn.onclick = () => {
  overlay.style.display = "flex";

  const query = searchInput.value.trim();

  if (query) {
    searchAndShowInOverlay(query); // 🔥 strict
  } else {
    renderOverlayContacts();
  }
};

closeOverlay.onclick = () => overlay.style.display = "none";
overlay.onclick = e => e.target === overlay && (overlay.style.display = "none");

async function searchAndShowInOverlay(query) {
  const res = await fetch(
    `${API_URL}/contacts/search?query=${encodeURIComponent(query)}`
  );
  const result = await res.json();

  overlayList.innerHTML = "";

  if (!result.success || result.data.length === 0) {
    overlayList.innerHTML = `
      <div style="text-align:center; padding:30px;">
        <h3 style="color:#dc3545;">❌ Contact not found</h3>
        <p style="color:#666;">"${query}" does not exist</p>
      </div>
    `;
    return;
  }

  result.data.forEach(c => {
    overlayList.innerHTML += `
      <div class="contact-card">
        <div>
          <strong>${c.name}</strong><br>
          📞 ${c.phone}
          ${c.email ? `<br>📧 ${c.email}` : ""}
        </div>

        <div class="contact-actions">
          <button class="btn-edit" onclick="editContact(${c.id})">Edit</button>
          <button class="btn-delete" onclick="deleteContact(${c.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

async function renderOverlayContacts() {
  const res = await fetch(`${API_URL}/contacts`);
  const result = await res.json();

  overlayList.innerHTML = "";

  if (!result.data.length) {
    overlayList.innerHTML = "<p>No contacts available</p>";
    return;
  }

  result.data.forEach(c => {
    overlayList.innerHTML += `
      <div class="contact-card">
        <div>
          <strong>${c.name}</strong><br>
          📞 ${c.phone}
          ${c.email ? `<br>📧 ${c.email}` : ""}
        </div>

        <div class="contact-actions">
          <button class="btn-edit" onclick="editContact(${c.id})">Edit</button>
          <button class="btn-delete" onclick="deleteContact(${c.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

fetchContacts();
