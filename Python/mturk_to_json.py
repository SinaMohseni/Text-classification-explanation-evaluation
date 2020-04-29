# Generating individual user annotations records from mTurk records

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




def get_jsons(batch): 

	in_folder = "../user-study/mturk-annotation-results/"+batch+"/1.csv"
	out_folder = "../user-study/mturk-annotation-results/"+batch+"/json/"

	entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 

	results = entire_log['Answer.surveycode']

	i=0
	for each in results: 
		i+=1;
		each_json = json.loads(each)
		each_json.pop(0)   # pop out the mtruk id record
		for single in each_json:
			single['image'] = single.pop('i')
			single['counter'] = single.pop('c')
			single['points'] = single.pop('p')

		with open(out_folder+'P'+str(i)+'.json','w', encoding='utf-8') as f:
			json.dump(each_json, f, ensure_ascii=False)

	return 0