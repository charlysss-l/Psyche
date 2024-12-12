#The 16pf.py script processes an image of a completed OMR (Optical Mark Recognition) sheet. 
# The procedure starts by receiving an image URL from the frontend. 
# The backend downloads the image and processes it using OpenCV, detecting marked answer bubbles on the OMR sheet. 
# Each bubble's position is analyzed to determine whether it is marked or not, and based on the marked answers, the script assigns points according to a predefined answer key. 
# The script then calculates scores for factorLetter of the test (labeled as A, B, C, etc.) by grouping questions into specific sections and summing the corresponding points. 
# After processing,the backend returns the calculated scores as a JSON response, which the frontend then displays to the user. 
# The image is also saved with marked bubbles visualized for debugging purposes.

# step 1: user will upload an image and store it in firebase with a URL file name (OMRCamera.tsx)
# step 2: user will send a request to the backend to process the image (OMRCamera.tsx)
# step 3: backend will download the URL image and process it (16pf.py)
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
        1: [(98, 99), (136, 99), (174, 99)], 
        2: [(98, 134), (136, 134), (174, 134)],
        3: [(98, 169), (136, 169), (174, 169)],
        4: [(98, 204), (136, 204), (174, 204)],
        5: [(98, 239), (136, 239), (174, 239)],
        6: [(98, 274), (136, 274), (174, 274)],
        7: [(98, 309), (136, 309), (174, 309)],
        8: [(98, 344), (136, 344), (174, 344)],
        9: [(98, 379), (136, 379), (174, 379)],
        10: [(98, 414), (136, 414), (174, 414)],
        11: [(98, 449), (136, 449), (174, 449)],
        12: [(98, 484), (136, 484), (174, 484)],
        13: [(98, 519), (136, 519), (174, 519)],
        14: [(98, 554), (136, 554), (174, 554)],
        15: [(98, 589), (136, 589), (174, 589)],
        16: [(98, 624), (136, 624), (174, 624)],
        17: [(98, 659), (136, 659), (174, 659)],
        18: [(98, 694), (136, 694), (174, 694)],
        19: [(98, 729), (136, 729), (174, 729)],
        20: [(98, 764), (136, 764), (174, 764)],
        21: [(98, 799), (136, 799), (174, 799)],
        22: [(98, 834), (136, 834), (174, 834)],
        23: [(98, 869), (136, 869), (174, 869)],
        24: [(98, 904), (136, 904), (174, 904)],
        25: [(98, 939), (136, 939), (174, 939)],
        26: [(98, 974), (136, 974), (174, 974)],
        27: [(98, 1009), (136, 1009), (174, 1009)],
        28: [(98, 1044), (136, 1044), (174, 1044)],
        29: [(98, 1079), (136, 1079), (174, 1079)],
        30: [(98, 1114), (136, 1114), (174, 1114)],
        31: [(98, 1150), (136, 1150), (174, 1150)],
        32: [(98, 1185), (136, 1185), (174, 1185)],
        33: [(98, 1220), (136, 1220), (174, 1220)],
        34: [(98, 1255), (136, 1255), (174, 1255)],
        35: [(98, 1290), (136, 1290), (174, 1290)],
        36: [(98, 1325), (136, 1325), (174, 1325)],
        37: [(98, 1360), (136, 1360), (174, 1360)],
       
        38: [(282, 99), (320, 99), (358, 99)],
        39: [(282, 134), (320, 134), (358, 134)],
        40: [(282, 169), (320, 169), (358, 169)],
        41: [(282, 204), (320, 204), (358, 204)],
        42: [(282, 239), (320, 239), (358, 239)],
        43: [(282, 274), (320, 274), (358, 274)],
        44: [(282, 309), (320, 309), (358, 309)],
        45: [(282, 344), (320, 344), (358, 344)],
        46: [(282, 379), (320, 379), (358, 379)],
        47: [(282, 414), (320, 414), (358, 414)],
        48: [(282, 449), (320, 449), (358, 449)],
        49: [(282, 484), (320, 484), (358, 484)],
        50: [(282, 519), (320, 519), (358, 519)],
        51: [(282, 554), (320, 554), (358, 554)],
        52: [(282, 589), (320, 589), (358, 589)],
        53: [(282, 624), (320, 624), (358, 624)],
        54: [(282, 659), (320, 659), (358, 659)],
        55: [(282, 694), (320, 694), (358, 694)],
        56: [(282, 729), (320, 729), (358, 729)],
        57: [(282, 764), (320, 764), (358, 764)],
        58: [(282, 799), (320, 799), (358, 799)],
        59: [(282, 834), (320, 834), (358, 834)],
        60: [(282, 869), (320, 869), (358, 869)],
        61: [(282, 904), (320, 904), (358, 904)],
        62: [(282, 939), (320, 939), (358, 939)],
        63: [(282, 974), (320, 974), (358, 974)],
        64: [(282, 1009), (320, 1009), (358, 1009)],
        65: [(282, 1044), (320, 1044), (358, 1044)],
        66: [(282, 1079), (320, 1079), (358, 1079)],
        67: [(282, 1114), (320, 1114), (358, 1114)],
        68: [(282, 1150), (320, 1150), (358, 1150)],
        69: [(282, 1185), (320, 1185), (358, 1185)],
        70: [(282, 1220), (320, 1220), (358, 1220)],
        71: [(282, 1255), (320, 1255), (358, 1255)],
        72: [(282, 1290), (320, 1290), (358, 1290)],
        73: [(282, 1325), (320, 1325), (358, 1325)],
        74: [(282, 1360), (320, 1360), (358, 1360)],

        75: [(467, 99), (505, 99), (543, 99)],
        76: [(467, 134), (505, 134), (543, 134)],
        77: [(467, 169), (505, 169), (543, 169)],
        78: [(467, 204), (505, 204), (543, 204)],
        79: [(467, 239), (505, 239), (543, 239)],
        80: [(467, 274), (505, 274), (543, 274)],
        81: [(467, 309), (505, 309), (543, 309)],
        82: [(467, 344), (505, 344), (543, 344)],
        83: [(467, 379), (505, 379), (543, 379)],
        84: [(467, 414), (505, 414), (543, 414)],
        85: [(467, 449), (505, 449), (543, 449)],
        86: [(467, 484), (505, 484), (543, 484)],
        87: [(467, 519), (505, 519), (543, 519)],
        88: [(467, 554), (505, 554), (543, 554)],
        89: [(467, 589), (505, 589), (543, 589)],
        90: [(467, 624), (505, 624), (543, 624)],
        91: [(467, 659), (505, 659), (543, 659)],
        92: [(467, 694), (505, 694), (543, 694)],
        93: [(467, 729), (505, 729), (543, 729)],
        94: [(467, 764), (505, 764), (543, 764)],
        95: [(467, 799), (505, 799), (543, 799)],
        96: [(467, 834), (505, 834), (543, 834)],
        97: [(467, 869), (505, 869), (543, 869)],
        98: [(467, 904), (505, 904), (543, 904)],
        99: [(467, 939), (505, 939), (543, 939)],
        100: [(467, 974), (505, 974), (543, 974)],
        101: [(467, 1009), (505, 1009), (543, 1009)],
        102: [(467, 1044), (505, 1044), (543, 1044)],
        103: [(467, 1079), (505, 1079), (543, 1079)],
        104: [(467, 1114), (505, 1114), (543, 1114)],
        105: [(467, 1150), (505, 1150), (543, 1150)],
        106: [(467, 1185), (505, 1185), (543, 1185)],
        107: [(467, 1220), (505, 1220), (543, 1220)],
        108: [(467, 1255), (505, 1255), (543, 1255)],
        109: [(467, 1290), (505, 1290), (543, 1290)],
        110: [(467, 1325), (505, 1325), (543, 1325)],
        111: [(467, 1360), (505, 1360), (543, 1360)],

        112: [(650, 99), (688, 99), (726, 99)],
        113: [(650, 134), (688, 134), (726, 134)],
        114: [(650, 169), (688, 169), (726, 169)], 
        115: [(650, 204), (688, 204), (726, 204)],
        116: [(650, 239), (688, 239), (726, 239)],
        117: [(650, 274), (688, 274), (726, 274)],
        118: [(650, 309), (688, 309), (726, 309)],
        119: [(650, 344), (688, 344), (726, 344)],
        120: [(650, 379), (688, 379), (726, 379)],
        121: [(650, 414), (688, 414), (726, 414)],
        122: [(650, 449), (688, 449), (726, 449)],
        123: [(650, 484), (688, 484), (726, 484)],
        124: [(650, 519), (688, 519), (726, 519)],
        125: [(650, 554), (688, 554), (726, 554)],
        126: [(650, 589), (688, 589), (726, 589)],
        127: [(650, 624), (688, 624), (726, 624)],
        128: [(650, 659), (688, 659), (726, 659)],
        129: [(650, 694), (688, 694), (726, 694)],
        130: [(650, 729), (688, 729), (726, 729)],
        131: [(650, 764), (688, 764), (726, 764)],
        132: [(650, 799), (688, 799), (726, 799)],
        133: [(650, 834), (688, 834), (726, 834)],
        134: [(650, 869), (688, 869), (726, 869)],
        135: [(650, 904), (688, 904), (726, 904)],
        136: [(650, 939), (688, 939), (726, 939)],
        137: [(650, 974), (688, 974), (726, 974)],
        138: [(650, 1009), (688, 1009), (726, 1009)],
        139: [(650, 1044), (688, 1044), (726, 1044)],
        140: [(650, 1079), (688, 1079), (726, 1079)],
        141: [(650, 1114), (688, 1114), (726, 1114)],
        142: [(650, 1150), (688, 1150), (726, 1150)],
        143: [(650, 1185), (688, 1185), (726, 1185)],
        144: [(650, 1220), (688, 1220), (726, 1220)],
        145: [(650, 1255), (688, 1255), (726, 1255)],
        146: [(650, 1290), (688, 1290), (726, 1290)],
        147: [(650, 1325), (688, 1325), (726, 1325)],
        148: [(650, 1360), (688, 1360), (726, 1360)],

        149: [(831, 101), (869, 101), (907, 101)],
        150: [(831, 136), (869, 136), (907, 136)],
        151: [(831, 171), (869, 171), (907, 171)],
        152: [(831, 206), (869, 206), (907, 206)],
        153: [(831, 241), (869, 241), (907, 241)],
        154: [(831, 276), (869, 276), (907, 276)],
        155: [(831, 311), (869, 311), (907, 311)],
        156: [(831, 346), (869, 346), (907, 346)],
        157: [(831, 381), (869, 381), (907, 381)],
        158: [(831, 416), (869, 416), (907, 416)],
        159: [(831, 451), (869, 451), (907, 451)],
        160: [(831, 486), (869, 486), (907, 486)],
        161: [(831, 521), (869, 521), (907, 521)],
        162: [(831, 556), (869, 556), (907, 556)],
        163: [(831, 591), (869, 591), (907, 591)],
        164: [(831, 626), (869, 626), (907, 626)],
        165: [(831, 661), (869, 661), (907, 661)],
        166: [(831, 696), (869, 696), (907, 696)],
        167: [(831, 731), (869, 731), (907, 731)],
        168: [(831, 766), (869, 766), (907, 766)],
        169: [(831, 801), (869, 801), (907, 801)],
        170: [(831, 836), (869, 836), (907, 836)],
        171: [(831, 871), (869, 871), (907, 871)],
        172: [(831, 906), (869, 906), (907, 906)],
        173: [(831, 941), (869, 941), (907, 941)],
        174: [(831, 976), (869, 976), (907, 976)],
        175: [(831, 1011), (869, 1011), (907, 1011)],
        176: [(831, 1046), (869, 1046), (907, 1046)],
        177: [(831, 1081), (869, 1081), (907, 1081)],
        178: [(831, 1116), (869, 1116), (907, 1116)],
        179: [(831, 1151), (869, 1151), (907, 1151)],
        180: [(831, 1186), (869, 1186), (907, 1186)],
        181: [(831, 1221), (869, 1221), (907, 1221)],
        182: [(831, 1256), (869, 1256), (907, 1256)],
        183: [(831, 1291), (869, 1291), (907, 1291)],
        184: [(831, 1326), (869, 1326), (907, 1326)],
        185: [(831, 1361), (869, 1361), (907, 1361)],
       
       
    }

    # Correct answer key
    answer_key = {1: {'A':2, 'B':1, 'C':0}, 2: {'A':2, 'B':1, 'C':0}, 3: {'A':0, 'B':1, 'C':2}, 4: {'A':0, 'B':1, 'C':2}, 5: {'A':2, 'B':1, 'C':0}, 6: {'A':2, 'B':1, 'C':0}, 7: {'A':2, 'B':1, 'C':0}, 8: {'A':0, 'B':1, 'C':2},
    9: {'A':2, 'B':1, 'C':0}, 10: {'A':2, 'B':1, 'C':0}, 11: {'A':2, 'B':1, 'C':0}, 12: {'A':2, 'B':1, 'C':0}, 13: {'A':2, 'B':1, 'C':0}, 14: {'A':2, 'B':1, 'C':0}, 15: {'A':0, 'B':1, 'C':2}, 16: {'A':2, 'B':1, 'C':0},
    17: {'A':0, 'B':1, 'C':2}, 18: {'A':0, 'B':1, 'C':2}, 19: {'A':0, 'B':1, 'C':2}, 20: {'A':0, 'B':1, 'C':2}, 21: {'A':0, 'B':1, 'C':2}, 22: {'A':2, 'B':1, 'C':0}, 23: {'A':0, 'B':1, 'C':2}                                                                                                                                                             , 24: {'A':0, 'B':1, 'C':2},
    25: {'A':0, 'B':1, 'C':2}, 26: {'A':0, 'B':1, 'C':2}, 27: {'A':2, 'B':1, 'C':0}, 28: {'A':2, 'B':1, 'C':0}, 29: {'A':0, 'B':1, 'C':2}, 30: {'A':2, 'B':1, 'C':0}, 31: {'A':2, 'B':1, 'C':0}, 32: {'A':0, 'B':1, 'C':2},
    33: {'A':2, 'B':1, 'C':0}, 34: {'A':0, 'B':1, 'C':2}, 35: {'A':0, 'B':1, 'C':2}, 36: {'A':2, 'B':1, 'C':0}, 37: {'A':0, 'B':1, 'C':2}, 38: {'A':0, 'B':1, 'C':2}, 39: {'A':2, 'B':1, 'C':0}, 40: {'A':2, 'B':1, 'C':0},
    41: {'A':0, 'B':1, 'C':2}, 42: {'A':2, 'B':1, 'C':0}, 43: {'A':2, 'B':1, 'C':0}, 44: {'A':2, 'B':1, 'C':0}, 45: {'A':0, 'B':1, 'C':2}, 46: {'A':0, 'B':1, 'C':2}, 47: {'A':2, 'B':1, 'C':0}, 48: {'A':0, 'B':1, 'C':2},
    49: {'A':0, 'B':1, 'C':2}, 50: {'A':2, 'B':1, 'C':0}, 51: {'A':2, 'B':1, 'C':0}, 52: {'A':0, 'B':1, 'C':2}, 53: {'A':2, 'B':1, 'C':0}, 54: {'A':2, 'B':1, 'C':0}, 55: {'A':0, 'B':1, 'C':2}, 56: {'A':0, 'B':1, 'C':2},
    57: {'A':0, 'B':1, 'C':2}, 58: {'A':0, 'B':1, 'C':2}, 59: {'A':2, 'B':1, 'C':0}, 60: {'A':0, 'B':1, 'C':2}, 61: {'A':2, 'B':1, 'C':0}, 62: {'A':2, 'B':1, 'C':0}, 63: {'A':0, 'B':1, 'C':2}, 64: {'A':2, 'B':1, 'C':0},
    65: {'A':0, 'B':1, 'C':2}, 66: {'A':2, 'B':1, 'C':0}, 67: {'A':0, 'B':1, 'C':2}, 68: {'A':2, 'B':1, 'C':0}, 69: {'A':2, 'B':1, 'C':0}, 70: {'A':0, 'B':1, 'C':2}, 71: {'A':0, 'B':1, 'C':2}, 72:{'A':0, 'B':1, 'C':2},
    73: {'A':2, 'B':1, 'C':0}, 74: {'A':2, 'B':1, 'C':0}, 75: {'A':0, 'B':1, 'C':2}, 76: {'A':2, 'B':1, 'C':0}, 77: {'A':2, 'B':1, 'C':0}, 78: {'A':0, 'B':1, 'C':2}, 79: {'A':2, 'B':1, 'C':0}, 80: {'A':2, 'B':1, 'C':0},
    81: {'A':0, 'B':1, 'C':2}, 82: {'A':0, 'B':1, 'C':2}, 83: {'A':2, 'B':1, 'C':0}, 84: {'A':0, 'B':1, 'C':2}, 85: {'A':0, 'B':1, 'C':2}, 86: {'A':0, 'B':1, 'C':2}, 87: {'A':2, 'B':1, 'C':0}, 88: {'A':2, 'B':1, 'C':0},
    89: {'A':2, 'B':1, 'C':0}, 90: {'A':0, 'B':1, 'C':2}, 91: {'A':0, 'B':1, 'C':2}, 92: {'A':0, 'B':1, 'C':2}, 93: {'A':2, 'B':1, 'C':0}, 94: {'A':0, 'B':1, 'C':2}, 95: {'A':0, 'B':1, 'C':2}, 96:{'A':2, 'B':1, 'C':0},
    97: {'A':2, 'B':1, 'C':0}, 98: {'A':0, 'B':1, 'C':2}, 99: {'A':2, 'B':1, 'C':0}, 100: {'A':2, 'B':1, 'C':0}, 101: {'A':0, 'B':1, 'C':2}, 102: {'A':0, 'B':1, 'C':2}, 103: {'A':2, 'B':1, 'C':0}, 104: {'A':2, 'B':1, 'C':0},
    105: {'A':0, 'B':1, 'C':2}, 106: {'A':0, 'B':1, 'C':2}, 107: {'A':0, 'B':1, 'C':2}, 108: {'A':2, 'B':1, 'C':0}, 109: {'A':0, 'B':1, 'C':2}, 110: {'A':0, 'B':1, 'C':2}, 111:{'A':2, 'B':1, 'C':0}, 112: {'A':2, 'B':1, 'C':0},
    113: {'A':2, 'B':1, 'C':0}, 114: {'A':0, 'B':1, 'C':2}, 115: {'A':0, 'B':1, 'C':2}, 116: {'A':2, 'B':1, 'C':0},
    117: {'A':0, 'B':1, 'C':2}, 118: {'A':2, 'B':1, 'C':0}, 119: {'A':0, 'B':1, 'C':2}, 120: {'A':2, 'B':1, 'C':0},
    121: {'A':2, 'B':1, 'C':0}, 122: {'A':0, 'B':1, 'C':2}, 123: {'A':0, 'B':1, 'C':2}, 124: {'A':0, 'B':1, 'C':2},
    125: {'A':2, 'B':1, 'C':0}, 126: {'A':2, 'B':1, 'C':0}, 127: {'A':2, 'B':1, 'C':0}, 128: {'A':2, 'B':1, 'C':0},
    129: {'A':0, 'B':1, 'C':2}, 130: {'A':2, 'B':1, 'C':0}, 131: {'A':0, 'B':1, 'C':2}, 132: {'A':2, 'B':1, 'C':0},
    
    133: {'A':0, 'B':1, 'C':2}, 134: {'A':2, 'B':1, 'C':0}, 135: {'A':2, 'B':1, 'C':0}, 136:{'A':0, 'B':1, 'C':2},
    137: {'A':2, 'B':1, 'C':0},138: {'A':0, 'B':1, 'C':2}, 139: {'A':0, 'B':1, 'C':2}, 140: {'A':0, 'B':1, 'C':2},
    141: {'A':2, 'B':1, 'C':0}, 142: {'A':2, 'B':1, 'C':0}, 143: {'A':2, 'B':1, 'C':0},144: {'A':0, 'B':1, 'C':2},
    145: {'A':2, 'B':1, 'C':0}, 146: {'A':0, 'B':1, 'C':2}, 147: {'A':0, 'B':1, 'C':2}, 148: {'A':2, 'B':1, 'C':0},

    149: {'A':2, 'B':1, 'C':0}, 150: {'A':2, 'B':1, 'C':0}, 151: {'A':0, 'B':1, 'C':2}, 152: {'A':2, 'B':1, 'C':0},
    153: {'A':0, 'B':1, 'C':2}, 154: {'A':0, 'B':1, 'C':2}, 155: {'A':2, 'B':1, 'C':0}, 156: {'A':0, 'B':1, 'C':2}, 157: {'A':2, 'B':1, 'C':0}, 158: {'A':0, 'B':1, 'C':2}, 159: {'A':2, 'B':1, 'C':0}, 160: {'A':2, 'B':1, 'C':0},
    161: {'A':0, 'B':1, 'C':2}, 162: {'A':2, 'B':1, 'C':0}, 163: {'A':2, 'B':1, 'C':0}, 164: {'A':2, 'B':1, 'C':0}, 165: {'A':2, 'B':1, 'C':0}, 166: {'A':0, 'B':1, 'C':2}, 167: {'A':0, 'B':1, 'C':2}, 168: {'A':2, 'B':1, 'C':0},
    169: {'A':0, 'B':1, 'C':2}, 170: {'A':0, 'B':1, 'C':2}, 171: {'A':1, 'B':0, 'C':0}, 172: {'A':0, 'B':0, 'C':1}, 173: {'A':1, 'B':0, 'C':0}, 174: {'A':1, 'B':0, 'C':0}, 175: {'A':0, 'B':0, 'C':1}, 176: {'A':1, 'B':0, 'C':0},
    177: {'A':0, 'B':1, 'C':0}, 178: {'A':0, 'B':0, 'C':1}, 179: {'A':0, 'B':0, 'C':1}, 180: {'A':0, 'B':0, 'C':1}, 181: {'A':0, 'B':1, 'C':0}, 182: {'A':0, 'B':1, 'C':0}, 183: {'A':0, 'B':1, 'C':0}, 184: {'A':0, 'B':1, 'C':0},
    185: {'A':0, 'B':1, 'C':0}}

    # Initialize the scores for each factorLetter
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
            cv2.circle(image, (x, y), 12, (255, 0, 0), 2)  # Blue circle with radius 20
            
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

                # cv2.putText(image, "Marked", (x - 40, y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

                 # Display points for this choice
                points = answer_key[question].get(marked_answers[question], 0)
                cv2.putText(image, f"Points: {points}", (x - 40, y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

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


# This endpoint is designed to process a remotely stored OMR sheet image, calculate scores based on the marked answers, 
# and return the results to the frontend in real-time.
@app.route('/process_omr_PF', methods=['POST'])
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
    app.run(host='0.0.0.0', port=5001)