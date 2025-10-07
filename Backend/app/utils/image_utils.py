from PIL import Image
import numpy as np
import io

def preprocess_image(image_file):
    """
    Preprocesses an image file for the brain tumor model.
    Args:
        image_file: The image file in bytes.
    Returns:
        A preprocessed numpy array ready for model prediction.
    """
    img = Image.open(io.BytesIO(image_file))
    img = img.resize((299, 299))
    img_array = np.array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return img_array
