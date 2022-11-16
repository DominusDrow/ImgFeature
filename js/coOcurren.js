//funtion that returns the co-occurrence matrix of a given array

export default function coOcurren (m,l,A,scale) {
	let glcm = jStat.zeros(scale);
  let d = m.length;

	for (let i = 0; i < scale; i++) {
		for (let j = 0; j < scale; j++) {
			for (let x = 0; x < d; x++) {
				for (let y = 0; y < d; y++) {
					if(A == 0){
						if(y+l < d && m[x][y] == i && m[x][y+l] == j){
							glcm[i][j] += 1;
						}
					}
					else if(A == 45){
						if(0 <= x-l && y+l < d && m[x][y] == i && m[x-l][y+l] == j){
							glcm[i][j] += 1;
						}
					}
					else if(A == 90){
						if(x+l < d && m[x][y] == i && m[x+l][y] == j){
							glcm[i][j] += 1;
						}
					}
					else if(A == 135){
						if(0 <= x-l && 0 < y-l  && y-l < d && m[x][y] == i && m[x-l][y-l] == j){
							glcm[i][j] += 1;
						}
					}
				}
			}
		}
	}
	return glcm;
}

//function that returns the maximum value of a given array

export function max (m) {
	let max = 0;
	let d = m.length;

	for (let i = 0; i < d; i++) {
		for (let j = 0; j < d; j++) {
			if(m[i][j] > max){
				max = m[i][j];
			}
		}
	}
	return max;
}

//funtion that returns the energy of a given co occurrence matrix

export function energy (m) {
	let energy = 0;
	let d = m.length;

	for (let i = 0; i < d; i++) {
		for (let j = 0; j < d; j++) {
			energy += Math.pow(m[i][j],2);
		}
	}
	return energy;
}

//funtion that returns the entropy of a given co occurrence matrix

export function entropy (m) {
	let entropy = 0;
	let d = m.length;

	for (let i = 0; i < d; i++) {
		for (let j = 0; j < d; j++) {
			if(m[i][j] != 0){
				entropy += m[i][j]*Math.log(m[i][j]);
			}
		}
	}
	return -entropy;
}

//funtion that returns the contrast of a given co occurrence matrix

export function contrast (m) {
	let contrast = 0;
	let d = m.length;

	for (let i = 0; i < d; i++) {
		for (let j = 0; j < d; j++) {
			contrast += Math.pow(i-j,2)*m[i][j];
		}
	}
	return contrast;
}

