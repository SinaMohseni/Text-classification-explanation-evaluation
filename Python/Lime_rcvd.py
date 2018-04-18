from __future__ import print_function
import sklearn
import sklearn.datasets
import sklearn.ensemble
import numpy as np
import lime
import lime.lime_tabular

import cPickle

import xgboost

import json, csv, codecs

import pandas

def run_rcvd_lime(model):
    print ("\n Encoding...")
    # feature_names_old = ["Age", "Workclass", "fnlwgt", "Education", "Education-Num", "Marital Status","Occupation", "Relationship", "Race", "Sex", "Capital Gain", "Capital Loss","Hours per week", "Country"]
    feature_names = ["WHITE","ALCHY","JUNKY","SUPER","MARRIED","FELON","WORKREL", "PROPTY", "PERSON", "MALE","PRIORS","SCHOOL", "RULE","AGE","TSERVD", "FOLLOW","TIME","FILE"]  #"RECID",
    
    data = pandas.read_csv('./study_tabular_data/Data_1980.csv').as_matrix()  # recidivism.csv

    # print (len(data), len(data[0]));

    labels = data[:,18]
    le= sklearn.preprocessing.LabelEncoder()
    le.fit(labels)
    labels = le.transform(labels)
    class_names = le.classes_
    data = data[:,:-1]

    categorical_features = [0,1,2,3,4,5,6,7,8,9,17]  # 1,3,5, 6,7,8,9,13]


    categorical_names = {}
    for feature in categorical_features:
        le = sklearn.preprocessing.LabelEncoder()
        le.fit(data[:, feature])
        data[:, feature] = le.transform(data[:, feature])
        categorical_names[feature] = le.classes_

    data = data.astype(float)

    encoder = sklearn.preprocessing.OneHotEncoder(categorical_features=categorical_features)

    np.random.seed(1)
    train, test, labels_train, labels_test = sklearn.model_selection.train_test_split(data, labels, train_size=0.80)

    encoder.fit(data)
    encoded_train = encoder.transform(train)

    if (model == "train"):  ### ----------------------- Traiing and saving the model
        
        print ("\n fit XGBoost")
        gbtree = xgboost.XGBClassifier(n_estimators=300, max_depth=5)
        gbtree.fit(encoded_train, labels_train)

        model_accuracy = sklearn.metrics.accuracy_score(labels_test, gbtree.predict(encoder.transform(test)))
        print ("model_accuracy: ", model_accuracy)

        print ("\n Saving the model")
        with open('xgboost.pkl', 'wb') as fid:
            cPickle.dump(gbtree, fid)    
    else:   ### ------------------------ Loading a pre-trained model
    
        print ("loading the model")
        with open('xgboost.pkl', 'rb') as fid:
            gbtree = cPickle.load(fid)

    predict_fn = lambda x: gbtree.predict_proba(encoder.transform(x)).astype(float)

    print ("\n LIME")
    explainer = lime.lime_tabular.LimeTabularExplainer(train ,feature_names = feature_names,class_names=class_names,
                                                       categorical_features=categorical_features, 
                                                       categorical_names=categorical_names, kernel_width=3)
    np.random.seed(1)

    # -------- Loading study data ----------------------
    test_data = pandas.read_csv(study_data).as_matrix()  # recidivism.csv

    # print (len(test_data), len(test_data[0]));

    test_labels = test_data[:,18]
    le= sklearn.preprocessing.LabelEncoder()
    le.fit(test_labels)
    test_labels = le.transform(test_labels)
    class_names = le.classes_
    test_data = test_data[:,:-1]

    categorical_features = [0,1,2,3,4,5,6,7,8,9,17]


    categorical_names = {}
    for feature in categorical_features:
        le = sklearn.preprocessing.LabelEncoder()
        le.fit(test_data[:, feature])
        test_data[:, feature] = le.transform(test_data[:, feature])
        categorical_names[feature] = le.classes_

    test_data = test_data.astype(float)
    
    i = 0
    res_json = []
    for example in test_data:

        # data, inverse = explainer.__data_inverse(example, inverse)  # explainer
        # yss = predict_fn(inverse)

        # predicted_class = predict_fn(example);  # example.reshape(1,-1)[0,0]
        # predicted_class = gbtree.predict_proba(example)
        exp = explainer.explain_instance(example, predict_fn, num_features=5)
        # print ("\n exp", predicted_class, exp)

        # exp.show_in_notebook(show_all=False)
        exp.save_to_file(html_adrs+str(i)+'.html')
        features_list = exp.as_list()
        # print ("Result: ", features_list)
        true_class = labels_test[i];
        predicted_class=0
        # print (predicted_class, true_class, predicted_class)
        
        res_json.append({"model_accuracy":model_accuracy,"predicted_class":predicted_class, "true_class":true_class, "features_list":features_list})
        i +=1

    save_results(res_json)
    return

def save_results(res_json):

    fout = open(res_adrs,"w")
    fout.write(json.dumps(res_json,indent=1))
    fout.close()

    return 0



study_data =  './study_tabular_data/recidivism.csv'
html_adrs = './Tabular_results/recidivism/html/'
res_adrs = './Tabular_results/recidivism/results/rcvd.json'

run_rcvd_lime(model="train");   # model="test"