from __future__ import print_function

import os,sys
import time

import re
import glob
import copy
import operator

import math
import json
import csv


import lime
import sklearn
import numpy as np
import sklearn
import sklearn.ensemble
import sklearn.metrics

from lime import lime_text
from sklearn.pipeline import make_pipeline

from sklearn.datasets import fetch_20newsgroups

categories = ['sci.med', 'sci.electronics']
newsgroups_train = fetch_20newsgroups(subset='train', categories=categories)
newsgroups_test = fetch_20newsgroups(subset='test', categories=categories)
class_names = ['Medication', 'Electronics']

vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
train_vectors = vectorizer.fit_transform(newsgroups_train.data)
test_vectors = vectorizer.transform(newsgroups_test.data)


rf = sklearn.ensemble.RandomForestClassifier(n_estimators=500)
rf.fit(train_vectors, newsgroups_train.target)


pred = rf.predict(test_vectors)
sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary')
print ("\n Accuracy: ",sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary'))


c = make_pipeline(vectorizer, rf)
print(c.predict_proba([newsgroups_test.data[0]]))

from lime.lime_text import LimeTextExplainer
explainer = LimeTextExplainer(class_names=class_names)


def find_explanation(): #txt_file):
    idx = 1
    print ("\n \n", newsgroups_test.keys())

     #>> keys(['data', 'filenames', 'target_names', 'target', 'DESCR', 'description'])

    # print ("\n \n", newsgroups_test.filenames)
    # print ("\n \n", newsgroups_test.target_names)
    # print ("\n \n", newsgroups_test.target)
    
    # targetdsd
    # print ("\n 1111> ", newsgroups_test.data[0])

    # print ("\n 2222> ", newsgroups_test.data[1])

    # print ("\n 3333> ", newsgroups_test.data[2])

    # print ("\nv4444> ", newsgroups_test.data[3])

    exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=10)
    print('\n \n Document id: %d' % idx)
    print('Probability(Electronics) =', c.predict_proba([newsgroups_test.data[idx]])[0,1])
    print('True class: %s' % class_names[newsgroups_test.target[idx]])

    print("\n \n")

    # exp.as_list()
    exp_10 = exp.as_list();
    txt_exp = exp_10;

    print ("\n Explanations: ",exp_10[0][0],exp_10[1][0],exp_10[2][0],exp_10[3][0],exp_10[4][0],exp_10[5][0],exp_10[6][0],exp_10[7][0],exp_10[8][0],exp_10[9][0])

    # fig = exp.as_pyplot_figure()
    # exp.save_to_file('./oi.html')
    # exp.show_in_notebook(text=True)

    return txt_exp



def write_exp(img_exp, txt_file):
    #scipy.misc.imsave('./LIME_mask/mask_'+txt_file+ '.json', img_exp)
    # Save json
    print ("\n")

def read_data(img_folder, json_file):

    result = []  
    
    all_txts = json.load(open(json_file))

    for a_txt in all_txts:

        # txt_file = a_txt["image"];

        txt_exp = find_explanation() #txt_file)

        # write_exp(txt_exp, txt_file)

    return img_exp
        

def evaluate(img_folder,res_folder):

    img_number = 1
    for i in range(0,1):   # users loop 
        img_exp = read_data(txt_exp, res_folder+"P1.json")


# tmp_total = time.time()
txt_exp = "./txt/"
res_folder = "./txt/"
evaluate(txt_exp,res_folder);
# print ("\n Total time: ", time.time() - tmp_total)



