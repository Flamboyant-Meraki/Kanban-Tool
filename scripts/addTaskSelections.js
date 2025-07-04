/**
 * Selects a category option and updates the input field.
 *
 * @param {HTMLElement} element - The selected category element.
 */
function selectCategoryOption(element) {
  const dropdown = element.closest(".dropdown-container").querySelector("input.categoryDropdown");
  if (!dropdown) return;

  dropdown.value = element.textContent;
  dropdown.dataset.value = element.dataset.value;

  setTimeout(() => {
    closeAllDropdowns();
  });
}

/**
 * Toggles the checked state of the checkbox and returns the updated state.
 *
 * @param {HTMLElement} element - The parent element containing the checkbox.
 * @returns {boolean} The updated checked state of the checkbox.
 */
function toggleCheckbox(element) {
  const checkbox = element.querySelector(".hidden-checkbox");
  checkbox.checked = !checkbox.checked;
  return checkbox.checked;
}

/**
 * Updates the background color based on the checked state.
 *
 * @param {HTMLElement} element - The element whose background color is updated.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function updateBackground(element, isChecked) {
  element.style.backgroundColor = isChecked ? "#2a3647" : "";
}

/**
 * Changes the text color based on the checked state.
 *
 * @param {HTMLElement} element - The element containing the text.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function updateTextColor(element, isChecked) {
  const textSpan = element.querySelector("span");
  textSpan.style.color = isChecked ? "#ffffff" : "";
}

/**
 * Updates the checkbox images, ensuring the selected image turns fully white.
 *
 * @param {HTMLElement} element - The element containing the checkbox images.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function updateCheckboxImages(element, isChecked) {
  const uncheckedImg = element.querySelector(".unchecked");
  const checkedImg = element.querySelector(".checked");

  uncheckedImg.style.display = isChecked ? "none" : "inline";
  checkedImg.style.display = isChecked ? "inline" : "none";

  checkedImg.style.filter = isChecked ? "brightness(0) invert(100%)" : "none";
}

/**
 * Applies all style changes based on selection.
 *
 * @param {HTMLElement} element - The element to apply styles to.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function applySelectionStyles(element, isChecked) {
  updateBackground(element, isChecked);
  updateCheckboxImages(element, isChecked);
  updateTextColor(element, isChecked);
  updateSelectedContacts(element, isChecked);
}

/**
 * Ensures clicking on images correctly toggles selection.
 *
 * @param {HTMLElement} element - The element containing the images.
 */
function setupImageClickEvents(element) {
  const checkbox = element.querySelector(".hidden-checkbox");
  const images = element.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      checkbox.checked = !checkbox.checked;
      applySelectionStyles(element, checkbox.checked);
    });
  });
}

/**
 * Handles selection behavior when an option is clicked.
 *
 * @param {HTMLElement} element - The selected option element.
 */
function selectOption(element) {
  const checkbox = element.querySelector(".hidden-checkbox");

  if (event.target !== checkbox) {
    checkbox.click();
  }

  applySelectionStyles(element, checkbox.checked);
  updateSelectedContacts();
}

/**
 * Updates the displayed selected contact avatars
 *
 */
function updateSelectedContacts() {
  const selectedContactsDiv = document.getElementById("selectedContacts");
  selectedContactsDiv.innerHTML = "";

  const checkedElements = document.querySelectorAll(".hidden-checkbox:checked");
  const maxVisibleAvatars = 5;
  const extraCount = checkedElements.length - maxVisibleAvatars;

  createAvatars(checkedElements, maxVisibleAvatars, selectedContactsDiv);
  createPlusCounter(extraCount, selectedContactsDiv);

  selectedContactsDiv.style.display = "none";
  selectedContactsDiv.offsetHeight;
  selectedContactsDiv.style.display = "flex";
}

/**
 * Creates an input field for searching contacts.
 *
 * @param {HTMLInputElement} button - The button element to replace.
 * @returns {HTMLInputElement} The newly created input field.
 */
function createInputField(button) {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Search contacts...";
  inputField.className = button.className;
  inputField.id = button.id;
  return inputField;
}

/**
 * Creates a button to replace an input field.
 *
 * @param {HTMLInputElement} input - The input field to replace.
 * @returns {HTMLInputElement} The newly created button.
 */
function createButton(input) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = "Select contacts to assign";
  button.className = input.className;
  button.id = input.id;
  button.onclick = () => toggleContactSearch(button);
  return button;
}

/**
 * Toggles the category dropdown and updates its state.
 * @param {HTMLElement} input - The clicked input element.
 */
function toggleCategoryDropdown(input) {
  const container = input.closest(".dropdown-container"),
    options = container.querySelector(".dropdown-options"),
    button = container.querySelector("#toggleButtonDropdown");

  if (!options) return;

  let isActive = options.classList.contains("active");

  options.classList.toggle("active", !isActive);

  toggleButtonImageRotation(button, !isActive);
}

/**
 * Toggles the contact dropdown based on the trigger element.
 * @param {HTMLElement} triggerElement - The element that triggered the dropdown toggle.
 */
function toggleContactDropdown(triggerElement) {
    const { dropdownOptions, searchField, button, wasActive } = prepareDropdown(triggerElement);
    toggleDropdown(dropdownOptions, searchField, button, wasActive);
}

/**
 * Prepares the dropdown by retrieving elements and managing existing dropdown states.
 * @param {HTMLElement} triggerElement - The element that triggered the dropdown toggle.
 * @returns {{
 *   dropdownOptions: HTMLElement | null,
 *   searchField: HTMLElement | null,
 *   button: HTMLElement | null,
 *   wasActive: boolean
 * }} - Object containing dropdown elements and activation state.
 */
function prepareDropdown(triggerElement) {
    const { dropdownOptions, searchField, button } = getDropdownElements(triggerElement);
    if (!dropdownOptions) return { dropdownOptions: null, searchField: null, button: null, wasActive: false };

    const wasActive = dropdownOptions.classList.contains("active");
    closeAllDropdowns(dropdownOptions);

    if (shouldActivateSearch(triggerElement, searchField, button)) {
        activateSearchField(searchField, dropdownOptions);
        return { dropdownOptions: null, searchField: null, button: null, wasActive: false };
    }

    return { dropdownOptions, searchField, button, wasActive };
}

/**
 * Toggles the dropdown state and updates related elements.
 * @param {HTMLElement | null} dropdownOptions - The dropdown element to toggle.
 * @param {HTMLElement | null} searchField - The associated search input field.
 * @param {HTMLElement | null} button - The dropdown toggle button.
 * @param {boolean} wasActive - Indicates if the dropdown was previously active.
 */
function toggleDropdown(dropdownOptions, searchField, button, wasActive) {
    if (!dropdownOptions) return;

    dropdownOptions.classList.toggle("active");
    updateDropdownState(dropdownOptions, wasActive);
    updateButtonState(button, wasActive);

    if (!dropdownOptions.classList.contains("active")) {
        resetInputField(searchField);
    }
}

/**
 * Updates the button rotation state.
 * @param {HTMLElement} button - The button element.
 * @param {boolean} wasActive - Whether the dropdown was previously active.
 */
function updateButtonState(button, wasActive) {
  resetAllButtonImages();
  toggleButtonImageRotation(button, !wasActive);
}

/**
 * Retrieves dropdown elements based on the trigger element.
 * @param {HTMLElement} triggerElement - The element triggering the dropdown.
 * @returns {Object} Object containing dropdown elements.
 */
function getDropdownElements(triggerElement) {
  const container = triggerElement.closest(".dropdown-container");
  return {
    dropdownOptions: container?.querySelector(".dropdown-options"),
    searchField: container?.querySelector(".dropdown-selected"),
    button: container?.querySelector("#toggleButtonDropdown"),
  };
}

/**
 * Closes all active dropdowns except the specified one.
 * @param {HTMLElement} currentDropdown - The dropdown to remain active.
 */
function closeOtherDropdowns(currentDropdown) {
  document.querySelectorAll(".dropdown-options.active").forEach((dropdown) => {
    if (dropdown !== currentDropdown) dropdown.classList.remove("active");
  });
}

/**
 * Determines whether the search field should be activated.
 */
function shouldActivateSearch(triggerElement, searchField, button) {
  return (triggerElement === searchField || triggerElement === button) && searchField.type === "button";
}

/**
 * Resets rotation of all dropdown toggle buttons.
 */
function resetAllButtonImages() {
  document.querySelectorAll("#toggleButtonDropdown").forEach((btn) => toggleButtonImageRotation(btn, false));
}

/**
 * Rotates button image based on dropdown visibility.
 * @param {HTMLElement} button - Button element.
 * @param {boolean} isVisible - Dropdown visibility state.
 */
function toggleButtonImageRotation(button, isVisible) {
  if (!button) return;
  const img = button.querySelector("img");
  if (img) img.style.transform = isVisible ? "rotate(180deg)" : "rotate(0deg)";
}

/**
 * Updates dropdown visibility state.
 * @param {HTMLElement} dropdown - Dropdown element.
 * @param {boolean} wasVisible - Previous visibility state.
 */
function updateDropdownState(dropdown, wasVisible) {
  dropdown.classList.toggle("active", !wasVisible);
  dropdown.style.display = wasVisible ? "none" : "block";
}

/**
 * Converts button input into a search field and activates it.
 * @param {HTMLElement} inputField - Search field element.
 * @param {HTMLElement} dropdownOptions - Dropdown options container.
 */
function activateSearchField(inputField, dropdownOptions) {
  const container = inputField.closest(".dropdown-container"),
    button = container.querySelector("#toggleButtonDropdown");

  if (inputField.type === "button") {
    const newInput = document.createElement("input");
    Object.assign(newInput, { type: "text", placeholder: "Search contacts...", className: "dropdown-selected typeBars", id: inputField.id, value: "" });
    newInput.oninput = () => filterDropdownOptions(newInput, dropdownOptions);
    inputField.replaceWith(newInput);
    setTimeout(() => newInput.focus(), 0);
  }

  dropdownOptions.classList.add("active");
  dropdownOptions.style.display = "block";
  toggleButtonImageRotation(button, true);
}

/**
 * Resets search field back to a button.
 * @param {HTMLElement} inputField - Search field element.
 */
function resetInputField(inputField) {
  if (inputField && inputField.type === "text") {
    const container = inputField.closest(".dropdown-container");
    if (!container) return;

    createButtonInput(inputField);

    const dropdownOptions = container.querySelector(".dropdown-options");
    if (dropdownOptions) {
      dropdownOptions.querySelectorAll(".option").forEach(option => {
        option.style.display = "flex";
      });
    }
  }
}

/**
 * Creates a button and replaces the search field.
 * @param {HTMLElement} inputField - Search field element.
 */
function createButtonInput(inputField) {
  const newButton = document.createElement("input");
  Object.assign(newButton, { type: "button", value: "Select contacts to assign", className: "dropdown-selected typeBars", id: inputField.id });
  newButton.onclick = () => toggleContactDropdown(newButton);
  inputField.replaceWith(newButton);
}

/**
 * Closes all dropdowns and resets fields if necessary.
 */
function closeAllDropdowns(excludedDropdown) {
  document.querySelectorAll(".dropdown-container .dropdown-options").forEach((options) => {
    if (options !== excludedDropdown) {
      options.classList.remove("active");
      options.style.display = "none";
      resetInputField(options.closest(".dropdown-container").querySelector(".dropdown-selected"));
    }
  });

  document.querySelectorAll(".dropdown-container button img").forEach((img) => (img.style.transform = "rotate(0deg)"));
}

/**
 * Filters dropdown options based on search input.
 * @param {HTMLElement} input - Search field element.
 * @param {HTMLElement} dropdownOptions - Dropdown options container.
 */
function filterDropdownOptions(input, dropdownOptions) {
  const searchValue = input.value.toLowerCase();
  dropdownOptions.querySelectorAll(".option").forEach((option) => {
    option.style.display = option.textContent.toLowerCase().includes(searchValue) ? "flex" : "none";
  });
}
