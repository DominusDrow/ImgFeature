import gBlur from './blur.js';
import coOcurren from './coOcurren.js';
import { max,energy,contrast,entropy } from './coOcurren.js';

const d = document;

export default function uploadFile(container,canvas,button,panel){
	const $dropArea = d.querySelector(container);
	const $dragText = $dropArea.querySelector("h2");
	const $button = $dropArea.querySelector("button");
	const $input = $dropArea.querySelector("input");
	const $canvas = d.querySelector(canvas);
	const $ctx = d.querySelector(canvas).getContext("2d");
	const $btnQuit = d.querySelector(button);

	const img = new Image();
	let fileurl = null; 
	let file;
	let myImageData = null;
	let section = null;

	let Rarray = [];
	let Garray = [];
	let Barray = [];

	let grayScale;
	let jsonPost;
	let respuesta = [];


	$button.addEventListener("click", () => {
		$input.click();
	});

	$input.addEventListener("change", () =>{
		file = $input.files;
		$dropArea.classList.add("active");
		processFile(file[0]);
		$dropArea.classList.remove("active");
	});

	$dropArea.addEventListener("dragover", (e) => {
		e.preventDefault();
		$dropArea.classList.add("active");
		$dragText.textContent = "Sueltalo";
	});
	$dropArea.addEventListener("dragleave", (e) => {
		e.preventDefault();
		$dropArea.classList.remove("active");
		$dragText.textContent = "Arrastra tu archivo aqui";
	});
	$dropArea.addEventListener("drop", (e) => {
		e.preventDefault();
		file = e.dataTransfer.files;
		processFile(file[0]);
		$dropArea.classList.remove("active");
		$dragText.textContent = "Arrastra tu archivo aqui";
	});


	const processFile = (file) => {
		const docType = file.type;
		const validTypes = ["image/jpeg", "image/jpg", "image/png"];

		if(validTypes.includes(docType)){
			
			$dropArea.classList.add("hidden");
			$canvas.classList.remove("hidden");
			$btnQuit.classList.remove("hidden");

			fileurl = URL.createObjectURL(file);
			reload();
			
		}
		else
			alert("El archivo no es valido");
	}

	const reload = () => {

			img.onload = () => {
				$canvas.width = img.width;
				$canvas.height = img.height;
			
				$ctx.drawImage(img,0,0);
			}
			img.src = fileurl;
			gBlur(5,$canvas,$ctx);
	}

	$btnQuit.addEventListener("click", (e) => {
		e.preventDefault();
		$dropArea.classList.remove("hidden");
		$canvas.classList.add("hidden");
		$btnQuit.classList.add("hidden");
	});

	$dropArea.addEventListener("change", () => {
		let scale = 0;
		let coOcurrence = null;		

		setTimeout(() => {
			for (let i = 0; i < $canvas.width-60; i+=30){
				
				for (let j = 0; j < $canvas.height-60; j+=30) {
					
					myImageData = $ctx.getImageData(i,j,30,30);
					section = myImageData.data;
			
					preview();
			
					scale = Math.round(max(grayScale)) + 1;
					coOcurrence = coOcurren(grayScale,3,90,scale);
			
					jsonPost = {
						Medidas:[
							[
								jStat.mean(Rarray),
								jStat.stdev(Rarray),
								jStat.range(Rarray),
								jStat.skewness(Rarray),
								jStat.kurtosis(Rarray),
								jStat.coeffvar(Rarray),
								jStat.mean(Garray), 
								jStat.stdev(Garray),
								jStat.range(Garray),
								jStat.skewness(Garray),
								jStat.kurtosis(Garray),
								jStat.coeffvar(Garray),
								jStat.mean(Barray),
								jStat.stdev(Barray),
								jStat.range(Barray),
								jStat.skewness(Barray),
								jStat.kurtosis(Barray),
								jStat.coeffvar(Barray),
								energy(coOcurrence),
								entropy(coOcurrence),
								contrast(coOcurrence),
							]
						]
					}
					console.log("hola")
					
					postData('https://web-production-151d.up.railway.app/predecir', jsonPost)
					.then(data => {
						respuesta.push(parseInt(data[0]));
						d.querySelector(".loader").classList.add("hidden");
					});
					
					Rarray = [];
					Garray = [];
					Barray = [];
							
				}
			}
			
			definirClase();

			jsonPost = null;
			respuesta = [];

		}, 10);
	})

	const definirClase = () => {
		setTimeout(() => {
			console.log(respuesta);

			let clase = jStat.mode(respuesta);
			if(clase === 1)
				alert("INCENDIOOOOOOOOO");
			else if(clase === 0)
				alert("HAY HUMO, CUIDADO")
			else if(clase === -1)
				alert("TODO TRANQUILO");
		}, 100);
	}


	const preview = () => {
		let gray = 0;
		let arrAux = [];
		grayScale = jStat.zeros(30);
		for (let i = 0; i < myImageData.data.length; i += 4) {

			Rarray.push(section[i + 0]);
			Garray.push(section[i + 1]);
			Barray.push(section[i + 2]);

			gray = 0.33*section[i]+0.5*section[i+1]+0.15*section[i+2];
			arrAux.push(Math.round(gray * 10) / 10);

			if(((i/4)+1) % 30 == 0 ){

				for(let j = 0; j < 30; j++)
					grayScale[(((i/4)+1) / 30)-1][j]=arrAux[j];

				arrAux = [];
			}
		}

	}



}


// Example POST method implementation:
async function postData(url = '', data = {}) {
	d.querySelector(".loader").classList.remove("hidden");
	// Default options are marked with *
	const response = await fetch(url, {
	  method: 'POST', // *GET, POST, PUT, DELETE, etc.
	  mode: 'cors', // no-cors, *cors, same-origin
	  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	  credentials: 'same-origin', // include, *same-origin, omit
	  headers: {
		'Content-Type': 'application/json'
		// 'Content-Type': 'application/x-www-form-urlencoded',
	  },
	  redirect: 'follow', // manual, *follow, error
	  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	  body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
  }





