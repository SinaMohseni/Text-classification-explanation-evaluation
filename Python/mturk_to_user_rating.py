# Generating human-judgment from mTurk records
# TODO: Remove each participant’s mean of its results


# -*- coding: utf-8 -*- 
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
import pandas as pd




def get_ratings(batch):
	
	in_folder = "../user-study/mturk-rating-results/"+batch+"/1.csv";
	out_folder = "../user-study/mturk-rating-results/"+batch+"/json/";


	entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 
	results = entire_log['Answer.surveycode']
	images = {}  # 	{image_xx: [ rating1, rating2,..., rating_n]}
	
	i=0
	for each in results: 
		i+=1;
		each_json = json.loads(each)
		each_json.pop(0)			# pop out the mtruk id record
		# print (each_json.pop(0))  # pop out the mtruk id record
		for single in each_json:
			# print ("single", single)
			if single['i'] in images: 
				images[single['i']].append(int(single['r']))
			else: 
				images[single['i']] = [int(single['r'])]


	for each in images: 
		# print ('images: ',each, images[each])
		images[each] = round((sum(images[each])/len(images[each]))/10, 3)
		# print ('images: ',each, images[each])

		# with open(out_folder+'P'+str(i)+'.json','w', encoding='utf-8') as f:
		# 	json.dump(each_json, f, ensure_ascii=False)

	return images;