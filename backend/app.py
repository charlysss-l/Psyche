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
        1: [(241, 168), (272, 168), (303, 168), (333, 168), (363, 168), (394, 168) ], 
        2: [(241, 198), (272, 198), (303, 198), (333, 198), (363, 198), (394, 198) ],
        3: [(241, 229), (272, 229), (303, 229), (333, 229), (363, 229), (394, 229) ],
        4: [(241, 259), (272, 259), (303, 259), (333, 259), (363, 259), (394, 259) ],
        5: [(242, 289), (273, 289), (304, 289), (334, 289), (364, 289), (395, 289) ],
        6: [(241, 320), (272, 320), (303, 320), (333, 320), (363, 320), (394, 320) ],
        7: [(241, 351), (272, 351), (303, 351), (333, 351), (363, 351), (394, 351) ],
        8: [(241, 381), (272, 381), (303, 381), (333, 381), (363, 381), (394, 381) ],
        9: [(242, 411), (273, 411), (304, 411), (334, 411), (364, 411), (395, 411) ],
        10: [(242, 441), (273, 441), (304, 441), (334, 441), (364, 441), (395, 441) ],
        11: [(242, 471), (273, 471), (304, 471), (334, 471), (364, 471), (395, 471) ],
        12: [(242, 502), (273, 502), (304, 502), (334, 502), (364, 502), (395, 502) ],
        
        13: [(620, 169), (651, 169), (681, 169), (711, 169), (742, 169), (773, 169) ],
        14: [(621, 200), (651, 200), (681, 200), (711, 200), (742, 200), (773, 200) ],
        15: [(621, 230), (651, 230), (681, 230), (711, 230), (742, 230), (773, 230) ],
        16: [(621, 261), (651, 261), (681, 261), (711, 261), (742, 261), (773, 261) ],
        17: [(622, 290), (652, 290), (682, 290), (712, 290), (743, 290), (774, 290) ],
        18: [(622, 321), (652, 321), (682, 321), (712, 321), (743, 321), (774, 321) ],
        19: [(622, 354), (652, 354), (682, 354), (712, 354), (743, 354), (774, 354) ],
        20: [(622, 384), (652, 384), (682, 384), (712, 384), (743, 384), (774, 384) ],
        21: [(622, 414), (652, 414), (682, 414), (712, 414), (743, 414), (774, 414) ],
        22: [(622, 444), (652, 444), (682, 444), (712, 444), (743, 444), (774, 444) ],
        23: [(622, 473), (652, 473), (682, 473), (712, 473), (743, 473), (774, 473) ],
        24: [(622, 504), (652, 504), (682, 504), (712, 504), (743, 504), (774, 504) ],

        25: [(86, 756), (117, 756), (145, 756) , (176, 756), (206, 756), (237, 756), (267, 756) , (296, 756)],
        26: [(86, 784), (117, 784) , (145, 784) , (176, 784), (206, 784), (237, 784), (267, 784) , (297, 784)],
        27: [(86, 812), (117, 812) , (145, 812) , (176, 812), (206, 812), (237, 812), (267, 812) , (297, 812)],
        28: [(86, 838), (117, 838) , (145, 838) , (176, 838), (206, 838), (237, 838), (267, 838) , (297, 838)],
        29: [(86, 866), (117, 866) , (145, 866) , (176, 866), (206, 866), (237, 866), (267, 866) , (297, 866)],
        30: [(86, 894), (117, 894) , (145, 894) , (176, 894), (206, 894), (237, 894), (267, 894) , (297, 894)],
        31: [(86, 922), (117, 922) , (145, 922) , (176, 922), (206, 922), (237, 922), (267, 922) , (297, 922)],
        32: [(86, 950), (117, 950) , (145, 950) , (176, 950), (206, 950), (237, 950), (267, 950) , (297, 950)],
        33: [(86, 978), (117, 978) , (145, 978) , (176, 978), (206, 978), (237, 978), (267, 978) , (297, 978)],
        34: [(90, 1015), (120, 1015) , (151, 1015) , (182, 1015), (213, 1015), (243, 1015), (273, 1015) , (303, 1015)],
        35: [(90, 1043), (120, 1043) , (151, 1043) , (182, 1043), (213, 1043), (243, 1043), (273, 1043) , (303, 1043)],
        36: [(90, 1070), (120, 1070) , (151, 1070) , (182, 1070), (213, 1070), (243, 1070), (273, 1070) , (303, 1070)],

        37: [(406, 758),(437, 758),(466, 758) ,(494, 758) ,(523, 758) ,(557, 758) ,(585, 758) ,(613, 758)  ],
        38: [(407, 784) ,(437, 785),(466, 784) ,(494, 784) ,(525, 784) ,(557, 784) ,(585, 785) ,(616, 785)],
        39: [(406, 812) ,(436, 812),(466, 812) ,(494, 812) ,(525, 812) ,(557, 812) ,(587, 812) ,(617, 815)],
        40: [(408, 841) ,(438, 841),(466, 841) ,(494, 841) ,(523, 841) ,(557, 841) ,(587, 841) ,(617, 841)],
        41: [(408, 869) ,(440, 869),(470, 869) ,(498, 869) ,(527, 869) ,(557, 869) ,(587, 869) ,(617, 869)],
        42: [(408, 897) ,(440, 897),(470, 897) ,(498, 897) ,(527, 897) ,(557, 897) ,(587, 897) ,(617, 897)],
        43: [(407, 927) ,(440, 927),(470, 927) ,(498, 927) ,(527, 927) ,(557, 927) ,(587, 927) ,(617, 927)],
        44: [(410, 957) ,(440, 955),(469, 955) ,(498, 955) ,(527, 955) ,(557, 955) ,(587, 955) ,(617, 956)],
        45: [(410, 984) ,(440, 984),(469, 984) ,(498, 984) ,(527, 984) ,(557, 984) ,(587, 984) ,(617, 984)],
        46: [(410, 1015) ,(440, 1015),(469, 1015) ,(498, 1015) ,(527, 1015) ,(557, 1015) ,(587, 1015) ,(617, 1015)],
        47: [(411, 1043),(440, 1043),(469, 1043) ,(498, 1043) ,(528, 1043) ,(558, 1043) ,(588, 1043) ,(618, 1044) ],
        48: [(411, 1072),(440, 1072),(470, 1072) ,(498, 1072) ,(530, 1072) ,(559, 1072) ,(588, 1072) ,(618, 1072) ],

        49: [(712, 749), (741, 749), (770, 749) , (799, 749), (828, 749), (857, 749), (886, 749) , (915, 749)],
        50: [(713, 776), (741, 776), (770, 776) , (799, 776), (828, 776), (857, 776), (886, 776) , (915, 776)],
        51: [(713, 803), (741, 803), (770, 803) , (799, 803), (828, 803), (857, 803), (886, 803) , (915, 803)],
        52: [(713, 830), (741, 830), (770, 830) , (799, 830), (828, 830), (857, 830), (886, 830) , (915, 830)],
        53: [(714, 857), (743, 857), (784, 857) , (801, 857), (830, 857), (859, 857), (888, 857) , (917, 857)],
        54: [(714, 884), (743, 884), (772, 884) , (801, 884), (830, 884), (859, 884), (888, 884) , (917, 884)],
        55: [(714, 913), (743, 913), (772, 913) , (801, 913), (830, 913), (859, 913), (888, 913) , (917, 913)],
        56: [(715, 940), (744, 940), (773, 940) , (802, 940), (831, 940), (860, 940), (889, 940) , (918, 940)],
        57: [(715, 967), (744, 967), (773, 967) , (802, 967), (831, 967), (860, 967), (889, 967) , (918, 967)],
        58: [(715, 994), (744, 994), (773, 994) , (802, 994), (831, 994), (860, 994), (889, 994) , (918, 994)],
        59: [(716, 1022), (758, 1022), (774, 1022) , (803, 1022), (832, 1022), (861, 1022), (890, 1022) , (919, 1022)],
        60: [(716, 1049), (758, 1049), (774, 1049) , (803, 1049), (832, 1049), (861, 1049), (890, 1049) , (919, 1049)],
        
        
       
    }

    # Correct answer key
    answer_key = {1: 'D', 2: 'E', 3: 'A', 4: 'B', 5: 'F', 6: 'C', 7: 'F', 8: 'B', 9: 'A', 10: 'C', 11: 'D', 12: 'E',
        13: 'B', 14: 'F', 15: 'A', 16: 'B', 17: 'A', 18: 'C', 19: 'E', 20: 'F', 21: 'D', 22: 'C', 23: 'D', 24: 'E',
        25: 'H', 26: 'B', 27: 'C', 28: 'H', 29: 'G', 30: 'D', 31: 'E', 32: 'A', 33: 'G', 34: 'F', 35: 'A', 36: 'B',
        37: 'C', 38: 'D', 39: 'C', 40: 'G', 41: 'H', 42: 'F', 43: 'E', 44: 'D', 45: 'A', 46: 'B', 47: 'E', 48: 'F',
        49: 'G', 50: 'F', 51: 'H', 52: 'B', 53: 'A', 54: 'E', 55: 'A', 56: 'F', 57: 'C', 58: 'B', 59: 'D', 60: 'E'}
    
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

        # Now draw the correct answer with a green box for visualization
        correct_answer = answer_key[question]
        correct_index = ord(correct_answer) - 65  # Convert 'A', 'B', 'C', 'D' to index 0, 1, 2, 3
        correct_x, correct_y = bubbles[correct_index]
        cv2.circle(image, (correct_x, correct_y), 10, (0, 0, 255), 2)  # red circle for correct answer
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
