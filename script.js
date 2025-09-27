// Map wavelength (nm) to RGB
// Adapted from Dan Bruton’s "Spectral Colors" approximation
function wavelengthToRGB(wavelength) {
  let R=0, G=0, B=0, factor=0;

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
  } else if (wavelength <= 780) {
    R = 1.0;
    G = 0.0;
    B = 0.0;
  }

  // Intensity factor near vision limits
  if (wavelength < 420) factor = 0.3 + 0.7*(wavelength - 380) / (40);
  else if (wavelength > 700) factor = 0.3 + 0.7*(780 - wavelength) / (80);
  else factor = 1.0;

  R = Math.round(R * factor * 255);
  G = Math.round(G * factor * 255);
  B = Math.round(B * factor * 255);

  return `rgb(${R},${G},${B})`;
}

// Draw spectrum lines
function plotSpectrum() {
  const canvas = document.getElementById("spectrum");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const input = document.getElementById("input").value;
  const wavelengths = input.split(" ").map(Number);

  const minWL = 390, maxWL = 745;

  wavelengths.forEach((wl) => {
    if (wl < minWL || wl > maxWL) return; // skip out-of-range
    // Map wavelength → x-position
    const x = ((wl - minWL) / (maxWL - minWL)) * canvas.width;
    const color = wavelengthToRGB(wl);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  });
}
