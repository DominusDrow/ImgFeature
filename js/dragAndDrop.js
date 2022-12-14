import arrayObjToCsv  from './generateCsv.js';
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

	const $canvas2 = d.querySelector(".canvas2");
	const $ctx2 = $canvas2.getContext("2d");
	const $canvas3 = d.querySelector(".canvas3");
	const $ctx3 = $canvas3.getContext("2d");
	const $canvas4 = d.querySelector(".canvas4");
	const $ctx4 = $canvas4.getContext("2d");

	const $panel = d.querySelector(panel);
	const $btnDownload = d.querySelector(".btn-63");
	const $grid = $panel.querySelector("#tentacles");
	const $gblur = $panel.querySelector("#gblur");
	const $clase = $panel.querySelector("#clase");
	const $features = $panel.querySelector(".features");
	const $distancia = $panel.querySelector("#distance");
	const $angulo = $panel.querySelector("#angulo");
	const $clases = $panel.querySelector(".clases");


	const img = new Image();
	let fileurl = null; 
	let file;
	let mousePos = {x:0,y:0};
	let ClientRect = null;
	let myImageData = null;
	let section = null;
	let imgData2; 

	let Rarray = [];
	let Garray = [];
	let Barray = [];

	let arrCSV = [];
	let grayScale;

	let humo = 0;
	let fuego = 0;
	let nada = 0;

	$grid.addEventListener("change", e => {
		e.preventDefault();
		$ctx.clearRect(0,0,$canvas.width,$canvas.height);
		reload();

	});


	$button.addEventListener("click", () => {
		$input.click();
	});

	$btnDownload.addEventListener("click", () => {
		arrayObjToCsv(arrCSV);
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
				$ctx.filter = 'blur(5px)';
			img.onload = () => {
				$canvas.width = img.width;
				$canvas.height = img.height;
				$ctx.drawImage(img,0,0);

				$canvas3.width = img.width;
				$canvas3.height = img.height;
				$ctx3.drawImage(img,0,0);

				$canvas4.width = img.width;
				$canvas4.height = img.height;
				$ctx4.drawImage(img,0,0);
				gridupdate();
			}
			img.src = fileurl;

	}

	$btnQuit.addEventListener("click", (e) => {
		e.preventDefault();
		$dropArea.classList.remove("hidden");
		$canvas.classList.add("hidden");
		$btnQuit.classList.add("hidden");
		$gblur.value = 0;
	});


	d.addEventListener("click", e => {
		let scale = 0;
		let coOcurrence = null;
		if(e.target==$canvas){
			ClientRect = $canvas.getBoundingClientRect();
			mousePos.x = Math.round(e.clientX - ClientRect.left);
			mousePos.y = Math.round(e.clientY - ClientRect.top);

			for(let i =0; i < parseInt($grid.value); i++){
				if(mousePos.x % parseInt($grid.value) != 0)
					mousePos.x -- ;
				if(mousePos.y % parseInt($grid.value) != 0)
					mousePos.y -- ;
			}


			myImageData = $ctx3.getImageData(mousePos.x,mousePos.y,parseInt($grid.value),parseInt($grid.value));
			section = myImageData.data;

			$ctx2.clearRect(0,0,$canvas2.width,$canvas2.height);
			preview();
			let distanciaAux = parseInt($distancia.value);
			let anguloAux = parseInt($angulo.value);
			scale = Math.round(max(grayScale)) + 1;
			coOcurrence = coOcurren(grayScale,distanciaAux,anguloAux,scale);

			arrCSV.push({
				MEANR: jStat.mean(Rarray),
				STDEVR: jStat.stdev(Rarray),
				RANGE_R: jStat.range(Rarray),
				SKEWR: jStat.skewness(Rarray),
				KURTOSISR: jStat.kurtosis(Rarray),
				CV_R: jStat.coeffvar(Rarray),

				MEANG: jStat.mean(Garray), 
				STDEVG: jStat.stdev(Garray),
				RANGE_G: jStat.range(Garray),
				SKEWG: jStat.skewness(Garray),
				KURTOSISG: jStat.kurtosis(Garray),
				CV_G: jStat.coeffvar(Garray),

				MEANB: jStat.mean(Barray),
				STDEVB: jStat.stdev(Barray),
				RANGE_B: jStat.range(Barray),
				SKEWB: jStat.skewness(Barray),
				KURTOSISB: jStat.kurtosis(Barray),
				CV_B: jStat.coeffvar(Barray),

				ENERGY: energy(coOcurrence),
				ENTROPY: entropy(coOcurrence),
				CONTRAST: contrast(coOcurrence),

				CLASS: $clase.value
			});

			if($clase.value == "1")
				fuego ++;
			else if($clase.value == "0")
				humo ++;
			else if($clase.value == "-1")
				nada ++;

			$clases.innerHTML = `
				Fuego: ${fuego}&nbsp;&nbsp;
				Humo: ${humo}&nbsp;&nbsp;
				Nada: ${nada}&nbsp;&nbsp;
			`;
			
			$features.innerHTML = `RED layer<br>mean = ${jStat.mean(Rarray)}<br>stdev = ${jStat.stdev(Rarray)}<br>range = ${jStat.range(Rarray)}<br>skewness = ${jStat.skewness(Rarray)}<br>kurtosis = ${jStat.kurtosis(Rarray)}<br>coeffvar = ${jStat.coeffvar(Rarray)}<br>energy = ${energy(coOcurrence)}<br>entropy = ${entropy(coOcurrence)}<br>contrast = ${contrast(coOcurrence)}`;

			Rarray = [];
			Garray = [];
			Barray = [];

		}
	});



	const preview = () => {
		let gray = 0;
		let arrAux = [];
		grayScale = jStat.zeros(parseInt($grid.value));
		imgData2 = $ctx2.createImageData(parseInt($grid.value),parseInt($grid.value));
		for (let i = 0; i < imgData2.data.length; i += 4) {

		  imgData2.data[i + 0] = section[i + 0];
		  imgData2.data[i + 1] = section[i + 1];
	 		imgData2.data[i + 2] = section[i + 2];
  		imgData2.data[i + 3] = 255;

			Rarray.push(section[i + 0]);
			Garray.push(section[i + 1]);
			Barray.push(section[i + 2]);

			gray = 0.33*section[i]+0.5*section[i+1]+0.15*section[i+2];
			arrAux.push(Math.round(gray * 10) / 10);

			if(((i/4)+1) % parseInt($grid.value) == 0 ){

				for(let j = 0; j < parseInt($grid.value); j++)
					grayScale[(((i/4)+1) / parseInt($grid.value))-1][j]=arrAux[j];

				arrAux = [];
			}
		}
		$ctx2.putImageData(imgData2, 120, 0);

	}

	const gridupdate = () => {
				$ctx.beginPath();
				for(let i = 0; i < img.width; i+=parseInt($grid.value)){
					$ctx.moveTo(i, 0);
					$ctx.lineTo(i,img.height);
				}
				for(let i = 0; i < img.height; i+=parseInt($grid.value)){
					$ctx.moveTo(0, i);
					$ctx.lineTo(img.width,i);
				}
    		$ctx.stroke();	

	};


	$gblur.addEventListener("change", (e) => {
		e.preventDefault();
			$ctx.drawImage($canvas4,0,0);
			gridupdate();
			$ctx3.drawImage($canvas4,0,0);
		if(parseInt($gblur.value) > 0 && parseInt($gblur.value) < 10){
			gBlur(parseInt($gblur.value),$canvas3,$ctx);
			gridupdate();
			gBlur(parseInt($gblur.value),$canvas3,$ctx3);
		}
	});



}





