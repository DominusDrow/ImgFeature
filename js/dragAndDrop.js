const d = document;
import  arrayObjToCsv  from './generateCsv.js';

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

	const $panel = d.querySelector(panel);
	const $btnDownload = d.querySelector(".btn-63");
	const $grid = $panel.querySelector("#tentacles");
	const $clase = $panel.querySelector("#clase");
	const $features = $panel.querySelector(".features");

	const img = new Image();
	let fileurl = null; 
	let file;
	let mousePos = {x:0,y:0};
	let ClientRect = null;
	let myImageData = null;
	let section = null;

	let Rarray = [];
	let Garray = [];
	let Barray = [];

	let arrCSV = [];

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
			img.onload = () => {
				$canvas.width = img.width;
				$canvas.height = img.height;
				$ctx.drawImage(img,0,0);

				$canvas3.width = img.width;
				$canvas3.height = img.height;
				$ctx3.drawImage(img,0,0);

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
			}
			img.src = fileurl;
	}

	$btnQuit.addEventListener("click", (e) => {
		e.preventDefault();
		$dropArea.classList.remove("hidden");
		$canvas.classList.add("hidden");
		$btnQuit.classList.add("hidden");
	});

	d.addEventListener("click", e => {
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

			console.log(jStat.mean(Rarray));
			
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

				CLASS: $clase.value
			});
			
			$features.innerHTML = `RED layer<br>mean = ${jStat.mean(Rarray)}<br>stdev = ${jStat.stdev(Rarray)}<br>range = ${jStat.range(Rarray)}<br>skewness = ${jStat.skewness(Rarray)}<br>kurtosis = ${jStat.kurtosis(Rarray)}<br>coeffvar = ${jStat.coeffvar(Rarray)}`;

			Rarray = [];
			Garray = [];
			Barray = [];

		}
	});



	const preview = () => {
		let imgData2 = $ctx2.createImageData(parseInt($grid.value),parseInt($grid.value));
		for (let i = 0; i < imgData2.data.length; i += 4) {
		  imgData2.data[i + 0] = section[i + 0];
		  imgData2.data[i + 1] = section[i + 1];
	 		imgData2.data[i + 2] = section[i + 2];
  		imgData2.data[i + 3] = 255;

			Rarray.push(section[i + 0]);
			Garray.push(section[i + 1]);
			Barray.push(section[i + 2]);
		}
		$ctx2.putImageData(imgData2, 120, 0);
	}


}





