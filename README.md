# AngularAPP

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.1.

## my-app
run in local env 
* commands :

```
npm install 
npm start
```
* now you can see a sample app in your localhost : 8091 port
### run in azure devops
create azure **res group** ,azure devops org and upload this project to ``` devops repo - > aks -> container registry ```
go to you created project in azure devops -> go into the project setting (bottom left)
setup the connection service (AKS , container registry)
### aks / k8s setting
(remark) becauase of k8s after 1.24 update, the service account would not auto create a secret for it,you need to create it by youself 
* create a service account and create a secret by follow commands:
``` kubectl create serviceaccount {serviceAccountName} ```
* create a secret for the serviceaccount and apply the secret into your created serviceAccount.
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: {secretName}
  annotations:
    kubernetes.io/service-account.name: {serviceAccountName}
type: kubernetes.io/service-account-token
EOF
```

* create the enviorment / pipline using yaml file setting.
select the container registry & choose the build and push image as action.
deploy to AKS service , enter the pod details 
