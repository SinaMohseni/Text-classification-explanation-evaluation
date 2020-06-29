# 1- sentence-level +  work level.
# 2- VOC dataset. 50 images per class x 20 class = $300
# - or  ImageNet: 10 image x  1000 class = at least $1000

# 3- any other evaluation experiment? 

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

# script to get user rating dic from mturk csv file
from mturk_to_user_rating import get_ratings;



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

        if an_img["image"] in images:
            for this_ in new_user_list:
                if this_["image"] == an_img["image"]:

                    if ( len(an_img["points"]) > 0):
                        this_["points"].append(an_img["points"])
                        # new_user_list.append({"image":an_img["image"],"contour":1,"points": new_points })

                    break;

        else:
            images.append(an_img["image"]);
            new_points = [an_img["points"]]
            new_user_list.append({"image":an_img["image"],"points": new_points }) 

    # print ("\n number of user annotations", len(new_user_list))#, new_user_list
    return new_user_list



def reference_mask(img_folder, ref_file,ref_mask):
    print ("\n Reference Mask...")
    # user_mask = read_ref(img_folder, ref_file)   #ref_mask

    all_imgs = read_json(ref_file)    

    imgs_count = len(all_imgs)

    for an_img in all_imgs:
        if an_img["image"] not in attention_checks:
            
            jpg_file = img_folder + an_img["image"];
            usr_img =  an_img["points"]
            img_exp, user_mask = img_process(jpg_file,usr_img,1)
            ref_mask.append( [an_img["image"], user_mask] ) 

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

            x_ = int(float(usr_img[j][i][1])*img_to_ann_ratio)
            y_ = int(float(usr_img[j][i][0])*img_to_ann_ratio)
            x_ = sorted([0, x_, size_x-1])[1]
            y_ = sorted([0, y_, size_y-1])[1]

            new_usr_img.append([float(usr_img[j][i][0])*img_to_ann_ratio,float(usr_img[j][i][1])*img_to_ann_ratio])

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


def dic_normalization(this_dic): 

    min_value = this_dic.pop('min')
    max_value = this_dic.pop('max')
    range_value = max_value - min_value;
    
    # print (this_dic['max'], this_dic['min'])
    # print (range_value)

    for each in this_dic:
        this_dic[each] = round(((this_dic[each] - min_value) / range_value),3);

def evaluate_MAE(user_path,model_path,ref_mask): 
    print ("\n MAE Evaluation...")
    
    # Calculate MSE        (threshold agnostic)
    # based on order of samples in "ref.json"
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
    MAE = {}
    attn_FP = {};
    attn_FN = {};
    max_AE= -100; max_FN= -100; max_FP= -100;
    min_AE = 100; min_FN = 100; min_FP = 100;

    # LIME = 255
    # User = weighted (0..255)


    for this_img in ref_mask:

        user_file = user_path + this_img[0]
        model_file = model_path + this_img[0].split("-")[1]+'.jpg'



        # model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        # if os.path.exists(model_file):
        #     # user_file = jpg_file_1
        #     model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        # else: 
        #     # user_file = jpg_file_2
        #     model_file = model_path + "dog-"+ this_img[0] + ".jpg";
        # # user_file = user_path + this_img[0] + ".jpg"; 
        
        
        print (user_file, model_file)

        model_mask = cv2.imread(model_file,0);
        model_mask = cv2.resize(model_mask, (224,224))
        
        user_mask = cv2.imread(user_file,0);
        user_mask = cv2.resize(user_mask, (224,224))
        
        # normalize user_mask and model_mask
        norm_usr_msk = np.true_divide(user_mask,(user_mask.sum())); 
        norm_mdl_msk = np.true_divide(model_mask, (model_mask.sum()));
        this_AE = (abs(norm_usr_msk - norm_mdl_msk)).sum();


        ref_mask_inv = cv2.bitwise_not(this_img[1])  # reference 
        FP_model = cv2.bitwise_and(norm_mdl_msk,norm_mdl_msk,mask = ref_mask_inv)
        FP_user = cv2.bitwise_and(norm_usr_msk,norm_usr_msk,mask = ref_mask_inv)
        this_FP = (abs(FP_model - FP_user)).sum();   

        FN_model = cv2.bitwise_and(norm_mdl_msk,norm_mdl_msk,mask = this_img[1])   # reference 
        FN_user = cv2.bitwise_and(norm_usr_msk,norm_usr_msk,mask = this_img[1])   # reference 
        this_FN = (abs(FN_model - FN_user)).sum();  

        # Now black-out the area of logo in ROI
        # img1_bg = cv2.bitwise_and(roi,roi,mask = gray_mask_inv)
        # Take only region of logo from logo image.
        # img2_fg = cv2.bitwise_and(heatmap,heatmap,mask = gray_mask)
        

        # >>>>>>>> With out Normalize Scores >>>>>>>>
        this_AE = round(1.0 - this_AE/2,3);               # changing error to score  
        attn_FN[this_img[0]] = round(this_FN/2,3);  # 1.0 -...   changing error to score  
        attn_FP[this_img[0]] = round(this_FP/2,3);  # 1.0 -... changing error to score  

        # >>>>>>>>>>>>>>>> Normalize Scores >>>>>>>>>>>>>>>>
        # this_AE = 1.0 - this_AE;              # changing error to score  
        # >>>>>>>>> With out normalization Scores 
        MAE[this_img[0]] = this_AE; 
        # >>>>>>>>>>>>>>>> Normalize Scores >>>>>>>>>>>>>>>>
        # if (this_AE > max_AE): max_AE = this_AE;
        # if (this_AE < min_AE): min_AE = this_AE;

        # attn_FN[this_img[0]] = this_FN; 
        # if (this_FN > max_FN): max_FN = this_FN;
        # if (this_FN < min_FN): min_FN = this_FN;

        # attn_FP[this_img[0]] = this_FP; 
        # if (this_FP > max_FP): max_FP = this_FP;
        # if (this_FP < min_FP): min_FP = this_FP;

    # >>>> Normalize adding min and max values in the dictionaries >>>>
    # MAE["max"] = max_AE 
    # MAE["min"] = min_AE
    # attn_FN["max"] = max_FN
    # attn_FN["min"] = min_FN 
    # attn_FP["max"] = max_FP
    # attn_FP["min"] = min_FP
    # dic_normalization(MAE)
    # dic_normalization(attn_FP)
    # dic_normalization(attn_FN)

    return MAE,attn_FP,attn_FN

 



def evaluate_AUPR(user_path,model_path,ref_mask): 
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

        user_file = user_path + this_img[0]
        model_file = model_path + this_img[0]

        # jpg_file_1 = user_path + "cat-"+ this_img[0] + ".jpg";
        # jpg_file_2 = user_path + "dog-"+ this_img[0] + ".jpg";
        # if os.path.exists(jpg_file_1):
        #     user_file = jpg_file_1
        #     model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        # else: 
        #     user_file = jpg_file_2
        #     model_file = model_path + "dog-"+ this_img[0] + ".jpg";


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




def evaluate_IoU(user_path,model_path,ref_mask): 
    print ("\n IoU Evaluation...")
    
    # Calculate AUPR       (threshold agnostic)
    # Calculate MSE        (threshold agnostic)
    # Calculate IoU        (threshold dependent)

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

    
    AE = []
    MAE = {}
    attn_FP = {};
    attn_FN = {};

    # LIME = 255
    # User = weighted (0..255)


    for this_img in ref_mask:

        user_file = user_path + this_img[0]
        model_file = model_path + this_img[0]


        # model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        # if os.path.exists(model_file):
        #     # user_file = jpg_file_1
        #     model_file = model_path + "cat-"+ this_img[0] + ".jpg";
        # else: 
        #     # user_file = jpg_file_2
        #     model_file = model_path + "dog-"+ this_img[0] + ".jpg";
        # user_file = user_path + this_img[0] + ".jpg";  # "cat-"+ 
 

        user_mask = cv2.imread(user_file,0);
        user_mask = cv2.resize(user_mask, (224,224))
        
        model_mask = cv2.imread(model_file,0);
        model_mask = cv2.resize(model_mask, (224,224))
            

        # normalize user_mask and model_mask
        norm_usr_msk = np.true_divide(user_mask,(user_mask.sum())); 
        norm_mdl_msk = np.true_divide(model_mask, (model_mask.sum()));
        this_AE = (abs(norm_usr_msk - norm_mdl_msk)).sum() / 2; 


        ref_mask_inv = cv2.bitwise_not(this_img[1])  # reference 
        FP_model = cv2.bitwise_and(norm_mdl_msk,norm_mdl_msk,mask = ref_mask_inv)
        FP_user = cv2.bitwise_and(norm_usr_msk,norm_usr_msk,mask = ref_mask_inv)
        this_FP = (abs(FP_model - FP_user)).sum()/2;


        FN_model = cv2.bitwise_and(norm_mdl_msk,norm_mdl_msk,mask = this_img[1])   # reference
        FN_user = cv2.bitwise_and(norm_usr_msk,norm_usr_msk,mask = this_img[1])   # reference 
        this_FN = (abs(FN_model - FN_user)).sum()/2;
        

        MAE[this_img[0]] = 1.0 - round(this_AE,3);
        attn_FN[this_img[0]] = round(this_FN,3);
        attn_FP[this_img[0]] = round(this_FP,3);


        # tot = 1.0 - (attn_FN[this_img[0]] + attn_FP[this_img[0]])/2;
        # print ("this_FP, FN,1-TOT, MAE: ", round(this_FP,3),round(this_FN,3),round(tot,3),MAE[this_img[0]]);
    return MAE,attn_FP,attn_FN  



def pair_two(filename, attn_score,mask_score, human_rating,attn_FP,attn_FN,batch):
        # (pair_1,pair_2,pair_3,batch):

    rows = [];

    for each in attn_score:
        
        this = each.split("-")[1];

        rows.append({'name':each, 
                    "human_rating":human_rating[this], 
                    "human-attention":attn_score[each],
                    "segmentation-mask":mask_score[each], 
                    "attn_FP":attn_FP[each],
                    "attn_FN":attn_FN[each]
                    })

    # name of csv file  
    
    fields = ['name','human_rating','human-attention','segmentation-mask','attn_FP','attn_FN']

    with open(filename, 'w',newline='') as csvfile:  
        
        writer = csv.DictWriter(csvfile, fieldnames = fields)  
        writer.writeheader()  
        writer.writerows(rows)

    return 0 





batches = ['batch-2'] # ,'batch-2','batch-3','batch-4']
tot_user = 91;
annt_per_imgs = 9;  
img_to_ann_ratio = 0.5;


for batch in batches:

    print ('Batch: ', batch)
    ref_mask = [];
    img_folder = "../data/VOC2012_raw/"                                       # original raw images
    lime_mask_folder =  "../data/VOC2012_lime/masks/" 
    grad_mask_folder =  "../data/VOC2012_grad-cam/VOC2012_mask/"
    model_mask_folder = lime_mask_folder; # grad_mask_folder;

    attn_mask_folder = "../data/user_attn_maps/"+batch+"/"                         # Final binary human-attention mask
    seg_mask_folder = "../data/user_seg_maps/"+batch+"/"                         # Final binary human-attention mask
    res_folder = "../user-study/mturk-annotation-results/"+batch+"/json/"
    ref_folder = "../user-study/mturk-annotation-results/"+batch+"/ref/"
    # to save an overlay of user attention-map on raw image
    # heatmap_folder = "../data/user_attn_overlay/"+batch+"/"
    

    # out_folder = "../user-study/evaluation-results/"+batch+"/pairs_ready.csv"
    out_folder = "../user-study/evaluation-results/"+batch+"/lime/pairs_ready.csv"
    
    # model_mask = "../data/VOC2012_mask/"                                       # "./Image/LIME_mask/"
    # model_overlay = "./Image/LIME_overlay/"

    attention_checks = ["cat-2007_000528.jpg","cat-2007_000876.jpg","cat-2007_003778.jpg","cat-2008_000824.jpg"]

    # get_workers(batchs)

    # Genrating objects reference mask useing ref contur
    keys = [0,1,2,3,4,5,6,7,8,9]
    for each_key in keys:
        reference_mask(img_folder, ref_folder+"ref-"+str(each_key)+".json",ref_mask);


    # 1- Calculating mean human-judgment for model explanations
    human_rating = get_ratings(batch,'lime')


    # 2-Calculating human-attentino MAE score 
    [attn_score,attn_FP,attn_FN] = evaluate_MAE(attn_mask_folder, model_mask_folder,ref_mask);

    # 3- Calculating segmentation-mask MAE score 
    [mask_score,mask_FP,mask_FN] = evaluate_MAE(seg_mask_folder, model_mask_folder,ref_mask);

    # 4- Calculating AUPR and IoU scores
    # Precision, Recall = evaluate_IoU(usr_mask_folder, model_mask_folder,ref_mask);
    # Precision, Recall = evaluate_AUPR(usr_mask_folder, model_mask_folder,ref_mask);

    # generate csv tables of all results for statistical analysis 
    # "exp_score":pair_1[each],"mask_score":pair_2[each],"human_rating":pair_3[each]
    # pair_two(attn_FN,mask_FN, human_rating,attn_FP,attn_FN,batch)
    pair_two(out_folder, attn_score,mask_score, human_rating,attn_FP,attn_FN,batch)


