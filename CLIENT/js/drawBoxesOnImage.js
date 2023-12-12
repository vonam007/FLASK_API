export async function drawBoxesOnImage(fileJson) {
  const input = document.getElementById("image-input");
  const img = document.getElementById("input-img");
  const canvas = document.getElementById("output-canvas");
  const ctx = canvas.getContext("2d");

  const file = input.files[0];
  const reader = new FileReader();

  //reader.onload = function () {
    img.src = reader.result;

    // Wait for the image to load before processing
    //img.onload = function () {
      // Đọc file JSON từ API (điều này giả định rằng bạn đã có một cách để lấy dữ liệu từ API)
      const jsonData = fileJson;
      console.log("Got JSON data from API:");
      console.log(jsonData);
      // Vẽ hình ảnh lên canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


      jsonData.forEach(function (item) {
        let label = item.label;
        let score = item.score;
        let box = item.box;

        // Vẽ hộp quanh vật thể
        ctx.beginPath();
        ctx.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.stroke();
        ctx.fill();

        // Hiển thị thông tin nhãn và điểm số
        ctx.font = '14px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(label + " " + score.toFixed(2), box[0], box[1] - 5);
      });
    //};

    if (file) {
      reader.readAsDataURL(file);
    }
  //}
}
