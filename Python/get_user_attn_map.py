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

# print ("OpenCV Version: ", cv2.__version__)
# print ("SciPy Version: ", scipy.__version__)
# print ("NumPy Version: ", np.__version__)


# script to get and save json files form mturk csv file
from mturk_to_json import get_jsons



def files_name(folder):

    for filename in os.listdir(folder):
        print ('"data/VOC_org/'+filename+'",')




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

    # print ("User anns: ", len(new_user_list))#, new_user_list
    return new_user_list

def read_user_data(img_folder, json_file,tot_user):

    result = []
    
    all_imgs = read_json(json_file)    

    imgs_count = len(all_imgs)

    for an_img in all_imgs:

        if an_img["image"] not in attention_checks:

            usr_img =  an_img["points"]
            jpg_file = img_folder + an_img["image"];
            heatmap_path = attn_mask_folder + an_img["image"];

            img_exp, user_mask = img_process(jpg_file,usr_img,tot_user)

            user_mask = mask_exact_obj(user_mask,an_img["image"]);

            # cv2.imshow('image',img_exp)   
            # cv2.waitKey(0)                
            # cv2.destroyAllWindows()

            if os.path.exists(heatmap_path): # image_heatmap.size == imgs_count:
                update_heatmap_mask(heatmap_path, user_mask)
            else:
                # print (heatmap_path)
                cv2.imwrite(heatmap_path, user_mask)

            result.append({"image": 0,"recall": 0,"precision": 0,"accuracy": 0})

    return result


def segmentation_mask(ref_mask, seg_mask_folder):

    print ('segmentation_mask...')
    result = []
    
    for this_ref in ref_mask:
        if this_ref[0] not in attention_checks:
            seg_mask_path = seg_mask_folder + this_ref[0];
            
            if os.path.exists(seg_mask_path): # image_heatmap.size == imgs_count:
                print ('already exists! ', seg_mask_path)
                # update_heatmap_mask(heatmap_path, user_mask)
            else:
                cv2.imwrite(seg_mask_path, this_ref[1])  #   *annt_per_imgs

    return 0

def mask_exact_obj(user_mask,this_image):
    
    # print "This image: ", this_image, len(user_mask), len(ref_mask[0])
    masked = 0
    for this_ref in ref_mask:
        if this_ref[0] == this_image: 
            user_mask = cv2.bitwise_and(user_mask,this_ref[1])
            masked = 1

    if (masked == 0):
        print ("\n Error: couldn't find the ref masked: ", this_image)

    return user_mask



def reference_mask(img_folder, ref_file,ref_mask):
    print (" Reference Mask...")
    # user_mask = read_ref(img_folder, ref_file)   #ref_mask

    all_imgs = read_json(ref_file)    

    for an_img in all_imgs:

        if an_img["image"] not in attention_checks:
            jpg_file = img_folder +  an_img["image"];       # + "cat-"+ an_img["image"] + ".jpg";

            usr_img =  an_img["points"];

            img_exp, user_mask = img_process(jpg_file,usr_img,1)
            
            ref_mask.append( [an_img["image"], user_mask] ) 
        # else:
        #     print ("Attention Check: ", an_img["image"])
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

def user_heatmap(img_folder,heatmap_folder,attn_mask_folder):
    print ("\n User heatmap...")
    for this_img in ref_mask:

        if this_img[0] not in attention_checks:
            gray_mask_path = attn_mask_folder + this_img[0]
            raw_img_path = img_folder + this_img[0]
            
            gray_mask = cv2.imread(gray_mask_path,0);
            raw_img = cv2.imread(raw_img_path,3);
            
            heatmap = cv2.applyColorMap(gray_mask,cv2.COLORMAP_TURBO)  # COLORMAP_JET COLORMAP_TURBO cv2.COLORMAP_AUTUMN COLORMAP_RAINBOW 
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

    exp_img = cv2.imread(jpg_file,0)    # load in grayscale 

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

            x_ = int(float(usr_img[j][i][1])*img_to_ann_ratio)
            y_ = int(float(usr_img[j][i][0])*img_to_ann_ratio)
            x_ = sorted([0, x_, size_x-1])[1]
            y_ = sorted([0, y_, size_y-1])[1]

            new_usr_img.append([float(usr_img[j][i][0])*img_to_ann_ratio,float(usr_img[j][i][1])*img_to_ann_ratio])

            mask[x_,y_] = 255 / annt_per_imgs;
            exp_img[x_,y_] = 0

        contours.append([np.array([new_usr_img], dtype=np.int32)])
        # contours.append([np.array([_usr_img[j]], dtype=np.int32)])
        cv2.drawContours(exp_img, [contours[j][0]], 0, (255),3)    # 1: Line thinckness 
        cv2.drawContours(mask, [contours[j][0]], 0, (255 / annt_per_imgs),-1)   # -1: Fill the controur 
    
        # cv2.imshow('image',exp_img)   
        # cv2.waitKey(0)                
        # cv2.destroyAllWindows()

    return exp_img, mask


def user_att_mask(img_folder,res_folder):
    print ("\n User Mask...")


    for i in range(1,tot_user+1):   # users loop 

        print ("User: P", i)
        images_accuracy = read_user_data(img_folder, res_folder+"P"+str(i)+".json",tot_user)
   

batches = ['batch-2'] # ,'batch-2','batch-3','batch-4']
tot_user = 91;
annt_per_imgs = 9;
img_to_ann_ratio = 0.5;

for batch in batches:

    print ('Batch: ', batch)

    # 0- Create participants' annotation records from mturk csv
    # get_jsons(batch)
    # get_workers(batchs)

    
    ref_mask = [];
    img_folder = "../data/VOC2012_raw/"                     # original raw images  
    attn_mask_folder = "../data/user_attn_maps/"+batch+"/"              # Final binary human-attention mask
    seg_mask_folder = "../data/user_seg_maps/"+batch+"/"              # Final binary human-attention mask
    
    res_folder = "../user-study/mturk-annotation-results/"+batch+"/json/"
    ref_folder = "../user-study/mturk-annotation-results/"+batch+"/ref/"

    # to save an overlay of user attention-map on raw image
    heatmap_folder = "../data/user_attn_overlay/"+batch+"/"

    LIME_mask = "./Image/LIME_mask/"
    LIME_overlay = "./Image/LIME_overlay/"

    attention_checks = ["cat-2007_000528.jpg","cat-2007_000876.jpg","cat-2007_003778.jpg","cat-2008_000824.jpg"]

    # test_folder = "../data/test/"  
    # files_name(test_folder)
    
    # Genrating objects reference mask useing ref contur
    keys = [0,1,2,3,4,5,6,7,8,9]
    for each_key in keys:
        reference_mask(img_folder, ref_folder+"ref-"+str(each_key)+".json",ref_mask);

    # 1- Generating users weighted mask with user data
    # erase_folder(attn_mask_folder)
    # user_att_mask(img_folder,res_folder)

    # 2- Generating users weighted mask with user data
    erase_folder(seg_mask_folder)
    segmentation_mask(ref_mask,seg_mask_folder)

    # 3- Generating user heatmaps for visualization
    # erase_folder(heatmap_folder)
    # user_heatmap(img_folder,heatmap_folder,attn_mask_folder);
