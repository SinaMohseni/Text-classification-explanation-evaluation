# -*- coding: utf-8 -*- 

print "importing..."

import re
import glob
import copy
import operator

import math
import json
import csv

import os
import os.path

import nltk
from nltk.tokenize import WordPunctTokenizer
from nltk.tokenize import word_tokenize
from nltk.tokenize import RegexpTokenizer
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer

import codecs

import sys
import time
from datetime import datetime
from collections import Counter

import urllib2,urllib
# import urllib3

from collections import defaultdict


def read_json(json_file):  
    # Fix if there are multiple annotations per image.
    all_docs = json.load(open(json_file))
    docs_list = [];
    new_user_list = []

    for a_doc in all_docs:
        # cut repeated contours

        if a_doc["article"] in docs_list:
            for this_ in new_user_list:
                if this_["article"] == a_doc["article"]:
                    if ( len(a_doc["word"]) > 0):
                        for this_word in a_doc["word"]:
                            if this_word not in this_["words"]:
                                this_["words"].append(this_word)
                    break;
                    

        else:
            docs_list.append(a_doc["article"]);
            new_words = a_doc["word"]
            new_user_list.append({"article":a_doc["article"],"words": new_words }) 

    print "\n number of user annotations", len(new_user_list), "\n"

    return new_user_list

def read_user_data(article_exp, json_file,tot_user):

    
    all_docs = read_json(json_file)    # removes duplicated documents.
    
    article_exp = txt_process(article_exp, all_docs,tot_user)   # Tokenizaton and explanation accumulation

    return article_exp

def txt_process(article_exp, all_docs,tot_user):

    article_list = []
    English_stop_words = get_stop_words('en')
    tokenizer = RegexpTokenizer(r'\w+')

    for this_article in article_exp:
        article_list.append(this_article["article"])

    for a_doc in all_docs:

        if a_doc["article"] in article_list:
            for this_ in article_exp:
                if this_["article"] == a_doc["article"]:
                    tokenized = [[word for word in tokenizer.tokenize(str(document).lower()) if (word not in English_stop_words)] for document in a_doc["words"]]
                    weighted_words = []
                    words_bag = []
                    for each_word in tokenized:
                        for signle_word in each_word:
                            if signle_word not in words_bag and len(signle_word) > 2:
                                words_bag.append(signle_word);
                                all_signle_word = [];
                                for this_bag in this_["words"]:
                                    all_signle_word.append(this_bag[0])
                                if signle_word in all_signle_word:
                                    for this_bag in this_["words"]:
                                        if this_bag[0] == signle_word:
                                            this_bag[1] += float(1)/tot_user;
                                else:
                                    this_["words"].append([signle_word, float(1)/tot_user])

        else:
            # tokenized = [[word for word in WordPunctTokenizer().tokenize(str(document).lower()) if (word not in English_stop_words)] for document in a_doc["words"]]
            tokenized = [[word for word in tokenizer.tokenize(str(document).lower()) if (word not in English_stop_words)] for document in a_doc["words"]]
            weighted_words = []
            words_bag = []
            for each_word in tokenized:
                for signle_word in each_word:
                    if signle_word not in words_bag and len(signle_word) > 2:
                        # print signle_word
                        words_bag.append(signle_word);
                        weighted_words.append([signle_word, float(1)/tot_user]);
                
            article_exp.append({"article":a_doc["article"], "words": weighted_words}) 
            # print "Tozenized: >>" , article_exp
            
    return article_exp

def save_results(article_exp,eval_folder,topic):

    for each_doc in article_exp:
        fout = open(eval_folder+topic+"/"+each_doc["article"]+ ".json","w")
        fout.write(json.dumps(each_doc,indent=1))
        fout.close()

    return 0

def visualization():
    return


def user_eval(img_folder,res_folder):
    print "\n User evaluation..."

    tot_user = 2;
    topics = ["sci.med", "sci.electronics"]

    for topic in topics:   # read_user data
        
        article_exp = [];

        for i in xrange(1,tot_user+1):
            print "Topic: ", topic, " User: P", i
            read_user_data(article_exp, res_folder+topic+"/P"+str(i)+".json",tot_user)


        save_results(article_exp,eval_folder,topic)      # save this topics result

   

# article_exp = [];
txt_folder = "./Text/org_documents/20news-bydate/20news-bydate-test/" # sci.electronics # sci.med
vis_folder = "./Text/visualization/" # sci.electronics # sci.med
eval_folder = "./Text/user_evaluation/" # sci.electronics # sci.med
res_folder = "./Text/user_json/" # sci.electronics # sci.med

# shutil.rmtree(mask_folder)
# os.remove(mask_folder, *, dir_fd=None)

user_eval(txt_folder,res_folder)
visualization();


