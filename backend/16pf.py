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
        1: [(100, 130) ], 
        2: [(100, 162) ],
        3: [(100, 194) ],
        4: [(100, 226) ],
        5: [(100, 258) ],
        6: [(100, 290) ],
        7: [(100, 322) ],
        8: [(100, 354) ],
        9: [(100, 386) ],
        10: [(100, 419) ],
        11: [(100, 451) ],
        12: [(100, 483) ],
        13: [(100, 515) ],
        14: [(100, 547) ],
        15: [(100, 579) ],
        16: [(100, 611) ],
        17: [(100, 643) ],
        18: [(100, 675) ],
        19: [(100, 707) ],
        20: [(100, 741) ],
        21: [(100, 774) ],
        22: [(100, 806) ],
        23: [(100, 838) ],
        24: [(100, 870) ],
        25: [(100, 902) ],
        26: [(100, 934) ],
        27: [(100, 966) ],
        28: [(100, 1000) ],
        29: [(100, 1032) ],
        30: [(100, 1064) ],
        31: [(100, 1096) ],
        32: [(100, 1128) ],
        33: [(100, 1160) ],
        34: [(100, 1192) ],
        35: [(100, 1224) ],
        36: [(100, 1256) ],
        37: [(100, 1288) ],

        38: [(280, 130) ],
        39: [(280, 162) ],
        40: [(280, 194) ],
        41: [(280, 226) ],
        42: [(280, 258) ],
        43: [(280, 290) ],
        44: [(280, 322) ],
        45: [(280, 354) ],
        46: [(280, 386) ],
        47: [(280, 419) ],
        48: [(280, 451) ],
        49: [(280, 483) ],
        50: [(280, 515) ],
        51: [(280, 547) ],
        52: [(280, 579) ],
        53: [(280, 611) ],
        54: [(280, 643) ],
        55: [(280, 675) ],
        56: [(280, 707) ],
        57: [(280, 741) ],
        58: [(280, 774) ],
        59: [(280, 806) ],
        60: [(280, 838) ],
        61: [(280, 870) ],
        62: [(280, 902) ],
        63: [(280, 934) ],
        64: [(280, 966) ],
        65: [(280, 1000) ],
        66: [(280, 1032) ],
        67: [(280, 1064) ],
        68: [(280, 1096) ],
        69: [(280, 1128) ],
        70: [(280, 1160) ],
        71: [(280, 1192) ],
        72: [(280, 1224) ],
        73: [(280, 1256) ],
        74: [(280, 1288) ],

        75: [(462, 130) ],
        76: [(462, 162) ],
        77: [(462, 194) ],
        78: [(462, 226) ],
        79: [(462, 258) ],
        80: [(462, 290) ],
        81: [(462, 322) ],
        82: [(462, 354) ],
        83: [(462, 386) ],
        84: [(462, 419) ],
        85: [(462, 451) ],
        86: [(462, 483) ],
        87: [(462, 515) ],
        88: [(462, 547) ],
        89: [(462, 579) ],
        90: [(462, 611) ],
        91: [(462, 643) ],
        92: [(462, 675) ],
        93: [(462, 707) ],
        94: [(462, 741) ],
        95: [(462, 774) ],
        96: [(462, 806) ],
        97: [(462, 838) ],
        98: [(462, 870) ],
        99: [(462, 902) ],
        100: [(462, 934) ],
        101: [(462, 966) ],
        102: [(462, 1000) ],
        103: [(462, 1032) ],
        104: [(462, 1064) ],
        105: [(462, 1096) ],
        106: [(462, 1128) ],
        107: [(462, 1160) ],
        108: [(462, 1192) ],
        109: [(462, 1224) ],
        110: [(462, 1256) ],
        111: [(462, 1288) ],

        112: [(644, 130) ],
        113: [(644, 162) ],
        114: [(644, 194) ],
        115: [(644, 226) ],
        116: [(644, 258) ],
        117: [(644, 290) ],
        118: [(644, 322) ],
        119: [(644, 354) ],
        120: [(644, 386) ],
        121: [(644, 419) ],
        122: [(644, 451) ],
        123: [(644, 483) ],
        124: [(644, 515) ],
        125: [(644, 547) ],
        126: [(644, 579) ],
        127: [(644, 611) ],
        128: [(644, 643) ],
        129: [(644, 675) ],
        130: [(644, 707) ],
        131: [(644, 741) ],
        132: [(644, 774) ],
        133: [(644, 806) ],
        134: [(644, 838) ],
        135: [(644, 870) ],
        136: [(644, 902) ],
        137: [(644, 934) ],
        138: [(644, 966) ],
        139: [(644, 1000) ],
        140: [(644, 1032) ],
        141: [(644, 1064) ],
        142: [(644, 1096) ],
        143: [(644, 1128) ],
        144: [(644, 1160) ],
        145: [(644, 1192) ],
        146: [(644, 1224) ],
        147: [(644, 1256) ],
        148: [(644, 1288) ],

        149: [(826, 130) ],
        150: [(826, 162) ],
        151: [(826, 194) ],
        152: [(826, 226) ],
        153: [(826, 258) ],
        154: [(826, 290) ],
        155: [(826, 322) ],
        156: [(826, 354) ],
        157: [(826, 386) ],
        158: [(826, 419) ],
        159: [(826, 451) ],
        160: [(826, 483) ],
        161: [(826, 515) ],
        162: [(826, 547) ],
        163: [(826, 579) ],
        164: [(826, 611) ],
        165: [(826, 643) ],
        166: [(826, 675) ],
        167: [(826, 707) ],
        168: [(826, 741) ],
        169: [(826, 774) ],
        170: [(826, 806) ],
        171: [(826, 838) ],
        172: [(826, 870) ],
        173: [(826, 902) ],
        174: [(826, 934) ],
        175: [(826, 966) ],
        176: [(826, 1000) ],
        177: [(826, 1032) ],
        178: [(826, 1064) ],
        179: [(826, 1096) ],
        180: [(826, 1128) ],
        181: [(826, 1160) ],
        182: [(826, 1192) ],
        183: [(826, 1224) ],
        184: [(826, 1256) ],
        185: [(826, 1288) ],
        

        
       
    }

    # Correct answer key
    answer_key = {1: {'A':1}, 2: {'A':2}, 3: {'A': 1}, 4: {'A':2}, 5: {'A':1}, 6: {'A':2}, 7: {'A':1}, 8: {'A':2},
    9: {'A':1}, 10: {'A':2}, 11: {'A':1}, 12: {'A':2}, 13: {'A':1}, 14: {'A':2}, 15: {'A':1}, 16: {'A':2},
    17: {'A':1}, 18: {'A':2}, 19: {'A':1}, 20: {'A':2}, 21: {'A':1}, 22: {'A':2}, 23: {'A':1}, 24: {'A':2},
    25: {'A':1}, 26: {'A':2}, 27: {'A':1}, 28: {'A':2}, 29: {'A':1}, 30: {'A':2}, 31: {'A':1}, 32: {'A':2},
    33: {'A':1}, 34: {'A':2}, 35: {'A':1}, 36: {'A':2}, 37: {'A':1}, 38: {'A':2}, 39: {'A':1}, 40: {'A':2},
    41: {'A':1}, 42: {'A':2}, 43: {'A':1}, 44: {'A':2}, 45: {'A':1}, 46: {'A':2}, 47: {'A':1}, 48: {'A':2},
    49: {'A':1}, 50: {'A':2}, 51: {'A':1}, 52: {'A':2}, 53: {'A':1}, 54: {'A':2}, 55: {'A':1}, 56: {'A':2},
    57: {'A':1}, 58: {'A':2}, 59: {'A':1}, 60: {'A':2}, 61: {'A':1}, 62: {'A':2}, 63: {'A':1}, 64: {'A':2},
    65: {'A':1}, 66: {'A':2}, 67: {'A':1}, 68: {'A':2}, 69: {'A':1}, 70: {'A':2}, 71: {'A':1}, 72: {'A':2},
    73: {'A':1}, 74: {'A':2}, 75: {'A':1}, 76: {'A':2}, 77: {'A':1}, 78: {'A':2}, 79: {'A':1}, 80: {'A':2},
    81: {'A':1}, 82: {'A':2}, 83: {'A':1}, 84: {'A':2}, 85: {'A':1}, 86: {'A':2}, 87: {'A':1}, 88: {'A':2},
    89: {'A':1}, 90: {'A':2}, 91: {'A':1}, 92: {'A':2}, 93: {'A':1}, 94: {'A':2}, 95: {'A':1}, 96: {'A':2},
    97: {'A':1}, 98: {'A':2}, 99: {'A':1}, 100: {'A':2}, 101: {'A':1}, 102: {'A':2}, 103: {'A':1}, 104: {'A':2},
    105: {'A':1}, 106: {'A':2}, 107: {'A':1}, 108: {'A':2}, 109: {'A':1}, 110: {'A':2}, 111: {'A':1}, 

    112: {'A':2, 'B':2}, 'C':1},
    113: {'A':2, 'B':2}, 'C':1}, 114: {'A':2, 'B':2}, 'C':1}, 115: {'A':2, 'B':2}, 'C':1}, 116: {'A':2, 'B':2}, 'C':1},
    117: {'A':2, 'B':2}, 'C':1}, 118: {'A':2, 'B':2}, 'C':1}, 119:{'A':2, 'B':2}, 'C':1}, 120: {'A':2, 'B':2}, 'C':1},
    121: {'A':2, 'B':2}, 'C':1}, 122: {'A':2, 'B':2}, 'C':1}, 123: {'A':2, 'B':2}, 'C':1}, 124: {'A':2, 'B':2}, 'C':1},
     125: {'A':2, 'B':2}, 'C':1}, 126: {'A':2, 'B':2}, 'C':1}, 127: {'A':2, 'B':2}, 'C':1}, 128: {'A':2, 'B':2}, 'C':1},
    129: {'A':2, 'B':2}, 'C':1}, 130: {'A':2, 'B':2}, 'C':1}, 131: {'A':2, 'B':2}, 'C':1}, 132: {'A':2, 'B':2}, 'C':1},
    133: {'A':2, 'B':2}, 'C':1}, 134: {'A':2, 'B':2}, 'C':1}, 135: {'A':2, 'B':2}, 'C':1}, 136:{'A':2, 'B':2}, 'C':1},
    137: {'A':2, 'B':2}, 'C':1},138: {'A':2, 'B':2}, 'C':1}, 139: {'A':2, 'B':2}, 'C':1}, 140: {'A':2, 'B':2}, 'C':1},
     141: {'A':2, 'B':2}, 'C':1}, 142: {'A':2, 'B':2}, 'C':1}, 143: {'A':2, 'B':2}, 'C':1},144: {'A':2, 'B':2}, 'C':1},
    145: {'A':2, 'B':2}, 'C':1}, 146: {'A':2, 'B':2}, 'C':1}, 147: {'A':2, 'B':2}, 'C':1}, 148: {'A':2, 'B':2}, 'C':1},
    
    149: {'A':1}, 150: {'A':2}, 151: {'A':1}, 152: {'A':2},
    153: {'A':1}, 154: {'A':2}, 155: {'A':1}, 156: {'A':2}, 157: {'A':1}, 158: {'A':2}, 159: {'A':1}, 160: {'A':2},
    161: {'A':1}, 162: {'A':2}, 163: {'A':1}, 164: {'A':2}, 165: {'A':1}, 166: {'A':2}, 167: {'A':1}, 168: {'A':2},
    169: {'A':1}, 170: {'A':2}, 171: {'A':1}, 172: {'A':2}, 173: {'A':1}, 174: {'A':2}, 175: {'A':1}, 176: {'A':2},
    177: {'A':1}, 178: {'A':2}, 179: {'A':1}, 180: {'A':2}, 181: {'A':1}, 182: {'A':2}, 183: {'A':1}, 184: {'A':2},
    185: {'A':1}}

    # Initialize the scores for each section
    section_scores = {
        'A': 0,
        'B': 0,
        'C': 0,
        'E': 0,
        'F': 0,
        'G': 0,
        'H': 0,
        'I': 0,
        'L': 0,
        'M': 0,
        'N': 0,
        'O': 0,
        'Q1': 0,
        'Q2': 0,
        'Q3': 0,
        'Q4': 0,

    }
   # To track marked answers
    marked_answers = {}
    
    # Visualize detection for debugging
    for question, bubbles in answer_bubbles.items():
        print(f"Processing Question {question} with bubbles {bubbles}")  # Debugging print
        marked_bubble_count = 0
        for i, (x, y) in enumerate(bubbles):
            # Draw rectangles on the image to visualize bubble positions
            cv2.circle(image, (x, y), 11, (255, 0, 0), 2)  # Blue circle with radius 20
            
            # Extract region of interest (ROI) for each bubble
            roi = thresh[y-20:y+20, x-20:x+20]  # Small region around the bubble
            
            # Check if the ROI is filled (marked)
            filled = cv2.countNonZero(roi)
            if filled > 500:  # Threshold for considering it marked
                marked_bubble_count += 1
                if marked_bubble_count > 1:  # Check for multiple marked bubbles
                    marked_answers[question] = None  # Award zero points if multiple marked
                    break  # No need to check further bubbles for this question
                else:
                    marked_answers[question] = chr(65 + i)  # 'A' is 65 in ASCII

                cv2.putText(image, "Marked", (x - 40, y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Calculate the score for each section
    for question, marked in marked_answers.items():
        if marked:
            points = answer_key[question].get(marked, 0)
            # Assign points to the correct section
            if question in [1, 31, 33, 63, 65, 96, 98, 127, 129, 159, 161]:  # Example: Questions 1 and 2 belong to Section 1
                section_scores['A'] += points

            elif question in [171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185]:  # Example: Question 3 belongs to Section 2
                section_scores['B'] += points

            elif question in [2, 32, 35, 64, 67, 97, 128, 131, 160, 162]:  # Example: Question 4 belongs to Section 3
                section_scores['C'] += points

            elif question in [3, 36, 38, 66, 99, 102, 130, 132, 163, 165]:  # Example: Question 5 belongs to Section 4
                section_scores['E'] += points

            elif question in [4, 6, 37, 39, 68, 70, 100, 103, 134, 164]:  # Example: Question 6 belongs to Section 5
                section_scores['F'] += points

            elif question in [5, 7, 40, 69, 72, 104, 106, 133, 136, 166, 168]:  # Example: Question 7 belongs to Section 6
                section_scores['G'] += points

            elif question in [9, 41, 71, 73, 105, 107, 135, 137, 167, 169]:  # Example: Question 8 belongs to Section 7    
                section_scores['H'] += points

            elif question in [8, 10, 42, 44, 74, 77, 108, 110, 138, 140, 170]:  # Example: Question 9 belongs to Section 8
                section_scores['I'] += points

            elif question in [11, 13, 43, 45, 76, 78, 109, 112, 139, 141]:  # Example: Question 10 belongs to Section 9
                section_scores['L'] += points

            elif question in [12, 14, 17, 46, 49, 79, 81, 111, 114, 142, 145]:  # Example: Question 11 belongs to Section 10
                section_scores['M'] += points

            elif question in [15, 18, 47, 50, 80, 85, 113, 117, 143, 148]:  # Example: Question 12 belongs to Section 11
                section_scores['N'] += points
                
            elif question in [19, 21, 51, 54, 82, 87, 116, 119, 146, 150]:  # Example: Question 13 belongs to Section 12
                section_scores['O'] += points

            elif question in [20, 22, 24, 52, 53, 55, 83, 86, 88, 118, 120, 147, 149, 151]:  # Example: Question 14 belongs to Section 13
                section_scores['Q1'] += points

            elif question in [25, 27, 56, 59, 89, 92, 121, 123, 152, 156]:  # Example: Question 15 belongs to Section 14
                section_scores['Q2'] += points

            elif question in [26, 29, 57, 61, 90, 93, 122, 125, 154, 157]:  # Example: Question 16 belongs to Section 15
                section_scores['Q3'] += points

            elif question in [28, 30, 60, 62, 91, 94, 124, 126, 155, 158]:  # Example: Question 17 belongs to Section 16
                section_scores['Q4'] += points
            # Add more conditions for other sections if needed

    # Save the debug image with marked areas and correct answers
    cv2.imwrite('marked_answer_sheet_updated.png', image)  # Save updated image with marked answers
    
    return section_scores

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