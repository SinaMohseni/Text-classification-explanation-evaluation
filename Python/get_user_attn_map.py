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
# from mturk_to_json import get_jsons



all_lab = {}

# bic_class = ["bicycle/2007_000515", "bicycle/2007_000793", "bicycle/2007_001027", "bicycle/2007_005702", "bicycle/2008_000803"] //, "bicycle/2008_001336", "bicycle/2008_001404", "bicycle/2008_001626", "bicycle/2008_002370", "bicycle/2008_002948", "bicycle/2008_003075", "bicycle/2008_003351", "bicycle/2008_003940", "bicycle/2008_004040", "bicycle/2008_004331", "bicycle/2008_004862", "bicycle/2008_005201", "bicycle/2008_006088", "bicycle/2008_006195", "bicycle/2008_006645", "bicycle/2008_007761", "bicycle/2008_008080", "bicycle/2008_008357", "bicycle/2008_008579", "bicycle/2008_008705", "bicycle/2009_000161", "bicycle/2009_000281", "bicycle/2009_000757", "bicycle/2009_001642", "bicycle/2009_001915", "bicycle/2009_002371", "bicycle/2009_002404", "bicycle/2009_002777", "bicycle/2009_003469", "bicycle/2009_004496", "bicycle/2009_004518", "bicycle/2009_004710", "bicycle/2009_004984", "bicycle/2010_000113", "bicycle/2010_001431", "bicycle/2010_001606", "bicycle/2010_002720", "bicycle/2010_003912", "bicycle/2010_004069", "bicycle/2011_000465", "bicycle/2011_001599", "bicycle/2011_002543", "bicycle/2011_002657", "bicycle/2011_002811", "bicycle/2011_002913"]
# plane_class = ["aeroplane/2007_000256", "aeroplane/2007_001377", "aeroplane/2007_004988", "aeroplane/2007_005043", "aeroplane/2007_006232"] // , "aeroplane/2007_009348", "aeroplane/2008_000251", "aeroplane/2008_001805", "aeroplane/2008_003189", "aeroplane/2008_003261", "aeroplane/2008_003275", "aeroplane/2008_003673", "aeroplane/2008_003905", "aeroplane/2008_004406", "aeroplane/2008_004532", "aeroplane/2008_004885", "aeroplane/2008_005078", "aeroplane/2008_005538", "aeroplane/2008_005796", "aeroplane/2008_006213", "aeroplane/2008_006216", "aeroplane/2008_006401", "aeroplane/2008_006920", "aeroplane/2008_007195", "aeroplane/2008_007764", "aeroplane/2008_007970", "aeroplane/2008_008048", "aeroplane/2008_008479", "aeroplane/2008_008546", "aeroplane/2009_000397", "aeroplane/2009_000440", "aeroplane/2009_000545", "aeroplane/2009_001905", "aeroplane/2009_002941", "aeroplane/2009_003033", "aeroplane/2009_003278", "aeroplane/2009_003994", "aeroplane/2009_004402", "aeroplane/2009_004548", "aeroplane/2009_004969", "aeroplane/2009_005019", "aeroplane/2010_000437", "aeroplane/2010_000939", "aeroplane/2010_001085", "aeroplane/2010_003279", "aeroplane/2011_000129", "aeroplane/2011_000481", "aeroplane/2011_001158", "aeroplane/2011_002851", "aeroplane/2011_003111"]
# bird_class = ["bird/2007_003682", "bird/2007_009607", "bird/2008_000472", "bird/2008_000515", "bird/2008_001514"] //, "bird/2008_001673", "bird/2008_001810", "bird/2008_004087", "bird/2008_004276", "bird/2008_004551", "bird/2008_004689", "bird/2008_004783", "bird/2008_005260", "bird/2008_005303", "bird/2008_005997", "bird/2008_006924", "bird/2008_007319", "bird/2008_007546", "bird/2008_007673", "bird/2008_007752", "bird/2008_007848", "bird/2008_007994", "bird/2008_008197", "bird/2008_008347", "bird/2008_008461", "bird/2009_000146", "bird/2009_000218", "bird/2009_000879", "bird/2009_000930", "bird/2009_001693", "bird/2009_002754", "bird/2009_003088", "bird/2009_003285", "bird/2009_003922", "bird/2009_004509", "bird/2009_004652", "bird/2009_004996", "bird/2009_005137", "bird/2009_005262", "bird/2010_001042", "bird/2010_001715", "bird/2010_001868", "bird/2010_003929", "bird/2010_004352", "bird/2010_004570", "bird/2010_005350", "bird/2010_005516", "bird/2010_005896", "bird/2011_000232", "bird/2011_003163"]
# boat_class = ["boat/2007_001487", "boat/2007_003910", "boat/2008_000148", "boat/2008_000235", "boat/2008_000957"] // , "boat/2008_001136", "boat/2008_001159", "boat/2008_001202", "boat/2008_001858", "boat/2008_001946", "boat/2008_002131", "boat/2008_003034", "boat/2008_003275", "boat/2008_003480", "boat/2008_004636", "boat/2008_004716", "boat/2008_004983", "boat/2008_005398", "boat/2008_005593", "boat/2008_006065", "boat/2008_006121", "boat/2008_006289", "boat/2008_006500", "boat/2008_006730", "boat/2008_007179", "boat/2009_000308", "boat/2009_000385", "boat/2009_000690", "boat/2009_000752", "boat/2009_002173", "boat/2009_002343", "boat/2009_003284", "boat/2009_003522", "boat/2009_004888", "boat/2010_000906", "boat/2010_001164", "boat/2010_001967", "boat/2010_002117", "boat/2010_002620", "boat/2010_003107", "boat/2010_003117", "boat/2010_004124", "boat/2010_004714", "boat/2010_005192", "boat/2010_005332", "boat/2011_000744", "boat/2011_001310", "boat/2011_001532", "boat/2011_001582", "boat/2011_001886"]
# bus_class = ["bus/2007_008747", "bus/2008_003373", "bus/2008_007356", "bus/2008_008281", "bus/2009_000557"]
# car_class = ["car/2008_001274", "car/2008_002466", "car/2008_003061", "car/2008_005638", "car/2008_005686"]
# chair_class =  ["chair/2007_004510", "chair/2008_001439", "chair/2008_002071", "chair/2008_003504", "chair/2008_004460"]
# cow_class = ["cow/2007_003841", "cow/2008_005375", "cow/2008_007932", "cow/2009_001163", "cow/2010_000907"]
# table_class = ["diningtable/2007_003668", "diningtable/2008_001809", "diningtable/2008_002892", "diningtable/2008_007048", "diningtable/2008_008402"]
# horse_class = ["horse/2007_000783", "horse/2008_000219", "horse/2008_002338", "horse/2008_003805", "horse/2008_005408"]
# motor_class = ["motorbike/2007_005173", "motorbike/2008_000082", "motorbike/2008_000811", "motorbike/2008_002772", "motorbike/2008_003892"]
# person_class =  ["person/2007_001686", "person/2007_002545", "person/2007_003581", "person/2007_005331", "person/2007_006744"]
# plant_class = ["pottedplant/2008_000287", "pottedplant/2008_000491", "pottedplant/2008_003726", "pottedplant/2008_005345", "pottedplant/2008_006207"]
# sheep_class =  ["sheep/2007_003593", "sheep/2007_006944", "sheep/2008_005706", "sheep/2008_007677", "sheep/2010_004188"]
# sofa_class =["sofa/2008_005623", "sofa/2008_005850", "sofa/2008_006276", "sofa/2008_008538", "sofa/2009_000732"]
# train_class = ["train/2008_004212", "train/2008_007648", "train/2009_000283", "train/2009_001291", "train/2009_003185"]
# monitor_class = ["tvmonitor/2007_000121", "tvmonitor/2007_009216", "tvmonitor/2008_003466", "tvmonitor/2008_005439", "tvmonitor/2008_007798", , "tvmonitor/2010_001270", "tvmonitor/2008_006946", "tvmonitor/2009_000041", "tvmonitor/2009_002733", "tvmonitor/2009_004128"]



all_class = ["bicycle/2007_000515", "bicycle/2007_000793", "bicycle/2007_001027", "bicycle/2007_005702", "bicycle/2008_000803",
                "aeroplane/2007_000256", "aeroplane/2007_001377", "aeroplane/2007_004988", "aeroplane/2007_005043", "aeroplane/2007_006232",
                "bird/2007_003682", "bird/2007_009607", "bird/2008_000472", "bird/2008_000515", "bird/2008_001514",
                "boat/2007_001487", "boat/2007_003910", "boat/2008_000148", "boat/2008_000235", "boat/2008_000957",
                "bus/2007_008747", "bus/2008_003373", "bus/2008_007356", "bus/2008_008281", "bus/2009_000557",
                "car/2008_001274", "car/2008_002466", "car/2008_003061", "car/2008_005638", "car/2008_005686",
                "chair/2007_004510", "chair/2008_001439", "chair/2008_002071", "chair/2008_003504", "chair/2008_004460",
                "cow/2007_003841", "cow/2008_005375", "cow/2008_007932", "cow/2009_001163", "cow/2010_000907",
                "diningtable/2007_003668", "diningtable/2008_001809", "diningtable/2008_002892", "diningtable/2008_007048", "diningtable/2008_008402",
                "horse/2007_000783", "horse/2008_000219", "horse/2008_002338", "horse/2008_003805", "horse/2008_005408",
                "motorbike/2007_005173", "motorbike/2008_000082", "motorbike/2008_000811", "motorbike/2008_002772", "motorbike/2008_003892",
                "person/2007_001686", "person/2007_002545", "person/2007_003581", "person/2007_005331", "person/2007_006744",
                "pottedplant/2008_000287", "pottedplant/2008_000491", "pottedplant/2008_003726", "pottedplant/2008_005345", "pottedplant/2008_006207",
                "sheep/2007_003593", "sheep/2007_006944", "sheep/2008_005706", "sheep/2008_007677", "sheep/2010_004188",
                "sofa/2008_005623", "sofa/2008_005850", "sofa/2008_006276", "sofa/2008_008538", "sofa/2009_000732",
                "train/2008_004212", "train/2008_007648", "train/2009_000283", "train/2009_001291", "train/2009_003185",
                "tvmonitor/2007_000121", "tvmonitor/2007_009216", "tvmonitor/2008_003466", "tvmonitor/2008_005439", "tvmonitor/2008_007798", "tvmonitor/2010_001270", "tvmonitor/2008_006946", "tvmonitor/2009_000041", "tvmonitor/2009_002733", "tvmonitor/2009_004128"]


for each in all_class:
    all_lab[each.split("/")[1]] = each.split("/")[0];


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




def erase_files(folder):

    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path);
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
            
            ## Batch-3
            # heatmap_path = attn_mask_folder + an_img["image"];
            ## Batch-4
            heatmap_path = attn_mask_folder + "/" + all_lab[an_img["image"].split(".")[0]] + "/" + an_img["image"];
            ## Batch-2 and  Batch-5
            # heatmap_path = attn_mask_folder + "/"+ an_img["image"].split("-")[0] +"/" + an_img["image"].split("-")[1];


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
            ## Batch 2 and 5
            # seg_mask_path = seg_mask_folder + this_ref[0].split("-")[0] +"/" + this_ref[0].split("-")[1];
            ## Batch 3
            seg_mask_path = seg_mask_folder + this_ref[0];
            ## Batch 4
            ## Batch-4
            seg_mask_path = seg_mask_folder + "/" + all_lab[this_ref[0].split(".")[0]] + "/" + this_ref[0];
            
            if os.path.exists(seg_mask_path): # image_heatmap.size == imgs_count:
                print ('already exists! ', seg_mask_path)
                # update_heatmap_mask(heatmap_path, user_mask)
            else:
                print (seg_mask_path)
                cv2.imwrite(seg_mask_path, this_ref[1]*annt_per_imgs*100)

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
    # print (jpg_file)
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
   


batches = ['batch-4'] # ,'batch-2','batch-3','batch-4']
tot_user = 85;     # batch-4: 85    # batch-3 47 # batch-2 91  participatns 
annt_per_imgs = 10;
img_to_ann_ratio = 2.0/3.0;    # batch-3 and 4
# img_to_ann_ratio = 1.0/2.0;  # batch-2

for batch in batches:

    print ('Batch: ', batch)

    # 0- Create participants' annotation records from mturk csv
    # get_jsons(batch)
    # get_workers(batchs)

    
    ref_mask = [];
    img_folder = "../data/VOC2012_raw/"                     # original raw images  
    # img_folder = "../data/VOC2012_by_label/"                     # original raw images  
    # batch-3
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
    keys = [0,1,2,3,4,5,6,7,8]   # batch-2 9  # batch-3 4 batch-4 8  
    for each_key in keys:
        reference_mask(img_folder, ref_folder+"ref-"+str(each_key)+".json",ref_mask);

    # 1- Generating users weighted mask with user data
    # erase_files(attn_mask_folder)
    # user_att_mask(img_folder,res_folder)


    # 2- Generating segmetnation masks with user data
    erase_files(seg_mask_folder)
    segmentation_mask(ref_mask,seg_mask_folder)


    # 3- Generating user heatmaps for visualization
    # erase_files(heatmap_folder)
    # user_heatmap(img_folder,heatmap_folder,attn_mask_folder);

