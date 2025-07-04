/**
 * Renders the interface for adding a new task.
 *
 * @returns {string} The HTML content for the add task section.
 */
function renderAddTask() {
  return `
            <div class="contentWrapper">
            <h1>Add Task</h1>
            <div class="inputOrg">
              <form class="taskInfomations" id="myForm">
                <div class="spanGlue">
                  <span>Task<label>*</label></span>
                  <input
                    type="text"
                    class="typeBars resetTarget"
                    id="taskTitle"
                    placeholder="Enter a title"
                    onblur="handleBlur(this)"
                    required
                  />
                  <span id="showUpRequired" style="display: none; position: absolute;">This field is required</span>
                </div>
                <div class="spanGlue">
                  <span>Description</span>
                  <textarea
                    name="description"
                    class="typeBars resetTarget"
                    id="taskDescription"
                    placeholder="Enter a Discription"
                    style="height: 120px; padding: 14px 15px"
                  ></textarea>
                </div>
                <div class="spanGlue">
                  <span>Due date<label>*</label></span>
                  <input
                    type="date"
                    id="date-input"
                    class="typeBars resetTarget"
                    placeholder="dd/mm/yy"
                    oninput="checkValue()"
                    onblur="handleBlur(this)"
                    required
                  />
                  <span id="showUpRequired" style="display: none; position: absolute;">This field is required</span>
                </div>
              </form>
              <hr class="hrHider"/>
              <section class="taskCategorysation">
                <div class="spanGlue">
                  <span>Priority</span>
                  <div class="priorityArange" style="display: flex" id="priority">
                    <button
                      class="priorityBtns"
                      data-color="#FF3D00"
                      data-priority="high"
                      onclick="handleButtonClick(this)"
                    >
                      <span>Urgent</span>
                      <img
                        src="../assets/icons/Prio high_red.svg"
                        style="width: 24px; transform: rotate(270deg);"
                      />
                    </button>

                    <button
                      class="priorityBtns selected"
                      data-color="#FFA800"
                      data-priority="medium"
                      onclick="handleButtonClick(this)"
                    >
                      <span>Medium</span>
                      <img
                        src="../assets/icons/Prio medi_orange.svg"
                        style="width: 24px;"
                      />
                    </button>

                    <button
                      class="priorityBtns"
                      data-color="#7AE229"
                      data-priority="low"
                      onclick="handleButtonClick(this)"
                    >
                      <span>Low</span>
                      <img
                        src="../assets/icons/Prio low_green.svg"
                        style="width: 24px; transform: rotate(90deg);"
                      />
                    </button>
                  </div>
                </div>
                <!-- Contact Dropdown -->
                <div class="spanGlue">
                    <span>Assigned to</span>
                    <div class="dropdown-container">
                        <input type="button" value="Select contacts to assign" class="dropdown-selected typeBars" id="contactDropdown" onclick="toggleContactDropdown(this)">
                        <button id="toggleButtonDropdown"
                            onclick="toggleContactDropdown(this)">
                            <img src="../assets/icons/arrow_drop_downaa.png" alt="down">
                        </button>
                        <div class="dropdown-options" id="contact-list"></div>
                    </div>
                    <div class="resetTarget" id="selectedContacts"></div>
                </div>

                <!-- Category Dropdown -->
                <div class="spanGlue">
                    <span>Category<label>*</label></span>
                    <div class="dropdown-container">
                        <input type="button" value="Select task category" class="dropdown-selected typeBars categoryDropdown" onclick="toggleCategoryDropdown(this)" required />
                        <button id="toggleButtonDropdown" onclick="toggleCategoryDropdown(this)"><img src="../assets/icons/arrow_drop_downaa.png" alt="down"></button>
                        <div class="dropdown-options">
                            <div class="option" data-value="Technical Task" onclick="selectCategoryOption(this)">Technical Task</div>
                            <div class="option" data-value="User Story" onclick="selectCategoryOption(this)">User Story</div>
                        </div>
                    </div>
                </div>
                <div class="spanGlue">
                  <span>Subtasks</span>
                  <div class="subtask-container">
                    <input
                      type="text"
                      class="typeBars typePriorityBars"
                      id="newSubtask"
                      placeholder="Add new subtask"
                    />
                    <div class="subtaskNavigator">
                      <img id="addSubtask" src="../assets/icons/addIconSubtask.svg" alt="cross" onclick="showConfirmDelete(event)"/>
                      <div id="confirmDeleteNewSubtask">
                        <img src="../assets/icons/closeAddSubtask.svg" alt="X" id="close" onclick="resetElements()"/>
                        <hr />
                        <img src="../assets/icons/checkNewSubtask.svg" alt="Check" id="confirm" onclick="emptyFeedback(); addSubtask();"/>
                      </div>
                    </div>
                  </div>
                  <ul class="resetTarget" id="subtaskList">
                      <!-- Subtasks -->
                    </ul>
                </div>
              </section>
            </div>
            <div class="bottomButtons">
              <span><label>*</label>This field is required</span>
              <div class="bottomButtonsSplice">
                <button id="resetButton" class="bottomButton1" onclick="initReset()">
                  Clear<div class="x-icon"></div>
                </button>
                <button
                  type="button"
                  class="bottomButton2"
                  id="submitBtn"
                  onclick="addTask()"
                  disabled
                >
                  Creakte Task<img
                    src="../assets/icons/check.png"
                    alt="Check"
                  />
                </button>
              </div>
            </div>
          </div>
            `;
}

/**
 * Adds a contact to the contact list template.
 *
 * @param {Object} person - The contact information.
 * @param {string} person.name - The name of the contact.
 * @param {string} person.color - The color associated with the contact.
 * @param {string} person.initials - The initials of the contact.
 */
function addContactToTemplate(person) {
  if (!person || !person.name || !person.color || !person.initials) {
    return;
  }

  const contactList = document.getElementById("contact-list");
  if (!contactList) return;

  const template = `
    <div class="option" data-value="${person.name}" onclick="selectOption(this)">
      <div style=" display: flex; align-items: center; gap: 15px;">
        <div class="task-card-avatar" data-color="${person.color}" style="background-color: ${person.color}">${person.initials}</div>
        <span style="padding-bottom: 0;">${person.name}</span>
      </div>
      <label style="display: flex; cursor: pointer;">
        <input type="checkbox" class="hidden-checkbox" value="${person.name}" style="cursor: pointer; z-index: 5"/>
        <img src="../assets/icons/checkbox_icon.svg" class="unchecked" style="pointer-events: auto; cursor: pointer;"/>
        <img src="../assets/icons/checkbox_checked_icon.svg" class="checked" style="pointer-events: auto; cursor: pointer;"/>
      </label>
    </div>
  `;

  contactList.insertAdjacentHTML("beforeend", template);
}

/**
 * Creates the template structure for a new subtask.
 *
 * @param {string} text - The text content of the subtask.
 * @returns {HTMLLIElement} The list item element representing the subtask.
 */
function createSubtaskElement(text) {
  const listItem = document.createElement("li");
  listItem.className = "dot";
  listItem.id = "subtaskListElement";
  listItem.onclick = () => toggleEditMode(listItem);

  listItem.innerHTML = `
        <span id="editableText" class="subtask-text">${text}</span>
        <div id="editDelate">
            <img src="../assets/icons/editPen.svg" alt="Pen" onclick="toggleEditMode(this)">
            <hr>
            <img src="../assets/icons/deleteBin.svg" alt="Bin" onclick="deleteSubtask(this)">
        </div>
        <div id="deleteChange" style="display: none;">
            <img src="../assets/icons/deleteBin.svg" alt="Bin" onclick="deleteSubtask(this)">
            <hr>
            <img src="../assets/icons/checkBlack.svg" alt="Check" onclick="saveAndExitEditMode(this)">
        </div>
    `;

  return listItem;
}
