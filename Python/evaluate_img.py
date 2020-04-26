# Calculate AUPR
# Calculate soft-IoU 
# Calculate rank corollation 
# Calculate subjective human judgment 

# Generating user attention map from mTurk studies

# -*- coding: utf-8 -*- 

import re
import glob
import copy
import operator

import math
import json
import csv

import os, shutil
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
import numpy as np
# from matplotlib import pyplot as plt
# from skimage.io import imread
# from skimage.segmentation import mark_boundaries
import scipy.misc
print ("OpenCV Version: ", cv2.__version__)
print ("SciPy Version: ", scipy.__version__)
print ("NumPy Version: ", np.__version__)




def erase_folder(folder):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))




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

        usr_img =  an_img["points"]
        # jpg_file = img_folder + an_img["image"];
        jpg_file_1 = img_folder + "cat-"+ an_img["image"] + ".jpg";
        jpg_file_2 = img_folder + "dog-"+ an_img["image"] + ".jpg";
        if os.path.exists(jpg_file_1):
            jpg_file = jpg_file_1
            heatmap_path = usr_mask_folder + "cat-" + an_img["image"] + ".jpg";
        else: 
            jpg_file = jpg_file_2
            heatmap_path = usr_mask_folder + "dog-" + an_img["image"] + ".jpg";
            

        img_exp, user_mask = img_process(jpg_file,usr_img,tot_user)

        # write_user_exp(img_exp, an_img["image"])

        user_mask = mask_exact_obj(user_mask,an_img["image"]);


        # cv2.imshow('image',img_exp)   
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()

        # heatmap_path = mask_folder+an_img["image"]  # './Image/user_mask/'

        if os.path.exists(heatmap_path): # image_heatmap.size == imgs_count:

            update_heatmap_mask(heatmap_path, user_mask)
        else:
            print (heatmap_path)
            # user_mask[:] = np.arange(255)
            # scipy.misc.imsave(heatmap_path, user_mask)
            cv2.imwrite(heatmap_path, user_mask)

        
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
        print ("\n Error: couldn't get the ref masked: ", this_image)

    return user_mask

def reference_mask(img_folder, ref_file,ref_mask):
    print ("\n Reference Mask...")
    # user_mask = read_ref(img_folder, ref_file)   #ref_mask

    all_imgs = read_json(ref_file)    

    imgs_count = len(all_imgs)

    for an_img in all_imgs:

        jpg_file_1 = img_folder + "cat-"+ an_img["image"] + ".jpg";
        jpg_file_2 = img_folder + "dog-"+ an_img["image"] + ".jpg";
        if os.path.exists(jpg_file_1):
            jpg_file = jpg_file_1
        else: 
            jpg_file = jpg_file_2

        usr_img =  an_img["points"]
        # print an_img["image"]

        img_exp, user_mask = img_process(jpg_file,usr_img,1)
        
        ref_mask.append( [an_img["image"], user_mask] )      # ref_mask.append(user_mask)    
        # ref_mask.append( [jpg_file, user_mask] )      # ref_mask.append(user_mask)    

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
    # scipy.misc.imsave(heatmap_path, new_mask)
    cv2.imwrite(heatmap_path, new_mask)

    return 0

def user_heatmap(img_folder,heatmap_folder,usr_mask_folder):
    print ("\n User heatmap...")
    for this_img in ref_mask:

        # gray_mask_path = mask_folder + this_img[0]
        # raw_img_path = img_folder + this_img[0]

        gray_mask_path_1 = usr_mask_folder + "cat-"+ this_img[0] + ".jpg";
        gray_mask_path_2 = usr_mask_folder + "dog-"+ this_img[0] + ".jpg";
        if os.path.exists(gray_mask_path_1):
            gray_mask_path = gray_mask_path_1
            raw_img_path = img_folder + "cat-"+ this_img[0] + ".jpg";
        else: 
            gray_mask_path = gray_mask_path_2
            raw_img_path = img_folder + "dog-"+ this_img[0] + ".jpg";

        gray_mask = cv2.imread(gray_mask_path,0);
        raw_img = cv2.imread(raw_img_path,3);
        
        heatmap = cv2.applyColorMap(gray_mask,cv2.COLORMAP_JET)  # COLORMAP_TURBO  cv2.COLORMAP_AUTUMN COLORMAP_RAINBOW COLORMAP_JET
        masked_heatmap = cv2.bitwise_and(heatmap,heatmap,mask = this_img[1])

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

        alpha = 0.5;
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
    # scipy.misc.imsave('./Image/exp_user/exp_'+jpg_file+ '.jpg', img_exp)
    cv2.imwrite('./Image/exp_user/exp_'+jpg_file+ '.jpg', img_exp)

def img_process(jpg_file,usr_img,tot_user):

    exp_img = cv2.imread(jpg_file,0)  # load in grayscale 

    size_y = exp_img.shape[1] 
    size_x = exp_img.shape[0]     
    
    mask = np.zeros((size_x,size_y), np.uint8)    #     np.zeros((size_x,size_y,1), np.uint8)

    size_y = mask.shape[1] 
    size_x = mask.shape[0]
    
    sketch_points = len(usr_img);


    contours = []
    
    for j in range(0,sketch_points):
        sketch_size = len(usr_img[j])
        new_usr_img = []
        for i in range(0,sketch_size):

            x_ = int(float(usr_img[j][i][1]))
            y_ = int(float(usr_img[j][i][0]))
            x_ = sorted([0, x_, size_x-1])[1]
            y_ = sorted([0, y_, size_y-1])[1]

            new_usr_img.append([float(usr_img[j][i][0]),float(usr_img[j][i][1])])

            mask[x_,y_] = 255 / tot_user;
            exp_img[x_,y_] = 0

        contours.append([np.array([new_usr_img], dtype=np.int32)])
        # contours.append([np.array([_usr_img[j]], dtype=np.int32)])
        cv2.drawContours(exp_img, [contours[j][0]], 0, (255),3)    # 1: Line thinckness 
        cv2.drawContours(mask, [contours[j][0]], 0, (255 / tot_user),-1)   # -1: Fill the controur 
    
        # cv2.imshow('image',exp_img)   
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()

    return exp_img, mask


def evaluate_MAE(user_path,model_path,ref_mask):  # usr_mask_folder, model_mask_folder,ref_mask
    print ("\n Explanation Evaluation...")

    # Calculate MSE        (threshold agnostic)

  
    '''
    We are presenting three quantitative metrics to evaluation model attention maps and compare with human judgment.
    The IoU metric is a threshold 
    The AUPR is a threashold 


    [MAE]
    The final metric is a threshold agnostic metrics to calculate the error in model explanations in comparison to human-attention baseline.
    In our human-attention evaluation, we first normalize both human attention and model attention values. 
    Then, we calculate pixelwise MSE of model attention map in comparison to human-attention map.
    Both huamn-attention and model-attention maps are normalized in values and only the case of complete equal overlap generates
    zero MSE. 
    On the other hand, the carse of no overlap between human and model attention create MSE error of 1.
    Average MAE is reported for the entire test set in Table X.
    '''
    AE = []

    # LIME = 255
    # User = weighted (0..255)

    for this_img in ref_mask:

        # user_file = user_path + this_img[0]
        # model_file = model_path + this_img[0]

        jpg_file_1 = user_path + "cat-"+ this_img[0] + ".jpg";
        jpg_file_2 = user_path + "dog-"+ this_img[0] + ".jpg";
        if os.path.exists(jpg_file_1):
            user_file = jpg_file_1
            model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        else: 
            user_file = jpg_file_2
            model_file = model_path + "dog-"+ this_img[0] + ".jpg";


        user_mask = cv2.imread(user_file,0);
        user_mask = cv2.resize(user_mask, (224,224))
        
        model_mask = cv2.imread(model_file,0);
        model_mask = cv2.resize(model_mask, (224,224))
        

        # normalize user_mask and model_mask
        norm_usr_msk = np.true_divide(user_mask,(user_mask.sum())); 
        norm_mdl_msk = np.true_divide(model_mask, (model_mask.sum()));
        
        this_AE = (abs(norm_usr_msk - norm_mdl_msk)).sum() / 2; # mean() axis=ax
        # mse = ((norm_usr_msk - norm_mdl_msk)**2).sum() / 4;
        AE.append(this_AE)
    
    return [sum(AE) / len(AE), AE]

  

def evaluate_AUPR(user_path,model_path,ref_mask):  # usr_mask_folder, model_mask_folder,ref_mask
    print ("\n Explanation Evaluation...")
    
    # Calculate AUPR       (threshold agnostic)
    # Calculate MSE        (threshold agnostic)
    # Calculate IoU 

    # IoU: TP/(TP + FP + FN)
    # Soft-IoU: TP/(TP + FP + FN)
    # Precision: TP/(TP + FP)
    # Recall: TP/(TP + FN)

    # TP: mask(LIME,user_mask).sum()
    # FP: user_mask - mask(LIME, user_mask).sum()
    # FN: mask(LIME, ref_inv).sum()

   
    '''
    We are presenting three quantitative metrics to evaluation model attention maps and compare with human judgment.
    The IoU metric is a threshold 
    The AUPR is a threashold 

    [AUPR]
    To calcuate the AUPR for model attention maps, we used 10-point thresholding (0.1.0.2,0.3, ..., 0.9) to obtain
    single layer attention mask from the attention map.
    Using normalized human-attention map and obtained hard masks from model, we calcualate pixel-wise precision and reacll values
    for each image.
    Average AUPR is reported for the entire test set.
    '''

    PR = []


    # LIME = 255
    # User = weighted (0..255)

    for this_img in ref_mask:

        # user_file = user_path + this_img[0]
        # model_file = model_path + this_img[0]

        jpg_file_1 = user_path + "cat-"+ this_img[0] + ".jpg";
        jpg_file_2 = user_path + "dog-"+ this_img[0] + ".jpg";
        if os.path.exists(jpg_file_1):
            user_file = jpg_file_1
            model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        else: 
            user_file = jpg_file_2
            model_file = model_path + "dog-"+ this_img[0] + ".jpg";


        user_mask = cv2.imread(user_file,0);
        user_mask = cv2.resize(user_mask, (224,224))
        
        model_mask = cv2.imread(model_file,0);
        model_mask = cv2.resize(model_mask, (224,224))
        
        # used for IoU        
        ref_mask = cv2.resize(this_img[1], (224,224))


        TP = cv2.bitwise_and(user_mask,user_mask,mask = model_mask).sum();

        ref_mask_inv = cv2.bitwise_not(ref_mask)
        FN = cv2.bitwise_and(model_mask,model_mask,mask = ref_mask_inv).sum()
        
        model_mask_inv = cv2.bitwise_not(model_mask)
        FP = cv2.bitwise_and(user_mask,user_mask,mask = model_mask_inv).sum()

        # cv2.imshow('TP',TP)
        # cv2.imshow('FN',FN)
        # cv2.imshow('FP',FP)
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()
        # print ("TP: , FN: ,FP: ", TP, FN,FP) 
        precision =  float(TP)/(TP + FP)
        recall = float(TP)/(TP + FN)
        print ("\n Precision: ", precision , "Recall :", recall)
        PR.append([precision, recall])


    all_precision=0
    all_recall=0
    
    for this_PR in PR:
        all_precision += this_PR[0]
        all_recall += this_PR[1]

    Precision = all_precision/len(PR)
    Recall = all_recall/len(PR)
    
    print ("\n Average Precision: ", Precision , "Recall :", Recall)

    return Precision, Recall




def evaluate_IoU(user_path,model_path,ref_mask):  # usr_mask_folder, model_mask_folder,ref_mask
    print ("\n Explanation Evaluation...")
    
    # Calculate AUPR       (threshold agnostic)
    # Calculate MSE        (threshold agnostic)
    # Calculate IoU 

    # IoU: TP/(TP + FP + FN)
    # Soft-IoU: TP/(TP + FP + FN)
    # Precision: TP/(TP + FP)
    # Recall: TP/(TP + FN)

    # TP: mask(LIME,user_mask).sum()
    # FP: user_mask - mask(LIME, user_mask).sum()
    # FN: mask(LIME, ref_inv).sum()

   
    '''
    We are presenting three quantitative metrics to evaluation model attention maps and compare with human judgment.
    The IoU metric is a threshold 
    The AUPR is a threashold 

    [IoU]
    IoU metric requires the overlap and union between two hard boundaries to calcutes sample quality.
    Thefore, for our case, we disregard the multilayer human-attantion and take the objects segemetation mask as the baseline.
    Also, we follow related research (e.g., [], [], and []) and use 0.3 as the threshold for the model saliency map to obtain
    single layer localization masks.
    '''

    PR = []


    # LIME = 255
    # User = weighted (0..255)

    for this_img in ref_mask:

        # user_file = user_path + this_img[0]
        # model_file = model_path + this_img[0]

        jpg_file_1 = user_path + "cat-"+ this_img[0] + ".jpg";
        jpg_file_2 = user_path + "dog-"+ this_img[0] + ".jpg";
        if os.path.exists(jpg_file_1):
            user_file = jpg_file_1
            model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        else: 
            user_file = jpg_file_2
            model_file = model_path + "dog-"+ this_img[0] + ".jpg";


        user_mask = cv2.imread(user_file,0);
        user_mask = cv2.resize(user_mask, (224,224))
        
        model_mask = cv2.imread(model_file,0);
        model_mask = cv2.resize(model_mask, (224,224))
        
        # used for IoU        
        ref_mask = cv2.resize(this_img[1], (224,224))


        TP = cv2.bitwise_and(user_mask,user_mask,mask = model_mask).sum();

        ref_mask_inv = cv2.bitwise_not(ref_mask)
        FN = cv2.bitwise_and(model_mask,model_mask,mask = ref_mask_inv).sum()
        
        model_mask_inv = cv2.bitwise_not(model_mask)
        FP = cv2.bitwise_and(user_mask,user_mask,mask = model_mask_inv).sum()

        # cv2.imshow('TP',TP)
        # cv2.imshow('FN',FN)
        # cv2.imshow('FP',FP)
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()
        # print ("TP: , FN: ,FP: ", TP, FN,FP) 
        precision =  float(TP)/(TP + FP)
        recall = float(TP)/(TP + FN)
        print ("\n Precision: ", precision , "Recall :", recall)
        PR.append([precision, recall])


    all_precision=0
    all_recall=0
    
    for this_PR in PR:
        all_precision += this_PR[0]
        all_recall += this_PR[1]

    Precision = all_precision/len(PR)
    Recall = all_recall/len(PR)
    
    print ("\n Average Precision: ", Precision , "Recall :", Recall)

    return Precision, Recall



def user_mask(img_folder,res_folder):
    print ("\n User Mask...")
    image_heatmap = []
    user_accuracy = []

    
    for i in range(1,tot_user+1):   # users loop 
            # contour_img(img_folder + "test.jpg")
        print ("user: P", i)
        images_accuracy = read_user_data(img_folder, res_folder+"P"+str(i)+".json",tot_user)
        user_accuracy.append(images_accuracy)
   


batches = ['batch-1'] # ,'batch-2','batch-3','batch-4']
# ref_mask = [];

for batch in batches:

    print ('Batch: ', batch)
    tot_user = 10;
    ref_mask = [];
    img_folder = "../data/VOC2012_raw/"                                       # original raw images
    model_mask_folder =  "../data/VOC2012_mask/" 
    usr_mask_folder = "../data/user_attn_maps/"+batch+"/"                         # Final binary human-attention mask
    res_folder = "../user-study/mturk-annotation-results/"+batch+"/json/"
    # to save an overlay of user attention-map on raw image
    heatmap_folder = "../data/user_attn_overlay/"+batch+"/"

    model_mask = "../data/VOC2012_mask/"                                       # "./Image/LIME_mask/"
    # model_overlay = "./Image/LIME_overlay/"


    # Genrating objects reference mask useing ref contur
    reference_mask(img_folder, res_folder+"ref.json",ref_mask);

    # Generating users weighted mask with user data
    # erase_folder(usr_mask_folder)
    # user_mask(img_folder,res_folder)

    # Generating user heatmaps for visualization
    # erase_folder(heatmap_folder)
    # user_heatmap(img_folder,heatmap_folder,usr_mask_folder);

    # Genrating LIME heatmaps from visualizations
    # LIME_heatmap(img_folder,LIME_overlay,LIME_mask);

    # Calculating explanations score compared to user
    MAE_all, MAE = evaluate_MAE(usr_mask_folder, model_mask_folder,ref_mask);
    print (MAE_all)
    print (MAE)
    # Precision, Recall = evaluate_AUPR(usr_mask_folder, model_mask_folder,ref_mask);
    # Precision, Recall = evaluate_IoU(usr_mask_folder, model_mask_folder,ref_mask);
    # 