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




def parse_column(data):
    try:
        return json.loads(data)
    except Exception as e:
        print(e)
        return None

# get Participants' annotaions from server json objects
def get_jsons(batch, data_source): 

	if data_source == "ref":
		source = "ref"  #  "mturk1"
		out_folder = "ref"
	else: 
		source = "mturk1"
		out_folder = "json"

	# in_folder = "../user-study/mturk-annotation-results/mturk/"+batch+"/mturk.csv"
	in_folder = "../user-study/mturk-annotation-results/mturk/"+batch+"/"+source+".json"
	out_folder = "../user-study/mturk-annotation-results/"+batch+"/"+out_folder+"/"

	# entire_log = pd.read_csv(in_folder , doublequote=True , escapechar='\\')  
	# entire_log = pd.read_csv(in_folder , converters={'log': parse_column})   # json.loads
	# entire_log = pd.read_json(in_folder)   # json.loads
	# entire_log = json.loads(in_folder)

	f = open (in_folder, "r") 
	entire_log = json.loads(f.read()) 
	
	i=0;
	j=0;
	print ("mturk_id: ", entire_log[0])   # pop out the mtruk id record
	# entire_log.pop(0)
	new_file = []
	for each in entire_log:
		# print (each)
		if (len(each['i'].split(".")) > 1): # == "jpg"):
			new_conture = {};
			new_conture['image'] = each['i'];#  .pop('i')
			new_conture['points'] = each['p']; # .pop('p')
			new_file.append(new_conture.copy())
			# print ('image counter: ',j)
			j+=1;
		else:
			if (len(new_file) > 0):
				print ('P: ',i, len(new_file))
				j=0
				i+=1;
				# with open(out_folder+'P'+str(i)+'.json','w', encoding='utf-8') as f:
				with open(out_folder+'ref-'+str(i-1)+'.json','w', encoding='utf-8') as f:
					json.dump(new_file, f, ensure_ascii=False)
				new_file = [];

	# write the  last log  
	print ('Last: P: ',i, len(new_file),  out_folder)
	j=0
	i+=1;
	# with open(out_folder+'P'+str(i)+'.json','w', encoding='utf-8') as f:
	with open(out_folder+'ref-'+str(i-1)+'.json','w', encoding='utf-8') as f:
		json.dump(new_file, f, ensure_ascii=False)


	return 0

# get Participants' annotaions from the AMT csv output file
def get_jsons_old(batch): 

	in_folder = "../user-study/mturk-annotation-results/mturk"+batch+"/mturk.csv"
	out_folder = "../user-study/mturk-annotation-results/"+batch+"/ref/"  # json

	entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 

	results = entire_log['Answer.surveycode']


	i=0;
	for each in results:
		try:
			print ('P: ',i)
			each_json = json.loads(each)
			try:
				each_json.pop(0)   # pop out the mtruk id record
				for single in each_json:
					single['image'] = single.pop('i')
					# single['counter'] = single.pop('c')
					single['points'] = single.pop('p')
				i+=1;
				with open(out_folder+'P'+str(i)+'.json','w', encoding='utf-8') as f:
					json.dump(each_json, f, ensure_ascii=False)

			except:
				print ('Error: ', each_json, each)    # pop out the mtruk id record

		except ValueError:
			print ("No response: ", i," ") # , each)

	return 0





def get_workers(batch):
	#  This function needs an update for batch-2
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
	duplicates = 0;
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
		
	print ("\n total duplicate annotatots: ",duplicates)

	with open('../benchmark/scripts/workers_new.json','w', encoding='utf-8') as f:
		json.dump(all_workers, f, ensure_ascii=False)

	return all_workers;


batchs = 'batch-3';
data_source = 'ref' #  mturk

# get_jsons(batchs, data_source)
# get_workers(batchs)