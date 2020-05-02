# Generating user-annotations records from mTurk records




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





def get_workers(batch):
	# this function needs an update for batch-2
	#  does not read the previous worker files - requires manual merging. 
	#  check for duplicate workers - requires manual checking. 
	#  dumps a {worker: key} file.

	in_folder = "../user-study/mturk-annotation-results/"+batch+"/1.csv";
	out_folder = "../user-study/mturk-annotation-results/"+batch+"/";

	jsonfile=open("../benchmark/scripts/workers.json")
	all_workers=json.load(jsonfile)

	entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 
	results = entire_log['Answer.surveycode']
	# all_workers = {}     # {image_xx: [ rating1, rating2,..., rating_n]}
	duplicates = 0
	for each in results: 

		each_json = json.loads(each)
		this_worker = each_json.pop(0)			# pop out the mtruk id record
		if this_worker['r'] in all_workers: 
			duplicates+=1;
			all_workers[this_worker['r']].append(int(-2))  # .append(int(this_worker['r']))
			print ('duplicate worker! :', this_worker['r'])
		else:
			all_workers[this_worker['r']] = [int(-2)] # this_worker['r']
			# all_workers[this_worker['i']].append(int(this_worker['r']))
		
	print ("\n total duplicates: ",duplicates)

	with open('../benchmark/scripts/workers_new.json','w', encoding='utf-8') as f:
		json.dump(all_workers, f, ensure_ascii=False)

	return all_workers;


batchs = 'batch-1';
get_workers(batchs)
