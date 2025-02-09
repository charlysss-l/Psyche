# step 1: user will upload an image and store it in firebase with a URL file name (OMRCamera.tsx)
# step 2: user will send a request to the backend to process the image (OMRCamera.tsx)
# step 3: backend will download the URL image and process it (app.py)
# step 4: backend will return the score to the localhost named http://127.0.0.1:5000/process_omr (app.py)
# step 5: frontend will fetch the score from the same localhost (OMRCamera.tsx)
# step 6: frontend will display the score (OMRCamera.tsx)



import requests
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def detect_and_crop_sheet(image):
    # Convert image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur and edge detection
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 75, 200)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest contour which should be the outline of the sheet
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
    sheet_contour = None
    for contour in contours:
        # Approximate the contour to get a 4-point boundary
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        if len(approx) == 4:
            sheet_contour = approx
            break
    
    if sheet_contour is None:
        raise ValueError("Unable to detect answer sheet boundaries.")
    
    # Get a top-down view of the sheet by applying a perspective transform
    pts = sheet_contour.reshape(4, 2)
    rect = np.zeros((4, 2), dtype="float32")
    
    # Order points: top-left, top-right, bottom-right, bottom-left
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    
    (tl, tr, br, bl) = rect
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))
    
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")
    
    # Perform the perspective transform to get a cropped and aligned sheet
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    
    return warped


import cv2
import numpy as np

def omr_processing(image):
    image = detect_and_crop_sheet(image)
    
    # Resize cropped image to match the expected sheet dimensions
    image = cv2.resize(image, (1000, 1400))
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply binary threshold to make the paper white and answers black
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # Define the grid positions for the answer bubbles
    answer_bubbles = {
        1: [(185, 224), (222, 224), (259, 224), (295, 224), (333, 224), (370, 224)], 
        2: [(185, 262), (222, 262), (259, 262), (295, 262), (333, 262), (370, 262)],
        3: [(185, 297), (222, 297), (259, 297), (295, 297), (333, 297), (370, 296)],
        4: [(185, 334), (222, 334), (259, 334), (295, 334), (333, 334), (370, 334)],
        5: [(186, 369), (223, 369), (260, 369), (297, 369), (334, 369), (371, 369)],
        6: [(186, 407), (223, 407), (260, 407), (297, 407), (334, 407), (371, 407)],
        7: [(186, 444), (223, 444), (260, 444), (297, 444), (334, 444), (371, 444)],
        8: [(186, 481), (223, 481), (260, 481), (297, 481), (334, 481), (371, 481)],
        9: [(186, 518), (223, 518), (260, 518), (297, 518), (334, 518), (371, 518)],
        10: [(186, 555), (223, 555), (260, 555), (297, 555), (334, 555), (371, 555)],
        11: [(186, 590), (223, 590), (260, 590), (297, 590), (334, 590), (371, 590)],
        12: [(186, 628), (223, 628), (260, 628), (297, 628), (334, 628), (371, 628)],
        13: [(186, 666), (223, 666), (260, 666), (297, 666), (334, 666), (371, 666)],

        14: [(650, 224), (687, 224), (724, 224), (761, 224), (798, 224)],
        15: [(650, 262), (687, 262), (724, 262), (761, 262), (798, 262)],
        16: [(650, 297), (687, 297), (724, 297), (761, 297), (798, 297)],
        17: [(650, 334), (687, 334), (724, 334), (761, 334), (798, 334)],
        18: [(652, 369), (689, 369), (726, 369), (763, 369), (800, 369)],
        19: [(652, 407), (689, 407), (726, 407), (763, 407), (800, 407)],
        20: [(652, 444), (689, 444), (726, 444), (763, 444), (800, 444)],
        21: [(652, 481), (689, 481), (726, 481), (763, 481), (800, 481)],
        22: [(652, 518), (689, 518), (726, 518), (763, 518), (800, 518)],
        23: [(652, 555), (689, 555), (726, 555), (763, 555), (800, 555)],
        24: [(652, 590), (689, 590), (726, 590), (763, 590), (800, 590)],
        25: [(652, 628), (689, 628), (726, 628), (763, 628), (800, 628)],
        26: [(652, 666), (689, 666), (726, 666), (763, 666), (800, 666)],
        27: [(653, 702), (690, 702), (727, 702), (764, 702), (801, 702)],

        28: [(185, 855), (222, 855), (259, 855), (295, 855), (333, 855), (370, 855)],
        29: [(185, 892), (222, 892), (259, 892), (295, 892), (333, 892), (370, 892)],
        30: [(185, 928), (222, 928), (259, 928), (295, 928), (333, 928), (370, 928)],
        31: [(185, 965), (222, 965), (259, 965), (295, 965), (333, 965), (370, 965)],
        32: [(186, 1000), (223, 1000), (260, 1000), (297, 1000), (334, 1000), (371, 1000)],
        33: [(186, 1037), (223, 1037), (260, 1037), (297, 1037), (334, 1037), (371, 1037)],
        34: [(186, 1074), (223, 1074), (260, 1074), (297, 1074), (334, 1074), (371, 1074)],
        35: [(186, 1111), (223, 1111), (260, 1111), (297, 1111), (334, 1111), (371, 1111)],
        36: [(186, 1148), (223, 1148), (260, 1148), (297, 1148), (334, 1148), (371, 1148)],
        37: [(186, 1185), (223, 1185), (260, 1185), (297, 1185), (334, 1185), (371, 1185)],
        38: [(186, 1220), (223, 1220), (260, 1220), (297, 1220), (334, 1220), (371, 1220)],
        39: [(186, 1258), (223, 1258), (260, 1258), (297, 1258), (334, 1258), (371, 1258)],
        40: [(186, 1296), (223, 1296), (260, 1296), (297, 1296), (334, 1296), (371, 1296)],

        41: [(650, 855), (687, 855), (724, 855), (761, 855), (798, 855)],
        42: [(650, 892), (687, 892), (724, 892), (761, 892), (798, 892)],
        43: [(650, 928), (687, 928), (724, 928), (761, 928), (798, 928)],
        44: [(650, 965), (687, 965), (724, 965), (761, 965), (798, 965)],
        45: [(652, 1000), (689, 1000), (726, 1000), (763, 1000), (800, 1000)],
        46: [(652, 1037), (689, 1037), (726, 1037), (763, 1037), (800, 1037)],
        47: [(652, 1074), (689, 1074), (726, 1074), (763, 1074), (800, 1074)],
        48: [(652, 1111), (689, 1111), (726, 1111), (763, 1111), (800, 1111)],
        49: [(652, 1148), (689, 1148), (726, 1148), (763, 1148), (800, 1148)],
        50: [(652, 1185), (689, 1185), (726, 1185), (763, 1185), (800, 1185)],



    }

    # Correct answer key
    answer_key = {
        1: ['B'],  
        2: ['C'], 
        3: ['B'], 
        4: ['D'], 
        5: ['E'],
        6: ['B'],
        7: ['D'],
        8: ['B'],
        9: ['F'],
        10: ['C'],
        11: ['B'],
        12: ['B'],
        13: ['E'],

        14: ['B', 'E'],  
        15: ['A', 'E'], 
        16: ['A', 'D'], 
        17: ['C', 'E'], 
        18: ['B', 'E'],
        19: ['A', 'D'],
        20: ['B', 'E'],
        21: ['B', 'E'],
        22: ['A', 'D'],
        23: ['B', 'D'],
        24: ['A', 'E'],
        25: ['C', 'D'],
        26: ['B', 'C'],
        27: ['A', 'B'],

        28: ['E'],  
        29: ['E'], 
        30: ['E'], 
        31: ['B'], 
        32: ['C'],
        33: ['D'],
        34: ['E'],
        35: ['E'],
        36: ['A'],
        37: ['A'],
        38: ['F'],
        39: ['C'],
        40: ['C'],
        
        41: ['B'],
        42: ['A'],
        43: ['D'],
        44: ['D'],
        45: ['A'],
        46: ['B'],
        47: ['C'],
        48: ['D'],
        49: ['A'],
        50: ['D'],


    }

    marked_answers = {}

    # Process each question
    for question, bubbles in answer_bubbles.items():
        print(f"Processing Question {question} with bubbles {bubbles}")  # Debugging print
        
        marked_choices = []
        
        for i, (x, y) in enumerate(bubbles):
            # Draw rectangles on the image to visualize bubble positions
            cv2.circle(image, (x, y), 14, (255, 0, 0), 2)  # Blue circle
            
            # Extract region of interest (ROI) for each bubble
            roi = thresh[y-20:y+20, x-20:x+20]  
            
            # Check if the ROI is filled (marked)
            filled = cv2.countNonZero(roi)
            if filled > 500:  # Threshold for considering it marked
                marked_choices.append(chr(65 + i))  # Convert index to letter (A-F)
                cv2.putText(image, "Marked", (x - 40, y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Store marked answers
        marked_answers[question] = marked_choices

        # Now draw the correct answer with a red circle for visualization
        for correct in answer_key[question]:
            correct_index = ord(correct) - 65
            correct_x, correct_y = bubbles[correct_index]
            cv2.circle(image, (correct_x, correct_y), 15, (0, 0, 255), 2)  # Red circle for correct answer

    # Calculate the score
    correct_answers = 0
    for question, marked in marked_answers.items():
        correct_set = set(answer_key[question])  # Convert correct answer list to a set
        marked_set = set(marked)  # Convert marked answers to a set
        
        # if question >= 14 and question <= 27 :  # Require exactly 2 answers
        #     if len(marked_set) == 2 and marked_set == correct_set:
        #         correct_answers += 1
        # else:  # Require exactly 1 answer
        #     if len(marked_set) == 1 and marked_set == correct_set:
        #         correct_answers += 1

        # Check if the marked answers match the correct answers
        if marked_set == correct_set:
            correct_answers += 1

    # Save the debug image
    cv2.imwrite('marked_answer_sheet_updated.png', image)
    
    return correct_answers


@app.route('/process_omr_CF', methods=['POST'])
def process_omr():
    
    
    # Get the image URL from the incoming request
    image_url = request.json.get('image_url')
    
    # Get image data from URL (in memory, no saving to disk)
    img_data = requests.get(image_url).content
    # Check if we received the image
    if not img_data:
        return jsonify({'error': 'Failed to fetch image'}), 500
    
    image = np.asarray(bytearray(img_data), dtype=np.uint8)
    img = cv2.imdecode(image, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Failed to decode image'}), 500
    
    if img.shape[0] < 100 or img.shape[1] < 100:
        return jsonify({'error': 'Image too small to process'}), 400


    # Process the image to calculate the score
    score = omr_processing(img)
    

    # Return the score as a JSON response
    return jsonify({'score': score}) 



if __name__ == '__main__':
    app.run(debug=True, port=5002)