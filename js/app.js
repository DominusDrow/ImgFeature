import uploadFile from './dragAndDrop.js';

const d = document;

d.addEventListener("DOMContentLoaded", () => {

	uploadFile(".drag-area",".canvas",".button-shrink",".panel");

})
