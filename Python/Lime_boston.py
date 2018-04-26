from sklearn.datasets import load_boston
import sklearn.ensemble
import sklearn.model_selection
import numpy as np

import lime
import lime.lime_tabular
import csv, json

def boston_explanations(inputs,inputs_label):

    boston = load_boston()

    print (boston.data.shape)
    boston.data[:,0]*=1000;   # Feature engineering
    # print (train[0])

    rf = sklearn.ensemble.RandomForestRegressor(n_estimators=1000)
    train, test, labels_train, labels_test = sklearn.model_selection.train_test_split(boston.data, boston.target, train_size=0.80, test_size=0.20)

    # train[:,0]  ==> CRIM
    # train[:,0]  ==> ZN
    # train[:,0]  ==> INDUS
    # train[:,0]  ==> CHAS
    # train[:,0]  ==> NOX
    # train[:,0]  ==> RM
    # train[:,0]  ==> AGE
    # train[:,0]  ==> DIS
    # train[:,0]  ==> RAD
    # train[:,0]  ==> TAX
    # train[:,0]  ==> PT Ration 
    # train[:,0]  ==> B
    # train[:,0]  ==> LSTAT
    # train[:,0]  ==> MEDV
    

    rf.fit(train, labels_train)
    print('---------------------Random Forest MSError', np.mean((rf.predict(test) - labels_test) ** 2))
    print('---------------------MSError when predicting the mean', np.mean((labels_train.mean() - labels_test) ** 2))
    model_accuracy = np.mean((rf.predict(test) - labels_test) ** 2)

    categorical_features = np.argwhere(np.array([len(set(boston.data[:,x])) for x in range(boston.data.shape[1])]) <= 10).flatten()
    explainer = lime.lime_tabular.LimeTabularExplainer(train, feature_names=boston.feature_names, class_names=['price'], categorical_features=categorical_features, verbose=True, mode='regression')
    i = 0;
    res_json = [];
    inputs[:,0] *= 1000   # Feature  engineering
    predicted_class = rf.predict(inputs)
    # print (inputs, inputs_label)
    print('+++++++++++++++++++ MSError', np.mean((rf.predict(inputs) - inputs_label) ** 2))
    for this_exm in inputs:

        

        print ("\n Input: ",len(this_exm), this_exm)

        exp = explainer.explain_instance(this_exm, rf.predict, num_features=5)  # test[i]
        
       
        exp.save_to_file(html_adrs+str(i)+'.html')  # results_address+'/LIME_html/'+str(idx)+
        features_list = exp.as_list()
        true_class = 0
        predicted_class = 0
        # print ("\n \n Result: \n ", predicted_class, true_class)
        res_json.append({"model_accuracy":model_accuracy,"predicted_class":predicted_class, "true_class":true_class, "features_list":features_list})
        i+=1
    
    save_results(res_json)

    return

def read_csv(study_data):

    with open(study_data, 'r') as csvfile:
        boston_data = csv.reader(csvfile, delimiter=',', quotechar='"')
        next(boston_data, None)   # skip the headers
        data_read = [[float(item) for item in row if (row.index(item) < 13)] for row in boston_data] # skip the prediction price (last item) 

    with open(study_data, 'r') as csvfile:
        boston_data = csv.reader(csvfile, delimiter=',', quotechar='"')
        next(boston_data, None)   # skip the headers
        label_read = [[float(item) for item in row if (row.index(item) == 13)] for row in boston_data] # skip the prediction price (last item) 
        

    return [np.array(data_read), np.array(label_read)]

def save_results(res_json):

    fout = open(res_adrs,"w")
    fout.write(json.dumps(res_json,indent=1))
    fout.close()

    return 0


study_data =  './study_tabular_data/housing.csv'
html_adrs = './Tabular_results/housing/html/'

# res_adrs = './Tabular_results/housing/results/housing.json'
# res_adrs = './Tabular_results/housing/results_10/housing.json'




for ii in range(1,11):

    res_adrs = './Tabular_results/housing/results_1000/housing-'+str(ii)+'.json'
    [inputs, inputs_label]= read_csv(study_data);
    boston_explanations(inputs,inputs_label);

