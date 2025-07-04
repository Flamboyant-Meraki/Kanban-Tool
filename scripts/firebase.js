const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Fetchs Contacts from Firebase and converts them to an Array.
 */
async function fetchContacts() {
  try {
    const response = await fetch(`${baseURL}/contacts.json`);
    const data = await response.json();

    if (!data) return [];

    return Object.entries(data).map(([key, contact]) => ({
      name: contact.name || "Unbekannt",
      initials: contact.monogram || "??",
      color: contact.monogramColor || "#CCCCCC",
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    return [];
  }
}

/**
 * Inserts contacts into the template.
 */
async function loadContacts(contacts) {
  if (!contacts.length) return;
  contacts.forEach(addContactToTemplate);
}

/**
 * Saves a new taskk to the database and updates it with the ID generated by the database
 *
 * @param {Object} task - The task object to save
 */
async function saveTask(task) {
  try {
    const response = await fetch(`${baseURL}/tasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    const postData = await response.json();
    const taskId = postData.name; // saves the ID created by Firebase to the taskId variable
    await updateTaskWithId(taskId);
  } catch (error) {
    console.error("Failed to save task:", error);
  }
}

/**
 * Updates a task entry with its own database generated ID
 *
 * @param {string} taskId - The ID generated by the database during the POST
 */
async function updateTaskWithId(taskId) {
  try {
    await fetch(`${baseURL}/tasks/${taskId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: taskId }),
    });
  } catch (error) {
    console.error("Failed to update task with ID:", error);
  }
}
