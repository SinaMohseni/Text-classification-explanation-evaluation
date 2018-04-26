from __future__ import print_function
import sklearn
# import sklearn.datasets
import sklearn.ensemble

import sklearn.metrics
from sklearn.pipeline import make_pipeline
from sklearn.naive_bayes import MultinomialNB

from sklearn.naive_bayes import GaussianNB

from sklearn.svm import SVC

import numpy as np
import lime
import lime.lime_tabular

import cPickle

import xgboost

import csv, json

import pandas

def run_lending_lime(model_name):
    print ("\n Loading data")
    # ALL feature_names = ["loan_amnt","term","int_rate","installment","emp_title","emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "earliest_cr_line", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"]; 
    feature_names = ["loan_amnt","term","int_rate","installment","emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"]; 
    # result_2 feature_names = ["loan_amnt","term", "installment","emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"]; 
    # result_3 feature_names = ["installment","emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"]; 
    # feature_names = ["emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"]; 
    data = pandas.read_csv('./study_tabular_data/LoanStats3a_securev1.csv').as_matrix()

    # data(:,0) numeric
    # data(:,1) ===> 36 months
    # data(:,2) ===> 10.5%
    # data(:,3) numberic
    ### data(:,4) ===> Starbucks --remove
    # data(:,4) ===> 10+ years  >> keep digits
    # data(:,5) ===> category ()
    # data(:,6) numberic
    # data(:,7) category
    # data(:,8) category
    # data(:,9) numeric
    ## data(:,10 11) ===> date --remove
    # data(:,10) numeric
    # data(:,11) numeric
    # data(:,12) numeric
    # data(:,13) numeric
    # data(:,14) numeric
    # data(:,15) category
    # data(:,16) ---Label

    # print ("Data length", data.shape)

    label_map = {'Current':2, 'Fully Paid': 1, 'Charged Off': 0, 'In Grace Period':2, 'Late (31-120 days)':3, 'Late (16-30 days)':3, 'Default':0}       
    fix_label = lambda x: label_map[x];
    fix_num = lambda x: int(''.join(y for y in x if y.isdigit()));
    fix_rate = lambda x: float(''.join(y for y in x if y.isdigit()))/10;
    def fix_date(x):
        try:
            return int(''.join(str(y) for y in str(x) if y.isdigit())); #int()
        except ValueError: 
            return 0;

    date_func = np.vectorize(fix_date)
    term_func = np.vectorize(fix_num)
    rate_func = np.vectorize(fix_rate)

    # ---label---
    labels = data[:,18]
    label_func = np.vectorize(fix_label)
    labels = label_func(labels)

    le= sklearn.preprocessing.LabelEncoder()
    le.fit(labels)
    labels = le.transform(labels)
    class_names = le.classes_
      
    data = data[:,:-1]                  # remove label
    data = np.delete(data, 4, 1)        # remove work title
    data = np.delete(data, 10, 1)       # remove first fico date 
    data[:,1] = term_func(data[:,1])     # fix loan term
    data[:,2] = rate_func(data[:,2])     # fix interest rate
    data[:,4] = date_func(data[:,4])    # fix emp 
    # data = np.delete(data, 3, 1)        # remove interest rate 
    # data = np.delete(data, 2, 1)        # remove interest rate 
    # data = np.delete(data, 1, 1)        # remove loan term
    # data = np.delete(data, 0, 1)        # remove loan amount

    # --------------- Change percentage and dates to numbers !! -------------------

    categorical_features = [5,7,8,15];
    # categorical_features = [4,6,7,14];
    # categorical_features = [2,4,5,12];
    # categorical_features = [2,4,5,12];
    # categorical_features = [1,3,4,11];


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

    print ("\n fit scikit-learn")

    encoder.fit(data)
    encoded_train = encoder.transform(train)
    ### ----------------------- Traiing and saving the model
    if (model_name == "XgBoost"):
        print ("\n fit the XGBoost");
        this_model = xgboost.XGBClassifier(n_estimators=300, max_depth=5); # (n_estimators=300, max_depth=5)
        this_model.fit(encoded_train, labels_train);
    elif model_name == "NB":
        this_model = MultinomialNB(alpha=0.01);
        this_model.fit(encoded_train, labels_train);
    else:
        # print ("here 1")
        this_model = SVC(); # GaussianNB();
        this_model.fit(encoded_train, labels_train)
        # print ("here 2")

    model_accuracy = sklearn.metrics.accuracy_score(labels_test, this_model.predict(encoder.transform(test)))
    print ("model_accuracy: ", model_accuracy)

    predict_fn = lambda x: this_model.predict_proba(encoder.transform(x)).astype(float)

    print ("\n LIME")
    explainer = lime.lime_tabular.LimeTabularExplainer(train ,feature_names = feature_names,class_names=class_names,
                                                       categorical_features=categorical_features, 
                                                       categorical_names=categorical_names, kernel_width=3)
    np.random.seed(1)

    # -------- Loading study data ----------------------
    test_data = pandas.read_csv('./study_tabular_data/lendingclub.csv').as_matrix()  # recidivism.csv

    # ---label---
    test_labels = test_data[:,18]
    label_func = np.vectorize(fix_label)
    test_labels = label_func(test_labels)

    le= sklearn.preprocessing.LabelEncoder()
    le.fit(test_labels)
    test_labels = le.transform(test_labels)
    class_names = le.classes_

    test_data = test_data[:,:-1]  # remove label
    test_data = np.delete(test_data, 4, 1)  # remove work title
    test_data = np.delete(test_data, 10, 1)  # remove first fico date 
    test_data[:,1] = term_func(test_data[:,1]) # fix loan term 
    test_data[:,2] = rate_func(test_data[:,2]) # fix interest rate 
    test_data[:,4] = date_func(test_data[:,4]) # fix emp.

    # test_data = np.delete(test_data, 3, 1)        # remove interest rate 
    # test_data = np.delete(test_data, 2, 1)        # remove interest rate 
    # test_data = np.delete(test_data, 1, 1)        # remove loan term
    # test_data = np.delete(test_data, 0, 1)        # remove loan amount

    categorical_names = {};
    for feature in categorical_features:
        le = sklearn.preprocessing.LabelEncoder()
        le.fit(test_data[:, feature])
        test_data[:, feature] = le.transform(test_data[:, feature])
        categorical_names[feature] = le.classes_

    test_data = test_data.astype(float)
    i = 0
    res_json = [];
    for example in test_data:
        true_class = labels_test[i];
        predicted_class = 0;
        # predicted_class = predict_fn(example)
        exp = explainer.explain_instance(example, predict_fn, num_features=5)
        exp.save_to_file(html_adrs+str(i)+'.html')
        features_list = exp.as_list()
        # print ("Exp: ", features_list)
        res_json.append({"model_accuracy":model_accuracy,"predicted_class":predicted_class, "true_class":true_class, "features_list":features_list})
        i +=1;

    # save_results(res_json)
    return 0;

def save_results(res_json):
    fout = open(res_adrs,"w")
    fout.write(json.dumps(res_json,indent=1))
    fout.close()

    return 0

study_data =  './study_tabular_data/recidivism.csv';
html_adrs = './Tabular_results/lendingclub/html/';
model_name= "SVC";  # XgBoost # NB RF  GaussianNB
for ii in range(1, 11):
    print (ii, ": out of 10")
    res_adrs = './Tabular_results/lendingclub/'+model_name+'/results_1/lending-ML-'+str(ii)+'.json';
    run_lending_lime(model_name);

    # result_1 = no changes
    # result_2 = remove interest rate 
    # result_3 = result_2 + loan amount + loan term
    # result_4 = only loan amout
    # result_5 = no loan informations