# Kubernetes Project for Cloud Technologies course (University of Gdańsk)

## Author
Robert Jankowski

## Running the configuration
---
*Following operations should be performed at the "project" directory level.*


The best option to run the configuration is to use run.sh file.
```
./run.sh
```

You can also use following commands (it's important to do this in order to make sure app starts properly).

### Production 
```
kubectl apply -f ./production/namespace/
kubectl apply -f ./production/configmaps/
kubectl apply -f ./production/services/
kubectl apply -f ./production/volumes/
kubectl apply -f ./production/volumeclaims/
kubectl apply -f ./production/deployments/
kubectl apply -f ./production/ingress/
```


### Development
```
kubectl apply -f ./development/namespace/
kubectl apply -f ./development/configmaps/
kubectl apply -f ./development/services/
kubectl apply -f ./development/volumes/
kubectl apply -f ./development/volumeclaims/
kubectl apply -f ./development/deployments/
kubectl apply -f ./development/ingress/
```

## Removing namespaces
---
The best option is to use delete.sh script, you can also use following commands.
```
./delete.sh
```

```
kubectl delete namespace project-development
kubectl delete persistentvolume mongo-development-pv

kubectl delete namespace project-production
kubectl delete persistentvolume mongo-production-pv
```

## Access the application
---

### [Development](http://localhost/development/)
http://localhost:80/development/

### [Production](http://localhost/production/)
http://localhost:80/production/

## Technical data
---

### Backend
Request comming to backend first passes through Redis cache.

- After receiving GET of citizen his existence is checked in cache. In case he is there, he is returned with a record expiration time. In case of citizen missing in cache his existence is checked in Mongo. If he does not exist in Mongo database, he is created in Mongo and also added to the cache for a minute.

- POST checks existence of citizen in cache. If unsuccessful, he is checked in Mongo. If he does not exist, he is added both to Mongo and Redis(for a minute).

- Similarly, in case of failures, appropriate errors are returned.

## Other notes
---

### Forms
To access form buttons you have to:

- POST: type name and surname(length cannot be less than one) and PESEL (polish ID number) as 11-digit sequence of numbers


- GET: PESEL as 11-digit sequence of numbers

There is no PESEL validation, all other validations happen in backend

### Responses
Responses of HTTP requests are shown in a field below forms.

## Version history
---
### [Backend](https://hub.docker.com/repository/docker/robertjankowski/devops-project-backend/tags)
- dev-0.1
- dev-0.2
- dev-0.3
- dev-1.0 (version used in a production namespace)
- dev-1.1 (version used in a development namespace)

### [Frontend](https://hub.docker.com/repository/docker/robertjankowski/devops-project-frontend/tags)
- dev-0.1
- dev-0.2
- dev-0.3
- dev-0.4
- dev-0.5
- dev-0.6
- dev-1.0 (version used in a production namespace)
- dev-1.1 (version used in a development namespace)

## Version differences 1.0-1.1
---
### Backend
Different error message while passing wrong PESEL (ex. 893fn9kd92j)

### Frontend
There is a "Under development" paragraph above the form.
