# -*- coding: utf-8 -*- 


import re
import glob
import copy
import operator

import math
import json
import csv

import os

import codecs

import sys
import time
from datetime import datetime
from collections import Counter

# import urllib2,urllib
# import urllib3

from collections import defaultdict

import cv2
import numpy as np
# import numpy
from matplotlib import pyplot as plt

from skimage.io import imread
from skimage.segmentation import mark_boundaries
import scipy.misc


def read_data(img_folder, json_file):

    result = []  
    
    all_imgs = json.load(open(json_file))

    for an_img in all_imgs:

        jpg_file = img_folder + an_img["image"];# "test.jpg"; 
        usr_img =  an_img["points"]

        img_exp = img_process(jpg_file,usr_img)

        # write_user_exp(img_exp, an_img["image"])

        heat_map(img_exp)
        
        result.append({"image": 0,"recall": 0,"precision": 0,"accuracy": 0})

    return result

def heat_map(img_exp):
    
    img_exp_heat = cv2.applyColorMap(img_exp,cv2.COLORMAP_JET)
    cv2.imshow('frame',img_exp_heat)
    cv2.waitKey(0)                
    cv2.destroyAllWindows()

    return 0

def write_user_exp(img_exp, jpg_file):
    scipy.misc.imsave('./user_exp/exp_'+jpg_file+ '.jpg', img_exp)

def img_process(jpg_file,usr_img):
    
    exp_img = cv2.imread(jpg_file,0)  # load in grayscale 
    # plt.imshow(img, cmap = 'gray', interpolation = 'bicubic')     # plot show
    # plt.show()

    size_y = exp_img.shape[1] 
    size_x = exp_img.shape[0]     
    print ("image: x ", size_x, "y ", size_y)
    
    blank_image = np.zeros((size_x,size_y,1), np.uint8)

    size_y = blank_image.shape[1] 
    size_x = blank_image.shape[0]     
    print ("blank: x ", size_x, "y ", size_y)

    sketch_size = len(usr_img);
    # print "sketch_size", sketch_size

    for i in xrange(0,sketch_size):
        x_ = int(usr_img[i][1])
        y_ = int(usr_img[i][0])
        x_ = sorted([0, x_, size_x-1])[1]
        y_ = sorted([0, y_, size_y-1])[1]

        blank_image[x_,y_] = [255] # ,255,255];
        exp_img[x_,y_] = 0
    

    contours = [np.array([usr_img], dtype=np.int32)]
    
    cv2.drawContours(exp_img, [contours[0]], 0, (255),3)    # 1: Line thinckness 
    cv2.drawContours(blank_image, [contours[0]], 0, (255),-1)   # -1: Fill the controur 
    
    # kernel = np.ones((2,2),np.uint8)
    # dilation = cv2.dilate(blank_image,kernel,iterations = 1)
    # kernel = np.ones((20,20),np.uint8)
    # closing = cv2.morphologyEx(blank_image, cv2.MORPH_CLOSE, kernel)

    # cv2.imshow('image',exp_img)   
    # cv2.waitKey(0)                
    # cv2.destroyAllWindows()

    return exp_img

def contour_img(jpg_file):
    
    img = cv2.imread(jpg_file,0)  # load in grayscale 
    
    # cv2.imshow('image',img)     # img show
    # cv2.waitKey(0)                
    # cv2.destroyAllWindows()

    # plt.imshow(img, cmap = 'gray', interpolation = 'bicubic')     # plot show
    # plt.show()

    ret,thresh = cv2.threshold(img,127,255,0)   
    im2, contours,hierarchy = cv2.findContours(thresh,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    cnt = contours[0]  
    print ("contour: ",cnt)
    # M = cv2.moments(cnt)

    return cnt

def write_img(jpg_file):
    cv2.imwrite('test.png',img)

def evaluate(img_folder,res_folder):

    img_number = 1
    for i in xrange(0,1):   # users loop 
        # contour_img(img_folder + "test.jpg")    # a test for findContours function 
        usr_exp = read_data(img_folder, res_folder+"P1.json")


img_folder = "./raw_img/"
res_folder = "./annotations_json/"
evaluate(img_folder,res_folder)
