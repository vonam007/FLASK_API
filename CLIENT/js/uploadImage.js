import { drawBoxesOnImage } from "./drawBoxesOnImage.js";


export const handleImageUpload = () => {
  const input = document.getElementById("image-input");
  const img = document.getElementById("input-img");
  const canvas = document.getElementById("output-canvas");

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    img.src = reader.result;

    // Wait for the image to load before processing
    img.onload = function () {
      // Convert image to base64 string
      canvas.width = 800;

      // Tính tỉ lệ khung hình ảnh để đặt chiều dài tự động
      const aspectRatio = img.width / img.height;
      canvas.height = canvas.width / aspectRatio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      console.log("img img");
      const base64Image = canvas.toDataURL("image/png");
      const base64ImageWithoutHeader = base64Image.split(',')[1];
      // Send image to Flask API
      sendImageToAPI(base64ImageWithoutHeader);
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function sendImageToAPI(base64Image) {
  const BASE = "http://127.0.0.1:5000"; // Replace with your Flask API URL

  const apiUrl = BASE + "/process_image"; // Replace with your Flask API endpoint

  const data = {
    image: base64Image,
  };


  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Sử dụng hàm isJSON để kiểm tra



  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      
      if (isJSON(response)) {
        console.log("Response is a valid JSON.");
        const jsonResponse = JSON.parse(response);
        console.log(jsonResponse);
        // Process the response as needed
        drawBoxesOnImage(jsonResponse);
      } else {
        console.log("Response is not a valid JSON.");
        console.log(response);
      }

    }
  };

  const jsonData = JSON.stringify(data);
  xhr.send(jsonData);
}
