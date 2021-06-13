# Projekt z Technologii Chmurowych (Uniwersytet Gdański) [Robert Jankowski]

## Uruchomienie
---
*Poniższe operacje należy wykonywać na poziomie katalogu projekt.*


Najlepszą opcją uruchomienia jest użycie skryptu run.sh (jeśli uruchamiamy na windowsie i mamy zainstalowanego GITa, to nie powinno być z tym problemu).
```
./run.sh
```

Alternatywnie należy wywołać poniższe polecenia z zachowaniem kolejności (by umożliwić płynne uruchomienie konfiguracji).
Między instalacją volume i volumeclaima najlepiej chwilę odczekać. Po samej instalacji potrzeba chwili, by zaczęła być funkcjonalna (wejście na stronę za szybko może zwrócić błąd 503).

### Namespace produkcyjny
```
kubectl apply -f ./production/namespace/
kubectl apply -f ./production/configmaps/
kubectl apply -f ./production/services/
kubectl apply -f ./production/volumes/
kubectl apply -f ./production/volumeclaims/
kubectl apply -f ./production/deployments/
kubectl apply -f ./production/ingress/
```


### Namespace deweloperski
```
kubectl apply -f ./development/namespace/
kubectl apply -f ./development/configmaps/
kubectl apply -f ./development/services/
kubectl apply -f ./development/volumes/
kubectl apply -f ./development/volumeclaims/
kubectl apply -f ./development/deployments/
kubectl apply -f ./development/ingress/
```

## Usuwanie konfiguracji
---
Najlepiej użyć skryptu delete.sh. Alternatywnie można uruchomić poniższe polecenia.
```
./delete.sh
```

```
kubectl delete namespace project-development
kubectl delete persistentvolume mongo-development-pv

kubectl delete namespace project-production
kubectl delete persistentvolume mongo-production-pv
```

## Dostęp do aplikacji
---

### [Development](http://localhost/development/)
http://localhost:80/development/

### [Production](http://localhost/production/)
http://localhost:80/production/

## Dane techniczne aplikacji
---

### Ilość replik
Wszyskie deploymenty poza expressem mają po jednej replice. Wynika to z tego, że baz danych z reguły nie powinno się replikować, bo mogłoby to powodować krytyczne błędy w logice aplikacji, a frontend nie powinien osiągnąć tak dużego obciążenia, by była potrzebna większa ilość replik, niż jedna (dostarcza treści statyczne, nie dokonuje stricte obliczeń, tak jak na backendzie). Backend ma dwie repliki. Ruch jest rozdzielany między nimi, a w razie awarii jednej z replik druga może kontynuować dostarczanie funkcjonalności.

### Działanie backendu
Żądania wysyłane na backend przechodzą najpierw przez cache w postaci Redisa.


- Po otrzymaniu GET danego obywatela sprawdzane jest jego istnienie w cache, jeśli w nim jest, to zostaje on zwrócony wraz z pozostałym czasem jego żywotności w cache. W przypadku nieznalezienia go jest sprawdzany w Mongo. W przypadku znalezienia zostaje dodany do cache i zwrócony użytkownikowi.


- POST sprawdza istnienie obywatela najpierw w cache, a w przypadku niepowodzenia w Mongo. Jeśli nie istnieje w żadnej z baz, to zostaje stworzony w Mongo, a także dodany na minutę do cache.


- Analogicznie w przypadku niepowodzeń zostają zwrócone odpowiednie błędy.

## Uwagi do aplikacji
---

### Formularze
By uzyskać dostęp do przycisku wysyłania formularzy należy:

- POST: podać imię oraz nazwisko o długości conajmniej 1 oraz PESEL jako ciąg znaków o długości 11


- GET: PESEL jako ciąg znaków o długości 11

Nie ma walidacji poprawności peselu, poza tym reszta walidacji (czy zawiera tylko liczby itp.) odbywa się już na serwerze.

### Odpowiedzi
Odpowiedzi żądań HTTP wyświetlane są na pasku pod formularzami.

## Historia wersji
---
### [Backend](https://hub.docker.com/repository/docker/robertjankowski/devops-project-backend/tags)
- dev-0.1
- dev-0.2
- dev-0.3
- dev-1.0 (wersja używana na produkcji)
- dev-1.1 (wersja używana w developmencie)

### [Frontend](https://hub.docker.com/repository/docker/robertjankowski/devops-project-frontend/tags)
- dev-0.1
- dev-0.2
- dev-0.3
- dev-0.4
- dev-0.5
- dev-0.6
- dev-1.0 (wersja używana na produkcji)
- dev-1.1 (wersja używana w developmencie)

## Różnica między wersjami 1.0-1.1
---
### Backend
Inna treść komunikatu zwracanego podczas podania niewłaściwego PESELU do GET (np. 893fn9kd92j)

### Frontend
Paragraf "Under development" nad formularzem
