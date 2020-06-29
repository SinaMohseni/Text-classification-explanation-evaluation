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



def dic_normalization(this_dic): 

    min_value = this_dic.pop('min')
    max_value = this_dic.pop('max')
    range_value = max_value - min_value; 
    
    # print (this_dic['max'], this_dic['min'])
    # print (range_value)

    for each in this_dic:
        this_dic[each] = round(((this_dic[each] - min_value) / range_value),3);



def get_ratings(batch,select_method):
	
	if select_method == 'lime':
		return get_lime(batch)
	else:
		return get_grad_cam(batch)


def get_lime(batch):
	
	max_rate = -100; min_rate = 100;
	print ('---------------- here')
	batch = 'batch-3'

	in_folder = "../user-study/mturk-rating-results/mturk/"+batch+"/mturk.json";  # mturk.csv
	out_folder = "../user-study/mturk-rating-results/"+batch+"/json/";

	# entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 
	# results = entire_log['Answer.surveycode']
	
	f = open (in_folder, "r") 
	entire_log = json.loads(f.read()) 

	images = {}  # 	{image_xx: [ rating1, rating2,..., rating_n]}
	
	i=0;
	j=0;
	# print ("mturk_id: ", entire_log[0])   # pop out the mtruk id record
	# entire_log.pop(0)
	new_file = []
	for each in entire_log:
		# print ("Each: ", each)
		if (len(each['i'].split(".")) > 1): # == "jpg"):
			this_image = each['i'].split(".")[0]+"."+each['i'].split(".")[1]
			if this_image in images:
				images[this_image].append(int(each["r"]));
			else:
				images[this_image] = [int(each["r"])]

	# print (images)

	# i=0
	# # each participant
	# for each in results: 
	# 	try:
	# 		print ('P: ',i)
	# 		each_json = json.loads(each)
	# 		try:
	# 			i+=1;
	# 			each_json.pop(0);			# pop out the mtruk id record
				
	# 			# each image rating
	# 			# >>>>>>>>>>>> Normalize each participants rating here >>>>>>>>>>>>>>>
	# 			max_r = -100; min_r = 100;  
	# 			for single in each_json: 
	# 				if single['i'] not in attention_checks:
	# 					this_rating = int(single['r'])
	# 					if (this_rating > max_r): max_r = this_rating;
	# 					if (this_rating < min_r): min_r = this_rating;

	# 			range_value = max_r - min_r;
	# 			for single in each_json:
	# 				if single['i'] not in attention_checks:
	# 					# >>>>>>>>>>>> Without Normalization >>>>>>>>>>>>>>>
	# 					# with out normalization
	# 					this_rating = int(single['r'])   
						
	# 					# with the per participant normalization
	# 					# this_rating = round(((this_rating - min_r) / range_value),3)

	# 					if single['i'] in images: 
	# 						images[single['i']].append(this_rating)
	# 					else: 
	# 						images[single['i']] = [this_rating]
	# 		except:
	# 			print ('Error: ', each_json)    # pop out the mtruk id record
	# 	except:
	# 		print ('Error: ', each)    # pop out the mtruk id record


	take_it_out = []
	for each in images:
		if (len(images[each]) > 3):
			# >>>> No normalization   >>> 
			this_rating = round((sum(images[each])/len(images[each]))/10, 3)
			
			# >>>> With normalization   >>> 
			# this_rating = sum(images[each])/len(images[each])
			
			print ('images: ',each, images[each])
			images[each] = this_rating;
			if (this_rating > max_rate): max_rate = this_rating;
			if (this_rating < min_rate): min_rate = this_rating;
		else: 
			take_it_out.append(each);	

	for each in take_it_out:
		print('less than 3 ratings: ',images.pop(each))

	# >>>>>>>>>>>> Normalize all images ratings here >>>>>>>>>>>>> 
	# images["max"] = max_rate
	# images["min"] = min_rate
	# dic_normalization(images)

	return images;


def get_grad_cam(batch):
	
	max_rate = -100; min_rate = 100;

	in_folder = "../user-study/mturk-rating-results/mturk/"+batch+"/mturk.csv";
	out_folder = "../user-study/mturk-rating-results/"+batch+"/json/";

	entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 
	results = entire_log['Answer.surveycode']
	images = {}  # 	{image_xx: [ rating1, rating2,..., rating_n]}
	
	i=0
	# each participant
	for each in results: 
		try:
			print ('P: ',i)
			each_json = json.loads(each)
			try:
				i+=1;
				each_json.pop(0);			# pop out the mtruk id record
				
				# each image rating
				# >>>>>>>>>>>> Normalize each participants rating here >>>>>>>>>>>>>>>
				max_r = -100; min_r = 100;  
				for single in each_json: 
					if single['i'] not in attention_checks:
						this_rating = int(single['r'])
						if (this_rating > max_r): max_r = this_rating;
						if (this_rating < min_r): min_r = this_rating;

				range_value = max_r - min_r;
				for single in each_json:
					if single['i'] not in attention_checks:
						# >>>>>>>>>>>> Without Normalization >>>>>>>>>>>>>>>
						# with out normalization
						this_rating = int(single['r'])   
						
						# with the per participant normalization
						# this_rating = round(((this_rating - min_r) / range_value),3)

						if single['i'] in images: 
							images[single['i']].append(this_rating)
						else: 
							images[single['i']] = [this_rating]
			except:
				print ('Error: ', each_json)    # pop out the mtruk id record
		except:
			print ('Error: ', each)    # pop out the mtruk id record


	take_it_out = []
	for each in images:
		if (len(images[each]) > 3):
			# >>>> No normalization   >>> 
			this_rating = round((sum(images[each])/len(images[each]))/10, 3)
			
			# >>>> With normalization   >>> 
			# this_rating = sum(images[each])/len(images[each])
			
			print ('images: ',each, images[each])
			images[each] = this_rating;
			if (this_rating > max_rate): max_rate = this_rating;
			if (this_rating < min_rate): min_rate = this_rating;
		else: 
			take_it_out.append(each);	

	for each in take_it_out:
		print('less than 3 ratings: ',images.pop(each))

	# >>>>>>>>>>>> Normalize all images ratings here >>>>>>>>>>>>> 
	# images["max"] = max_rate
	# images["min"] = min_rate
	# dic_normalization(images)

	return images;

def get_workers(batch):
	# this function needs an update for batch-2
	#  does not read the previous worker files - requires manual merging. 
	#  check for duplicate workers - requires manual checking. 
	#  dumps a {worker: key} file.

	in_folder = "../user-study/mturk-rating-results/"+batch+"/1.csv";
	out_folder = "../user-study/mturk-rating-results/"+batch+"/";

	# jsonfile=open("../user-study/mturk-rating-results/"+batch+"/workers.json")
	jsonfile=open("../benchmark/scripts/workers.json")
	all_workers=json.load(jsonfile)

	entire_log = pd.read_csv(in_folder, doublequote=True, escapechar='\\')  # 
	results = entire_log['Answer.surveycode']
	all_workers = {}    # {image_xx: [ rating1, rating2,..., rating_n]}
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


attention_checks = ["cat-2007_000528.jpg","cat-2007_000876.jpg","cat-2007_003778.jpg","cat-2008_000824.jpg"]


# batchs = 'batch-1';
# get_workers(batchs)


