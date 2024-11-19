# step 1: user will upload an image and store it in firebase with a URL file name (OMRCamera.tsx)
# step 2: user will send a request to the backend to process the image (OMRCamera.tsx)
# step 3: backend will download the URL image and process it (app.py)
# step 4: backend will return the score to the localhost named http://127.0.0.1:5000/process_omr (app.py)
# step 5: frontend will fetch the score from the same localhost (OMRCamera.tsx)
# step 6: frontend will display the score (OMRCamera.tsx)



from io import BytesIO
import requests
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def omr_processing(image):
    # Resize image if needed (adjust size based on your sheet size)
    image = cv2.resize(image, (1000, 1400))  # Adjust size as per your sheet
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply binary threshold to make the paper white and answers black
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # Define the grid positions for the answer bubbles
    answer_bubbles = {
        1: [(253, 182), (283, 182), (313, 182), (342, 182), (371, 182), (400, 182) ], 
        2: [(253, 212), (283, 212), (313, 212), (342, 212), (371, 212), (400, 212) ],
        3: [(253, 240), (283, 240), (313, 240), (342, 240), (371, 240), (400, 240) ],
        4: [(253, 270), (283, 270), (313, 270), (342, 270), (371, 270), (400, 270) ],
        5: [(254, 297), (283, 297), (313, 297), (342, 297), (371, 297), (400, 297) ],
        6: [(255, 327), (284, 327), (314, 327), (343, 327), (372, 327), (401, 327) ],
        7: [(254, 357), (283, 357), (313, 357), (342, 357), (371, 357), (400, 357) ],
        8: [(255, 387), (284, 387), (314, 387), (343, 387), (372, 387), (401, 387) ],
        9: [(255, 415), (284, 415), (314, 415), (343, 415), (372, 415), (401, 415) ],
        10: [(255, 444), (284, 444), (314, 444), (343, 444), (372, 444), (401, 444) ],
        11: [(255, 471), (284, 471), (314, 471), (343, 471), (372, 471), (401, 471) ],
        12: [(255, 501), (284, 501), (314, 501), (343, 501), (372, 501), (401, 501) ],

        13: [(614, 185), (644, 185), (674, 185), (702, 185), (732, 185), (760, 185) ],
        14: [(615, 214), (645, 214), (674, 214), (703, 214), (732, 214), (761, 214) ],
        15: [(614, 242), (644, 242), (674, 242), (702, 242), (732, 242), (760, 242) ],
        16: [(615, 272), (645, 272), (675, 272), (703, 272), (733, 272), (761, 272) ],
        17: [(616, 299), (646, 299), (676, 299), (704, 299), (734, 299), (762, 299) ],
        18: [(616, 330), (646, 330), (676, 330), (704, 330), (734, 330), (762, 330) ],
        19: [(616, 359), (646, 359), (676, 359), (704, 359), (734, 359), (762, 359) ],
        20: [(616, 389), (646, 389), (676, 389), (704, 389), (734, 389), (762, 389) ],
        21: [(616, 416), (646, 416), (676, 416), (704, 416), (734, 416), (762, 416) ],
        22: [(616, 446), (646, 446), (676, 446), (704, 446), (734, 446), (762, 446) ],
        23: [(616, 473), (646, 473), (676, 473), (704, 473), (734, 473), (762, 473) ],
        24: [(616, 503), (646, 503), (676, 503), (704, 503), (734, 503), (762, 503) ],

        25: [(103, 742) ],
        26: [(103, 772) ],
        27: [(103, 802) ],
        28: [(103, 832) ],
        29: [(103, 862) ],
        30: [(103, 892) ],
        31: [(103, 922) ],
        32: [(103, 952) ],
        33: [(103, 982) ],
        34: [(103, 1012) ],
        35: [(103, 1042) ],
        36: [(103, 1072) ],

        37: [(403, 742) ],
        38: [(403, 772) ],
        39: [(403, 802) ],
        40: [(403, 832) ],
        41: [(403, 862) ],
        42: [(403, 892) ],
        43: [(403, 922) ],
        44: [(403, 952) ],
        45: [(403, 982) ],
        46: [(403, 1012) ],
        47: [(403, 1042) ],
        48: [(403, 1072) ],

        49: [(713, 742) ],
        50: [(713, 772) ],
        51: [(713, 802) ],
        52: [(713, 832) ],
        53: [(713, 862) ],
        54: [(713, 892) ],
        55: [(713, 922) ],
        56: [(713, 952) ],
        57: [(713, 982) ],
        58: [(713, 1012) ],
        59: [(713, 1042) ],
        60: [(713, 1072) ]
        
        
       
    }

    # Correct answer key
    answer_key = {1: 'A', 2: 'A', 3: 'A', 4: 'A', 5: 'A', 6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'A', 11: 'A', 12: 'A',
        13: 'A', 14: 'A', 15: 'A', 16: 'A', 17: 'A', 18: 'A', 19: 'A', 20: 'A', 21: 'A', 22: 'A', 23: 'A', 24: 'A',
        25: 'A', 26: 'A', 27: 'A', 28: 'A', 29: 'A', 30: 'A', 31: 'A', 32: 'A', 33: 'A', 34: 'A', 35: 'A', 36: 'A',
        37: 'A', 38: 'A', 39: 'A', 40: 'A', 41: 'A', 42: 'A', 43: 'A', 44: 'A', 45: 'A', 46: 'A', 47: 'A', 48: 'A',
        49: 'A', 50: 'A', 51: 'A', 52: 'A', 53: 'A', 54: 'A', 55: 'A', 56: 'A', 57: 'A', 58: 'A', 59: 'A', 60: 'A'}
    
    marked_answers = {}
    
    # Visualize detection for debugging
    for question, bubbles in answer_bubbles.items():
        print(f"Processing Question {question} with bubbles {bubbles}")  # Debugging print
        for i, (x, y) in enumerate(bubbles):
            # Draw rectangles on the image to visualize bubble positions
            cv2.circle(image, (x, y), 11, (255, 0, 0), 2)  # Blue circle with radius 20
            
            # Extract region of interest (ROI) for each bubble
            roi = thresh[y-20:y+20, x-20:x+20]  # Small region around the bubble
            
            # Check if the ROI is filled (marked)
            filled = cv2.countNonZero(roi)
            if filled > 500:  # Threshold for considering it marked
                marked_answers[question] = chr(65 + i)  # 'A' is 65 in ASCII, 'B' is 66, etc.
                cv2.putText(image, "Marked", (x - 40, y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Now draw the correct answer with a green box for visualization
        correct_answer = answer_key[question]
        correct_index = ord(correct_answer) - 65  # Convert 'A', 'B', 'C', 'D' to index 0, 1, 2, 3
        correct_x, correct_y = bubbles[correct_index]
        # cv2.circle(image, (correct_x, correct_y), 11, (0, 0, 255), 2)  # red circle for correct answer
        # cv2.putText(image, "Correct", (correct_x - 40, correct_y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Calculate the score
    correct_answers = 0
    for question, marked in marked_answers.items():
        if marked == answer_key[question]:
            correct_answers += 1
    
    # Save the debug image with marked areas and correct answers
    cv2.imwrite('marked_answer_sheet_updated.png', image)  # Save updated image with green boxes for correct answers
    
    return correct_answers

@app.route('/process_omr', methods=['POST'])
def process_omr():
    # Get the image URL from the incoming request
    image_url = request.json.get('image_url')
    
    # Get image data from URL (in memory, no saving to disk)
    img_data = requests.get(image_url).content
    image = np.asarray(bytearray(img_data), dtype=np.uint8)
    img = cv2.imdecode(image, cv2.IMREAD_COLOR)

    # Process the image to calculate the score
    score = omr_processing(img)

    # Return the score as a JSON response
    return jsonify({'score': score})

if __name__ == '__main__':
    app.run(debug=True)
