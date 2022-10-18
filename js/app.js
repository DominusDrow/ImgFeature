import uploadFile from './dragAndDrop.js';

const d = document;

d.addEventListener("DOMContentLoaded", () => {
		d.querySelector("#gblur").value = 0;

	uploadFile(".drag-area",".canvas",".button-shrink",".panel");

})


