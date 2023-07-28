import cv2
import numpy as np
import math
import json
import pupil_apriltags as apriltag

# create apriltag detector for families tag36h11
at_detector = apriltag.Detector(families='tag36h11')
TAG_SIZE = 33.30
tag_real_size = 22

def camera_to_world(cam_mtx, r_mat, t, img_points):

    inv_k = np.asmatrix(cam_mtx).I
    # invR * T
    inv_r = np.asmatrix(r_mat).I  # 3*3
    transPlaneToCam = np.dot(inv_r, np.asmatrix(t))  # 3*3 dot 3*1 = 3*1
    world_pt = []
    coords = np.zeros((3, 1), dtype=np.float64)
    for img_pt in img_points:
        coords[0][0] = img_pt[0][0]
        coords[1][0] = img_pt[0][1]
        coords[2][0] = 1.0
        worldPtCam = np.dot(inv_k, coords)  # 3*3 dot 3*1 = 3*1
        # [x,y,1] * invR
        worldPtPlane = np.dot(inv_r, worldPtCam)  # 3*3 dot 3*1 = 3*1
        # zc
        scale = transPlaneToCam[2][0] / worldPtPlane[2][0]
        # zc * [x,y,1] * invR
        scale_worldPtPlane = np.multiply(scale, worldPtPlane)
        # [X,Y,Z]=zc*[x,y,1]*invR - invR*T
        worldPtPlaneReproject = np.asmatrix(scale_worldPtPlane) - np.asmatrix(transPlaneToCam)  # 3*1 dot 1*3 = 3*3
        pt = np.zeros((3, 1), dtype=np.float64)
        pt[0][0] = worldPtPlaneReproject[0][0]
        pt[1][0] = worldPtPlaneReproject[1][0]
        pt[2][0] = 0
        world_pt.append(pt.T.tolist())
    return world_pt

#get image data
image =cv2.imread("./image/input.jpg") # do 5 kosov visoka
#create image for display output
output = image.copy()
#convert rgb to gray 
img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

camera_params = {'K': [[390.86761474609375, 0.0, 314.56004185520214],
                        [0.0, 440.59173583984375, 232.1905098724892],
                        [0.0, 0.0, 1.0]],
                 'R': [[-0.017766421721732397], [-3.122321216929027], [0.03274083772920534]],
                 'T': [[-0.1904723252544887], [51.149278678328216], [154.3334146634379]]}

K = np.array(camera_params['K'], dtype=np.float64).reshape(3, 3)
T = np.array(camera_params['T'], dtype=np.float64).reshape(3, 1)
R = np.array(camera_params['R'], dtype=np.float64).reshape(3, 1)
r_mat = np.zeros((3, 3), dtype=np.float64)
cv2.Rodrigues(R, r_mat)

frame_gray = cv2.cvtColor(np.copy(image), cv2.COLOR_RGB2GRAY)
params = [K[0][0], K[1][1], K[0][2], K[1][2]]  # 相机内参
tags = at_detector.detect(frame_gray, estimate_tag_pose=True, camera_params=params, tag_size=TAG_SIZE)  #
for tag in tags:
    corners = tag.corners.reshape(1, -1, 2).astype(int)
    dx = corners[0][1][0] - corners[0][2][0]
    dy = corners[0][1][1] - corners[0][2][1]
    tag_length_pixels = np.sqrt(dx**2 + dy**2)
    scale_factor = tag_real_size / tag_length_pixels
    center = tag.center.astype(int)
    id = tag.tag_id

    coordinates_text = "package center: " + str(center[0]) + ", " + str(center[1]) + ""
    id_text = "id: " + str(id)    # font
    font = cv2.FONT_HERSHEY_SIMPLEX
    # org
#     org1 = (center[0] + 30, center[1] + 5)
#     org2 = (center[0] + 30, center[1] + 35)

    org1 = (220, 400)
    org2 = (220, 440)

    # fontScale
    fontScale = 0.75
    # Red color in BGR
    color = (0, 0, 255)
    # Line thickness of 2 px
    thickness = 2
    cv2.putText(image, coordinates_text, org1, font, fontScale, color, thickness, cv2.LINE_AA)
    cv2.putText(image, id_text, org2, font, fontScale, color, thickness, cv2.LINE_AA)

    cv2.drawContours(image, corners, -1, (255, 0, 0), 3)
    cv2.circle(image, tuple(center), 5, (255, 255, 0), 10)


img_h, img_w = img.shape[:2]
cv2.line(image, (int(img_w / 2 - 10), int(img_h / 2)), (int(img_w / 2 + 10), int(img_h / 2)), (0, 255, 255), 2)
cv2.line(image, (int(img_w / 2), int(img_h / 2 - 10)), (int(img_w / 2), int(img_h / 2 + 10)), (0, 255, 255), 2)
cv2.imwrite("./image/atdetect.jpg", image)
cv2.imshow("april tags detection",image)
# cv2.waitKey(0)


# save max. area and its coordinates to object data
data_json = {
    "x_c" : int(center[0]),
    "y_c" : int(center[1]),
    "id" : int(id),
    "scale": float(scale_factor),
    "length": float(tag_length_pixels)
}
# transform object data to json data and print in console
# if (S and Center) is not None:
print(json.dumps(data_json))
# else:
#     print(ValueError)

# cv2.imshow("o",img)
# cv2.imshow("edges - threshold",thresh)
# cv2.imshow("output",output)
# cv2.waitKey(0)


#show every number package by area size
""" 
1 --> 47555.797     
2 --> 54495.3257
3 --> 61934.139
4 --> 70604.76
5 --> 82578.91

d = 11974.15    5 - 4 
d = 8670.62     4 - 3
d = 7438.81     3 - 2
d = 6939,5287   2 - 1

gain = 1,38     5-4 / 4-3 
gain = 1,16     4-3 / 3-2
gain = 1,07     3-2 / 2-1 eksponentna funkcija

"""