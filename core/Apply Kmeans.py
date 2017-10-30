
# coding: utf-8

# In[4]:

#!/usr/bin/env python3

"""
This script demo how to use the data fetcher to get the data into database
"""
import datetime
import tools.sql
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from Kmeans import *


# In[5]:

# We need to fill in the following variables first
MYSQL_DATABASE = 

MYSQL_USER = 

MYSQL_PASSWORD = 

MYSQL_PORT = 

MYSQL_HOST = 

start_date = "2016-10-01"
end_date = "2017-10-10"
targets = None
# create the fetcher and connect to database
fetcher = tools.sql.DataFetcher()
fetcher.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT)

# get the data in dataframe format and store it as `db`
df = fetcher.get_df(start_date, end_date, ids=targets)


# In[6]:

Kmeandata=[]
matrix1=[df['date'].tolist(),df['open'].tolist()]
#only for 7days case
for i in range(len(matrix1[0])-10):#10 is number of stock price in two weeks
    #contains full week data point
    if matrix1[0][i+5]!=matrix1[0][i]+datetime.timedelta(7):
        continue
    days=np.zeros(8) #(t-7,...,t)
    Price=np.zeros(8+1) #(t-7,...,t,t+7)
    for j in range(6):       
        delta=(matrix1[0][i+j]-matrix1[0][i]).days
        Price[delta]=matrix1[1][i+j]
        days[delta]=1
    #linear approximation for weekend
    for j in range(8):
        if days[j]!=0:
            continue
        Price[j]=(Price[j+2]-Price[j-1])/3+Price[j-1]
        Price[j+1]=(Price[j+2]-Price[j-1])/3*2+Price[j-1]
        break
    #last data for risk calculation
    Price[-1]=matrix1[1][i+10]
    #convert to percentage change
    data=[]
    for i in range(len(Price)-1):
        data.append((Price[i+1]-Price[i])/Price[i])
    Kmeandata.append(data)

    


# In[23]:

get_ipython().run_cell_magic('time', '', "#Kmeans\nindex=list(range(len(Kmeandata)))\nnp.random.shuffle(index)\nno_of_cluster=3\nKmeantraining=np.array([Kmeandata[index[i]][:-1] for i in range(int(len(Kmeandata)))]).astype('float64')\ncentroids, assignments=TFKMeansCluster(Kmeantraining,no_of_cluster)\n\n# 4 cluster with 10% data need 5mins in my computer")


# In[24]:

#the percentage change after7 days  
count=np.zeros(no_of_cluster)
stats=[[] for i in range(no_of_cluster)]
for i in range(len(assignments)):
    count[assignments[i]]+=1
    stats[assignments[i]].append(Kmeandata[index[i]][-1])
    
print("stats")
for i in range(no_of_cluster):
    print("For Cluster",i,"(Number,average,std):",end='')
    print(count[i],np.average(stats[i]),np.std(stats[i]))
    plt.hist(stats[i])
plt.show()


# In[25]:

##visualize the centroids
view_centroids=[[1] for i in range(len(centroids))]
for i in range(len(centroids)):
    for j in range(len(centroids[0])):
#         print(view_centroids[i][j]*centroids[i][j])
        view_centroids[i].append(view_centroids[i][j]*(1+centroids[i][j]))
        
test=range(len(centroids[0])+1)
for i in range(len(centroids)):
    plt.plot(test,view_centroids[i])
plt.show()


# In[ ]:



