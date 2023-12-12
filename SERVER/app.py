from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io

from model import prepareModel, predict

app = Flask(__name__)

processor, model  = prepareModel()

CORS(app)

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        # Nhận ảnh từ client
        data = request.get_json()
        image_base64 = data['image']

        # Chuyển đổi base64 string thành hình ảnh
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data))
        image = image.convert('RGB')
        # Xử lý ảnh - ví dụ: chuyển đổi sang grayscale
        prediction = predict(processor, model, image)
        # Tạo JSON response
        #response_data = {'message': 'Image processed successfully'}
        response_data = prediction

        # # Convert hình ảnh đã xử lý thành base64 để chuyển đi
        # buffered = io.BytesIO()
        # image.save(buffered, format="PNG")
        # img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        # response_data['processed_image'] = img_str

        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
