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
        1: [(204, 243), (239, 243), (273, 243), (307, 243), (342, 243), (377, 243)], 
        2: [(204, 278), (239, 278), (273, 278), (307, 278), (342, 278), (377, 278)],
        3: [(204, 310), (239, 310), (273, 310), (307, 310), (342, 310), (377, 310)],
        4: [(204, 345), (239, 345), (273, 345), (307, 345), (342, 345), (377, 345)],
        5: [(205, 377), (240, 377), (274, 377), (308, 377), (343, 377), (378, 377)],
        6: [(206, 413), (241, 413), (275, 413), (309, 413), (344, 413), (378, 413)],
        7: [(206, 448), (241, 448), (275, 448), (309, 448), (344, 448), (378, 448)],
        8: [(206, 482), (241, 482), (275, 482), (309, 482), (344, 482), (378, 482)],
        9: [(206, 515), (241, 515), (275, 515), (309, 515), (344, 515), (378, 515)],
        10: [(206, 550), (241, 550), (275, 550), (309, 550), (344, 550), (378, 550)],
        11: [(206, 582), (241, 582), (275, 582), (309, 582), (344, 582), (378, 582)],
        12: [(206, 617), (241, 617), (275, 617), (309, 617), (344, 617), (378, 617)],

        13: [(605, 245), (640, 245), (674, 245), (708, 245), (743, 245), (778, 245)],
        14: [(605, 280), (640, 280), (674, 280), (708, 280), (743, 280), (778, 280)],
        15: [(605, 312), (640, 312), (674, 312), (708, 312), (743, 312), (778, 312)],
        16: [(605, 347), (640, 347), (674, 347), (708, 347), (743, 347), (778, 347)],
        17: [(607, 379), (642, 379), (676, 379), (710, 379), (745, 379), (779, 379)],
        18: [(607, 414), (642, 414), (676, 414), (710, 414), (745, 414), (779, 414)],
        19: [(607, 450), (642, 450), (676, 450), (710, 450), (745, 450), (779, 450)],
        20: [(607, 484), (642, 484), (676, 484), (710, 484), (745, 484), (779, 484)],
        21: [(607, 517), (642, 517), (676, 517), (710, 517), (745, 517), (779, 517)],
        22: [(607, 552), (642, 552), (676, 552), (710, 552), (745, 552), (779, 552)],
        23: [(607, 584), (642, 584), (676, 584), (710, 584), (745, 584), (779, 584)],
        24: [(607, 619), (642, 619), (676, 619), (710, 619), (745, 619), (779, 619)],

        25: [(69, 809), (104, 809), (138, 809), (173, 809), (207, 809), (241, 809), (275, 809), (309, 809)],
        26: [(70, 841), (105, 841), (139, 841), (174, 841), (208, 841), (242, 841), (276, 841), (310, 841)],
        27: [(70, 872), (105, 872), (139, 872), (174, 872), (208, 872), (242, 872), (276, 872), (310, 872)],
        28: [(71, 903), (106, 903), (140, 903), (175, 903), (209, 903), (243, 903), (277, 904), (311, 904)],
        29: [(72, 935), (107, 935), (141, 935), (176, 935), (210, 935), (244, 935), (278, 935), (312, 935)],
        30: [(72, 967), (107, 967), (141, 967), (176, 967), (210, 967), (244, 967), (278, 967), (312, 967)],
        31: [(73, 1002), (107, 1002), (141, 1002), (176, 1002), (210, 1002), (245, 1002), (279, 1002), (313, 1002)],
        32: [(74, 1033), (108, 1033), (142, 1033), (177, 1033), (211, 1033), (246, 1033), (280, 1034), (314, 1034)],
        33: [(74, 1065), (108, 1065), (142, 1065), (177, 1065), (211, 1065), (246, 1065), (280, 1065), (314, 1065)],
        34: [(74, 1099), (108, 1099), (142, 1099), (177, 1099), (211, 1099), (246, 1099), (280, 1100), (314, 1100)],
        35: [(75, 1131), (109, 1131), (143, 1131), (178, 1131), (212, 1131), (247, 1131), (281, 1131), (315, 1131)],
        36: [(75, 1163), (109, 1163), (143, 1163), (178, 1163), (212, 1163), (247, 1163), (281, 1163), (315, 1163)],

        37: [(387, 810), (421, 810), (455, 810), (490, 810), (525, 810), (559, 810), (593, 811), (627, 811)],
        38: [(388, 842), (422, 842), (456, 842), (491, 842), (526, 842), (560, 842), (594, 842), (628, 842)],
        39: [(388, 874), (422, 874), (456, 874), (491, 874), (526, 874), (560, 874), (594, 874), (628, 874)],
        40: [(389, 905), (423, 905), (457, 905), (492, 905), (526, 905), (561, 905), (594, 906), (628, 906)],
        41: [(390, 937), (424, 937), (458, 937), (493, 937), (527, 937), (562, 937), (595, 937), (629, 937)],
        42: [(390, 968), (424, 968), (458, 968), (493, 968), (527, 968), (562, 968), (595, 969), (629, 969)],
        43: [(390, 1003), (425, 1003), (459, 1003), (493, 1003), (528, 1003), (562, 1003), (596, 1004), (630, 1004)],
        44: [(391, 1034), (425, 1034), (460, 1034), (494, 1034), (529, 1034), (563, 1034), (597, 1035), (631, 1035)],
        45: [(391, 1066), (425, 1066), (460, 1066), (494, 1066), (529, 1066), (563, 1066), (597, 1067), (631, 1067)],
        46: [(391, 1101), (425, 1101), (460, 1101), (494, 1101), (529, 1101), (563, 1101), (597, 1102), (631, 1102)],
        47: [(392, 1132), (426, 1132), (461, 1132), (495, 1132), (530, 1132), (564, 1132), (598, 1133), (632, 1133)],
        48: [(392, 1164), (426, 1164), (461, 1164), (495, 1164), (530, 1164), (564, 1164), (598, 1165), (632, 1165)],

        49: [(704, 815), (738, 815), (772, 815), (807, 815), (841, 815), (876, 815), (910, 815), (944, 815)],
        50: [(705, 847), (739, 847), (773, 847), (808, 847), (843, 847), (877, 847), (911, 847), (945, 847)],
        51: [(705, 878), (739, 878), (773, 878), (808, 878), (842, 878), (877, 878), (911, 879), (945, 879)],
        52: [(706, 910), (740, 910), (774, 910), (809, 910), (843, 910), (878, 910), (911, 910), (945, 910)],
        53: [(707, 941), (741, 941), (775, 941), (810, 941), (844, 941), (879, 941), (912, 942), (946, 942)],
        54: [(707, 973), (741, 973), (775, 973), (810, 973), (844, 973), (879, 973), (912, 973), (946, 973)],
        55: [(707, 1007), (741, 1007), (776, 1007), (811, 1007), (845, 1007), (880, 1007), (913, 1008), (947, 1008)],
        56: [(708, 1039), (743, 1039), (777, 1039), (812, 1039), (846, 1039), (881, 1039), (914, 1040), (948, 1040)],
        57: [(708, 1070), (743, 1070), (777, 1070), (812, 1071), (846, 1071), (881, 1071), (914, 1071), (948, 1071)],
        58: [(708, 1105), (743, 1105), (777, 1105), (812, 1105), (846, 1105), (881, 1105), (914, 1106), (948, 1106)],
        59: [(709, 1137), (744, 1137), (778, 1137), (813, 1137), (847, 1137), (882, 1137), (915, 1138), (949, 1138)],
        60: [(709, 1168), (744, 1168), (778, 1168), (813, 1168), (847, 1168), (882, 1168), (915, 1169), (949, 1169)],

        
        
       
       
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
                    # marked_answers[question] = None  # Award zero points if multiple marked
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

import requests
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process_omr_IQ', methods=['POST'])
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
    app.run(debug=True, port=5000)