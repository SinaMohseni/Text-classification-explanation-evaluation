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
feature_names = ["loan_amnt","term","int_rate","installment","emp_title","emp_length","home_ownership","annual_inc","purpose","addr_state","dti", "earliest_cr_line", "fico_range_low","fico_range_high","inq_last_6mths","open_acc","revol_bal","application_type"];           


data = pandas.read_csv('./study_tabular_data/LoanStats3a_securev1.csv').as_matrix()  # recidivism.csv

print ("Data length", len(data), len(data[0]), data[0], "\n", data[1]);

labels = data[:,18]
le= sklearn.preprocessing.LabelEncoder()
le.fit(labels)
labels = le.transform(labels)
class_names = le.classes_
data = data[:,:-1]

# --------------- Change percentage and dates to numbers !! -------------------

categorical_features = [0,1,2,3,4,5,6,7,8,9,17]# 1,3,5, 6,7,8,9,13]


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
print ("\n fit the XGBoost")
gbtree = xgboost.XGBClassifier(n_estimators=300, max_depth=5)
gbtree.fit(encoded_train, labels_train)

sklearn.metrics.accuracy_score(labels_test, gbtree.predict(encoder.transform(test)))


print ("\n Saving the model")
with open('xgboost.pkl', 'wb') as fid:
    cPickle.dump(gbtree, fid)    

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
for example in test_data:

    print ("\n \n test",example,labels_test[i])
    exp = explainer.explain_instance(example, predict_fn, num_features=5)

    exp.show_in_notebook(show_all=False)
    exp.save_to_file('rcvd1.html')
    res = exp.as_list()
    print ("Result: ", res)
    i +=1

