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
        1: [(253, 182) ], 
        2: [(253, 212) ],
        3: [(253, 242) ],
        4: [(253, 272) ],
        5: [(253, 302) ],
        6: [(253, 332) ],
        7: [(253, 362) ],
        8: [(253, 392) ],
        9: [(253, 422) ],
        10: [(253, 452) ],
        11: [(253, 482) ],
        12: [(253, 512) ],

        13: [(613, 182) ],
        14: [(613, 212) ],
        15: [(613, 242) ],
        16: [(613, 272) ],
        17: [(613, 302) ],
        18: [(613, 332) ],
        19: [(613, 362) ],
        20: [(613, 392) ],
        21: [(613, 422) ],
        22: [(613, 452) ],
        23: [(613, 482) ],
        24: [(613, 512) ],

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
