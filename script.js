// Map wavelength (nm) to RGB
function wavelengthToRGB(wavelength) {
  let R = 0, G = 0, B = 0, factor = 0;

  if (wavelength < 380 || wavelength > 780) {
    // Return gray for out-of-range
    return "rgb(128,128,128)";
  }

  if (wavelength >= 380 && wavelength < 440) {
    R = -(wavelength - 440) / (440 - 380);
    G = 0.0;
    B = 1.0;
  } else if (wavelength < 490) {
    R = 0.0;
    G = (wavelength - 440) / (490 - 440);
    B = 1.0;
  } else if (wavelength < 510) {
    R = 0.0;
    G = 1.0;
    B = -(wavelength - 510) / (510 - 490);
  } else if (wavelength < 580) {
    R = (wavelength - 510) / (580 - 510);
    G = 1.0;
    B = 0.0;
  } else if (wavelength < 645) {
    R = 1.0;
    G = -(wavelength - 645) / (645 - 580);
    B = 0.0;
  } else { // (wavelength <= 780)
    R = 1.0;
    G = 0.0;
    B = 0.0;
  }

  // Intensity correction
  if (wavelength < 420) factor = 0.3 + 0.7 * (wavelength - 380) / 40;
  else if (wavelength > 700) factor = 0.3 + 0.7 * (780 - wavelength) / 80;
  else factor = 1.0;

  // Clamp and round
  R = Math.max(0, Math.min(255, Math.round(R * factor * 255)));
  G = Math.max(0, Math.min(255, Math.round(G * factor * 255)));
  B = Math.max(0, Math.min(255, Math.round(B * factor * 255)));

  return `rgb(${R},${G},${B})`;
}

// Standard emission lines for each gas (in nm)
const GAS_LINES = {
  "He": "447 468 471 492 501 504 587 667 706",
  "Ne": "540 585 588 594 609 626 640 650 659",
  "Ar": "696 705 714 763 772 811 842 912",
  "Kr": "427 436 557 587 747 811 826 877",
  "Xe": "462 467 484 497 529 541 753 882"
};

// Fills the comparison input with standard wavelengths for the gas
function fillComparison(gas) {
  document.getElementById("input2").value = GAS_LINES[gas] || "";
}

// Draw spectrum lines from both inputs on separate canvases
function plotSpectrum() {
  const canvas1 = document.getElementById("spectrum1");
  const ctx1 = canvas1.getContext("2d");
  ctx1.fillStyle = "black";
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

  const canvas2 = document.getElementById("spectrum2");
  const ctx2 = canvas2.getContext("2d");
  ctx2.fillStyle = "black";
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

  const minWL = 390, maxWL = 745;

  const wavelengths1 = document.getElementById("input1").value
    .trim()
    .split(/\s+/)
    .map(Number)
    .filter(x => !isNaN(x));

  const wavelengths2 = document.getElementById("input2").value
    .trim()
    .split(/\s+/)
    .map(Number)
    .filter(x => !isNaN(x));

  wavelengths1.forEach((wl) => {
    if (wl < minWL || wl > maxWL) return;
    const x = ((wl - minWL) / (maxWL - minWL)) * canvas1.width;
    const color = wavelengthToRGB(wl);
    ctx1.strokeStyle = color;
    ctx1.lineWidth = 3;
    ctx1.beginPath();
    ctx1.moveTo(x, 0);
    ctx1.lineTo(x, canvas1.height);
    ctx1.stroke();
  });

  wavelengths2.forEach((wl) => {
    if (wl < minWL || wl > maxWL) return;
    const x = ((wl - minWL) / (maxWL - minWL)) * canvas2.width;
    const color = wavelengthToRGB(wl);
    ctx2.strokeStyle = color;
    ctx2.lineWidth = 3;
    ctx2.beginPath();
    ctx2.moveTo(x, 0);
    ctx2.lineTo(x, canvas2.height);
    ctx2.stroke();
  });
}
