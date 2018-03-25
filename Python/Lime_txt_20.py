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
import _pickle as cPickle

from lime import lime_text
from sklearn.pipeline import make_pipeline
from sklearn.datasets import fetch_20newsgroups

# import numpy as np
# from keras.preprocessing.text import Tokenizer
# from keras.preprocessing.sequence import pad_sequences
# from keras.utils import to_categorical
# from keras.layers import Dense, Input, GlobalMaxPooling1D
# from keras.layers import Conv1D, MaxPooling1D, Embedding
# from keras.models import Model

# from keras.models import load_model

# BASE_DIR = ''
# GLOVE_DIR = os.path.join(BASE_DIR, 'glove.6B')
# TEXT_DATA_DIR = os.path.join(BASE_DIR, '20_newsgroup')
# MAX_SEQUENCE_LENGTH = 1000
# MAX_NUM_WORDS = 20000
# EMBEDDING_DIM = 100
# VALIDATION_SPLIT = 0.2


# print('Indexing word vectors.')

# embeddings_index = {}
# with open(os.path.join(GLOVE_DIR, 'glove.6B.100d.txt')) as f:
#     for line in f:
#         values = line.split()
#         word = values[0]
#         coefs = np.asarray(values[1:], dtype='float32')
#         embeddings_index[word] = coefs

# print('Found %s word vectors.' % len(embeddings_index))

# # second, prepare text samples and their labels
# print('Processing text dataset')

# texts = []  # list of text samples
# labels_index = {}  # dictionary mapping label name to numeric id
# labels = []  # list of label ids
# for name in sorted(os.listdir(TEXT_DATA_DIR)):
#     path = os.path.join(TEXT_DATA_DIR, name)
#     if os.path.isdir(path):
#         label_id = len(labels_index)
#         labels_index[name] = label_id
#         for fname in sorted(os.listdir(path)):
#             if fname.isdigit():
#                 fpath = os.path.join(path, fname)
#                 args = {} if sys.version_info < (3,) else {'encoding': 'latin-1'}
#                 with open(fpath, **args) as f:
#                     t = f.read()
#                     i = t.find('\n\n')  # skip header
#                     if 0 < i:
#                         t = t[i:]
#                     texts.append(t)
#                 labels.append(label_id)

# print('Found %s texts.' % len(texts))

# # finally, vectorize the text samples into a 2D integer tensor
# tokenizer = Tokenizer(num_words=MAX_NUM_WORDS)
# tokenizer.fit_on_texts(texts)
# sequences = tokenizer.texts_to_sequences(texts)


# word_index = tokenizer.word_index
# print('Found %s unique tokens.' % len(word_index))

# data = pad_sequences(sequences, maxlen=MAX_SEQUENCE_LENGTH)

# labels = to_categorical(np.asarray(labels))
# print('Shape of data tensor:', data.shape)
# print('Shape of label tensor:', labels.shape)

# # split the data into a training set and a validation set
# indices = np.arange(data.shape[0])
# np.random.shuffle(indices)
# data = data[indices]
# labels = labels[indices]
# num_validation_samples = int(VALIDATION_SPLIT * data.shape[0])

# x_train = data[:-num_validation_samples]
# y_train = labels[:-num_validation_samples]
# x_val = data[-num_validation_samples:]
# y_val = labels[-num_validation_samples:]


def org_20_newsgroup():
    # newsgroups_train = fetch_20newsgroups(subset='train')
    # newsgroups_test = fetch_20newsgroups(subset='test')
    categories = ['sci.med', 'sci.electronics', 'talk.politics.guns', 'rec.autos' , 'sci.space']
    newsgroups_train = fetch_20newsgroups(subset='train', categories = categories)# , remove=('headers', 'footers', 'quotes'))
    newsgroups_test = fetch_20newsgroups(subset='test', categories = categories)#, remove=('headers', 'footers', 'quotes'))
    # making class names shorter
    print (newsgroups_train.target_names)
    class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in newsgroups_train.target_names]
    # class_names[2] = 'ms.windows'
    # class_names[3] = 'pc.hardware'
    # class_names[4] = 'mac.hardware'
    # class_names[5] = 'computer.windows'

    print(','.join(class_names))


    # categories = ['sci.med', 'sci.electronics']
    # newsgroups_train = fetch_20newsgroups(subset='train', categories=categories)
    # newsgroups_test = fetch_20newsgroups(subset='test', categories=categories)
    # class_names = ['Medication', 'Electronics']

    vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    test_vectors = vectorizer.transform(newsgroups_test.data)
    # vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    # train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    # test_vectors = vectorizer.transform(newsgroups_test.data)

    from sklearn.naive_bayes import MultinomialNB
    nb = MultinomialNB(alpha=.01)
    nb.fit(train_vectors, newsgroups_train.target)
    # rf = sklearn.ensemble.RandomForestClassifier(n_estimators=500)
    # rf.fit(train_vectors, newsgroups_train.target)

    pred = nb.predict(test_vectors)
    sklearn.metrics.f1_score(newsgroups_test.target, pred, average='weighted')
    print ("\n NB Accuracy: ",sklearn.metrics.f1_score(newsgroups_test.target, pred, average='weighted'))
    # pred = rf.predict(test_vectors)
    # sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary')
    # print ("\n Accuracy: ",sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary'))


    c = make_pipeline(vectorizer, nb)
    print(c.predict_proba([newsgroups_test.data[0]]).round(3))
    # c = make_pipeline(vectorizer, rf)
    # print(c.predict_proba([newsgroups_test.data[0]]))


    from lime.lime_text import LimeTextExplainer
    explainer = LimeTextExplainer(class_names=class_names)
    # from lime.lime_text import LimeTextExplainer
    # explainer = LimeTextExplainer(class_names=class_names)
    ii = 0;
    jj = 0;
    idx_list = [];
    my_targets = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    while (jj < 50):
        if (my_targets[newsgroups_test.target[ii]] < 10):
            text_file = open("./20news_test/org/"+str(jj)+" ("+str(ii)+")-"+class_names[newsgroups_test.target[ii]]+".txt", "w")
            text_file.write(newsgroups_test.data[ii])
            text_file.close();
            my_targets[newsgroups_test.target[ii]] += 1
            idx_list.append([ii,jj])
            jj+=1;
        ii+=1
        # print (ii, my_targets)
        pass
        
    idx = 5
    # print ("target: ", newsgroups_test.target[idx])
    # print ("file: ",newsgroups_test.filenames[idx])
    # print('True class: %s' % class_names[newsgroups_test.target[idx]])
    # print('True class: %s' % newsgroups_test.filenames[idx])
    # idx = 2
    # print('True class: %s' % class_names[newsgroups_test.target[idx]])
    # print('True class: %s' % newsgroups_test.filenames[idx])
    # idx = 3
    # print('True class: %s' % class_names[newsgroups_test.target[idx]])
    # print('True class: %s' % newsgroups_test.filenames[idx])
    # idx = 4
    # print('True class: %s' % class_names[newsgroups_test.target[idx]])
    # print('True class: %s' % newsgroups_test.filenames[idx])
    # idx = 5
    # print('True class: %s' % class_names[newsgroups_test.target[idx]])
    # print('True class: %s' % newsgroups_test.filenames[idx])
    # print('True class: %s' % newsgroups_test.target[idx])
    # print('True class: %s' % newsgroups_test.data[idx])

    exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=6, labels=[0])
    print('Document id: %d' % idx)
    print('Predicted class =', class_names[nb.predict(test_vectors[idx]).reshape(1,-1)[0,0]])
    print('True class: %s' % class_names[newsgroups_test.target[idx]])


    print ('\n \n Explanation for class %s' % class_names[0])
    print ('\n'.join(map(str, exp.as_list(label=0))))

    exp.show_in_notebook(text=True)
    exp.save_to_file('./oi_new.html')
    return 

def no_hdr_20_newsgroup():
    newsgroups_train = fetch_20newsgroups(subset='train', remove=('headers', 'footers', 'quotes'))
    newsgroups_test = fetch_20newsgroups(subset='test',remove=('headers', 'footers', 'quotes'))
    # train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    # test_vectors = vectorizer.transform(newsgroups_test.data)
    # nb = MultinomialNB(alpha=.01)
    # nb.fit(train_vectors, newsgroups_train.target)
    # c = make_pipeline(vectorizer, nb)
    # explainer = LimeTextExplainer(class_names=class_names)

    # making class names shorter
    class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in newsgroups_train.target_names]
    class_names[3] = 'pc.hardware'
    class_names[4] = 'mac.hardware'
    print(','.join(class_names))
    # categories = ['sci.med', 'sci.electronics']
    # newsgroups_train = fetch_20newsgroups(subset='train', categories=categories)
    # newsgroups_test = fetch_20newsgroups(subset='test', categories=categories)
    # class_names = ['Medication', 'Electronics']

    vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    test_vectors = vectorizer.transform(newsgroups_test.data)
    # vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    # train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    # test_vectors = vectorizer.transform(newsgroups_test.data)

    from sklearn.naive_bayes import MultinomialNB
    nb = MultinomialNB(alpha=.01)
    nb.fit(train_vectors, newsgroups_train.target)
    # rf = sklearn.ensemble.RandomForestClassifier(n_estimators=500)
    # rf.fit(train_vectors, newsgroups_train.target)

    pred = nb.predict(test_vectors)
    sklearn.metrics.f1_score(newsgroups_test.target, pred, average='weighted')
    print ("\n NB Accuracy: ",sklearn.metrics.f1_score(newsgroups_test.target, pred, average='weighted'))
    # pred = rf.predict(test_vectors)
    # sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary')
    # print ("\n Accuracy: ",sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary'))

    c = make_pipeline(vectorizer, nb)
    print(c.predict_proba([newsgroups_test.data[0]]).round(3))
    # c = make_pipeline(vectorizer, rf)
    # print(c.predict_proba([newsgroups_test.data[0]]))


    from lime.lime_text import LimeTextExplainer
    explainer = LimeTextExplainer(class_names=class_names)
    # from lime.lime_text import LimeTextExplainer
    # explainer = LimeTextExplainer(class_names=class_names)

    idx = 1040
    class_number = nb.predict(test_vectors[idx]).reshape(1,-1)[0,0]
    exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=6, labels=[class_number])
    print('Document id: %d' % idx, class_number, class_names[class_number])
    print('Predicted class =', class_names[nb.predict(test_vectors[idx]).reshape(1,-1)[0,0]],class_number)
    print('True class: %s' % class_names[newsgroups_test.target[idx]])


    print ('\n \n Explanation for class %s' % class_names[class_number])
    print ('\n'.join(map(str, exp.as_list(label=class_number))))

    exp.show_in_notebook(text=False)
    exp.save_to_file('./oi_no_hdr.html')
    return 

def no_hdr_20_newsgroup_rf():
    newsgroups_train = fetch_20newsgroups(subset='train', remove=('headers', 'footers', 'quotes'))
    newsgroups_test = fetch_20newsgroups(subset='test',remove=('headers', 'footers', 'quotes'))
    # train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    # test_vectors = vectorizer.transform(newsgroups_test.data)
    # nb = MultinomialNB(alpha=.01)
    # nb.fit(train_vectors, newsgroups_train.target)
    # c = make_pipeline(vectorizer, nb)
    # explainer = LimeTextExplainer(class_names=class_names)

    # making class names shorter
    class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in newsgroups_train.target_names]
    class_names[3] = 'pc.hardware'
    class_names[4] = 'mac.hardware'
    print(','.join(class_names))

    # categories = ['sci.med', 'sci.electronics', 'comp.sys.mac.hardware']
    # newsgroups_train = fetch_20newsgroups(subset='train', categories=categories)
    # newsgroups_test = fetch_20newsgroups(subset='test', categories=categories)
    # class_names = ['Medication', 'Electronics', 'Hardware']

    vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    test_vectors = vectorizer.transform(newsgroups_test.data)
    # vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    # train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    # test_vectors = vectorizer.transform(newsgroups_test.data)

    # from sklearn.naive_bayes import MultinomialNB
    # nb = MultinomialNB(alpha=.01)
    # nb.fit(train_vectors, newsgroups_train.target)

   
    # vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
    # train_vectors = vectorizer.fit_transform(newsgroups_train.data)
    # test_vectors = vectorizer.transform(newsgroups_test.data)

    # rf = sklearn.ensemble.RandomForestClassifier(n_estimators=500)
    # rf.fit(train_vectors, newsgroups_train.target)

    # load it again
    with open('rf_trained_model.pkl', 'rb') as fid:
        rf = cPickle.load(fid)
    
    # save the classifier
    # with open('rf_trained_model.pkl', 'wb') as fid:
    #     cPickle.dump(rf, fid)    

    # pred = nb.predict(test_vectors)
    pred = rf.predict(test_vectors)
    print ("\n Output predition: ", pred)
    sklearn.metrics.f1_score(newsgroups_test.target, pred, average='weighted')
    print ("\n RF Accuracy: ",sklearn.metrics.f1_score(newsgroups_test.target, pred, average='weighted'))
    # sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary')
    # print ("\n Accuracy: ",sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary'))

    # c = make_pipeline(vectorizer, nb)
    c = make_pipeline(vectorizer, rf)
    print("predict_proba>>>", c.predict_proba([newsgroups_test.data[0]]).round(3))
    
    # print(c.predict_proba([newsgroups_test.data[0]]))


    from lime.lime_text import LimeTextExplainer
    explainer = LimeTextExplainer(class_names=class_names)
    # from lime.lime_text import LimeTextExplainer
    # explainer = LimeTextExplainer(class_names=class_names)

    idx = 630
    # class_number = nb.predict(test_vectors[idx]).reshape(1,-1)[0,0]
    class_number = rf.predict(test_vectors[idx]).reshape(1,-1)[0,0]
    print ("\n Predinc:", class_number, "Prob: >>", c.predict_proba)
    exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=6, labels=[class_number])
    print('Document id: %d' % idx, class_number, class_names[class_number])
    # print('Predicted class =', class_names[nb.predict(test_vectors[idx]).reshape(1,-1)[0,0]],class_number)
    print('Predicted class =', class_names[rf.predict(test_vectors[idx]).reshape(1,-1)[0,0]],class_number)
    print('True class: %s' % class_names[newsgroups_test.target[idx]])


    print ('\n \n Explanation for class %s' % class_names[class_number])
    print ('\n'.join(map(str, exp.as_list(label=class_number))))

    exp.show_in_notebook(text=False)
    exp.save_to_file('./oi_no_hdr.html')
    return 

def newsgroup_keras():
    newsgroups_train = fetch_20newsgroups(subset='train', remove=('headers', 'footers', 'quotes'))
    newsgroups_test = fetch_20newsgroups(subset='test',remove=('headers', 'footers', 'quotes'))

    # making class names shorter
    class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in newsgroups_train.target_names]
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


def find_explanation(txt_file):
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

        txt_file = a_txt["image"];

        txt_exp = find_explanation(txt_file)

        write_exp(txt_exp, txt_file)

    return img_exp
        

def evaluate(img_folder,res_folder):

    img_number = 1
    for i in range(0,1):   # users loop 
        img_exp = read_data(txt_exp, res_folder+"mohsen.json")


# tmp_total = time.time()
txt_exp = "./txt/"
res_folder = "./res/"
# evaluate(txt_exp,res_folder);
# print ("\n Total time: ", time.time() - tmp_total)
# no_hdr_20_newsgroup_rf()
# hdr_20_newsgroup_rf()
# newsgroup_keras()
org_20_newsgroup()
