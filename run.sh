kubectl apply -f ./production/namespace/
kubectl apply -f ./production/configmaps/
kubectl apply -f ./production/services/
kubectl apply -f ./production/volumes/
sleep 10
kubectl apply -f ./production/volumeclaims/
kubectl apply -f ./production/deployments/
kubectl apply -f ./production/ingress/

kubectl apply -f ./development/namespace/
kubectl apply -f ./development/configmaps/
kubectl apply -f ./development/services/
kubectl apply -f ./development/volumes/
sleep 10
kubectl apply -f ./development/volumeclaims/
kubectl apply -f ./development/deployments/
kubectl apply -f ./development/ingress/