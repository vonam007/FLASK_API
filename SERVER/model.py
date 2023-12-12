from transformers import DetrImageProcessor, DetrForObjectDetection
import torch
from PIL import Image
import requests
import json

# url = "IMG_5852.JPG"
# image = Image.open(requests.get(url, stream=True).raw)

# url = "IMG_5852.JPG"
# image = Image.open(url)

def prepareModel():
        # you can specify the revision tag if you don't want the timm dependency
        processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
        model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
        return processor, model

def predict(processor, model, image):
        
        inputs = processor(images=image, return_tensors="pt")
        outputs = model(**inputs)

        # convert outputs (bounding boxes and class logits) to COCO API
        # let's only keep detections with score > 0.9

        target_sizes = torch.tensor([image.size[::-1]])
        results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.9)[0]

        # Khởi tạo một danh sách để chứa các đối tượng JSON
        results_list = []

        for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
                box = [round(i, 2) for i in box.tolist()]
                result_item = {
                        "label": model.config.id2label[label.item()],
                        "score": round(score.item(), 3),
                        "box": box
                }
                # Thêm đối tượng JSON vào danh sách
                results_list.append(result_item)
        

        # Chuyển đổi danh sách thành định dạng JSON
        json_results = json.dumps(results_list)
        return json_results
