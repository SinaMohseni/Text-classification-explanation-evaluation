from __future__ import print_function

import os,sys
import time

import re
import glob
import copy
import operator

import math
import json, csv, codecs

import lime
from lime import lime_text
from lime.lime_text import LimeTextExplainer

import sklearn
import numpy as np
import pandas as pd

import sklearn.ensemble
import sklearn.metrics
import _pickle as cPickle
from sklearn.pipeline import make_pipeline
from sklearn.datasets import fetch_20newsgroups
from sklearn.naive_bayes import MultinomialNB

from wordembeddings import EmbeddingVectorizer

import nltk
from nltk.tokenize import WordPunctTokenizer
from nltk.tokenize import word_tokenize
from nltk.tokenize import RegexpTokenizer
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer

import xgboost


# GLOVE_DIR = os.path.join('', 'glove.6B')
# glove = pd.read_csv(open(os.path.join(GLOVE_DIR, 'glove.6B.100d.txt')), sep=" ", quoting=3, header=None, index_col=0)
# glove2 = {key: val.values for key, val in glove.T.items()}
# with open('glove.6B.100d.pkl', 'wb') as output:
#     cPickle.dump(glove2, output)

def run_txt_evaluation(training_set, model_name,header_mode,vectorization):
    categories = ['sci.med', 'sci.electronics', 'talk.politics.guns', 'rec.autos' , 'sci.space']
    print ("round: ", training_set)
    if (header_mode == "no_header"):
        newsgroups_train = fetch_20newsgroups(subset='train', categories = categories, remove=('headers', 'footers', 'quotes'))
        newsgroups_test = fetch_20newsgroups(subset='test', categories = categories, remove=('headers', 'footers', 'quotes'))
    else:
        newsgroups_train = fetch_20newsgroups(subset='train', categories = categories)
        newsgroups_test = fetch_20newsgroups(subset='test', categories = categories)
    
    
    class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in newsgroups_train.target_names]

    print(','.join(class_names))

    if (vectorization == "tfidf"):
        vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
        train_vectors = vectorizer.fit_transform(newsgroups_train.data)
        test_vectors = vectorizer.transform(newsgroups_test.data)
        train_labels = newsgroups_train.target;
        test_labels = newsgroups_test.target;
    # else:

    if model_name == "NB":         # Naive Baysian    
        this_model = MultinomialNB(alpha=.01)
        this_model.fit(train_vectors, train_labels) 
    elif model_name == "xgboost":                     # Random Forset
        this_model = xgboost.XGBClassifier(n_estimators=100, max_depth=11)
        this_model.fit(train_vectors, train_labels)
    else:
        this_model = sklearn.ensemble.RandomForestClassifier(n_estimators=500)
        this_model.fit(train_vectors, train_labels)
            # load it again
        # with open('rf_trained_model.pkl', 'rb') as fid:
        #     rf = cPickle.load(fid)
        
        # save the classifier
        # with open('rf_trained_model.pkl', 'wb') as fid:
        #     cPickle.dump(rf, fid)    

    pred = this_model.predict(test_vectors)
    # sklearn.metrics.f1_score(test_labels, pred, average='weighted')
    model_accuracy = sklearn.metrics.f1_score(test_labels, pred, average='weighted').round(3);
    print ("\n", str(this_model)+"Accuracy: ",model_accuracy)
        
    c = make_pipeline(vectorizer, this_model)
        
    explainer = LimeTextExplainer(class_names=class_names)
    ii = 0;
    jj = 0;
    idx_list = [];
    my_targets = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    # while (jj < 50):   # Generating test samples to run the user study
    #     if (my_targets[test_labels[ii]] < 10):
    #         text_file = open("./20news_test/org/"+str(jj)+" ("+str(ii)+")-"+class_names[test_labels[ii]]+".txt", "w")
    #         text_file.write(newsgroups_test.data[ii])
    #         text_file.close();
    #         my_targets[test_labels[ii]] += 1
    #         idx_list.append([ii,jj])
    #         jj+=1;
    #     ii+=1
    #     pass
    
    # study_list = [1,3,4,5,7,9,10,12,13,14,15,16,18,19,20,21,22,23,24,25,
    #               26,27,28,29,30,31,33,35,36,37,38,40,41,42,43,44,47,49,
    #               51,54,56,60,66,68,71,72,77,83,88,93];  # jj

    study_list = [1,3,4,5,7,9,10,12,13,14,15,16,18,19,20,21,22,23,24,25,
                  26,27,28,29,30,31,33,35,36,37,38,40,41,42,43,44,47,49,
                  51,54,56,60,66,68,71,72,77,85,90,97] # ii

    res_json = [[],[],[],[],[]]
    results_address = './Text_results/Study_results/'+str(model_name)+'/'+str(vectorization)+'/'+header_mode
    for idx in study_list:

        print('\n \n Document id: %d' % idx)
        predicted_class = class_names[this_model.predict(test_vectors[idx]).reshape(1,-1)[0,0]];
        true_class = class_names[test_labels[idx]]
        predicted_class_num = this_model.predict(test_vectors[idx]).reshape(1,-1)[0,0]
        predicted_class_matrix = c.predict_proba([newsgroups_test.data[idx]]).round(3)

        # print('Predicted class =', predicted_class)
        # print('True class: %s' % true_class)
        # print ("\n Class names: ", class_names)
        # print("All class predictions:", predicted_class_matrix)
        
        class_matrix = []
        for each in predicted_class_matrix:
            class_matrix.append(each)


        # print ('\n \n Explanation for class %s' % predicted_class, "#: ", class_names.index(predicted_class) , int(class_names.index(predicted_class)))
        exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=10, labels=[predicted_class_num])
        features_list = exp.as_list(label=predicted_class_num)
        # print (exp.as_list(label=predicted_class_num))
        # print ('\n'.join(map(str, exp.as_list(label=predicted_class_num))) )

        exp.show_in_notebook(text=True)
        exp.save_to_file(results_address+'/LIME_html/'+str(idx)+'.html')

        res_json[newsgroups_test.target[idx]].append({"model_accuracy":model_accuracy,"predicted_class":predicted_class, "true_class":true_class,"predictions_weights":predicted_class_matrix.tolist(), "features_list":features_list})  #  

    save_results(training_set, res_json,class_names, results_address)
    return

def save_results(training_set, res_json,class_names,results_address):

    for each_class in class_names:
        fout = open(results_address+"/LIME_exp/"+str(each_class)+"-"+str(training_set)+".json","w")
        fout.write(json.dumps(res_json[class_names.index(each_class)],indent=1))
        fout.close()

    return 0

def glove_test(model_name,header_mode,vectorization):
    categories = ['sci.med', 'sci.electronics', 'talk.politics.guns', 'rec.autos' , 'sci.space'];

    if (header_mode == "no_header"):
        newsgroups_train = fetch_20newsgroups(subset='train', categories = categories, remove=('headers', 'footers', 'quotes'))
        newsgroups_test = fetch_20newsgroups(subset='test', categories = categories, remove=('headers', 'footers', 'quotes'))
    else:
        newsgroups_train = fetch_20newsgroups(subset='train', categories = categories)
        newsgroups_test = fetch_20newsgroups(subset='test', categories = categories)
    
    
    class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in newsgroups_train.target_names]

    print(','.join(class_names))

    # if (vectorization == "tfidf"):
    #     vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    #     train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    #     test_vectors = vectorizer.transform(newsgroups_test.data)
    #     train_labels = newsgroups_train.target;
    #     test_labels = newsgroups_test.target;
    # else:

    with open('glove.6B.100d.pkl', 'rb') as pkl:
        glove = cPickle.load(pkl);
    
    stoplist = set(get_stop_words('en'))

    tokens_train = [[word for word in WordPunctTokenizer().tokenize(str(document).lower()) if ((word not in stoplist) )]
    for document in newsgroups_train.data]

    tokens_test = [[word for word in WordPunctTokenizer().tokenize(str(document).lower()) if ((word not in stoplist) )]
    for document in newsgroups_test.data]
    ii = 0        
    total_emp = 0
    for xx in tokens_train:
        if (len(xx) == 0):
            total_emp +=1
            print (newsgroups_train.data[ii])
            print (len(xx))
            # xx.append(this doc is null)

    print ("Total: ---------------------------------", total_emp)
    total_emp = 0
    for xx in tokens_test:
        if (len(xx) == 0):
            total_emp +=1
            # print (newsgroups_test.data[ii])
            print (len(xx))
            # xx.append(this doc is null)

    print ("Total Test: ---------------------------------", total_emp)
    vectorizer = EmbeddingVectorizer(word_vectors=glove, weighted=True, R=True)
    train_vectors = vectorizer.fit_transform(tokens_train)
    test_vectors = vectorizer.transform(newsgroups_test.data)

    # vectorizer = MeanEmbeddingVectorizer(word_vectors=glove)
    # train_vectors = vectorizer.fit(tokens_train)
    # test_vectors = vectorizer.transform(newsgroups_test.data)
    # print ("-------------------------------------")
    # train_labels = newsgroups_train.target;
    # test_labels = newsgroups_test.target;

    # Vs0 = emb.fit_transform(sickA)      
    # Vs1 = emb.fit_transform(sickB)

    # BASE_DIR = ''
    # GLOVE_DIR = os.path.join(BASE_DIR, 'glove.6B')
    # TEXT_DATA_DIR = os.path.join(BASE_DIR, '20_newsgroup')
    # MAX_SEQUENCE_LENGTH = 1000
    # MAX_NUM_WORDS = 20000
    # EMBEDDING_DIM = 100
    # VALIDATION_SPLIT = 0.2

    # # first, build index mapping words in the embeddings set
    # # to their embedding vector

    # print('Indexing word vectors.')

    # embeddings_index = {}
    # with open(os.path.join(GLOVE_DIR, 'glove.6B.100d.txt')) as f:
    #     for line in f:
    #         values = line.split()
    #         word = values[0]
    #         coefs = np.asarray(values[1:], dtype='float32')
    #         embeddings_index[word] = coefs

    # print('Found %s word vectors.' % len(embeddings_index))

    # print ("test1", embeddings_index.get("gun"))
    # # embedding_vector = embeddings_index.get(word)
    # # if embedding_vector is not None:
    # #     # words not found in embedding index will be all-zeros.
    # #     embedding_matrix[i] = embedding_vector

    # ------------------------- End of work embbeding ------------------------

    if (model_name == "NB"):  # Naive Baysian
        this_model = MultinomialNB(alpha=.01)
        this_model.fit(train_vectors, train_labels)
    else:                     # Random Forset
        this_model = sklearn.ensemble.RandomForestClassifier(n_estimators=500)
        this_model.fit(train_vectors, train_labels)
            # load it again
        # with open('rf_trained_model.pkl', 'rb') as fid:
        #     rf = cPickle.load(fid)
        
        # save the classifier
        # with open('rf_trained_model.pkl', 'wb') as fid:
        #     cPickle.dump(rf, fid)    

    pred = this_model.predict(test_vectors)
    # sklearn.metrics.f1_score(test_labels, pred, average='weighted')
    model_accuracy = sklearn.metrics.f1_score(test_labels, pred, average='weighted').round(3);
    print ("\n", str(this_model)+"Accuracy: ",model_accuracy)
        
    c = make_pipeline(vectorizer, this_model)
        
    explainer = LimeTextExplainer(class_names=class_names)
    ii = 0;
    jj = 0;
    idx_list = [];
    my_targets = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    # while (jj < 50):   # Generating test samples to run the user study
    #     if (my_targets[test_labels[ii]] < 10):
    #         text_file = open("./20news_test/org/"+str(jj)+" ("+str(ii)+")-"+class_names[test_labels[ii]]+".txt", "w")
    #         text_file.write(newsgroups_test.data[ii])
    #         text_file.close();
    #         my_targets[test_labels[ii]] += 1
    #         idx_list.append([ii,jj])
    #         jj+=1;
    #     ii+=1
    #     pass
    
    # study_list = [1,3,4,5,7,9,10,12,13,14,15,16,18,19,20,21,22,23,24,25,
    #               26,27,28,29,30,31,33,35,36,37,38,40,41,42,43,44,47,49,
    #               51,54,56,60,66,68,71,72,77,83,88,93];  # jj

    study_list = [1,3,4,5,7,9,10,12,13,14,15,16,18,19,20,21,22,23,24,25,
                  26,27,28,29,30,31,33,35,36,37,38,40,41,42,43,44,47,49,
                  51,54,56,60,66,68,71,72,77,85,90,97] # ii

    res_json = [[],[],[],[],[]]
    results_address = './Text/Study_results/'+str(model_name)+'/'+str(vectorization)+'/'+header_mode
    for idx in study_list:

        print('\n \n Document id: %d' % idx)
        predicted_class = class_names[this_model.predict(test_vectors[idx]).reshape(1,-1)[0,0]];
        true_class = class_names[test_labels[idx]]
        predicted_class_num = this_model.predict(test_vectors[idx]).reshape(1,-1)[0,0]
        predicted_class_matrix = c.predict_proba([newsgroups_test.data[idx]]).round(3)

        # print('Predicted class =', predicted_class)
        # print('True class: %s' % true_class)
        # print ("\n Class names: ", class_names)
        # print("All class predictions:", predicted_class_matrix)
        
        class_matrix = []
        for each in predicted_class_matrix:
            class_matrix.append(each)


        # print ('\n \n Explanation for class %s' % predicted_class, "#: ", class_names.index(predicted_class) , int(class_names.index(predicted_class)))
        exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=10, labels=[predicted_class_num])
        features_list = exp.as_list(label=predicted_class_num)
        # print (exp.as_list(label=predicted_class_num))
        # print ('\n'.join(map(str, exp.as_list(label=predicted_class_num))) )

        exp.show_in_notebook(text=True)
        exp.save_to_file(results_address+'/LIME_html/'+str(idx)+'.html')

        res_json[newsgroups_test.target[idx]].append({"model_accuracy":model_accuracy,"predicted_class":predicted_class, "true_class":true_class,"predictions_weights":predicted_class_matrix.tolist(), "features_list":features_list})  #  

    # save_results(res_json,class_names, results_address)
    return

def newsgroup_keras():
    newsgroups_train = fetch_20newsgroups(subset='train', remove=('headers', 'footers', 'quotes'))
    newsgroups_test = fetch_20newsgroups(subset='test',remove=('headers', 'footers', 'quotes'))

    # making class names shorter
    class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in train_labels_names]
    class_names[3] = 'pc.hardware'
    class_names[4] = 'mac.hardware'
    print(','.join(class_names))

    vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    test_vectors = vectorizer.transform(newsgroups_test.data)
    
    # load the model
    model = load_model('dnn_trained_model_100.h5')

    # c = make_pipeline(vectorizer, model)
    # print(c.predict_proba([newsgroups_test.data[0]]).round(3))
    
    # print(c.predict_proba([newsgroups_test.data[0]]))


    from lime.lime_text import LimeTextExplainer
    explainer = LimeTextExplainer(class_names=class_names)
    # from lime.lime_text import LimeTextExplainer
    # explainer = LimeTextExplainer(class_names=class_names)

    idx = 1130
    # class_number = rf.predict(test_vectors[idx]).reshape(1,-1)[0,0]
    this_x = x_train[idx].reshape(1,1000)
    prediction = model.predict(this_x, batch_size = 128)
    this_pred = prediction[0]
    class_number = this_pred.argmax(axis=0)

    exp = explainer.explain_instance(this_x, model.predict, num_features=6, labels=[class_number])  # newsgroups_test.data[idx]
    print('Document id: %d' % idx, class_number, class_names[class_number])
    # print('Predicted class =', class_names[nb.predict(test_vectors[idx]).reshape(1,-1)[0,0]],class_number)
    print('Predicted class =', class_names[class_number],class_number)
    # print('True class: %s' % class_names[newsgroups_test.target[idx]])


    print ('\n \n Explanation for class %s' % class_names[class_number])
    print ('\n'.join(map(str, exp.as_list(label=class_number))))

    exp.show_in_notebook(text=False)
    exp.save_to_file('./oi_no_hdr.html')
    return 



def is_int(s):
    try:     
        ss = str(s)
        #if len(ss) == len(ss.strip({0,1,2,3,4,5,6,7,8,9})):
        if re.search('\d+', ss):
            return True
        else:           
            return False            
    except ValueError:          
        return False    


txt_exp = "./txt/"
res_folder = "./res/"

for training_set in range(1,11):
    # newsgroup_keras()
    # run_txt_evaluation("NB","no_header","tfidf")
    # run_txt_evaluation("NB","no_header","GloVe")
    # run_txt_evaluation("NB","header","tfidf")
    # run_txt_evaluation("RF","no_header","tfidf")
    # run_txt_evaluation(training_set, "RF","header","tfidf")
    run_txt_evaluation(training_set, "xgboost","no_header","tfidf")
    # run_txt_evaluation(training_set, "xgboost","header","tfidf")
    # glove_test("NB","no_header","glove")



