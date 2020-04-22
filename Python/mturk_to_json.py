# Generating user attention map from mTurk studies

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


in_folder = "../user-study/mturk-annotation-results/1.csv"
out_folder = "../user-study/mturk-annotation-results/json/"

entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 

results = entire_log['Answer.surveycode']



# print (results)


i=0
for each in results: 
	i+=1;
	each_json = json.loads(each)
	each_json.pop(0)
	for single in each_json:
		single['image'] = single.pop('i')
		single['counter'] = single.pop('c')
		single['points'] = single.pop('p')
	# obj = JSON.parse(json)[0];
	# obj.id = obj._id;
	# delete obj._id;
	# json = JSON.stringify([obj]);

	with open(out_folder+'P'+str(i)+'.json','w', encoding='utf-8') as f:
		json.dump(each_json, f, ensure_ascii=False)
	# print (each['Answer.work_duration'])
	# print (each['Answer.surveycode'])