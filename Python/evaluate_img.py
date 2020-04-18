# 1- calculation: 
# Genrating objects reference mask useing ref contur
# Generating users weighted mask with user data

# 2- visualizations: 
# Generating user heatmaps for visualization
# Genrating LIME heatmaps from visualizations


# -*- coding: utf-8 -*- 

print ("importing...")

import re
import glob
import copy
import operator

import math
import json
import csv

import os
import os.path


import codecs

import sys
import time
from datetime import datetime
from collections import Counter

# import urllib2,urllib
import urllib3

from collections import defaultdict

import cv2
print ("OpenCV Version: ", cv2.__version__)

import numpy as np
# from matplotlib import pyplot as plt

# from skimage.io import imread
# from skimage.segmentation import mark_boundaries
import scipy.misc



def read_json(json_file):  
    # Fix if there are multiple annotations per image.
    all_imgs = json.load(open(json_file))
    images = [];
    new_user_list = []
    
    for an_img in all_imgs:
        # cut repeated contours

        if an_img["image"] in images:
            for this_ in new_user_list:
                if this_["image"] == an_img["image"]:
                    

                    if ( len(an_img["points"]) > 0):
                        this_["points"].append(an_img["points"])
                        # new_user_list.append({"image":an_img["image"],"contour":1,"points": new_points })

                    # del this_
                    break;
                    # print "\n ", this_["points"][0], "\n ",this_["points"][1]
                    
                    

        else:
            images.append(an_img["image"]);
            new_points = [an_img["points"]]
            new_user_list.append({"image":an_img["image"],"points": new_points }) 

    print ("\n number of user annotations", len(new_user_list))#, new_user_list
    return new_user_list

def read_user_data(img_folder, json_file,tot_user):

    result = []
    
    all_imgs = read_json(json_file)    

    imgs_count = len(all_imgs)

    for an_img in all_imgs:

        jpg_file = img_folder + an_img["image"];
        usr_img =  an_img["points"]

        img_exp, user_mask = img_process(jpg_file,usr_img,tot_user)

        # write_user_exp(img_exp, an_img["image"])

        user_mask = mask_exact_obj(user_mask,an_img["image"]);


        # cv2.imshow('image',img_exp)   
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()

        heatmap_path = './Image/user_mask/'+an_img["image"]

        if os.path.exists(heatmap_path): # image_heatmap.size == imgs_count:
            update_heatmap_mask(heatmap_path, user_mask)
        else:
            # print heatmap_path
            # user_mask[:] = np.arange(255)
            scipy.misc.imsave(heatmap_path, user_mask)

        
        result.append({"image": 0,"recall": 0,"precision": 0,"accuracy": 0})

    return result

def mask_exact_obj(user_mask,this_image):
    
    # print "This image: ", this_image, len(user_mask), len(ref_mask[0])
    masked = 0
    for this_ref in ref_mask:
        if this_ref[0] == this_image: 
            user_mask = cv2.bitwise_and(user_mask,this_ref[1])
            masked = 1

    if (masked == 0):
        print ("\n Error: didn't ref masked: ", this_image)

    return user_mask

def reference_mask(img_folder, ref_file,ref_mask):
    print ("\n Reference Mask...")
    # user_mask = read_ref(img_folder, ref_file)   #ref_mask

    all_imgs = read_json(ref_file)    

    imgs_count = len(all_imgs)

    for an_img in all_imgs:

        jpg_file = img_folder + an_img["image"];
        usr_img =  an_img["points"]
        # print an_img["image"]

        img_exp, user_mask = img_process(jpg_file,usr_img,1)
        
        ref_mask.append( [an_img["image"], user_mask] )      # ref_mask.append(user_mask)    

        # cv2.imshow('image',img_exp)   
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()


    return 0

def update_heatmap_mask(heatmap_path, user_mask):
    
    old_mask = cv2.imread(heatmap_path,0);

    new_mask = cv2.add(old_mask,user_mask)

    # cv2.imshow('image',new_mask)   
    # cv2.waitKey(0)                
    # cv2.destroyAllWindows()

    # image_heatmap.append()  
    scipy.misc.imsave(heatmap_path, new_mask)

    return 0

def user_heatmap(img_folder,heatmap_folder,mask_folder):
    print ("\n User heatmap...")
    for this_img in ref_mask:

        gray_mask_path = mask_folder + this_img[0]
        raw_img_path = img_folder + this_img[0]

        gray_mask = cv2.imread(gray_mask_path,0);
        raw_img = cv2.imread(raw_img_path,3);
        
        heatmap = cv2.applyColorMap(gray_mask,cv2.COLORMAP_JET)  # cv2.COLORMAP_AUTUMN COLORMAP_RAINBOW COLORMAP_JET
        # print this_img[1]
        # print heatmap
        masked_heatmap = cv2.bitwise_and(heatmap,heatmap,mask = this_img[1])

        # print len(raw_img), len(heatmap)

        new_raw_img = raw_img.copy()
        rows,cols,channels = masked_heatmap.shape
        roi = new_raw_img[0:rows, 0:cols ]
        
        gray_mask_inv = cv2.bitwise_not(gray_mask)
        # Now black-out the area of logo in ROI
        img1_bg = cv2.bitwise_and(roi,roi,mask = gray_mask_inv)
        # Take only region of logo from logo image.
        img2_fg = cv2.bitwise_and(masked_heatmap,masked_heatmap,mask = gray_mask)
        # Put logo in ROI and modify the main image
        dst = cv2.add(img1_bg,img2_fg)
        # raw_img[0:rows, 0:cols ] = dst
        
        new_raw_img[0:rows, 0:cols ] = dst
        
        # cv2.imshow('frame0',dst)
        # cv2.imshow('frame1',raw_img)
        # cv2.imshow('frame2',new_raw_img)
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()
        # print len(raw_img), len(heatmap)

        alpha = 0.3;
        blend_heatmap = cv2.addWeighted(raw_img,alpha,new_raw_img,1-alpha,0)


        # blend_heatmap = cv2.addWeighted(raw_img,0.6,masked_heatmap,0.6,0)
        
        user_heatmap_path = heatmap_folder + this_img[0].split(".")[0] + ".png"

        # scipy.misc.imsave(user_heatmap_path, blend_heatmap)
        cv2.imwrite(user_heatmap_path, blend_heatmap)  # 
        # cv2.imshow('frame',blend_heatmap)
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()



    return 0

def LIME_heatmap(img_folder,LIME_overlay,LIME_mask):
    print ("\n LIME heatmap...")
    for this_img in ref_mask:

        gray_mask_path = LIME_mask + "mask_"+ this_img[0] + ".jpg"
        raw_img_path = img_folder + this_img[0]

        gray_mask = cv2.imread(gray_mask_path,0);
        # print gray_mask.max()
        raw_img = cv2.imread(raw_img_path,3);
        raw_img = cv2.resize(raw_img, (299,299))

        heatmap = cv2.applyColorMap(gray_mask,cv2.COLORMAP_HSV)  # cv2.COLORMAP_AUTUMN COLORMAP_RAINBOW COLORMAP_JET
        # cv2.imshow('heatmap',heatmap)

        # ref_img = cv2.resize(this_img[1], (299,299))
        # masked_heatmap = cv2.bitwise_and(heatmap,heatmap,mask = gray_mask)
        # xx = cv2.add(masked_heatmap, raw_img)  # simple add
        
        new_raw_img = raw_img.copy()
        rows,cols,channels = heatmap.shape
        roi = new_raw_img[0:rows, 0:cols ]
        
        gray_mask_inv = cv2.bitwise_not(gray_mask)
        # Now black-out the area of logo in ROI
        img1_bg = cv2.bitwise_and(roi,roi,mask = gray_mask_inv)
        # Take only region of logo from logo image.
        img2_fg = cv2.bitwise_and(heatmap,heatmap,mask = gray_mask)
        # Put logo in ROI and modify the main image
        dst = cv2.add(img1_bg,img2_fg)
        # raw_img[0:rows, 0:cols ] = dst
        
        new_raw_img[0:rows, 0:cols ] = dst
        
        # cv2.imshow('frame0',dst)
        # cv2.imshow('frame1',raw_img)
        # cv2.imshow('frame2',new_raw_img)
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()
        # print len(raw_img), len(heatmap)

        alpha = 0.4;
        blend_heatmap = cv2.addWeighted(raw_img,alpha,new_raw_img,1-alpha,0)
        # cv2.addWeighted(overlay, alpha, output, 1 - alpha, 0, output)
        LIME_overlay_path = LIME_overlay + this_img[0].split(".")[0] + ".png"

        # scipy.misc.imsave(user_heatmap_path, blend_heatmap)
        cv2.imwrite(LIME_overlay_path, blend_heatmap)  # .png
        # cv2.imshow('frame',blend_heatmap)
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()



    return 0

def write_user_exp(img_exp, jpg_file):
    # Writing a sample user. 
    scipy.misc.imsave('./Image/exp_user/exp_'+jpg_file+ '.jpg', img_exp)

def img_process(jpg_file,usr_img,tot_user):
    
    exp_img = cv2.imread(jpg_file,0)  # load in grayscale 

    size_y = exp_img.shape[1] 
    size_x = exp_img.shape[0]     
    
    mask = np.zeros((size_x,size_y), np.uint8)    #     np.zeros((size_x,size_y,1), np.uint8)

    size_y = mask.shape[1] 
    size_x = mask.shape[0]
    
    sketch_points = len(usr_img);
    # print "sketch_size", sketch_points

    contours = []

    for j in xrange(0,sketch_points):
        sketch_size = len(usr_img[j])
        for i in xrange(0,sketch_size):
            x_ = int(usr_img[j][i][1])
            y_ = int(usr_img[j][i][0])
            x_ = sorted([0, x_, size_x-1])[1]
            y_ = sorted([0, y_, size_y-1])[1]

            mask[x_,y_] = 255 / tot_user;
            exp_img[x_,y_] = 0

        contours.append([np.array([usr_img[j]], dtype=np.int32)])
        cv2.drawContours(exp_img, [contours[j][0]], 0, (255),3)    # 1: Line thinckness 
        cv2.drawContours(mask, [contours[j][0]], 0, (255 / tot_user),-1)   # -1: Fill the controur 
    
        # cv2.imshow('image',exp_img)   
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()

    return exp_img, mask

def evaluate_explanations():
    print ("\n Explanation Evaluation...")
    
    # Precision: TP/(TP + FP)
    # Recall: TP/(TP + FN)

    # TP: mask(LIME,user_mask).sum()
    # FP: user_mask - mask(LIME, user_mask).sum()
    # FN: mask(LIME, ref_inv).sum()

    # LIME = 255
    # User = weighted (0..255)
    
    PR = []

    for this_img in ref_mask:

        user_mask_path = mask_folder + this_img[0]
        LIME_mask_path = LIME_mask + "mask_"+ this_img[0] + ".jpg"

        gray_user_mask = cv2.imread(user_mask_path,0);
        gray_user_mask = cv2.resize(gray_user_mask, (299,299))
        LIME_exp_mask = cv2.imread(LIME_mask_path,0);
        ref_mask_gray = cv2.resize(this_img[1], (299,299))

        TP = cv2.bitwise_and(gray_user_mask,gray_user_mask,mask = LIME_exp_mask).sum()
        ref_mask_gray_inv = cv2.bitwise_not(ref_mask_gray)
        FN = cv2.bitwise_and(LIME_exp_mask,LIME_exp_mask,mask = ref_mask_gray_inv).sum()
        LIME_exp_mask_inv = cv2.bitwise_not(LIME_exp_mask)
        FP = cv2.bitwise_and(gray_user_mask,gray_user_mask,mask = LIME_exp_mask_inv).sum()

        # cv2.imshow('TP',TP)
        # cv2.imshow('FN',FN)
        # cv2.imshow('FP',FP)
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()
        print (TP, FN,FP)
        precision =  float(TP)/(TP + FP)
        recall = float(TP)/(TP + FN)
        PR.append([precision, recall])

    all_precision=0
    all_recall=0
    
    for this_PR in PR:
        all_precision += this_PR[0]
        all_recall += this_PR[1]

    Precision = all_precision/len(PR)
    Recall = all_recall/len(PR)
    
    print ("\n Precision: ", Presicion , "Recall :", Recall)

    return Precision, Recall

def user_mask(img_folder,res_folder):
    print ("\n User Mask...")
    image_heatmap = []
    user_accuracy = []

    tot_user = 9;
    for i in xrange(1,tot_user+1):   # users loop 
            # contour_img(img_folder + "test.jpg")
        print ("user: P", i)
        images_accuracy = read_user_data(img_folder, res_folder+"P"+str(i)+".json",tot_user)
        user_accuracy.append(images_accuracy)
   

ref_mask = [];
img_folder = "./Image/org_img/"
heatmap_folder = "./Image/user_heatmap/"
LIME_mask = "./Image/LIME_mask/"
LIME_overlay = "./Image/LIME_overlay/"
mask_folder = "./Image/user_mask/"
res_folder = "./Image/json_res/"


# shutil.rmtree(mask_folder)
# os.remove(mask_folder, *, dir_fd=None)


# Genrating objects reference mask useing ref contur
# reference_mask(img_folder, res_folder+"ref.json",ref_mask);

# Generating users weighted mask with user data
# user_mask(img_folder,res_folder)

# Generating user heatmaps for visualization
# user_heatmap(img_folder,heatmap_folder,mask_folder);

# Genrating LIME heatmaps from visualizations
# LIME_heatmap(img_folder,LIME_overlay,LIME_mask);

# Calculating explanations score compared to user
Precision, Recall = evaluate_explanations();

