# # step 1: user will upload an image and store it in firebase with a URL file name (OMRCamera.tsx)
# # step 2: user will send a request to the backend to process the image (OMRCamera.tsx)
# # step 3: backend will download the URL image and process it (app.py)
# # step 4: backend will return the score to the localhost named http://127.0.0.1:5000/process_omr (app.py)
# # step 5: frontend will fetch the score from the same localhost (OMRCamera.tsx)
# # step 6: frontend will display the score (OMRCamera.tsx)



# from io import BytesIO
# import requests
# import cv2
# import numpy as np
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# def detect_and_crop_sheet(image):
#     # Convert image to grayscale
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
#     # Apply Gaussian blur and edge detection
#     blurred = cv2.GaussianBlur(gray, (5, 5), 0)
#     edges = cv2.Canny(blurred, 75, 200)
    
#     # Find contours
#     contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
#     # Find the largest contour which should be the outline of the sheet
#     contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
#     sheet_contour = None
#     for contour in contours:
#         # Approximate the contour to get a 4-point boundary
#         epsilon = 0.02 * cv2.arcLength(contour, True)
#         approx = cv2.approxPolyDP(contour, epsilon, True)
#         if len(approx) == 4:
#             sheet_contour = approx
#             break
    
#     if sheet_contour is None:
#         raise ValueError("Unable to detect answer sheet boundaries.")
    
#     # Get a top-down view of the sheet by applying a perspective transform
#     pts = sheet_contour.reshape(4, 2)
#     rect = np.zeros((4, 2), dtype="float32")
    
#     # Order points: top-left, top-right, bottom-right, bottom-left
#     s = pts.sum(axis=1)
#     rect[0] = pts[np.argmin(s)]
#     rect[2] = pts[np.argmax(s)]
    
#     diff = np.diff(pts, axis=1)
#     rect[1] = pts[np.argmin(diff)]
#     rect[3] = pts[np.argmax(diff)]
    
#     (tl, tr, br, bl) = rect
#     widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
#     widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
#     maxWidth = max(int(widthA), int(widthB))
    
#     heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
#     heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
#     maxHeight = max(int(heightA), int(heightB))
    
#     dst = np.array([
#         [0, 0],
#         [maxWidth - 1, 0],
#         [maxWidth - 1, maxHeight - 1],
#         [0, maxHeight - 1]], dtype="float32")
    
#     # Perform the perspective transform to get a cropped and aligned sheet
#     M = cv2.getPerspectiveTransform(rect, dst)
#     warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    
#     return warped


# def omr_processing(image):

#     image = detect_and_crop_sheet(image)
    
#     # Resize cropped image to match the expected sheet dimensions
#     image = cv2.resize(image, (1000, 1400))
    
#     # Convert to grayscale
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     # Apply binary threshold to make the paper white and answers black
#     _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)


#     # Define the grid positions for the answer bubbles
#     answer_bubbles = {
#         1: [(241, 168), (272, 168), (303, 168), (333, 168), (363, 168), (394, 168) ], 
#         2: [(241, 198), (272, 198), (303, 198), (333, 198), (363, 198), (394, 198) ],
#         3: [(241, 229), (272, 229), (303, 229), (333, 229), (363, 229), (394, 229) ],
#         4: [(241, 259), (272, 259), (303, 259), (333, 259), (363, 259), (394, 259) ],
#         5: [(242, 289), (273, 289), (304, 289), (334, 289), (364, 289), (395, 289) ],
#         6: [(241, 320), (272, 320), (303, 320), (333, 320), (363, 320), (394, 320) ],
#         7: [(241, 351), (272, 351), (303, 351), (333, 351), (363, 351), (394, 351) ],
#         8: [(241, 381), (272, 381), (303, 381), (333, 381), (363, 381), (394, 381) ],
#         9: [(242, 411), (273, 411), (304, 411), (334, 411), (364, 411), (395, 411) ],
#         10: [(242, 441), (273, 441), (304, 441), (334, 441), (364, 441), (395, 441) ],
#         11: [(242, 471), (273, 471), (304, 471), (334, 471), (364, 471), (395, 471) ],
#         12: [(242, 502), (273, 502), (304, 502), (334, 502), (364, 502), (395, 502) ],
        
#         13: [(620, 169), (651, 169), (681, 169), (711, 169), (742, 169), (773, 169) ],
#         14: [(621, 200), (651, 200), (681, 200), (711, 200), (742, 200), (773, 200) ],
#         15: [(621, 230), (651, 230), (681, 230), (711, 230), (742, 230), (773, 230) ],
#         16: [(621, 261), (651, 261), (681, 261), (711, 261), (742, 261), (773, 261) ],
#         17: [(622, 290), (652, 290), (682, 290), (712, 290), (743, 290), (774, 290) ],
#         18: [(622, 321), (652, 321), (682, 321), (712, 321), (743, 321), (774, 321) ],
#         19: [(622, 354), (652, 354), (682, 354), (712, 354), (743, 354), (774, 354) ],
#         20: [(622, 384), (652, 384), (682, 384), (712, 384), (743, 384), (774, 384) ],
#         21: [(622, 414), (652, 414), (682, 414), (712, 414), (743, 414), (774, 414) ],
#         22: [(622, 444), (652, 444), (682, 444), (712, 444), (743, 444), (774, 444) ],
#         23: [(622, 473), (652, 473), (682, 473), (712, 473), (743, 473), (774, 473) ],
#         24: [(622, 504), (652, 504), (682, 504), (712, 504), (743, 504), (774, 504) ],

#         25: [(86, 756), (117, 756), (145, 756) , (176, 756), (206, 756), (237, 756), (267, 756) , (296, 756)],
#         26: [(86, 784), (117, 784) , (145, 784) , (176, 784), (206, 784), (237, 784), (267, 784) , (297, 784)],
#         27: [(86, 812), (117, 812) , (145, 812) , (176, 812), (206, 812), (237, 812), (267, 812) , (297, 812)],
#         28: [(87, 840), (118, 840) , (146, 840) , (177, 840), (207, 840), (238, 840), (268, 840) , (298, 840)],
#         29: [(87, 867), (118, 867) , (147, 867) , (178, 867), (208, 867), (239, 867), (269, 867) , (299, 867)],
#         30: [(87, 896), (118, 896) , (147, 896) , (178, 896), (208, 896), (239, 896), (269, 896) , (299, 896)],
#         31: [(87, 926), (118, 926) , (148, 926) , (179, 926), (209, 926), (240, 926), (270, 926) , (300, 926)],
#         32: [(87, 955), (118, 955) , (148, 955) , (179, 955), (209, 955), (240, 955), (270, 955) , (300, 955)],
#         33: [(87, 984), (118, 984) , (148, 984) , (179, 984), (209, 984), (240, 984), (270, 984) , (300, 984)],
#         34: [(90, 1015), (120, 1015) , (151, 1015) , (182, 1015), (213, 1015), (243, 1015), (273, 1015) , (303, 1015)],
#         35: [(90, 1043), (120, 1043) , (151, 1043) , (182, 1043), (213, 1043), (243, 1043), (273, 1043) , (303, 1043)],
#         36: [(90, 1070), (120, 1070) , (151, 1070) , (182, 1070), (213, 1070), (243, 1070), (273, 1070) , (303, 1070)],

#         37: [(406, 758),(437, 758),(466, 758) ,(494, 758) ,(523, 758) ,(557, 758) ,(585, 758) ,(613, 758)  ],
#         38: [(407, 784) ,(437, 785),(466, 784) ,(494, 784) ,(525, 784) ,(557, 784) ,(585, 785) ,(616, 785)],
#         39: [(406, 812) ,(436, 812),(466, 812) ,(494, 812) ,(525, 812) ,(557, 812) ,(587, 812) ,(617, 815)],
#         40: [(408, 841) ,(438, 841),(466, 841) ,(494, 841) ,(523, 841) ,(557, 841) ,(587, 841) ,(617, 841)],
#         41: [(408, 869) ,(440, 869),(470, 869) ,(498, 869) ,(527, 869) ,(557, 869) ,(587, 869) ,(617, 869)],
#         42: [(408, 897) ,(440, 897),(470, 897) ,(498, 897) ,(527, 897) ,(557, 897) ,(587, 897) ,(617, 897)],
#         43: [(407, 927) ,(440, 927),(470, 927) ,(498, 927) ,(527, 927) ,(557, 927) ,(587, 927) ,(617, 927)],
#         44: [(410, 957) ,(440, 955),(469, 955) ,(498, 955) ,(527, 955) ,(557, 955) ,(587, 955) ,(617, 956)],
#         45: [(410, 984) ,(440, 984),(469, 984) ,(498, 984) ,(527, 984) ,(557, 984) ,(587, 984) ,(617, 984)],
#         46: [(410, 1015) ,(440, 1015),(469, 1015) ,(498, 1015) ,(527, 1015) ,(557, 1015) ,(587, 1015) ,(617, 1015)],
#         47: [(411, 1043),(440, 1043),(469, 1043) ,(498, 1043) ,(528, 1043) ,(558, 1043) ,(588, 1043) ,(618, 1044) ],
#         48: [(411, 1072),(440, 1072),(470, 1072) ,(498, 1072) ,(530, 1072) ,(559, 1072) ,(588, 1072) ,(618, 1072) ],


#         49: [(721, 760),(751, 760),(782, 760) ,(813, 760) ,(843, 760) ,(874, 760) ,(904, 760) ,(934, 760)  ],
#         50: [(721, 789) ,(751, 789),(782, 789) ,(813, 789) ,(844, 789) ,(875, 789) ,(905, 789) ,(935, 789)],
#         51: [(721, 817) ,(752, 817),(782, 817) ,(813, 817) ,(844, 817) ,(875, 817) ,(905, 817) ,(935, 817)],
#         52: [(722, 845) ,(753, 845),(783, 845) ,(813, 845) ,(844, 845) ,(875, 845) ,(905, 845) ,(935, 845)],
#         53: [(723, 874) ,(754, 874),(784, 874) ,(815, 874) ,(845, 874) ,(876, 874) ,(906, 874) ,(936, 874)],
#         54: [(723, 902) ,(754, 902),(784, 902) ,(815, 902) ,(845, 902) ,(876, 902) ,(906, 902) ,(936, 902)],
#         55: [(724, 932) ,(755, 932),(785, 932) ,(816, 932) ,(846, 932) ,(877, 932) ,(907, 932) ,(937, 932)],
#         56: [(724, 960) ,(755, 960),(785, 960) ,(816, 960) ,(846, 960) ,(877, 960) ,(907, 960) ,(937, 960)],
#         57: [(724, 988) ,(755, 988),(785, 988) ,(816, 988) ,(846, 988) ,(877, 988) ,(907, 988) ,(937, 988)],
#         58: [(724, 1018) ,(755, 1018),(785, 1018) ,(816, 1018) ,(846, 1018) ,(877, 1018) ,(907, 1018) ,(937, 1018)],
#         59: [(726, 1047) ,(757, 1047),(788, 1047) ,(819, 1047) ,(849, 1047) ,(880, 1047) ,(910, 1047) ,(940, 1047)],
#         60: [(726, 1075) ,(757, 1075),(788, 1075) ,(819, 1075) ,(849, 1075) ,(880, 1075) ,(910, 1075) ,(940, 1075)]
                
        
       
#     }

#     # Correct answer key
#     answer_key = {1: 'D', 2: 'E', 3: 'A', 4: 'B', 5: 'F', 6: 'C', 7: 'F', 8: 'B', 9: 'A', 10: 'C', 11: 'D', 12: 'E',
#         13: 'B', 14: 'F', 15: 'A', 16: 'B', 17: 'A', 18: 'C', 19: 'E', 20: 'F', 21: 'D', 22: 'C', 23: 'D', 24: 'E',
#         25: 'H', 26: 'B', 27: 'C', 28: 'H', 29: 'G', 30: 'D', 31: 'E', 32: 'A', 33: 'G', 34: 'F', 35: 'A', 36: 'B',
#         37: 'C', 38: 'D', 39: 'C', 40: 'G', 41: 'H', 42: 'F', 43: 'E', 44: 'D', 45: 'A', 46: 'B', 47: 'E', 48: 'F',
#         49: 'G', 50: 'F', 51: 'H', 52: 'B', 53: 'A', 54: 'E', 55: 'A', 56: 'F', 57: 'C', 58: 'B', 59: 'D', 60: 'E'}
    
#     marked_answers = {}
    
#     # Visualize detection for debugging
#     for question, bubbles in answer_bubbles.items():
#         print(f"Processing Question {question} with bubbles {bubbles}")  # Debugging print
#         marked_bubble_count = 0
#         for i, (x, y) in enumerate(bubbles):
#             # Draw rectangles on the image to visualize bubble positions
#             cv2.circle(image, (x, y), 11, (255, 0, 0), 2)  # Blue circle with radius 20
            
#             # Extract region of interest (ROI) for each bubble
#             roi = thresh[y-20:y+20, x-20:x+20]  # Small region around the bubble
            
#             # Check if the ROI is filled (marked)
#             filled = cv2.countNonZero(roi)
#             if filled > 500:  # Threshold for considering it marked
#                 marked_bubble_count += 1
#                 if marked_bubble_count > 1:  # Check for multiple marked bubbles
#                     marked_answers[question] = None  # Award zero points if multiple marked
#                     break  # No need to check further bubbles for this question
#                 else:
#                     marked_answers[question] = chr(65 + i)  # 'A' is 65 in ASCII
#                 cv2.putText(image, "Marked", (x - 40, y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

#         # Now draw the correct answer with a green box for visualization
#         correct_answer = answer_key[question]
#         correct_index = ord(correct_answer) - 65  # Convert 'A', 'B', 'C', 'D' to index 0, 1, 2, 3
#         correct_x, correct_y = bubbles[correct_index]
#         cv2.circle(image, (correct_x, correct_y), 10, (0, 0, 255), 2)  # red circle for correct answer
#         # cv2.putText(image, "Correct", (correct_x - 40, correct_y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

#     # Calculate the score
#     correct_answers = 0
#     for question, marked in marked_answers.items():
#         if marked == answer_key[question]:
#             correct_answers += 1
    
#     # Save the debug image with marked areas and correct answers
#     cv2.imwrite('marked_answer_sheet_updated.png', image)  # Save updated image with green boxes for correct answers
    
    
#     return correct_answers

# @app.route('/process_omr', methods=['POST'])
# def process_omr():
#     # Get the image URL from the incoming request
#     image_url = request.json.get('image_url')
    
#     # Get image data from URL (in memory, no saving to disk)
#     img_data = requests.get(image_url).content
#     image = np.asarray(bytearray(img_data), dtype=np.uint8)
#     img = cv2.imdecode(image, cv2.IMREAD_COLOR)

#     # Process the image to calculate the score
#     score = omr_processing(img)

#     # Return the score as a JSON response
#     return jsonify({'score': score})

# if __name__ == '__main__':
#     app.run(debug=True)