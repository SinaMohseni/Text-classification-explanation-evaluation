import os,sys
import time

print('\n \n Loading Inception and Keras:')

import tensorflow
import keras
from keras.applications import inception_v3 as inc_net
from keras.preprocessing import image
from keras.applications.imagenet_utils import decode_predictions
from skimage.io import imread
import matplotlib.pyplot as plt   #matplotlib inline
import numpy as np
from skimage.segmentation import mark_boundaries
import scipy.misc


import re
import glob
import copy
import operator

import math
import json
import csv

print('\n \n Keras:', keras.__version__)
print('\n \n Loading Inception:')
inet_model = inc_net.InceptionV3()
# import os,sys
try:
    import lime
except:
    sys.path.append(os.path.join('..', '..')) # add the current directory
    import lime
from lime import lime_image


def transform_img_fn(path_list):
    out = []
    for img_path in path_list:
        img = image.load_img(img_path, target_size=(299, 299))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = inc_net.preprocess_input(x)
        out.append(x)
    return np.vstack(out)



def find_explanation(img_folder, jpg_file):
    print('\n \n Predictions:')
    images = transform_img_fn([os.path.join(img_folder,jpg_file)])  #'img'
    # print('\n \n ', images)
    # plt.imshow(images[0])
    # plt.show()
    # I'm dividing by 2 and adding 0.5 because of how this Inception represents images
    # plt.imshow(images[0] / 2 + 0.5)
    # plt.show()

    preds = inet_model.predict(images)
    for x in decode_predictions(preds)[0]:
        print(x)
        # print (x, names[x], preds[0,x])
    # print ('\n', decode_predictions(preds)[0])
    # print ('\n', decode_predictions(preds)[0][0])
    # print ('\n', str(decode_predictions(preds)[0][0][0]))
    # print ('\n', decode_predictions(preds)[0][1])

    print('\n \n Generating explanation:')
    tmp = time.time()
    explainer = lime_image.LimeImageExplainer()
    explanation, labels = explainer.explain_instance(images[0], inet_model.predict, top_labels=2, hide_color=0, num_samples=1000)
    print ("\n Processing time: ", time.time() - tmp)


    print ("\n Labels out: ", labels)

    print ("\n Exp intercept: ", explanation.intercept , explanation.intercept[labels[0]])
    # print ("\n Exp local_exp: ", explanation.local_exp , explanation.local_exp[labels[0]])
    # print ("\n Exp local_pred: ", explanation.local_pred , explanation.local_pred[labels[0]])
    # print ("\n Exp image: ", explanation.image , explanation.image[labels[0]])
    # print ("\n Exp segments: ", explanation.segments , explanation.segments[labels[0]])
                             
        # self.image = image
        # self.segments = segments
        # self.intercept = {}
        # self.local_exp = {}
        # self.local_pred = None


    temp, mask = explanation.get_image_and_mask(labels[0], positive_only=False, num_features=5, hide_rest=False)
    plt.imshow(mark_boundaries(temp / 2 + 0.5, mask))
    plt.show()


    temp, mask = explanation.get_image_and_mask(labels[1], positive_only=False, num_features=5, hide_rest=False)
    plt.imshow(mark_boundaries(temp / 2 + 0.5, mask))
    plt.show()
    



    # print ("\n Mask: ", mask)
    # num1 = 0
    # scipy.misc.imsave('./exp_mask/exp_'+jpg_file+'.jpg', temp)

    return mask

def write_exp(img_exp, jpg_file):
    scipy.misc.imsave('./LIME_mask/mask_'+jpg_file+ '.jpg', img_exp)

def read_data(img_folder, json_file):

    result = []  
    
    all_imgs = json.load(open(json_file))

    for an_img in all_imgs:

        jpg_file = an_img["image"];

        img_exp = find_explanation(img_folder, jpg_file)

        write_exp(img_exp, jpg_file)

    return img_exp
        

def evaluate(img_folder,res_folder):

    img_number = 1
    for i in range(0,1):   # users loop 
        img_exp = read_data(img_folder, res_folder+"P1.json")
        

def quick_explanations(test_folder):
    jpg_file = "dog5_2.jpg"  # elephant-dog.jpg  cat_basketball.jpg dog5.jpg dog3 dog5_2 flower4 plane-shark2 plane-shjark ship1 ship5 ship-house telephone-flower zebra-cat
    img_exp = find_explanation(test_folder, jpg_file)
    # write_exp(img_exp, jpg_file)
# 


tmp_total = time.time()
img_folder = "Image_results/org_img/"
res_folder = "Image_results/json_res/"
test_folder = "Image_results/fake_images/"  

# evaluate(img_folder,res_folder);

quick_explanations(test_folder)
print ("\n Total time: ", time.time() - tmp_total)



