const FunctionHolder = {};

/**
 * Modal object with methods for creating and closing a modal dialog.
 */
const Modal = {
  /**
   * Creates a modal dialog.
   * @param {string[]} header - The header content as an array of strings.
   * @param {string[]} body - The body content as an array of strings.
   * @param {string[]} footer - The footer content as an array of strings.
   */
  create: (header, body, footer) => {
    document.getElementById("modalLabel").innerHTML = header.join("");
    document.getElementById("modalBody").innerHTML = body.join("");
    document.getElementById("modalFooter").innerHTML = footer.join("");
  },

  /**
   * Closes the modal dialog.
   * @param {string} label - The label for the close button.
   * @returns {string} - The HTML for the close button.
   */
  close: (label) => {
    return `<button type='button' class='btn btn-outline-danger' style='width: auto;' data-bs-dismiss='modal'>${label}</button>`;
  },

  /**
   * Creates a button in the modal dialog.
   * @param {string} label - The label for the button.
   * @param {string} style - The style class for the button.
   * @param {string} id - The ID for the button.
   * @param {Function} onclick - The function to be called on button click.
   * @returns {string} - The HTML for the button.
   */
  button: (label, style, id, onclick) => {
    FunctionHolder[id] = onclick;
    return `<button type='button' class='btn ${style}' id='${id}' onclick='FunctionHolder["${id}"]()'>${label}</button>`;
  },
};