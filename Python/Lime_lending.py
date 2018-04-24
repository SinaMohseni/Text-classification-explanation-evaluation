from __future__ import print_function
import sklearn
import sklearn.datasets
import sklearn.ensemble
import numpy as np
import lime
import lime.lime_tabular

import cPickle

import xgboost

import csv

import pandas



print ("\n Loading data")
# feature_names_old = ["Age", "Workclass", "fnlwgt", "Education", "Education-Num", "Marital Status","Occupation", "Relationship", "Race", "Sex", "Capital Gain", "Capital Loss","Hours per week", "Country"]
# feature_names = ["WHITE","ALCHY","JUNKY","SUPER","MARRIED","FELON","WORKREL", "PROPTY", "PERSON", "MALE","PRIORS","SCHOOL", "RULE","AGE","TSERVD", "FOLLOW","TIME","FILE"]  #"RECID",
# feature_names = ["loan_amnt","term","int_rate","installment","emp_title","emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "earliest_cr_line", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"];
feature_names = ["loan_amnt","term","int_rate","installment","emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"];

data = pandas.read_csv('./study_tabular_data/LoanStats3a_securev1.csv').as_matrix()  # recidivism.csv

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

print ("Data length", data.shape)


label_map = {'Current':2, 'Fully Paid': 1, 'Charged Off': 0, 'In Grace Period':2, 'Late (31-120 days)':3, 'Late (16-30 days)':3, 'Default':0}
fix_label = lambda x: label_map[x];
fix_num = lambda x: int(''.join(y for y in x if y.isdigit()));
num_func = np.vectorize(fix_num)
# rmv_dgt = lambda x: (''.join(print(x) if x.strip() == ));# (print(y) for y in str(x) if y =="/");
# rmv_func = np.vectorize(rmv_dgt)
# fix_num2 = lambda x: ''.join(str(y) for y in str(x) if y.isdigit());
def fix_num2(x):
    try:
        return int(''.join(str(y) for y in str(x) if y.isdigit())); #int()
    except ValueError: 
        return 0;  # print (x);

num_func2 = np.vectorize(fix_num2)

# ---label---
labels = data[:,18]
label_func = np.vectorize(fix_label)
labels = label_func(labels)

le= sklearn.preprocessing.LabelEncoder()
le.fit(labels)
labels = le.transform(labels)
class_names = le.classes_

data = data[:,:-1]   # remove label
data = np.delete(data, 4, 1)  # remove work title
data = np.delete(data, 10, 1)  # remove first fico date 
print ("before",data[1,4])
data[:,1] = num_func(data[:,1]) # fix loan term 
data[:,2] = num_func(data[:,2]) # fix interest rate
# data[:,4] = rmv_func(data[:,4]) # fix emp.
data[:,4] = num_func2(data[:,4]) # fix emp.
print ("after",data[:,4])

# --------------- Change percentage and dates to numbers !! -------------------

# categorical_features = [1,2,3,5,6,8,9,11,17]
# categorical_features = [1,2,4,5,7,8,10,16]
categorical_features = [5,7,8,15];


categorical_names = {}
for feature in categorical_features:
    print(feature)
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
print ("\n fit the XGBoost")
gbtree = xgboost.XGBClassifier(n_estimators=300, max_depth=5)
gbtree.fit(encoded_train, labels_train)

sklearn.metrics.accuracy_score(labels_test, gbtree.predict(encoder.transform(test)))


# print ("\n Saving the model")
# with open('xgboost.pkl', 'wb') as fid:
#     cPickle.dump(gbtree, fid)    

### ------------------------ Loading a pre-trained model
# print ("loading the model")
# # load it again
# with open('xgboost.pkl', 'rb') as fid:
#     gbtree = cPickle.load(fid)

predict_fn = lambda x: gbtree.predict_proba(encoder.transform(x)).astype(float)




print ("\n LIME")
explainer = lime.lime_tabular.LimeTabularExplainer(train ,feature_names = feature_names,class_names=class_names,
                                                   categorical_features=categorical_features, 
                                                   categorical_names=categorical_names, kernel_width=3)
np.random.seed(1)

# -------- Loading study data ----------------------
test_data = pandas.read_csv('./study_tabular_data/lendingclub.csv').as_matrix()  # recidivism.csv

print (len(test_data), len(test_data[0]), test_data[0], "\n", test_data[1]);

# test_labels = test_data[:,18]
# le= sklearn.preprocessing.LabelEncoder()
# le.fit(test_labels)
# test_labels = le.transform(test_labels)
# class_names = le.classes_
# test_data = test_data[:,:-1]


# ---label---
test_labels = test_data[:,18]
label_func = np.vectorize(fix_label)
test_labels = label_func(test_labels)

le= sklearn.preprocessing.LabelEncoder()
le.fit(test_labels)
test_labels = le.transform(test_labels)
class_names = le.classes_

test_data = test_data[:,:-1]   # remove label
test_data = np.delete(test_data, 4, 1)  # remove work title
test_data = np.delete(test_data, 10, 1)  # remove first fico date 
print ("before",test_data[1,4])
test_data[:,1] = num_func(test_data[:,1]) # fix loan term 
test_data[:,2] = num_func(test_data[:,2]) # fix interest rate
test_data[:,4] = num_func2(test_data[:,4]) # fix emp.
print ("after",test_data[:,4])


categorical_names = {}
for feature in categorical_features:
    le = sklearn.preprocessing.LabelEncoder()
    le.fit(test_data[:, feature])
    test_data[:, feature] = le.transform(test_data[:, feature])
    categorical_names[feature] = le.classes_

test_data = test_data.astype(float)
i = 0
for example in test_data:

    print ("\n \n test",example,labels_test[i])
    exp = explainer.explain_instance(example, predict_fn, num_features=5)

    exp.show_in_notebook(show_all=False)
    exp.save_to_file('rcvd1.html')
    res = exp.as_list()
    print ("Result: ", res)
    i +=1

